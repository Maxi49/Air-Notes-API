import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws-sqs-service/aws.service';

@Injectable()
export class MlApiService {
  constructor(private readonly awsService: AwsService) {}

  async sendVectorData(
    token: string,
    postId: string,
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

  async deleteMessageVectorData(handleReceipt: string) {
    try {
      const deletedMessage =
        await this.awsService.deleteSQSMesssage(handleReceipt);

      return deletedMessage;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
