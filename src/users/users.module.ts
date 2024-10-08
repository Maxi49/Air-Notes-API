import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from 'src/notes/notes.module';
import { User, UserSchema } from './userSchema/user-schema';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { FirebaseAdminModule } from 'src/firebaseAdmin/firebaseAdmin.module';
import { FirebaseAuthModule } from 'src/firebaseAuth/firebaseAuth.module';
import { VectorModule } from 'src/vectors/vectors.module';

@Module({
  imports: [
    forwardRef(() => VectorModule),
    forwardRef(() => NotesModule),
    FirebaseAdminModule,
    FirebaseAuthModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule {}
