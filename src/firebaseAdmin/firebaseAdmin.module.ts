import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebaseAdmin.service';

@Module({
  exports: [FirebaseAdminService],
  providers: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
