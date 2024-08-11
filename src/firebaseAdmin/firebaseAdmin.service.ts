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

  async updateEmail(uid: unknown, newEmail: string) {
    try {
      await this.auth.updateUser(uid as string, { email: newEmail });
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update email', err);
    }
  }

  async updatePassword(uid: unknown, newPass: string) {
    try {
      await this.auth.updateUser(uid as string, { password: newPass });
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Failed to update password');
    }
  }

  // TODO FIX TYPES
  async deleteUser(uid: unknown) {
    try {
      await this.auth.deleteUser(uid as string);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
