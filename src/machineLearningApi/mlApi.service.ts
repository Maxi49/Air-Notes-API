import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { AwsService } from 'src/aws-sqs-service/aws.service';

@Injectable()
export class MlApiService {
  constructor(private readonly awsService: AwsService) {}

  async sendVectorData(
    token: string,
    postId: mongoose.Types.ObjectId,
    text: string,
    imgUrl: string,
  ): Promise<string> {
    try {
      await this.awsService.sendSQSMessage({
        token,
        postId,
        text,
        imgUrl,
      });

      return;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
