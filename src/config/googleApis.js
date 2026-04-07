import { google } from 'googleapis';
import { loadFirebaseServiceAccount } from './firebase/loadServiceAccount';

const serviceAccount = loadFirebaseServiceAccount();

const jwtClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/identitytoolkit'],
});

export const identityToolkit = google.identitytoolkit({
  auth: jwtClient,
  version: 'v3',
});
