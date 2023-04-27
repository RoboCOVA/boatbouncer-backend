import passport from 'passport';
import { identityToolkit } from '../config/googleApis';
import Users from '../models/Users';

export const createUserController = async (req, res, next) => {
  try {
    const {
      userName,
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
      userName,
      email,
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

export const verifyUserController = async (req, res, next) => {
  try {
    const { verificationCode, phoneNumber } = req.body;
    const user = await Users.verifyUser({
      verificationCode,
      phoneNumber,
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
      userName,
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

    if (userName) updateObject.userName = userName;
    if (email) updateObject.email = email;
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
