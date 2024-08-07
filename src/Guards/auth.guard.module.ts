import { forwardRef, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { UsersModule } from 'src/users/users.module';
import { NotesModule } from 'src/notes/notes.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => NotesModule)],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthGuardModule {}
