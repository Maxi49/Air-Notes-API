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
import { VectorType } from 'src/types/types';
import { findClosestVectors } from './vector.helpers/vectorHelpers';

@Injectable()
export class VectorService {
  constructor(
    @InjectModel(Vector.name) public vectorModel: Model<Vector>,
    public readonly mlApiService: MlApiService,
    @Inject(forwardRef(() => NotesService))
    public readonly noteService: NotesService,
  ) {}

  async sendVectorIdentifier(
    token: string,
    noteId: string,
    descriptionText: string,
    image: string,
  ): Promise<void> {
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
    userId: string,
    noteId: string,
    vector: number[],
    receiptHandle: string,
  ) {
    try {
      const noteVector = await this.vectorModel.create({
        vectorType: VectorType.note,
        noteId: noteId,
        vector: vector,
      });

      console.log(receiptHandle);

      const updatedNote = await this.noteService.updateNote(
        userId.toString(),
        noteId.toString(),
        {
          vector: noteVector.vector,
          vectorId: noteVector._id.toString(),
        },
      );

      await this.mlApiService.deleteMessageVectorData(receiptHandle);

      console.log('updated: ', updatedNote);

      return updatedNote;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateVector(
    vectorId: string,
    vector: number[],
  ): Promise<Vector | null> {
    const updated = await this.vectorModel.findByIdAndUpdate(
      vectorId,
      { vector: vector },
      { new: true },
    );

    return updated;
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
  /* TODO Add vector types such as : noteVector or userVector. So then it will filter the vectors in the correct way */

  async createUserVectorPreferences(userId: string) {
    try {
      const defaultPreferences = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

      const vector = await this.vectorModel.create({
        vectorType: VectorType.user,
        userId: userId,
        vector: defaultPreferences,
      });

      return vector;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findVectorByUserId(userId: string): Promise<Vector | null> {
    try {
      console.log('user id: ', userId);
      const vector: Vector | null = await this.vectorModel.findOne({
        userId: userId,
      });
      console.log(vector);

      return vector;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async vectorSimilaritySearch(vector: Vector): Promise<void> {
    try {
      console.log(vector.vector);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async vectorSearch(vector: Vector, limit = 20): Promise<Vector[]> {
    try {
      // Fetch only note vectors with minimal fields for speed
      const candidates: Pick<Vector, '_id' | 'noteId' | 'vector'>[] =
        await this.vectorModel
          .find({ vectorType: VectorType.note })
          .select({ vector: 1, noteId: 1 })
          .lean();

      if (!candidates?.length) return [] as unknown as Vector[];

      const top = findClosestVectors(vector.vector, candidates as any, limit);

      // Return as Vector-like objects (compatible with existing callers)
      // If not using .lean(), we could refetch; here we cast as any since only _id/noteId/vector are used downstream
      return top as unknown as Vector[];
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
