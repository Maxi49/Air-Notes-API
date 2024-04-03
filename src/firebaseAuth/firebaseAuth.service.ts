import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

@Injectable()
export class FirebaseAuthService {
  constructor(@Inject('FIREBASE_AUTH') private auth: Auth) {}

  async register(email: string, pass: string) {
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
      const user = this.auth.currentUser;
      if (!user) {
        throw new UnauthorizedException('No user is currently signed in');
      }
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
