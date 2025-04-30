import passport from 'passport';
import { identityToolkit } from '../config/googleApis';
import Users from '../models/Users';
import Boats from '../models/Boats';
import Otp from '../models/Otp';
import { emailToUsername } from '../utils';
import * as environments from '../config/environments';

export const createUserController = async (req, res, next) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
    } = req.body;

    const newUser = new Users({
      userName: emailToUsername(email),
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
      verified: false,
    });

    const savedNewUser = await newUser.createNewUser();
    res.send(savedNewUser);
  } catch (error) {
    next(error);
  }
};

export const formValidatedController = async (req, res, next) => {
  try {
    res.send('ok');
  } catch (error) {
    next(error);
  }
};

export const sendSmsController = async (req, res, next) => {
  try {
    const { phoneNumber, recaptchaToken } = req.body;
    const response = await identityToolkit.relyingparty.sendVerificationCode({
      phoneNumber,
      recaptchaToken,
    });

    const user = await Users.saveUserSession({
      phoneNumber,
      session: response.data.sessionInfo,
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const resendSmsController = async (req, res, next) => {
  try {
    const { phoneNumber, recaptchaToken } = req.body;

    const resendOTP = await Otp.handleResendSMSCode({
      phoneNumber,
      recaptchaToken,
    });

    res.send(resendOTP);
  } catch (error) {
    next(error);
  }
};

export const forgetPasswordController = async (req, res, next) => {
  try {
    const { phoneNumber, recaptchaToken } = req.body;

    const encryption = await Users.forgetPassword({
      phoneNumber,
      recaptchaToken,
    });

    res.send(encryption);
  } catch (error) {
    next(error);
  }
};

export const changeForgottenPasswordController = async (req, res, next) => {
  try {
    const { newPassword, encryption } = req.body;

    const user = await Users.changeForgottenPassword({
      newPassword,
      encryption,
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const verifyUserController = async (req, res, next) => {
  try {
    const { verificationCode, phoneNumber, encryption } = req.body;
    const user = await Users.verifyUser({
      verificationCode,
      phoneNumber,
      encryption,
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      email,
      password,
      oldPassword,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      state,
      zipCode,
    } = req.body;

    const updateObject = {};
    const matchQuery = { _id: userId };

    if (email) {
      updateObject.email = email.toLowerCase();
      updateObject.userName = emailToUsername(email);
    }
    if (password) updateObject.password = password;
    if (firstName) updateObject.firstName = firstName;
    if (lastName) updateObject.lastName = lastName;
    if (phoneNumber) updateObject.phoneNumber = phoneNumber;
    if (address) updateObject.address = address;
    if (city) updateObject.city = city;
    if (state) updateObject.state = state;
    if (zipCode) updateObject.zipCode = zipCode;
    if (oldPassword) updateObject.oldPassword = oldPassword;

    const user = await Users.updateUser({ matchQuery, updateObject });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfilePictureController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { profilePicture } = req.body;

    const updateObject = {};
    const matchQuery = { _id: userId };

    if (profilePicture) updateObject.profilePicture = profilePicture;

    const user = await Users.updateUser({ matchQuery, updateObject });
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const loginController = (req, res, next) => {
  passport.authenticate('local', (error, user, message) => {
    if (error || !user) {
      return next(error || message);
    }

    return res.json(user);
  })(req, res, next);
};

export const createStripeAccountController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const createAccount = await Users.createStripeAccount({ userId });
    res.send(createAccount);
  } catch (error) {
    next(error);
  }
};

export const attachPaymentMethodController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { methodId } = req.params;
    const createAccount = await Users.attachPaymentMethod({ userId, methodId });
    Boats.updateBoat({ owner: userId }, { searchable: true });
    res.send(createAccount);
  } catch (error) {
    next(error);
  }
};

export const getPaymentMethodController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const createAccount = await Users.getPaymentMethod({ userId });
    res.send(createAccount);
  } catch (error) {
    next(error);
  }
};

export const detachMethodController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { methodId } = req.params;
    const detached = await Users.detachPaymentMethod({ userId, methodId });
    res.send(detached);
  } catch (error) {
    next(error);
  }
};

export const updateMethodController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const { methodId } = req.params;
    const { metadata, billingDetails, card } = req.body;

    const updateObject = {};
    if (metadata) updateObject.metadata = metadata;
    if (billingDetails) updateObject.billingDetails = billingDetails;
    if (card) updateObject.card = card;

    const updatedMethod = await Users.updatePaymentMethod({
      userId,
      methodId,
      updateObject,
    });

    res.send(updatedMethod);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserController = async (req, res, next) => {
  try {
    const userId = req?.user?._id;
    const createAccount = await Users.getCurrentUser({ userId });
    res.send(createAccount);
  } catch (error) {
    next(error);
  }
};

/** ========== Auth Related============   */

export const googleLoginController = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email', 'phone'],
    accessType: 'offline',
    prompt: 'consent',
  })(req, res, next);
};

export const googleLoginCallbackControllerOLd = (req, res, next) => {
  passport.authenticate('google', {
    successRedirect: environments.googleSuccessRedict,
    failureRedirect: environments.googleSuccessRedict,
  })(req, res, next);
};

export const googleLoginCallbackController = (req, res, next) => {
  passport.authenticate(
    'google',
    {
      failureRedirect: environments.googleSuccessRedict,
    },
    (err, user, info) => {
      if (err) {
        return res.redirect(
          `${environments.googlefailureRedict}?error=${encodeURIComponent(
            err.message
          )}`
        );
      }
      if (!user) {
        return res.redirect(
          `${environments.googlefailureRedict}?error=authentication_failed`
        );
      }

      return req.logIn(user, (loginErr) => {
        if (!user) {
          console.log({ loginErr, user });
          return res.redirect(
            `${environments.googlefailureRedict}?error=${encodeURIComponent(
              'user not found'
            )}`
          );
        }
        // if (loginErr) {
        //   console.log({ loginErr, user });
        //   return res.redirect(
        //     `${environments.googlefailureRedict}?error=${encodeURIComponent(
        //       loginErr.message
        //     )}`
        //   );
        // }

        const { googleId } = user;
        const redirectUrl = new URL(environments.googleSuccessRedict);
        redirectUrl.searchParams.append('googleId', googleId);

        return res.redirect(redirectUrl.toString());
      });
    }
  )(req, res, next);
};

export const googleLoginGetAccountController = async (req, res, next) => {
  try {
    const { googleId } = req.params;
    const authUser = await Users.authenticateUserWithGoogle(googleId);
    return res.json(authUser);
  } catch (error) {
    return next(error);
  }
};

export const setLocalPasswordController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req?.user?._id || '';

    const user = await Users.setLocalPassword({
      password,
      userId,
    });

    res.send(user);
  } catch (error) {
    next(error);
  }
};
