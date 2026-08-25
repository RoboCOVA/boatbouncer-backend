import { canResendVerificationSMS } from './utils';
// eslint-disable-next-line import/no-cycle
import OTP from './index';
import { sendVerificationCode } from '../../utils/identityToolkitSms';

export async function handleResendSMSCode({ phoneNumber, recaptchaToken }) {
  const existingEntry = await this.findOne({
    phoneNumber,
  });

  if (!existingEntry) {
    const otp = {
      phoneNumber,
      numberOfTrials: 1,
      lastSMSTime: new Date(),
    };
    const resendEntry = await OTP.create(otp);

    await sendVerificationCode({ phoneNumber, recaptchaToken });

    return resendEntry;
  }

  const { proceed: canResendSMS, canResendAt } = canResendVerificationSMS(
    existingEntry.lastSMSTime,
    existingEntry.numberOfTrials
  );

  if (canResendSMS) {
    await sendVerificationCode({ phoneNumber, recaptchaToken });

    existingEntry.lastSMSTime = new Date();
    existingEntry.numberOfTrials += 1;
    const updatedEntry = await existingEntry.save();

    const { canResendAt: nextValidTime } = canResendVerificationSMS(
      updatedEntry.lastSMSTime,
      updatedEntry.numberOfTrials
    );

    return {
      data: {
        lastSMSTime: existingEntry.lastSMSTime,
        numberOfTrials: existingEntry.lastSMSTime,
        phoneNumber,
        canResendAt: nextValidTime,
      },
    };
  }

  return canResendAt;
}
