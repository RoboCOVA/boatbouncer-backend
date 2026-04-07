import { readFileSync, existsSync } from 'fs';
import path from 'path';

function parseServiceAccountJsonFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  return JSON.parse(raw);
}

function parseServiceAccountFromBase64Env() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!b64) return null;
  return JSON.parse(Buffer.from(b64.trim(), 'base64').toString('utf8'));
}

export function loadFirebaseServiceAccount() {
  const fromEnv = parseServiceAccountJsonFromEnv();
  if (fromEnv) return fromEnv;

  const fromBase64 = parseServiceAccountFromBase64Env();
  if (fromBase64) return fromBase64;

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && existsSync(credPath)) {
    return JSON.parse(readFileSync(credPath, 'utf8'));
  }

  const localPath = path.join(__dirname, 'firebase-adminsdk.json');
  if (existsSync(localPath)) {
    return JSON.parse(readFileSync(localPath, 'utf8'));
  }

  throw new Error(
    'Firebase service account missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, ' +
      'or GOOGLE_APPLICATION_CREDENTIALS (path to JSON file), or add firebase-adminsdk.json next to this module (local dev only).'
  );
}
