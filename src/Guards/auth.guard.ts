import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { IRequest } from 'src/types/types';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: IRequest = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Not token provided');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log('Token', decodedToken);
      // buscarlo en la db por el uuid
      req.user = decodedToken;
      req.id = decodedToken.uid;
      return true; // Siempre devolver true en un Guard
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
}
