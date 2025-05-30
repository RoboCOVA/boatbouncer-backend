import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { startSession } from 'mongoose';
import Stripe from 'stripe';
import {
  stripeFailedUrl,
  stripeSecretKey,
  stripeSuccessUrl,
} from '../../config/environments';
import { identityToolkit } from '../../config/googleApis';
import APIError from '../../errors/APIError';
import {
  comparePassword,
  decryptData,
  encryptData,
  generateHashedPassword,
  generateJwtToken,
} from '../../utils';
import { authProviders, boatStatus } from '../../utils/constants';
import Boats from '../Boats';
import Bookings from '../Bookings';
import { modelNames } from '../constants';
import {
  AuthProviderError,
  chargeEnableUpdateFailed,
  deleteFailed,
  doesntMatchError,
  emailAlreadyUsed,
  existingStripCustomerNotFound,
  passwordDontMatch,
  phoneNumberAlreadyUsed,
  updateFailed,
  userAlreadyVerified,
  userHasPeningBookings,
  userNotFound,
  userNotVerified,
} from './errors';

const stripe = new Stripe(stripeSecretKey);

/** @STATIC_FUNCTIONS */

/**
 * It saves a user's session to the database
 * @returns The user object with the session saved.
 * </code>
 */
export async function saveUserSession({
  phoneNumber,
  session,
  isForgetPassword,
}) {
  const user = await this.findOne({ phoneNumber });

  if (!user || user.isDeleted) throw userNotFound;
  if (user?.verified && !isForgetPassword) throw userAlreadyVerified;

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
export async function verifyUser({
  verificationCode,
  phoneNumber,
  encryption,
}) {
  const Otp = this.model(modelNames.OTP);
  const matchQuery = { phoneNumber };
  if (encryption) {
    const decryptedId = decryptData(encryption);
    matchQuery._id = decryptedId;
  }

  const user = await this.findOne(matchQuery);

  if (!user || user.isDeleted) throw userNotFound;
  if (user?.verified && !encryption) throw userAlreadyVerified;
  if (!user?.session)
    throw new APIError('Session not found', httpStatus.BAD_REQUEST);

  identityToolkit.relyingparty.verifyPhoneNumber({
    code: verificationCode,
    sessionInfo: user?.session,
  });

  // if (encryption && user)
  //   return encryptData(
  //     JSON.stringify({
  //       _id: user?._id,
  //       phoneNumber,
  //     })
  //   );

  const verifiedUser = await this.findOneAndUpdate(
    { _id: user?._id },
    {
      verified: true,
    },
    { new: true }
  );

  await Otp.findOneAndRemove({ phoneNumber });

  if (!verifiedUser) throw updateFailed;

  const cleanUser = verifiedUser.clean();
  const token = generateJwtToken(user._id, cleanUser);
  return { ...cleanUser, token };
}

/**
 * It updates a user's details in the database
 * @returns The updated user.
 */
export async function updateUser({ matchQuery, updateObject }) {
  const updateQuery = { ...updateObject };
  const user = await this.findOne(matchQuery);
  if (!user || user.isDeleted) throw userNotFound;

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
  const user = await this.findOne({
    email: { $regex: new RegExp(`^${email}$`, 'i') },
  }).exec();
  if (!user || user.isDeleted) {
    throw doesntMatchError;
  }
  if (!user.authProviders.includes(authProviders.LOCAL)) {
    throw AuthProviderError(user.authProviders);
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

export async function clearTempOAuthId(userId, tempFieldName) {
  await this.findOneAndUpdate(
    { _id: userId },
    { $unset: { [tempFieldName]: 1 } }
  );
}

async function authenticateUserByOAuth(tempFieldName, tempFieldValue) {
  const query = { [tempFieldName]: tempFieldValue };
  const user = await this.findOne(query).exec();

  if (!user || user.isDeleted) {
    throw userNotFound;
  }

  const cleanUser = user.clean();
  const token = generateJwtToken(user._id, cleanUser);
  clearTempOAuthId.call(this, user._id, tempFieldName);

  cleanUser.token = token;
  return cleanUser;
}

export async function setOAuthId(userId, updateObject) {
  await this.findOneAndUpdate({ _id: userId }, { $set: updateObject });
}

export async function authClearTempOAuthId(userId, tempFieldName) {
  setTimeout(() => {
    clearTempOAuthId.call(this, userId, tempFieldName);
  }, 3 * 60 * 1000);
}
export async function authenticateUserWithGoogle(googleIdTemp) {
  return authenticateUserByOAuth.call(this, 'googleIdTemp', googleIdTemp);
}

export async function authenticateUserWithFacebook(facebookIdTemp) {
  return authenticateUserByOAuth.call(this, 'facebookIdTemp', facebookIdTemp);
}

export async function authenticateUserWithApple(facebookIdTemp) {
  return authenticateUserByOAuth.call(this, 'facebookIdTemp', facebookIdTemp);
}

export async function getUserById({ userId }) {
  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;

  const clean = await user.clean();
  return clean;
}
export async function getUserByEmail(email) {
  return this.findOne({ email });
}

export async function getUserByGoogleId(googleId) {
  return this.findOne({ googleId });
}
export async function getUserByAppleId(appleId) {
  return this.findOne({ appleId });
}
export async function getUserByFacebookId(facebookId) {
  return this.findOne({ facebookId });
}

export async function getCurrentUser({ userId }) {
  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;

  if (user?.stripeAccountId) {
    const decryptedId = decryptData(user.stripeAccountId);
    const accountId = await stripe.accounts.retrieve(decryptedId);
    user.chargesEnabled = accountId?.charges_enabled || false;
  } else {
    user.chargesEnabled = false;
  }

  const activeListingsCount = await this.model(modelNames.BOATS).countDocuments(
    {
      owner: userId,
      status: 'active',
    }
  );
  user.activeListingsCount = activeListingsCount;

  const clean = await user.clean();
  return { ...clean, activeListingsCount };
}

export async function createStripeAccount({ userId, country = 'US' }) {
  const session = await startSession();

  return new Promise(async (resolve, reject) => {
    try {
      await session.withTransaction(async () => {
        const user = await this.findOne({ _id: userId });
        if (!user?.email) throw userNotFound;
        const { email } = user;
        if (user?.stripeAccountId) {
          const decryptedId = decryptData(user?.stripeAccountId);

          const savedAccount = await stripe.accounts.retrieve(decryptedId);

          if (savedAccount) {
            const allowRecivePayment = await this.findOneAndUpdate(
              { _id: userId },
              { chargesEnabled: savedAccount?.charges_enabled }
            );

            if (!allowRecivePayment) throw chargeEnableUpdateFailed;

            if (savedAccount?.charges_enabled)
              resolve('User already have account registered');
          }
        }

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
          refresh_url: stripeFailedUrl,
          return_url: stripeSuccessUrl,
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
  if (!user || user.isDeleted) throw userNotFound;
  if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  const attachedMethod = await stripe.paymentMethods.attach(methodId, {
    customer: user?.stripeCustomerId,
  });

  return attachedMethod;
}

export async function getPaymentMethod({ userId }) {
  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;
  if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  const customerPaymentMethods = await stripe.customers.listPaymentMethods(
    user?.stripeCustomerId,
    {
      type: 'card',
    }
  );

  return customerPaymentMethods;
}

export async function hasPaymentMethod({ userId }) {
  return true;
  // const user = await this.findOne({ _id: userId });
  // if (!user||user.isDeleted) throw userNotFound;
  // if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  // const customerPaymentMethods = await stripe.customers.listPaymentMethods(
  //   user?.stripeCustomerId,
  //   {
  //     type: 'card',
  //   }
  // );

  // return customerPaymentMethods?.data?.length > 0;
}

export async function detachPaymentMethod({ userId, methodId }) {
  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;
  if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  const detached = await stripe.paymentMethods.detach(methodId);
  return detached;
}

export async function updatePaymentMethod({ userId, methodId, updateObject }) {
  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;
  if (!user?.stripeCustomerId) throw existingStripCustomerNotFound;

  const data = {};

  if (updateObject?.metadata) data.metadata = updateObject?.metadata;
  if (updateObject?.billing_details)
    data.billing_details = updateObject?.billing_details;
  if (updateObject?.card) data.card = updateObject?.card;

  const updatedMethod = await stripe.paymentMethods.update(methodId, data);
  return updatedMethod;
}

export async function forgetPassword({ phoneNumber, recaptchaToken }) {
  const user = await this.findOne({ phoneNumber });

  if (!user || user.isDeleted) throw userNotFound;

  if (!user.authProviders.includes(authProviders.LOCAL)) {
    throw new APIError(
      `You signed up using ${user.authProviders.join(
        ','
      )}. Please set up a local password before trying to reset it.`,
      httpStatus.BAD_REQUEST,
      true
    );
  }
  if (!user || user.isDeleted) throw userNotFound;
  if (!user?.verified) throw userNotVerified;

  const encryption = encryptData(user?._id?.toString());

  const response = await identityToolkit.relyingparty.sendVerificationCode({
    phoneNumber,
    recaptchaToken,
  });

  await this.model(modelNames.USERS).saveUserSession({
    phoneNumber,
    session: response.data.sessionInfo,
    isForgetPassword: true,
  });

  return encryption;
}

export async function changeForgottenPassword({ newPassword, encryption }) {
  const data = decryptData(encryption);
  const parsedData = JSON.parse(data);

  const { _id, phoneNumber } = parsedData || {};

  const user = await this.findOne({ _id, phoneNumber });
  if (!user || user.isDeleted) throw userNotFound;

  const hashedPassword = await generateHashedPassword(newPassword);

  const updatePassword = await this.findOneAndUpdate(
    { _id, phoneNumber },
    { password: hashedPassword }
  );

  if (!updatePassword) throw updateFailed;

  await updatePassword.clean();
  return updatePassword;
}

export async function setLocalPassword({ password, userId }) {
  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;
  const hashedPassword = await generateHashedPassword(password);
  const updatePassword = await this.findOneAndUpdate(
    { _id: userId },
    {
      password: hashedPassword,
      authProviders: [...user.authProviders, authProviders.LOCAL],
    }
  );

  if (!updatePassword) throw updateFailed;
  await updatePassword.clean();
  return updatePassword;
}

export async function addPhoneNumber({ phoneNumber, userId }) {
  // Check if the phone number is already taken by another user
  const existingUser = await this.findOne({ phoneNumber });
  if (existingUser && existingUser._id.toString() !== userId.toString()) {
    throw phoneNumberAlreadyUsed;
  }

  const user = await this.findOne({ _id: userId });
  if (!user || user.isDeleted) throw userNotFound;

  const userUpdated = await this.findOneAndUpdate(
    { _id: userId },
    { phoneNumber },
    { new: true }
  );

  if (!userUpdated) throw updateFailed;
  await userUpdated.clean();
  return userUpdated;
}

export async function deleteUserAccount({ userId }) {
  const existingUser = await this.findOne({ _id: userId });
  if (!existingUser) {
    throw userNotFound;
  }

  const activeBookings = await Bookings.find({
    status: 'Pending',
    renter: userId,
  });
  if (activeBookings && activeBookings.length > 0) throw userHasPeningBookings;

  await Boats.updateMany({ owner: userId }, { status: boatStatus.DELETED });

  const deletionSuffix = `_deleted_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  const updateFields = {
    $unset: {
      session: 1,
      stripeCustomerId: 1,
      stripeAccountId: 1,
    },
    $set: {
      verified: false,
      chargesEnabled: false,
      isDeleted: true,
    },
  };

  if (existingUser.email) {
    updateFields.$set.email = `${existingUser.email}_${deletionSuffix}`;
  }
  if (existingUser.phoneNumber) {
    updateFields.$set.phoneNumber = `${existingUser.phoneNumber}_${deletionSuffix}`;
  }
  if (existingUser.userName) {
    updateFields.$set.userName = `${existingUser.userName}_${deletionSuffix}`;
  }
  if (existingUser.googleId) {
    updateFields.$set.googleId = `${existingUser.googleId}_${deletionSuffix}`;
  }
  if (existingUser.facebookId) {
    updateFields.$set.facebookId = `${existingUser.facebookId}_${deletionSuffix}`;
  }
  if (existingUser.appleId) {
    updateFields.$set.appleId = `${existingUser.appleId}_${deletionSuffix}`;
  }

  const userUpdated = await this.findOneAndUpdate(
    { _id: userId },
    updateFields,
    { new: true }
  );

  if (!userUpdated) throw deleteFailed;
  return userId;
}
