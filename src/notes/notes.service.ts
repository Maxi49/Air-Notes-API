import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './noteSchema/note-schema';
import { Model } from 'mongoose';
import { CreateNoteDto } from './note-dto/create-note.dto';
import { UpdateNoteDto } from './note-dto/update-note.dto';
import { UserService } from 'src/users/users.service';

// TODO GLOBAL (MIDDLEWARE)
// ! ADD A HANDLING ERROR MIDDLEWARE
@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
  ) {}

  async findAllNotes() {
    return await this.noteModel.find({});
  }

  async findUserNotes(userId: string) {
    try {
      return await this.noteModel.find({ user: userId });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findNoteById(id: string) {
    const note = await this.noteModel.findById(id);
    if (!note) {
      throw new NotFoundException();
    }
    return note;
  }

  async createNote(userId: string, note: CreateNoteDto) {
    console.log('userId provided: ', userId);
    return await this.noteModel.create({ user: userId, ...note });
  }

  async updateNote(userId: string, id: string, note: UpdateNoteDto) {
    const { description, location, title, user } = note;

    const updatedNote = await this.noteModel.findByIdAndUpdate(
      { _id: id, userId },
      { description, location, title, user },
      { new: true },
    );
    return updatedNote;
  }

  async removeNote(noteId: string, userId: string) {
    try {
      return await this.noteModel.findByIdAndDelete({ _id: noteId, userId });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeAllUserNotes(userId: string): Promise<boolean> {
    try {
      await this.noteModel.deleteMany({ user: userId });
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findNotesNearUser(userId: string): Promise<any> {
    try {
      const user = await this.userService.findUserById(userId);

      const filter = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: user.location.coordinates,
            },
            $maxDistance: 10,
          },
        },
      }
      const notes = await this.noteModel.find(filter);

      const total = await this.noteModel.countDocuments(filter)

      return {list: notes, total}; // {item: note}
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
