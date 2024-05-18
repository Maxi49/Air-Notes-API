import { Module } from '@nestjs/common';
import { FirebaseAdminService } from './firebaseAdmin.service';

@Module({
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
