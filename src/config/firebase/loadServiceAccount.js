import { readFileSync, existsSync } from 'fs';
import path from 'path';

function logCredentialDebug(source, obj) {
  if (process.env.FIREBASE_CREDENTIALS_DEBUG !== 'true') return;
  /* eslint-disable no-console */
  const key = obj.private_key || '';
  console.error('[Firebase credentials]', {
    source,
    project_id: obj.project_id,
    client_email: obj.client_email,
    type: obj.type,
    private_key_len: key.length,
    pem_ok: typeof key === 'string' && key.includes('BEGIN PRIVATE KEY'),
  });
  /* eslint-enable no-console */
}

function assertServiceAccount(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Service account data is not an object');
  }
  const {
    type,
    project_id: projectId,
    private_key: privateKey,
    client_email: clientEmail,
  } = obj;
  if (type !== 'service_account') {
    throw new Error(
      `Expected service account JSON (type "service_account"), got "${
        type || 'missing'
      }". ` +
        'Download the key from IAM → Service accounts → Keys, not the google-services.json app config.'
    );
  }
  if (!clientEmail || typeof clientEmail !== 'string') {
    throw new Error('Service account JSON missing client_email');
  }
  if (!projectId) {
    throw new Error('Service account JSON missing project_id');
  }
  if (
    typeof privateKey !== 'string' ||
    !privateKey.includes('BEGIN PRIVATE KEY')
  ) {
    throw new Error(
      'Service account private_key is missing or not a PEM ' +
        '(after loading from env/base64/file). Check truncation or copy/paste.'
    );
  }
}

/**
 * After JSON.parse, PEM sometimes has literal "\\n" or "\\r\\n" if copy-pasted wrong.
 */
function normalizeServiceAccount(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  let key = obj.private_key;
  if (typeof key !== 'string') return obj;
  key = key.replace(/\r\n/g, '\n');
  if (key.includes('\\n') && !key.includes('\n')) {
    key = key.replace(/\\n/g, '\n');
  }
  return { ...obj, private_key: key };
}

function trimEnvValue(s) {
  let t = String(s).trim();
  if (t.charCodeAt(0) === 0xfeff) t = t.slice(1);
  // Some dashboards wrap the whole value in matching quotes.
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
}

function parseJsonWithDoubleStringify(raw) {
  let parsed = JSON.parse(trimEnvValue(raw));
  if (typeof parsed === 'string') {
    parsed = JSON.parse(parsed);
  }
  return parsed;
}

function parseServiceAccountJsonFromEnv() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw || !String(raw).trim()) return null;
  try {
    const account = normalizeServiceAccount(parseJsonWithDoubleStringify(raw));
    assertServiceAccount(account);
    logCredentialDebug('FIREBASE_SERVICE_ACCOUNT_JSON', account);
    return account;
  } catch (e) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON: ${e.message}`);
  }
}

function normalizeBase64ForNode(s) {
  let t = String(s).replace(/\s/g, '');
  t = t.replace(/-/g, '+').replace(/_/g, '/');
  const pad = t.length % 4;
  if (pad) t += '='.repeat(4 - pad);
  return t;
}

function parseServiceAccountFromBase64Env() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!b64 || !String(b64).trim()) return null;
  let utf8;
  try {
    utf8 = Buffer.from(normalizeBase64ForNode(b64), 'base64').toString('utf8');
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_JSON_BASE64 decode error: ${e.message}`
    );
  }
  try {
    const account = normalizeServiceAccount(JSON.parse(utf8));
    assertServiceAccount(account);
    logCredentialDebug('FIREBASE_SERVICE_ACCOUNT_JSON_BASE64', account);
    return account;
  } catch (e) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON_BASE64: ${e.message}`);
  }
}

function parseJsonFile(filePath, label) {
  try {
    const account = normalizeServiceAccount(
      JSON.parse(readFileSync(filePath, 'utf8'))
    );
    assertServiceAccount(account);
    logCredentialDebug(label, account);
    return account;
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
    return parseJsonFile(credPath, 'GOOGLE_APPLICATION_CREDENTIALS');
  }

  const localPath = path.join(__dirname, 'firebase-adminsdk.json');
  if (existsSync(localPath)) {
    return parseJsonFile(localPath, 'local firebase-adminsdk.json');
  }

  throw new Error(
    'Firebase service account missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON_BASE64, ' +
      'or GOOGLE_APPLICATION_CREDENTIALS (path to JSON file), or add firebase-adminsdk.json next to this module (local dev only).'
  );
}
