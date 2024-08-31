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
import {
  findClosestVectors,
  thresholdCalc,
} from './vector.helpers/vectorHelpers';

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
    userId: string,
    noteId: string,
    vector: Vector,
    receiptHandle: string,
  ) {
    try {
      console.log(receiptHandle);
      console.log(vector);
      console.log(noteId);
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
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async vectorSearch(vector: Vector) {
    try {
      let minThresholdValue = 1;
      let minVectorsInRange = 200;
      let results: Vector[];
      let effort = 20;

      console.log(vector.vector);
      while (effort > 0) {
        console.log(minThresholdValue);
        console.log(minVectorsInRange);
        console.log(effort);

        const thresholds = thresholdCalc(vector.vector, minThresholdValue);

        results = await this.vectorModel.find({
          vectorType: VectorType.note,
          vector: {
            $all: thresholds.map((threshold) => ({
              $elemMatch: { $gte: threshold[1], $lte: threshold[0] },
            })),
          },
        });

        console.log(results.length);

        results.length >= minVectorsInRange
          ? (effort = 0)
          : (effort = effort - 1);

        minVectorsInRange - 1 === 0
          ? (minVectorsInRange = 1)
          : (minVectorsInRange = minVectorsInRange - 10);

        minThresholdValue <= 20
          ? (minThresholdValue = minThresholdValue + 1)
          : (minThresholdValue = 20);
      }

      const closestVectors: Vector[] = findClosestVectors(
        vector.vector,
        results,
      );

      return closestVectors;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
