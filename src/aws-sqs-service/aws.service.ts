import { Injectable } from '@nestjs/common';
import { AwsConfig } from './aws.config';
import { SendMessageCommandOutput } from '@aws-sdk/client-sqs';

@Injectable()
export class AwsService {
  constructor(private awsConfig: AwsConfig) {}

  async sendSQSMessage(message: object): Promise<SendMessageCommandOutput> {
    const messageSent = await this.awsConfig.sendMessage(message);

    return messageSent;
  }

  async deleteSQSMesssage(handleReceipt: string) {
    const deletedMessage = await this.awsConfig.killMessage(handleReceipt);

    return deletedMessage;
  }
}
