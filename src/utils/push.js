import { messaging } from '../config/firebase';

/**
 * Push costs nothing and firebase-admin is already initialised for Identity
 * Toolkit, so the only missing piece was somewhere to keep device tokens — see
 * `deviceTokens` on Users/schema.js and `registerDeviceToken` in its statics.
 *
 * Tokens expire and are revoked when a browser's notification permission is
 * withdrawn; FCM reports those per-token, and they are pruned here so the list
 * does not grow into a pile of dead entries.
 */
const DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument',
]);

export async function sendPush({ tokens, title, body, link, data = {} }) {
  const targets = (tokens ?? []).filter(Boolean);
  if (targets.length === 0) return { sent: 0, staleTokens: [] };

  try {
    const response = await messaging.sendEachForMulticast({
      tokens: targets,
      notification: { title, body },
      // Values must be strings; anything else is rejected by FCM.
      data: Object.fromEntries(
        Object.entries({ ...data, link: link ?? '' }).map(([key, value]) => [
          key,
          String(value ?? ''),
        ])
      ),
      webpush: link
        ? { fcmOptions: { link }, notification: { title, body } }
        : undefined,
    });

    const staleTokens = response.responses
      .map((result, index) =>
        !result.success && DEAD_TOKEN_CODES.has(result.error?.code)
          ? targets[index]
          : null
      )
      .filter(Boolean);

    return { sent: response.successCount, staleTokens };
  } catch (error) {
    console.error('[Push] failed to send:', error?.message ?? error);
    return { sent: 0, staleTokens: [] };
  }
}
