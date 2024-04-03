import { Injectable, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseConfig } from './Firebase.config';

@Injectable()
export class FirebaseAdminService {
  private auth: admin.auth.Auth;

  constructor() {
    FirebaseConfig.initializeFirebase();
    this.auth = admin.auth();
  }

  async updateEmail(uid: string, newEmail: string) {
    try {
      await this.auth.updateUser(uid, { email: newEmail });
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update email');
    }
  }

  async updatePassword(uid: string, newPass: string) {
    try {
      console.log('Holis');
      await this.auth.updateUser(uid, { password: newPass });
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update password');
    }
  }
}
