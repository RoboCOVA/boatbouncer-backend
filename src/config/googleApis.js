import { google } from 'googleapis';
import * as environments from './environments';
import { loadFirebaseServiceAccount } from './firebase/loadServiceAccount';

const serviceAccount = loadFirebaseServiceAccount();

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/identitytoolkit'],
});

// Firebase Identity Toolkit expects the Web API key (AIza…) on requests, not only OAuth.
// GOOGLE_CONSOLE_KEY must match the key from Firebase console → Project settings → Web API key.
export const identityToolkit = google.identitytoolkit({
  version: 'v3',
  auth,
  params: {
    key: environments.googleConsoleKey,
  },
});
