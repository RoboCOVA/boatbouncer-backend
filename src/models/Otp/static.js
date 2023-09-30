import { canResendVerificationSMS } from './utils';
// eslint-disable-next-line import/no-cycle
import OTP from './index';
import { identityToolkit } from '../../config/googleApis';

export async function handleResendSMSCode({ phoneNumber, recaptchaToken }) {
  const existingEntry = await this.findOne({
    phoneNumber,
  });

  if (!existingEntry) {
    const otp = {
      phoneNumber,
      numberOfTrials: 1,
    };
    const resendEntry = await OTP.create(otp);

    await identityToolkit.relyingparty.sendVerificationCode({
      phoneNumber,
      recaptchaToken,
    });

    return resendEntry;
  }

  const { proceed: canResendSMS, canResendAt } = canResendVerificationSMS(
    existingEntry.lastSMSTime,
    existingEntry.numberOfTrials
  );

  if (canResendSMS) {
    await identityToolkit.relyingparty.sendVerificationCode({
      phoneNumber,
      recaptchaToken,
    });

    existingEntry.lastSMSTime = new Date();
    existingEntry.numberOfTrials += 1;
    const updatedEntry = await existingEntry.save();

    const { canResendAt: nextValidTime } = canResendVerificationSMS(
      updatedEntry.lastSMSTime,
      updatedEntry.numberOfTrials
    );

    return {
      data: {
        ...existingEntry.clean(),
        canResendAt: nextValidTime,
      },
    };
  }

  return canResendAt;
}
