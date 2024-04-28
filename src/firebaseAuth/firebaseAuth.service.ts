import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  Auth,
} from 'firebase/auth';
import { FirebaseAuthConfig } from './firebaseAuth.config';

@Injectable()
export class FirebaseAuthService {
  private auth: Auth;

  constructor() {
    FirebaseAuthConfig.initializeFirebase();
    this.auth = getAuth();
  }

  async register(email: string, pass: string) {
    try {
      const newUser = await createUserWithEmailAndPassword(
        this.auth,
        email,
        pass,
      );

      return newUser;
    } catch (error) {
      console.log('Holis');
      throw new BadRequestException(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      const user = userCredentials.user;
      return user;
    } catch (err) {
      throw new UnauthorizedException('Error at trying to login', err);
    }
  }

  getProfile() {
    try {
      const user = this.auth.currentUser.uid;
      if (!user) {
        throw new UnauthorizedException('No user is currently signed in');
      }
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
