import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from 'src/notes/noteSchema/note-schema';
import { User } from 'src/users/userSchema/user-schema';

@Injectable()
export class GeoService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findNotesNearUser(userId: string) {
    const { location } = await this.userModel.findById(userId);
    return this.noteModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates,
          },
          $maxDistance: 3,
        },
      },
    });
  }
}
