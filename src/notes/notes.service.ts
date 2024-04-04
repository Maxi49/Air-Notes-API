import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './noteSchema/note-schema';
import { Model } from 'mongoose';
import { CreateNoteDto } from './note-dto/create-note.dto';
import { UpdateNoteDto } from './note-dto/update-note.dto';
import { UserService } from 'src/users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private userService: UserService,
  ) {}

  async findAllNotes() {
    return await this.noteModel.find({});
  }

  async findUserNotes(userId: string) {
    return await this.noteModel.find({ user: userId });
  }

  async findNoteById(id: string) {
    return await this.noteModel.findById(id);
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
    return await this.noteModel.findByIdAndDelete({ _id: noteId, userId });
  }

  async findNotesNearUser(userId: string) {
    const user = await this.userService.findUserById(userId);
    const findedNote = await this.noteModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates,
          },
          // Esta en metros je
          $maxDistance: 30,
        },
      },
    });

    return findedNote;
  }
}
