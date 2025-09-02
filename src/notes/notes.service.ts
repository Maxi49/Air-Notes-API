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

type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private readonly cloudinaryImageManagmentService: CloudinaryConfig,
    @Inject(forwardRef(() => VectorService))
    private readonly vectorService: VectorService,
  ) {}

  async findAllNotes(): Promise<{ notes: Note[]; total: number }> {
    const notes = await this.noteModel.find({});
    const total = await this.noteModel.countDocuments({});
    return { notes, total };
  }

  async getNotesBasedOnPreferences(userId: string): Promise<Note[]> {
    try {
      const userVector = await this.vectorService.findVectorByUserId(userId);
      if (!userVector) return [];

      const similarVectors = await this.vectorService.vectorSearch(
        userVector,
        20,
      );

      const noteIds = (similarVectors || [])
        .map((v: any) => v.noteId)
        .filter(Boolean);

      if (!noteIds.length) return [];

      const notes = await this.noteModel.find({ _id: { $in: noteIds } }).lean();

      const order = new Map<string, number>();
      noteIds.forEach((id: string, idx: number) =>
        order.set(id.toString(), idx),
      );
      const sorted = notes.sort(
        (a: any, b: any) =>
          (order.get(a._id.toString()) ?? 0) -
          (order.get(b._id.toString()) ?? 0),
      );

      return sorted as unknown as Note[];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findUserNotes(userId: string): Promise<Note[]> {
    try {
      return await this.noteModel.find({ user: userId });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findNoteById(id: string): Promise<Note> {
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
    file: Express.Multer.File,
    token: string,
  ): Promise<Note> {
    const { description, location, title, country, scope } = note;
    console.log('userId provided: ', userId);

    const parsedLocation: GeoPoint =
      typeof location === 'string'
        ? JSON.parse(location)
        : (location as GeoPoint);
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

    await this.vectorService.sendVectorIdentifier(
      token,
      createNote._id.toString(),
      description,
      uploadedUrlImage.url,
    );

    return createNote;
  }

  async updateNote(
    userId: string,
    id: string,
    note: UpdateNoteDto,
  ): Promise<Note | null> {
    const updatedNote = await this.noteModel.findOneAndUpdate(
      { _id: id, user: userId },
      { ...note },
      { new: true },
    );
    return updatedNote;
  }

  async removeNote(noteId: string, userId: string): Promise<boolean> {
    try {
      const deletedNote = await this.noteModel.findOneAndDelete({
        _id: noteId,
        user: userId,
      });

      if (deletedNote?.vectorId) {
        await this.vectorService.deleteVector(deletedNote.vectorId);
      }

      if (deletedNote?.image?.publicImageId) {
        await this.cloudinaryImageManagmentService.deleteCloudinaryImages(
          deletedNote.image.publicImageId,
        );
      }
      return true;
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

  /* Si yo solo necesito el valor actual de la ubicacion del usuario, no se lo voy a pasar de esa manera evidentemete, si no que se lo pasaria desde propio front con la ubicacion actualizada*/
  async findNotesNearUser(userId: string): Promise<void> {
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
