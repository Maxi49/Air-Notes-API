import * as admin from 'firebase-admin';
import serviceAccount from '../../air-notes-65be4-firebase-adminsdk-5a9ty-9c3992622a.json';
import dotenv from 'dotenv';
dotenv.config();

export class FirebaseAdminConfig {
  static initializeFirebase() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: process.env.firebaseDBUrl,
    });
    console.log('Firebase Admin initialized');
  }
}
