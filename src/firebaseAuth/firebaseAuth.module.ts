import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebaseAuth.service';

@Module({
  exports: [FirebaseAuthService],
  providers: [FirebaseAuthService],
})
export class FirebaseAuthModule {}
