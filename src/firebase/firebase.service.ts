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
  updateEmail,
  updatePassword,
} from 'firebase/auth';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_AUTH') private auth: Auth) {}

  async register(email: string, pass: string) {
    const newUser = await createUserWithEmailAndPassword(
      this.auth,
      email,
      pass,
    );

    return newUser;
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

  async updateEmail(newEmail: string) {
    const user = this.auth.currentUser;
    if (!user) throw new BadRequestException('No user is currently signed in');
    try {
      await updateEmail(user, newEmail);
      return true;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async updatePassword(newPass: string) {
    const user = this.auth.currentUser;
    if (!user) throw new BadRequestException('No user is currently signed in');
    try {
      await updatePassword(user, newPass);
      return true;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
