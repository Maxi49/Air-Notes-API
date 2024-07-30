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

  async createVectorIdentifier(
    postId: mongoose.Types.ObjectId,
    descriptionText: string,
    image: string,
  ): Promise<Vector | unknown> {
    try {
      const vector = await this.mlApiService.createPostVectorIdentifier(
        descriptionText,
        image,
      );
      console.log(vector);
      const postVector = await this.vectorModel.create({
        postId: postId,
        vector: vector,
      });

      console.log(postVector.vector);

      return postVector.vector;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

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
