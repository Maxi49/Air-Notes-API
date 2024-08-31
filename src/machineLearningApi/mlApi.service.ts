import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws-sqs-service/aws.service';

@Injectable()
export class MlApiService {
  constructor(private readonly awsService: AwsService) {}

  async sendVectorData(
    token: string,
    noteId: string,
    text: string,
    imgUrl: string,
  ): Promise<boolean> {
    try {
      await this.awsService.sendSQSMessage({
        token,
        noteId,
        text,
        imgUrl,
      });

      return true;
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
