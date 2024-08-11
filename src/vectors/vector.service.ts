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
    userId: string,
    noteId: mongoose.Types.ObjectId,
    vector: Vector,
    receiptHandle: string,
  ) {
    try {
      console.log(receiptHandle);
      console.log(vector);
      console.log(noteId);
      const postVector = await this.vectorModel.create({
        postId: noteId,
        vector: vector,
      });
      console.log(postVector);
      const updatedNote = await this.noteService.updateNote(userId, noteId, {
        vector: postVector.vector,
        vectorId: postVector._id,
      });

      await this.mlApiService.deleteMessageVectorData(receiptHandle);

      console.log('updated: ', updatedNote);

      return updatedNote;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // TODO use this function when creating a new user
  /* TODO Add vector types such as : postVector or userVector. So then it will filter the vectors in the correct way */

  async createUserVectorPreferences(userId: string) {
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
