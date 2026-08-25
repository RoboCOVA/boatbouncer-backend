import { frontendUrl } from '../config/environments';
import Users from '../models/Users';
import { sendEmail } from './email';
import { sendPush } from './push';
import { sendMessage } from './twilio';

/**
 * One dispatch point for the transactional notifications that used to go out as
 * SMS only. Each event now fans out to push (free) and email (~100x cheaper
 * than a segment, and the only channel guaranteed to reach every user, since
 * `email` is required on Users/schema.js while `phoneNumber` is not). SMS still
 * fires from here, but only where SMS_ENABLED turns it back on.
 *
 * Every channel swallows its own failures: these are all called alongside a
 * booking or offer write that has already succeeded, and a notification must
 * never be the thing that fails the request.
 */

function bookingLink(bookingId, type) {
  if (!bookingId || !type) return null;
  return `${frontendUrl}/bookings?bookingId=${bookingId}&type=${type}`;
}

const fullName = (first, last) => [first, last].filter(Boolean).join(' ');

/**
 * `linkType` names whose side of the booking the recipient is on, which decides
 * the tab the link opens. It matches the `type` query parameter the frontend
 * already reads on /bookings.
 */
const templates = {
  bookingRequest: {
    linkType: 'owner',
    push: (v) => ({
      title: 'New booking request',
      body: `${fullName(
        v.requesterFirstName,
        v.requesterLastName
      )} requested to book ${v.boatName}.`,
    }),
    email: (v) => ({
      subject: `New booking request for ${v.boatName}`,
      heading: 'You have a new booking request',
      lines: [
        `${fullName(
          v.requesterFirstName,
          v.requesterLastName
        )} requested to book <strong>${v.boatName}</strong>.`,
        'Review the request and send an offer to confirm the dates.',
      ],
      cta: 'View the request',
    }),
  },

  offerSent: {
    linkType: 'renter',
    push: (v) => ({
      title: 'You received an offer',
      body: `${fullName(v.ownerFirstName, v.ownerLastName)} sent an offer for ${
        v.boatName
      }.`,
    }),
    email: (v) => ({
      subject: `Your offer for ${v.boatName}`,
      heading: 'You received an offer',
      lines: [
        `${fullName(
          v.ownerFirstName,
          v.ownerLastName
        )} sent you an offer for <strong>${v.boatName}</strong>.`,
        'Accept it to lock in your booking.',
      ],
      cta: 'View the offer',
    }),
  },

  offerAccepted: {
    linkType: 'owner',
    push: (v) => ({
      title: 'Offer accepted',
      body: `${fullName(v.firstName, v.lastName)} accepted your offer for ${
        v.boatName
      }.`,
    }),
    email: (v) => ({
      subject: `${fullName(v.firstName, v.lastName)} accepted your offer`,
      heading: 'Your offer was accepted',
      lines: [
        `${fullName(v.firstName, v.lastName)} accepted your offer for <strong>${
          v.boatName
        }</strong>.`,
        'The booking is confirmed. You can message your renter from the booking page.',
      ],
      cta: 'View the booking',
    }),
  },

  bookingCancellation: {
    linkType: null,
    push: (v) => ({
      title: 'Booking cancelled',
      body: `${fullName(v.firstName, v.lastName)} cancelled the booking for ${
        v.boatName
      }.`,
    }),
    email: (v) => ({
      subject: `Booking cancelled - ${v.boatName}`,
      heading: 'A booking was cancelled',
      lines: [
        `${fullName(
          v.firstName,
          v.lastName
        )} cancelled the booking for <strong>${v.boatName}</strong>.`,
      ],
      cta: null,
    }),
  },

  notifyRenter: {
    linkType: 'renter',
    push: (v) => ({
      title: 'Your departure is coming up',
      body: `Departure in ${v.remainingTime}, at ${v.departureTime}.`,
    }),
    email: (v) => ({
      subject: `Departure reminder - ${v.departureTime}`,
      heading: 'Your departure is coming up',
      lines: [
        `Your departure is in <strong>${v.remainingTime}</strong>, at <strong>${v.departureTime}</strong>.`,
      ],
      cta: 'View the booking',
    }),
  },

  notifyOwner: {
    linkType: 'owner',
    push: (v) => ({
      title: 'Your renter departs soon',
      body: `Departure in ${v.remainingTime}, at ${v.departureTime}.`,
    }),
    email: (v) => ({
      subject: `Departure reminder - ${v.departureTime}`,
      heading: 'Your renter departs soon',
      lines: [
        `Your renter departs in <strong>${v.remainingTime}</strong>, at <strong>${v.departureTime}</strong>.`,
      ],
      cta: null,
    }),
  },

  /**
   * Completion previously existed only as a bell entry written by the
   * scheduler, so a renter who was not on the site when their trip ended never
   * heard about it. Same wording for both parties; the link differs.
   */
  bookingCompletedRenter: {
    linkType: 'renter',
    push: (v) => ({
      title: 'Your booking is complete',
      body: `Your trip on ${v.boatName} has ended. Leave a review?`,
    }),
    email: (v) => ({
      subject: 'Your booking is complete',
      heading: 'Your booking is complete',
      lines: [
        `Your trip on <strong>${v.boatName}</strong> has ended.`,
        'We would love to hear how it went.',
      ],
      cta: 'Leave a review',
    }),
  },

  bookingCompletedOwner: {
    linkType: 'owner',
    push: (v) => ({
      title: 'A booking is complete',
      body: `The booking for ${v.boatName} has ended.`,
    }),
    email: (v) => ({
      subject: 'A booking is complete',
      heading: 'A booking is complete',
      lines: [`The booking for <strong>${v.boatName}</strong> has ended.`],
      cta: 'View the booking',
    }),
  },
};

