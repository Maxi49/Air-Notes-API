import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './likeSchema/like-schema';
import { NotesModule } from 'src/notes/notes.module';
import { VectorModule } from 'src/vectors/vectors.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    NotesModule,
    VectorModule,
    MongooseModule.forFeature([
      {
        name: Like.name,
        schema: LikeSchema,
      },
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikesModule {}
