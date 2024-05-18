import { Module } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { NotesService } from 'src/notes/notes.service';

@Module({
  imports: [UserService, NotesService],
  providers: [AuthGuard],
})
export class AuthGuardModule {}
