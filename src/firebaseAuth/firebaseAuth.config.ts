import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import dotenv from 'dotenv';
dotenv.config();
export class FirebaseAuthConfig {
  static initializeFirebase() {
    const firebaseConfig = {
      apiKey: process.env.firebaseApiKey,
      authDomain: process.env.firebaseAuthDomain,
      projectId: process.env.firebaseProyectId,
      storageBucket: process.env.firebaseStorageBucket,
      messagingSenderId: process.env.firebaseMessagingSenderId,
      appId: process.env.firebaseAppId,
      measurementId: process.env.firebaseMeasurementId,
    };

    const app = initializeApp(firebaseConfig);
    console.log('Firebase Auth initialized');

    return getAuth(app);
  }
}
