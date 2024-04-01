import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { NotesModule } from 'src/notes/notes.module';
import { User, UserSchema } from './userSchema/user-schema';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FirebaseModule,
    NotesModule,
  ],
  exports: [UserService, MongooseModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
