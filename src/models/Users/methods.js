import httpStatus from 'http-status';
import APIError from '../../errors/APIError';
import { generateHashedPassword } from '../../utils';
import { modelNames } from '../constants';

const userEmailExists = new APIError(
  'User with this email already exists',
  httpStatus.CONFLICT,
  true
);

export async function createNewUser() {
  const { password, email } = this;
  const existingEmail = await await this.model(modelNames.USERS).findOne({
    email,
  });
  if (existingEmail) throw userEmailExists;

  const hashedPassword = await generateHashedPassword(password);

  this.password = hashedPassword;

  const user = await this.save();
  const cleanUser = user.clean();
  return cleanUser;
}

export function clean() {
  const userObj = this.toObject({ virtuals: true });
  delete userObj.password;
  // Delete other sensetive fields like this
  return userObj;
}
