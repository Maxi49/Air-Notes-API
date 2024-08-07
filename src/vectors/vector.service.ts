import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vector } from './entity/vector-schema';
import mongoose, { Model } from 'mongoose';
import { MlApiService } from 'src/machineLearningApi/mlApi.service';
import { NotesService } from 'src/notes/notes.service';

@Injectable()
export class VectorService {
  constructor(
    @InjectModel(Vector.name) private vectorModel: Model<Vector>,
    private readonly mlApiService: MlApiService,
    @Inject(forwardRef(() => NotesService))
    private readonly noteService: NotesService,
  ) {}

  async sendVectorIdentifier(
    token: string,
    noteId: mongoose.Types.ObjectId,
    descriptionText: string,
    image: string,
  ): Promise<boolean> {
    try {
      await this.mlApiService.sendVectorData(
        token,
        noteId,
        descriptionText,
        image,
      );

      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createVector(
    userId: mongoose.Types.ObjectId,
    noteId: mongoose.Types.ObjectId,
    vector: Vector,
  ) {
    const postVector = await this.vectorModel.create({
      postId: noteId,
      vector: vector,
    });

    const updatedNote = await this.noteService.updateNote(userId, noteId, {
      vector: postVector.vector,
    });

    return updatedNote;
  }

  // TODO use this function when creating a new user

  async createUserVectorPreferences(userId: mongoose.Types.ObjectId) {
    const defaultPreferences = [
      0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
    ];

    const vector = this.vectorModel.create({
      userId,
      vector: defaultPreferences,
    });

    return vector;
  }

  async vectorSimilaritySearch(vector: Vector) {
    const filter = {
      $vectorSearch: {
        index: 'AtlasVectorSearchIndex',
        path: 'vector',
        queryVector: vector,
      },
    };

    const similarities = await this.vectorModel.aggregate([{ $match: filter }]);

    return similarities;
  }
}
