/* eslint-disable camelcase */
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { isBefore, setMonth, setYear } from 'date-fns';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { cryptoSecret, jwtKey } from '../config/environments';

// Encryption function
export function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(cryptoSecret, 'hex'),
    iv
  );
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return iv.toString('hex') + encryptedData;
}

// Decryption function
export function decryptData(encryptedData) {
  const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
  // eslint-disable-next-line no-param-reassign
  encryptedData = encryptedData.slice(32);
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(cryptoSecret, 'hex'),
    iv
  );
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}

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

export function checkMethodExpiration({ paymentMethod }) {
  const { exp_month, exp_year } = paymentMethod;
  const now = new Date();
  const expirationDate = setMonth(setYear(new Date(), exp_year), exp_month);
  return !isBefore(now, expirationDate);
}

export function getMinutesDifference(date1, date2) {
  const diffMs = date1 - date2;
  return Math.floor(diffMs / 60000); // 60000 ms in one minute
}

export function emailToUsername(email) {
  return email.split('@')[0];
}

export function addHoursToDate(originalDate, hoursToAdd) {
  const newDate = new Date(originalDate);
  const millisecondsToAdd = hoursToAdd * 60 * 60 * 1000;
  newDate.setTime(newDate.getTime() + millisecondsToAdd);
  return newDate;
}

export const generateUserNameFromEmail = (email) => {
  const emailUsername = email.split('@')[0];
  const randomBytes = crypto.randomBytes(2).toString('hex');
  return `${emailUsername}.${randomBytes}`;
};

export const generateRandomOAuthId = () => {
  return Date.now();
};

export function formatDuration(durationObj) {
  const durationMs = durationObj.end - durationObj.start;
  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));

  if (durationHours >= 24) {
    const days = Math.floor(durationHours / 24);
    const hours = durationHours % 24;
    return `${days} day${days !== 1 ? 's' : ''}`.concat(
      hours > 0 ? ` ${hours} hour${hours !== 1 ? 's' : ''}` : ''
    );
  }
  return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`;
}

export function getRemainingTime(departureTime) {
  // Convert to Date object if it's not already
  const departureDate = new Date(departureTime);
  const now = new Date();

  // Calculate remaining time in milliseconds
  const remainingMs = departureDate - now;
  let remainingTime = '';
  if (remainingMs <= 0) remainingTime = 'an hour';

  // Convert to minutes
  const remainingMinutes = Math.floor(remainingMs / (1000 * 60));

  // Format the remaining time
  if (remainingMinutes < 60) {
    remainingTime = `${remainingMinutes} minute${
      remainingMinutes !== 1 ? 's' : ''
    }`;
  } else {
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    let result = `${hours} hour${hours !== 1 ? 's' : ''}`;
    if (mins > 0) {
      result += ` ${mins} minute${mins !== 1 ? 's' : ''}`;
    }
    remainingTime = result;
  }
  return remainingTime;
}

export function extractErrorMessageFromStack(stack) {
  if (typeof stack !== 'string') return null;

  // Match: APIError: <message>
  const match = stack.match(/APIError:\s*(.+)/);
  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}
