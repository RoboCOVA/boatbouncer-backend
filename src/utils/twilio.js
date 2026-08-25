import twilio from 'twilio';
import {
  fromPhoneNumber,
  frontendUrl,
  smsEnabled,
  twilioAccountSid,
  twilioAuthToken,
} from '../config/environments';

/**
 * SMS is now opt-in behind SMS_ENABLED: email and push carry these events by
 * default (see utils/notify.js), and this channel stays in place so it can be
 * switched back on per environment without touching code. The client is built
 * lazily because `twilio()` throws on missing credentials, and those are no
 * longer required when the channel is off.
 */
let client = null;

function getClient() {
  if (!client) client = twilio(twilioAccountSid, twilioAuthToken);
  return client;
}

/**
 * An SMS bills per 160-character segment, so every template below is written to
 * land inside one segment. That means the SMS is an alert, not a report: who did
 * what, and a link. Duration, departure time and the rest already ride along on
 * the in-app notification created next to each of these sends, so repeating them
 * here only bought us a second segment on every message.
 *
 * Two constraints keep it that way, and both are easy to break by accident:
 *   - stay in the GSM-7 alphabet (plain ASCII). A single curly quote, en dash or
 *     ellipsis flips the whole message to UCS-2, where a segment is 70 chars.
 *   - keep interpolated values bounded (see MAX_VALUE_LENGTH).
 */
const SMSTemplates = {
  bookingRequest:
    `<requesterFirstName> <requesterLastName> requested to book <boatName>.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,

  offerSent:
    `<ownerFirstName> <ownerLastName> sent an offer for <boatName>.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=renter`,

  offerAccepted:
    `<firstName> <lastName> accepted your offer for <boatName>.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,

  bookingCancellation: `<firstName> <lastName> cancelled the booking for <boatName>.`,

  notifyRenter:
    `Reminder: your departure is in <remainingTime>, at <departureTime>.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=renter`,

  notifyOwner:
    `Reminder: your renter departs in <remainingTime>, at <departureTime>.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,

  // `createMessage` throws on an unknown key, so every template key passed to
  // `notifyUser` needs an entry here even while SMS_ENABLED is off.
  bookingCompletedRenter:
    `Your trip on <boatName> has ended. Leave a review:\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=renter`,

  bookingCompletedOwner:
    `The booking for <boatName> has ended.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,
};

/**
 * Names and boat names are user-supplied and unbounded; one long one would push
 * an otherwise single-segment message over 160 and double its cost. Truncation
 * uses ASCII dots rather than an ellipsis character to stay inside GSM-7.
 *
 * Only free-text values are clamped. `bookingId` in particular must survive
 * intact or the link it sits in stops resolving; the remaining values are
 * already bounded by the helpers that format them.
 */
/**
 * 14, not 16. Measured worst case against the production `frontendUrl`, the
 * longest template (`offerAccepted`, three clamped values plus a booking link)
 * landed at 158 of 160 characters — two characters from costing a second
 * segment on every send. Each character shaved here is worth three there.
 */
const MAX_VALUE_LENGTH = 14;

const clampedKeys = new Set([
  'requesterFirstName',
  'requesterLastName',
  'ownerFirstName',
  'ownerLastName',
  'renterFirstName',
  'renterLastName',
  'firstName',
  'lastName',
  'boatName',
]);

function clamp(key, value) {
  const text = String(value);
  if (!clampedKeys.has(key) || text.length <= MAX_VALUE_LENGTH) return text;
  return `${text.slice(0, MAX_VALUE_LENGTH - 3)}...`;
}

function fillTemplate(template, values) {
  return template.replace(/<([^>]+)>/g, (placeholder, key) => {
    const value = values[key];
    return value ? clamp(key, value) : placeholder;
  });
}

const SINGLE_SEGMENT_LENGTH = 160;

function createMessage(templateKey, values) {
  const template = SMSTemplates[templateKey];
  if (!template) {
    throw new Error('Template not found');
  }

  const message = fillTemplate(template, values);

  // Every template is meant to fit one segment. Going over doubles the cost of
  // that send silently, so make it loud instead of letting it drift back.
  if (message.length > SINGLE_SEGMENT_LENGTH) {
    console.warn(
      `[SMS] "${templateKey}" is ${message.length} chars and will bill as multiple segments`
    );
  }

  return message;
}

async function notifyUsingMessage(phone, message) {
  try {
    await getClient().messages.create({
      body: message,
      from: fromPhoneNumber,
      to: phone,
    });
  } catch (error) {
    // Previously this discarded the error entirely, which left failed sends and
    // spend impossible to account for.
    console.error('[SMS] failed to send:', error?.message ?? error);
  }
}

export function sendMessage(phone, templateKey, values) {
  if (!smsEnabled) return;
  if (!phone) return;

  const message = createMessage(templateKey, values);
  notifyUsingMessage(phone, message);
}
