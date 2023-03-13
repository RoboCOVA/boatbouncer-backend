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

    const user = await Users.updateUser({ matchQuery, updateObject });
    res.send(user);
  } catch (error) {
    next(error);
  }
};
