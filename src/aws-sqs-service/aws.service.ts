import { Injectable } from '@nestjs/common';
import { AwsConfig } from './aws.config';
import { SendMessageCommandOutput } from '@aws-sdk/client-sqs';

export interface SQSMessage {
  token: string;
  postId: string;
  text: string;
  imgUrl: string;
}

@Injectable()
export class AwsService {
  constructor(private awsConfig: AwsConfig) {}

  async sendSQSMessage(message): Promise<SendMessageCommandOutput> {
    const messageSent = await this.awsConfig.sendMessage(message);

    return messageSent;
  }

  async deleteSQSMesssage(handleReceipt: string) {
    const deletedMessage = await this.awsConfig.killMessage(handleReceipt);

    return deletedMessage;
  }
}
