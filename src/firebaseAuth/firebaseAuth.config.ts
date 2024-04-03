import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export class FirebaseAuthConfig {
  static initializeFirebase() {
    const firebaseConfig = {
      apiKey: 'AIzaSyDjZnqgKojUbselFYFKPe7AG2ItGMofqBM',
      authDomain: 'air-notes-65be4.firebaseapp.com',
      projectId: 'air-notes-65be4',
      storageBucket: 'air-notes-65be4.appspot.com',
      messagingSenderId: '181563928561',
      appId: '1:181563928561:web:7c59fbbdcc5b7a01771e50',
      measurementId: 'G-VWXZL4EL15',
    };

    const app = initializeApp(firebaseConfig);

    return getAuth(app);
  }
}
