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
import type { User, UserCredential } from 'firebase/auth';

@Injectable()
export class FirebaseAuthService {
  private auth: Auth;

  constructor() {
    FirebaseAuthConfig.initializeFirebase();
    this.auth = getAuth();
  }

  async register(email: string, pass: string): Promise<UserCredential> {
    try {
      const newUser = await createUserWithEmailAndPassword(
        this.auth,
        email,
        pass,
      );

      return newUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      console.log(userCredentials);
      const user = userCredentials.user;
      return user;
    } catch (err) {
      throw new UnauthorizedException('Error at trying to login', err);
    }
  }
}
