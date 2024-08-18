import { Injectable, BadRequestException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseAdminConfig } from './firebaseAdmin.config';

@Injectable()
export class FirebaseAdminService {
  private auth: admin.auth.Auth;

  // TODO fix: Make that the service dont creates a new user in the firebase database till the user is succesfully created on the mongo DB databse

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

  async deleteUser(uid: string) {
    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
