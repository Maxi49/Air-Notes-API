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
import { VectorService } from 'src/vectors/vector.service';
import { CloudinaryConfig } from 'src/cloudinary/cloudinary.config';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private readonly cloudinaryImageManagmentService: CloudinaryConfig,
    @Inject(forwardRef(() => VectorService))
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

  async createNote(
    userId: string,
    note: CreateNoteDto,
    file: any,
    token: string,
  ) {
    const { description, location, title, country, scope } = note;
    console.log('userId provided: ', userId);

    // @ts-expect-error This cames here as a string
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

    this.vectorService.sendVectorIdentifier(
      token,
      post._id,
      description,
      uploadedUrlImage.url,
    );

    return post;
  }

  async updateNote(
    userId: string,
    id: mongoose.Types.ObjectId,
    note: UpdateNoteDto,
  ) {
    const updatedNote = await this.noteModel.findByIdAndUpdate(
      { _id: id, user: userId },
      { ...note },
      { new: true },
    );
    return updatedNote;
  }

  async removeNote(noteId: string, userId: mongoose.Types.ObjectId) {
    try {
      return await this.noteModel.findByIdAndDelete({ _id: noteId, userId });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async removeAllUserNotes(userId: unknown) {
    try {
      await this.noteModel.deleteMany({ user: userId });
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /* Si yo solo necesito el valor actual de la ubicacion del usuario, no se lo voy a pasar de esa manera evidentemete, si no que se lo pasaria desde propio front con la ubicacion actualizada*/
  async findNotesNearUser(userId: mongoose.Types.ObjectId) {
    try {
      console.log(userId);
      // TODO Re-do the logic of this function
      /*
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
      };*/
      return; // {item: note}
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
