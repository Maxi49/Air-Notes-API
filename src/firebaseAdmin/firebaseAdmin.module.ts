import { Module, Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseAdminService } from './firebaseAdmin.service';
import * as serviceAccount from '../../air-notes-65be4-firebase-adminsdk-5a9ty-9c3992622a.json';

export const FIREBASE_ADMIN_PROVIDER: Provider = {
  provide: 'FIREBASE_ADMIN',

  useFactory: () => {
    const firebaseConfig = {
      credential: admin.credential.applicationDefault(),
      proyectId: 'air-notes-65be4',
      databaseURL: 'https://air-notes-65be4-default-rtdb.firebaseio.com/',
    };

    admin.initializeApp(firebaseConfig);

    return admin.auth;
  },
};

@Module({
  exports: [FIREBASE_ADMIN_PROVIDER, FirebaseAdminService],
  providers: [FIREBASE_ADMIN_PROVIDER, FirebaseAdminService],
})
export class FirebaseAdminModule {}
