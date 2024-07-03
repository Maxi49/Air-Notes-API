import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './likeSchema/like-schema';
import { Model } from 'mongoose';
import { UserService } from 'src/users/users.service';
import { NotesService } from 'src/notes/notes.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    @Inject(forwardRef(() => UserService))
    @Inject(forwardRef(() => NotesService))
    private readonly userService: UserService,
    private readonly noteService: NotesService,
  ) {}

  async addLike(userId: string, noteId: string) {
    try {
      const like = await this.likeModel.create({ note: noteId, user: userId });
      await this.userService.updateUserLikedNotes(userId, like._id);
      await this.noteService.updateNoteLikes(noteId, like._id);

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
