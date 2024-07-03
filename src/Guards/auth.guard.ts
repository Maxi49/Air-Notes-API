import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotesService } from 'src/notes/notes.service';
import { IRequest } from 'src/types/types';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private notesService: NotesService,
  ) {}

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
      const user = await this.userService.findUserByFirebaseId(
        decodedToken.uid,
      );
      const notes = await this.notesService.findUserNotes(user._id);
      const profile = user;
      req.user = profile;
      req.notes = notes;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
}
