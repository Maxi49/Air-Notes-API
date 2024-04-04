import { Injectable, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseAdminConfig } from './firebaseAdmin.config';

@Injectable()
export class FirebaseAdminService {
  private auth: admin.auth.Auth;

  constructor() {
    FirebaseAdminConfig.initializeFirebase();
    this.auth = admin.auth();
  }

  async updateEmail(uid: string, newEmail: string) {
    try {
      await this.auth.updateUser(uid, { email: newEmail });
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update email', err);
    }
  }

  async updatePassword(uid: string, newPass: string) {
    try {
      await this.auth.updateUser(uid, { password: newPass });
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update password');
    }
  }
}
