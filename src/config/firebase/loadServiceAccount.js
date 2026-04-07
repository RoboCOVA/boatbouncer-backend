import { readFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * After JSON.parse, PEM sometimes still has literal "\\n" (two chars) if copy-pasted wrong.
 * Google/Firebase rejects that with errors like "invalid_grant" / invalid credential.
 */
function normalizeServiceAccount(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const key = obj.private_key;
  if (typeof key === 'string' && key.includes('\\n') && !key.includes('\n')) {
    return { ...obj, private_key: key.replace(/\\n/g, '\n') };
  }
  return obj;
}

function parseServiceAccountJsonFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || !String(raw).trim()) return null;
  try {
    return normalizeServiceAccount(JSON.parse(raw));
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_JSON is set but is not valid JSON: ${e.message}`
    );
  }
}

function parseServiceAccountFromBase64Env() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!b64 || !String(b64).trim()) return null;
  // Pasted base64 often includes newlines every 76 chars; those break decoding.
  const compact = String(b64).replace(/\s/g, '');
  let utf8;
  try {
    utf8 = Buffer.from(compact, 'base64').toString('utf8');
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 could not be decoded: ${e.message}`
    );
  }
  try {
    return normalizeServiceAccount(JSON.parse(utf8));
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 decodes but is not valid JSON: ${e.message}`
    );
  }
}

function parseJsonFile(filePath, label) {
  try {
    return normalizeServiceAccount(JSON.parse(readFileSync(filePath, 'utf8')));
  } catch (e) {
    throw new Error(`${label} (${filePath}): ${e.message}`);
  }
}

export function loadFirebaseServiceAccount() {
  const fromEnv = parseServiceAccountJsonFromEnv();
  if (fromEnv) return fromEnv;

  const fromBase64 = parseServiceAccountFromBase64Env();
  if (fromBase64) return fromBase64;

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && existsSync(credPath)) {
    return parseJsonFile(credPath, 'GOOGLE_APPLICATION_CREDENTIALS file');
  }

  const localPath = path.join(__dirname, 'firebase-adminsdk.json');
  if (existsSync(localPath)) {
    return parseJsonFile(localPath, 'Local firebase-adminsdk.json');
  }

  throw new Error(
    'Firebase service account missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, ' +
      'or GOOGLE_APPLICATION_CREDENTIALS (path to JSON file), or add firebase-adminsdk.json next to this module (local dev only).'
  );
}
