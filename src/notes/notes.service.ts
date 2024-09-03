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

  async getNotesBasedOnPreferences(userId: string) {
    try {
      const userVector = await this.vectorService.findVectorByUserId(userId);

      const similarVectors = await this.vectorService.vectorSearch(userVector);

      return similarVectors;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findUserNotes(userId: string) {
    try {
      return await this.noteModel.find({ user: userId });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findNoteById(id: string) {
    try {
      const note = await this.noteModel.findById(id);
      if (!note) {
        throw new NotFoundException();
      }
      return note;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
    console.log(file);

    const uploadedUrlImage =
      await this.cloudinaryImageManagmentService.uploadImage(file);

    const imageData = {
      imageUrl: uploadedUrlImage.url,
      publicImageId: uploadedUrlImage.public_id,
    };

    const createNote = await this.noteModel.create({
      user: userId,
      title,
      country,
      description,
      image: imageData,
      location: parsedLocation,
      scope,
    });

    this.vectorService.sendVectorIdentifier(
      token,
      createNote._id.toString(),
      description,
      uploadedUrlImage.url,
    );

    return createNote;
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
      const deletedNote = await this.noteModel.findByIdAndDelete({
        _id: noteId,
        userId,
      });

      await this.vectorService.deleteVector(deletedNote.vectorId);

      await this.cloudinaryImageManagmentService.deleteCloudinaryImages(
        deletedNote.image.publicImageId,
      );
      return true;
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

  /* Si yo solo necesito el valor actual de la ubicacion del usuario, no se lo voy a pasar de esa manera evidentemete, si no que se lo pasaria desde propio front con la ubicacion actualizada*/
  async findNotesNearUser(userId: string) {
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
