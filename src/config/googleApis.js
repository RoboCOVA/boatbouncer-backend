import path from 'path';
import { readFileSync } from 'fs';
import { google } from 'googleapis';

// Load your service account
const serviceAccountPath = path.join(
  __dirname,
  './firebase/firebase-adminsdk.json'
);

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

const jwtClient = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/identitytoolkit'],
});

export const identityToolkit = google.identitytoolkit({
  auth: jwtClient,
  version: 'v3',
});
