import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FirebaseService } from './firebase.service';

export const FIREBASE_AUTH_PROVIDER: Provider = {
  provide: 'FIREBASE_AUTH',
  useFactory: () => {
    // Configuración de Firebase
    const firebaseConfig = {
      apiKey: 'AIzaSyDjZnqgKojUbselFYFKPe7AG2ItGMofqBM',
      authDomain: 'air-notes-65be4.firebaseapp.com',
      projectId: 'air-notes-65be4',
      storageBucket: 'air-notes-65be4.appspot.com',
      messagingSenderId: '181563928561',
      appId: '1:181563928561:web:7c59fbbdcc5b7a01771e50',
      measurementId: 'G-VWXZL4EL15',
    };

    // Inicializa Firebase
    const app = initializeApp(firebaseConfig);

    // Devuelve la autenticación de Firebase
    return getAuth(app);
  },
};

@Module({
  exports: [FIREBASE_AUTH_PROVIDER, FirebaseService],
  providers: [FIREBASE_AUTH_PROVIDER, FirebaseService],
})
export class FirebaseModule {}

/**
 * !TODO: SET FIREBASE AS A BACKEND SERVICE NOT ONLY AS A CLIENT PROVIDER
 *    credential: admin.credential.applicationDefault(),
      databaseURL:"https://air-notes-65be4-default-rtdb.firebaseio.com/",
 */
