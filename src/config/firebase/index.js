import admin from 'firebase-admin';
import adminSDK from './bb-adminsdk.json';

admin.initializeApp({
  credential: admin.credential.cert(adminSDK),
  //   databaseURL: 'your-database-url-here',
});

export const messaging = admin.messaging();
