import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isBefore, setMonth, setYear } from 'date-fns';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { jwtKey } from '../config/environments';

const phoneNumberUtil = PhoneNumberUtil.getInstance();
/**
 * Checks wheter a given phone nuber string is a valid format. Then returns a formatted phone if ok.
 * @param {string} phoneNumber the phone number to be checked
 */
export const validPhoneFormat = (phoneNumber) => {
  let parsedNumber;

  try {
    parsedNumber = phoneNumberUtil.parse(phoneNumber);
  } catch (__) {
    return false;
  }

  if (phoneNumberUtil.isValidNumber(parsedNumber)) {
    return parsedNumber;
  }

  return false;
};

/**
 * Validates phone number and sanitizes it
 * @param {string} phoneNumber phone number string
 */
export const cleanPhoneNumber = (phoneNumber) => {
  if (typeof phoneNumber === 'string' && validPhoneFormat(phoneNumber)) {
    const parsedNumber = phoneNumberUtil.parse(phoneNumber);
    return phoneNumberUtil.format(parsedNumber, PhoneNumberFormat.E164);
  }

  return null;
};

/**
 * It takes a clean password, generates a salt, and then hashes the password with the salt.
 * @param cleanPassword - The password that the user entered in the form.
 * @returns The hashed password.
 */
export const generateHashedPassword = async (cleanPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(cleanPassword, salt);
  return hashedPassword;
};

/**
 * It takes a userId and a user object and returns a JWT token
 * @param userId - The user's id
 * @param user - {
 * @param [expiresIn=0.5y] - The time in seconds or a string describing a time span zeit/ms. Eg: 60, "2
 * days", "10h", "7d". A numeric value is interpreted as a seconds count. If you use a string be sure
 * you provide the time units (days, hours, etc
 * @returns A token
 */
export const generateJwtToken = (userId, user, expiresIn = '0.5y') => {
  const token = jwt.sign({ _id: userId, user }, jwtKey, { expiresIn });
  return token;
};

export const comparePassword = async (newPassword, oldPassword) => {
  const valid = bcrypt.compare(newPassword, oldPassword);
  return valid;
};

/**
 * Provided an object of string constants it returns all values as an array to be used as an enum
 * @param {{}} typesObject an object of types constant
 * @param {string} valueKey if value of key is an object pass in the value key
 */
export const generateEnumArrayFromObject = (typesObject, valueKey) => {
  const enumArray = [];
  if (typeof typesObject === 'object') {
    const keys = Object.keys(typesObject);
    // use for loop to make syncronous
    for (let index = 0; index < keys.length; index += 1) {
      const value = typesObject[keys[index]];

      if (value) {
        const valueToBeAdded = valueKey ? value[valueKey] : value;
        enumArray.push(valueToBeAdded);
      }
    }
  }

  return enumArray;
};

export const getPaginationValues = (pageNo = 1, size = 10) => {
  const page = Number.parseInt(pageNo || '1', 10);
  const limit = Number.parseInt(size || '10', 10);

  const skip = limit * (page - 1);

  return { limit, skip };
};

/**
 * Changes a coordinate obj to mongo Geo Json
 * @param {{lat:number, lng:number}} param0 coordinate object
 */
export const coordinateObjToGeoJson = ({
  latitude,
  longitude,
  landElevation,
}) => {
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return {
    type: 'Point',
    coordinates: [longitude, latitude],
    landElevation,
  };
};

/**
 * Express-validator custom date validator
 * @param {String} date Date String
 * @returns {Boolean}
 */
export const customDateValidator = (date) => {
  const validDate = Date.parse(date);
  if (validDate) {
    return true;
  }
  return false;
};

export async function checkMethodExpiration({ paymentMethod }) {
  const { expMonth, expYear } = paymentMethod;

  const now = new Date();
  const expirationDate = setMonth(setYear(new Date(), expYear), expMonth);

  if (isBefore(now, expirationDate)) return false; // Card is not expired.

  return true; // Card is expired.
}
