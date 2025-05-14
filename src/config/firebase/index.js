import admin from 'firebase-admin';
import adminSDK from './firebase-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(adminSDK),
  //   databaseURL: 'your-database-url-here',
});

export const messaging = admin.messaging();
