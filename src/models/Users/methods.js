import Stripe from 'stripe';
import httpStatus from 'http-status';
import { startSession } from 'mongoose';
import APIError from '../../errors/APIError';
import { generateHashedPassword } from '../../utils';
import { modelNames } from '../constants';
import { stripeSecretKey } from '../../config/environments';
import { existingStripCustomerNotFound, updateFailed } from './errors';

const stripe = new Stripe(stripeSecretKey);

const userEmailExists = new APIError(
  'User with this email already exists',
  httpStatus.CONFLICT,
  true
);

/** @HELPERS */
async function doesCustomerExistByEmail(email) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const customers = await stripe.customers.list({ email });
      resolve(customers); // customer exists if there is at least one customer with the given email
    } catch (error) {
      reject(error);
    }
  });
}
/** @END */

export async function createNewUser() {
  const session = await startSession();
  const Users = this.model(modelNames.USERS);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const { password, email } = this;
        const existingEmail = await await this.model(modelNames.USERS).findOne({
          email,
        });
        if (existingEmail) throw userEmailExists;

        const hashedPassword = await generateHashedPassword(password);

        this.password = hashedPassword;

        const user = await this.save({ session });

        const customers = await doesCustomerExistByEmail(user?.email);

        /** @CREATE_STRIPE_CUSTOMER ----- */
        if (!customers?.data?.length) {
          const Customer = await stripe.customers.create({
            phone: user.phoneNumber,
            email: user.email,
            name: user.userName,
            metadata: {
              id: user._id,
            },
          });

          const userStripe = await Users.findOneAndUpdate(
            { _id: user._id },
            { stripeCustomerId: Customer.id },
            { new: true }
          ).session(session);

          if (!userStripe?.stripeCustomerId) throw updateFailed;
        } else {
          const existingCustomer = customers?.data?.find(
            (customer) =>
              customer.email === user.email &&
              customer.phone === user.phoneNumber &&
              customer.name === user.userName
          );

          if (!existingCustomer?.id) throw existingStripCustomerNotFound;
          const userStripe = await Users.findOneAndUpdate(
            { _id: user._id },
            { stripeCustomerId: existingCustomer.id },
            { new: true }
          ).session(session);

          if (userStripe?.stripeCustomerId) throw updateFailed;
        }
        /** @END ----- */

        const cleanUser = user.clean();
        await session.commitTransaction();
        resolve(cleanUser);
      });
    } catch (error) {
      await session.endSession();
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}

export function clean() {
  const userObj = this.toObject({ virtuals: true });
  delete userObj.password;
  delete userObj.stripeCustomerId;
  // Delete other sensetive fields like this
  return userObj;
}
