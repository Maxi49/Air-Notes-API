import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseAuthModule } from 'src/firebaseAuth/firebaseAuth.module';
import { NotesModule } from 'src/notes/notes.module';
import { User, UserSchema } from './userSchema/user-schema';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { FirebaseAdminModule } from 'src/firebaseAdmin/firebaseAdmin.module';

@Module({
  imports: [
    forwardRef(() => NotesModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FirebaseAuthModule,
    FirebaseAdminModule,
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
