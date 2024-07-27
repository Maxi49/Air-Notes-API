import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vector } from './entity/vector-schema';
import mongoose, { Model } from 'mongoose';
import { MlApiService } from 'src/machineLearningApi/mlApi.service';

@Injectable()
export class VectorService {
  constructor(
    @InjectModel(Vector.name) private vectorModel: Model<Vector>,
    private readonly mlApiService: MlApiService,
  ) {}

  async createVector(
    note: mongoose.Types.ObjectId,
    descriptionText: string,
    image: string,
  ): Promise<Vector | unknown> {
    try {
      const vector = this.mlApiService.createPostVectorIdentifier(
        descriptionText,
        image,
      );

      const postVector = this.vectorModel.create({
        note,
        vector,
      });

      return postVector;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
