import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './likeSchema/like-schema';
import { Model } from 'mongoose';
import { UserService } from 'src/users/users.service';
import { UserDto } from 'src/users/user-dto/user.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private readonly userService: UserService,
  ) {}

  async getLikes(userId: string, noteId: string): Promise<Like[] | unknown[]> {
    try {
      const like = await this.likeModel.find({ note: noteId, user: userId });
      return like;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addLike(user: UserDto, noteId: string): Promise<Like | boolean> {
    try {
      const likeExists = await this.getLikes(user._id.toString(), noteId);
      if (likeExists.length !== 0) return false;
      const like = await this.likeModel.create({
        user: user._id.toString(),
        note: noteId,
      });

      await this.userService.updateUserPreferences(user._id, noteId);

      return like;
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
