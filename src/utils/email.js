import axios from 'axios';
import { emailFrom, resendApiKey } from '../config/environments';

/**
 * Email is the cheap channel: every user has a required `email` (see
 * Users/schema.js), where `phoneNumber` is optional, and a send costs roughly a
 * hundredth of an SMS segment. It is therefore the default carrier for booking
 * and offer notifications, with SMS reserved for whatever is explicitly opted
 * back in via SMS_ENABLED.
 *
 * Resend is called over plain HTTPS rather than through its SDK — the API is a
 * single POST, and axios is already a dependency.
 */
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export async function sendEmail({ to, subject, html, text }) {
  if (!resendApiKey) {
    console.warn(
      `[Email] RESEND_API_KEY is not set; skipped "${subject}" to ${to}`
    );
    return null;
  }

  if (!to) {
    console.warn(`[Email] no recipient address; skipped "${subject}"`);
    return null;
  }

  try {
    const { data } = await axios.post(
      RESEND_ENDPOINT,
      { from: emailFrom, to: [to], subject, html, text },
      {
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error) {
    // Notifications are fire-and-forget at every call site, so a failure here
    // must never surface as a failed booking. Log it loudly instead.
    console.error(
      '[Email] failed to send:',
      error?.response?.data ?? error?.message ?? error
    );
    return null;
  }
}