function renderEmail({ heading, lines, cta, link }) {
  const paragraphs = lines
    .map(
      (line) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:#1f2933;">${line}</p>`
    )
    .join('');

  const button =
    cta && link
      ? `<p style="margin:24px 0 0;"><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:6px;background:#0b6bcb;color:#ffffff;font-size:16px;text-decoration:none;">${cta}</a></p>`
      : '';

  const html = `<div style="margin:0;padding:24px;background:#f4f6f8;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px;background:#ffffff;border-radius:8px;">
    <h1 style="margin:0 0 20px;font-size:20px;line-height:28px;color:#0b2136;">${heading}</h1>
    ${paragraphs}${button}
  </div>
  <p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:18px;color:#697586;">BoatBouncer</p>
</div>`;

  // Sent alongside the HTML so clients that refuse it, and spam filters that
  // score text-less mail, both have something to work with.
  const text = [
    heading,
    '',
    ...lines.map((line) => line.replace(/<[^>]+>/g, '')),
    ...(link ? ['', link] : []),
  ].join('\n');

  return { html, text };
}

/**
 * @param user  the recipient's user document (email, phoneNumber, deviceTokens)
 * @param templateKey  one of the keys above; matches the SMS template names
 * @param values  the interpolated fields for that template
 */
export async function notifyUser({ user, templateKey, values = {} }) {
  const template = templates[templateKey];
  if (!template)
    throw new Error(`Notification template not found: ${templateKey}`);
  if (!user) return;

  const link = bookingLink(values.bookingId, template.linkType);

  const { title, body } = template.push(values);
  const email = template.email(values);
  const { html, text } = renderEmail({ ...email, link });

  const results = await Promise.allSettled([
    sendPush({
      tokens: (user.deviceTokens ?? []).map((device) => device.token),
      title,
      body,
      link,
      data: { templateKey, bookingId: values.bookingId ?? '' },
    }),
    sendEmail({ to: user.email, subject: email.subject, html, text }),
  ]);

  // SMS is a no-op unless SMS_ENABLED is on; the templates it uses live in
  // twilio.js and stay written for a single segment.
  sendMessage(user.phoneNumber, templateKey, values);

  const [push] = results;
  const staleTokens =
    push.status === 'fulfilled' ? push.value?.staleTokens ?? [] : [];

  if (staleTokens.length > 0) {
    await Users.pruneDeviceTokens({ tokens: staleTokens }).catch((error) =>
      console.error('[Push] failed to prune tokens:', error?.message ?? error)
    );
  }
}

/**
 * Call sites sit next to a completed write, so a rejected notification should
 * be logged rather than bubbled into the response.
 */
export function notifyUserSafely(args) {
  return notifyUser(args).catch((error) =>
    console.error('[Notify] failed:', error?.message ?? error)
  );
}
