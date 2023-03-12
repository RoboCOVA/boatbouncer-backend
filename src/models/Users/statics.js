import httpStatus from 'http-status';
import APIError from '../../errors/APIError';
import { identityToolkit } from '../../config/googleApis';

const userNotFound = new APIError(
  'User not found!',
  httpStatus.NOT_FOUND,
  true
);
const userAlreadyVerified = new APIError(
  'User is already verified!',
  httpStatus.NOT_FOUND,
  true
);
const updateFailed = new APIError(
  'Update operation failed!',
  httpStatus.NOT_FOUND,
  true
);

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
