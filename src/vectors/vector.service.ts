import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vector } from './entity/vector-schema';
import { Model } from 'mongoose';
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
    noteId: string,
    descriptionText: string,
    image: string,
  ): Promise<boolean> {
    try {
      console.log(noteId);

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
    vectorType: 'user' | 'post',
    userId: string,
    noteId: string,
    vector: Vector,
    receiptHandle: string,
  ) {
    try {
      console.log(receiptHandle);
      console.log(vector);
      console.log(noteId);
      const postVector = await this.vectorModel.create({
        vectorType,
        postId: noteId,
        vector: vector,
      });
      const updatedNote = await this.noteService.updateNote(
        userId.toString(),
        noteId.toString(),
        {
          vector: postVector.vector,
          vectorId: postVector._id.toString(),
        },
      );

      await this.mlApiService.deleteMessageVectorData(receiptHandle);

      console.log('updated: ', updatedNote);

      return updatedNote;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateVector(vectorId: string, vector: number[]): Promise<Vector> {
    await this.vectorModel.findByIdAndUpdate(
      vectorId,
      { vector: vector },
      { new: true },
    );

    return;
  }

  async deleteVector(vectorId: string): Promise<boolean> {
    try {
      await this.vectorModel.findByIdAndDelete(vectorId);

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // TODO use this function when creating a new user
  /* TODO Add vector types such as : postVector or userVector. So then it will filter the vectors in the correct way */

  async createUserVectorPreferences(userId: any) {
    try {
      const defaultPreferences = [
        0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
      ];

      const vector = this.vectorModel.create({
        vectorType: 'user',
        userId: userId,
        vector: defaultPreferences,
      });

      return vector;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findVectorByUserId(userId: string): Promise<Vector> {
    try {
      console.log('user id: ', userId);
      const vector: Vector | unknown = await this.vectorModel.findOne({
        userId: userId,
      });
      console.log(vector);

      return vector as Vector;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async vectorSimilaritySearch(vector: Vector) {
    try {
      console.log(vector.vector);
      const filter = {
        vectorType: { $eq: 'note' },

        $vectorSearch: {
          index: 'AtlasVectorSearchIndex',
          path: 'vector',
          queryVector: vector.vector,
          maxResults: 10,
        },
      };

      const similarities = await this.vectorModel.aggregate([
        { $match: filter },
      ]);

      return similarities;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
