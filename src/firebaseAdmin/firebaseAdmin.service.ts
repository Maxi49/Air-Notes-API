import { Injectable, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor(@Inject('FIREBASE_ADMIN') private auth: admin.auth.Auth) {}

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
