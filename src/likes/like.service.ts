import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './likeSchema/like-schema';
import { Model } from 'mongoose';
import { UserService } from 'src/users/users.service';
import { NotesService } from 'src/notes/notes.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private readonly userService: UserService,
    private readonly noteService: NotesService,
  ) {}

  async getLikes(userId: string, noteId: string): Promise<Like[] | unknown[]> {
    try {
      const like = await this.likeModel.find({ note: noteId, user: userId });
      return like;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addLike(userId: string, noteId: string): Promise<boolean> {
    try {
      const likeExists = await this.getLikes(userId, noteId);
      if (likeExists.length !== 0) return false;
      await this.likeModel.create({ user: userId, note: noteId });

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeLike(userId: string, noteId: string): Promise<boolean> {
    try {
      await this.likeModel.findOneAndDelete({
        note: noteId,
        user: userId,
      });

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
