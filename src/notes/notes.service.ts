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
import { VectorService } from 'src/vectors/vector.service';
import { CloudinaryConfig } from 'src/cloudinary/cloudinary.config';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly cloudinaryImageManagmentService: CloudinaryConfig,
    private readonly vectorService: VectorService,
  ) {}

  async findAllNotes() {
    const notes = await this.noteModel.find({});
    const total = await this.noteModel.countDocuments({});
    return { notes, total };
  }

  async findUserNotes(userId: any) {
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

  async createNote(userId: string, note: CreateNoteDto, file: any) {
    const { description, location, title, country, scope } = note;
    console.log('userId provided: ', userId);
    // @ts-expect-error im trying
    const parsedLocation = JSON.parse(location);

    const uploadedUrlImage =
      await this.cloudinaryImageManagmentService.uploadImage(file);

    const post = await this.noteModel.create({
      user: userId,
      title,
      country,
      description,
      image: uploadedUrlImage.url,
      location: parsedLocation,
      scope,
    });

    const vectorPostIdentifier =
      await this.vectorService.createVectorIdentifier(
        post._id,
        description,
        uploadedUrlImage.url,
      );
    console.log(vectorPostIdentifier);

    return post;
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
