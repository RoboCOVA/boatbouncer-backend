import { readFileSync, existsSync } from 'fs';
import path from 'path';

function parseServiceAccountJsonFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  return JSON.parse(raw);
}

export function loadFirebaseServiceAccount() {
  const fromEnv = parseServiceAccountJsonFromEnv();
  if (fromEnv) return fromEnv;

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && existsSync(credPath)) {
    return JSON.parse(readFileSync(credPath, 'utf8'));
  }

  const localPath = path.join(__dirname, 'firebase-adminsdk.json');
  if (existsSync(localPath)) {
    return JSON.parse(readFileSync(localPath, 'utf8'));
  }

  throw new Error(
    'Firebase service account missing. Set GOOGLE_APPLICATION_CREDENTIALS (path to JSON), ' +
      'or FIREBASE_SERVICE_ACCOUNT_JSON (full JSON string), or add firebase-adminsdk.json next to this module (local dev only).'
  );
}
