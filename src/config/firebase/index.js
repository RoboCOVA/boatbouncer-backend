import admin from 'firebase-admin';
import { loadFirebaseServiceAccount } from './loadServiceAccount';

admin.initializeApp({
  credential: admin.credential.cert(loadFirebaseServiceAccount()),
  //   databaseURL: 'your-database-url-here',
});

export const messaging = admin.messaging();
