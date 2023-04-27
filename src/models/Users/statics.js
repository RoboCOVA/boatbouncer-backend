import { startSession } from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import { identityToolkit } from '../../config/googleApis';
import APIError from '../../errors/APIError';
import {
  comparePassword,
  encryptData,
  generateHashedPassword,
  generateJwtToken,
} from '../../utils';
import {
  emailAlreadyUsed,
  passwordDontMatch,
  phoneNumberAlreadyUsed,
  updateFailed,
  userAlreadyVerified,
  userNotFound,
  doesntMatchError,
  existingStripCustomerNotFound,
} from './errors';
import { stripeSecretKey } from '../../config/environments';

const stripe = new Stripe(stripeSecretKey);

/** @STATIC_FUNCTIONS */

/**
 * It saves a user's session to the database
 * @returns The user object with the session saved.
 * </code>
 */
export async function saveUserSession({ phoneNumber, session }) {
  const user = await this.findOne({ phoneNumber });

  if (!user) throw userNotFound;
  if (user?.verified) throw userAlreadyVerified;

  const sessionSaved = await this.findOneAndUpdate(
    { _id: user?._id },
    { session }
  );

  if (!sessionSaved) throw updateFailed;
  sessionSaved.clean();
  return sessionSaved;
}

/**
 * It verifies a user's phone number by sending a verification code to the user's phone number and then
 * verifying the code with the Firebase API.
 * @returns The user object with the verified field set to true.
 * </code>
 */
export async function verifyUser({ verificationCode, phoneNumber }) {
  const user = await this.findOne({ phoneNumber });

  if (!user) throw userNotFound;
  if (user?.verified) throw userAlreadyVerified;
  if (!user?.session)
    throw new APIError('Session not found', httpStatus.BAD_REQUEST);

  await identityToolkit.relyingparty.verifyPhoneNumber({
    code: verificationCode,
    sessionInfo: user?.session,
  });
  const verifiedUser = await this.findOneAndUpdate(
    { _id: user?._id },
    {
      verified: true,
    }
  );

  if (!verifiedUser) throw updateFailed;
  return verifiedUser;
}

/**
 * It updates a user's details in the database
 * @returns The updated user.
 */
export async function updateUser({ matchQuery, updateObject }) {
  const updateQuery = { ...updateObject };
  const user = await this.findOne(matchQuery);
  if (!user) throw userNotFound;

  if (
    updateObject?.phoneNumber &&
    updateObject?.phoneNumber !== user?.phoneNumber
  )
    updateQuery.verified = false;

  /** check if email is already taken */
  if (updateObject?.email) {
    const existingEmail = await this.findOne({
      email: updateQuery?.email,
      _id: { $nin: [matchQuery?._id] },
    });
    if (existingEmail) throw emailAlreadyUsed;
  }

  /** check if phoneNumber is already taken */
  if (updateObject?.phoneNumber) {
    const existingPhoneNum = await this.findOne({
      phoneNumber: updateQuery?.phoneNumber,
      _id: { $nin: [matchQuery?._id] },
    });
    if (existingPhoneNum) throw phoneNumberAlreadyUsed;
  }

  /** if password, check with the perviously stored and hash for update */
  if (updateQuery?.password && updateQuery?.oldPassword) {
    const isMatch = await comparePassword(
      updateQuery?.oldPassword,
      user?.password
    );
    if (!isMatch) throw passwordDontMatch;

    updateQuery.password = await generateHashedPassword(updateQuery?.password);
  }

  const updatedUser = await this.findOneAndUpdate(matchQuery, updateQuery, {
    new: true,
  });

  if (!updatedUser) throw updateFailed;
  const clean = updatedUser.clean();
  return clean;
}

export async function authenticateUser(email, password) {
  const user = await this.findOne({ email }).exec();
  if (!user) {
    throw doesntMatchError;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    const cleanUser = user.clean();
    const token = generateJwtToken(user._id, cleanUser);
    cleanUser.token = token;
    return cleanUser;
  }

  // If not match
  throw doesntMatchError;
}

export async function createStripeAccount({ userId, country = 'US' }) {
  const session = await startSession();

  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const user = await this.findOne({ _id: userId });
        if (!user?.email) throw userNotFound;
        const { email } = user;
        if (user?.stripeAccountId)
          resolve('User already have account registered');

        const account = await stripe.accounts.create({
          type: 'express',
          country,
          email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
            tax_reporting_us_1099_k: { requested: true },
          },
          business_type: 'individual',
          individual: {
            email,
          },
        });

        const encryptedId = encryptData(account.id);
        const updatedUser = await this.findOneAndUpdate(
          { _id: userId },
          { stripeAccountId: encryptedId },
          { new: true }
        ).session(session);

        if (!updatedUser) throw updateFailed;

        const onboarding = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: 'http://localhost:5000/api/boatbouncer/test/failed',
          return_url: 'http://localhost:5000/api/boatbouncer/test',
          type: 'account_onboarding',
        });

        await session.commitTransaction();
        resolve(onboarding);
      });
    } catch (error) {
      reject(error);
    } finally {
      await session.endSession();
    }
  });
}

export async function attachPaymentMethod({ userId, methodId }) {
  const user = await this.findOne({ _id: userId });
  if (!user) throw userNotFound;
  if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  const attachedMethod = await stripe.attachPaymenMethod(methodId, {
    customer: user?.stripeCustomerId,
  });

  return attachedMethod;
}
export async function getPaymentMethod({ userId }) {
  const user = await this.findOne({ _id: userId });
  if (!user) throw userNotFound;
  if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  const customerPaymentMethods = await stripe.customers.listPaymentMethods(
    user?.stripeCustomerId,
    {
      type: 'card',
    }
  );

  return customerPaymentMethods;
}
