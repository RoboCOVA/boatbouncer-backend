/* eslint-disable import/prefer-default-export */
import { addMinutes, isAfter } from 'date-fns';

/**
 * Checks whether it's ok to re-send a verification SMS
 * @param {Date} lastSent the timestamp of the last sent verification SMS
 * @param {number} numberOfTrial the number of previous trials
 */
export const canResendVerificationSMS = (lastSent, numberOfTrial) => {
  // can initiate resend two minutes after the last sent time for first time retry
  let minimumAfterMinute = 2;

  if (numberOfTrial > 1 && numberOfTrial <= 5) {
    // For the next 4 trials increase resend time by 5 times of the trial
    minimumAfterMinute = 1;
  } else if (numberOfTrial > 1) {
    minimumAfterMinute = numberOfTrial * 1;
  }

  const calculatedMinimumResendTime = addMinutes(lastSent, minimumAfterMinute);

  return {
    proceed: isAfter(new Date(), calculatedMinimumResendTime),
    canResendAt: calculatedMinimumResendTime,
  };
};
