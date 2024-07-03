import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './noteSchema/note-schema';
import mongoose, { Model } from 'mongoose';
import { CreateNoteDto } from './note-dto/create-note.dto';
import { UpdateNoteDto } from './note-dto/update-note.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async findAllNotes() {
    const notes = await this.noteModel.find({});
    const total = await this.noteModel.countDocuments({});
    return { notes, total };
  }

  async findUserNotes(userId) {
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
    const { description, location, title, country, image, scope } = note;

    console.log('userId provided: ', userId);
    return await this.noteModel.create({
      user: userId,
      title,
      country,
      description,
      image,
      location,
      scope,
    });
  }

  async updateNote(userId: string, id: string, note: UpdateNoteDto) {
    const updatedNote = await this.noteModel.findByIdAndUpdate(
      { _id: id, user: userId },
      { ...note },
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

  async updateNoteLikes(id: string, like: mongoose.Types.ObjectId) {
    const updatedLikes = await this.noteModel.findByIdAndUpdate(
      id,
      {
        $push: { likes: like },
      },
      { new: true },
    );

    return updatedLikes;
  }

  async removeAllUserNotes(userId: string) {
    try {
      await this.noteModel.deleteMany({ user: userId });
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findNotesNearUser(userId: string) {
    try {
      const user = await this.userService.findUserById(userId);

      const filter = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: user.location.coordinates,
            },
            $maxDistance: 50,
          },
        },
      };
      const notes = await this.noteModel.find(filter);
      return notes; // {item: note}
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
