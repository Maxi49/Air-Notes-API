import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';
import { FirebaseAuthModule } from './firebaseAuth/firebaseAuth.module';
import { FirebaseAdminModule } from './firebaseAdmin/firebaseAdmin.module';
import { LikesModule } from './likes/like.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://gimenezzmaximiliano:u7ty5OFFD2EO4cAp@air-note-db.xhrxjga.mongodb.net/?retryWrites=true&w=majority&appName=air-note-db',
    ),
    NotesModule,
    UsersModule,
    FirebaseAuthModule,
    FirebaseAdminModule,
    LikesModule,
  ],
})
export class AppModule {}
