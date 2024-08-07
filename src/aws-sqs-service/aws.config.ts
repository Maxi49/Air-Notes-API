import dotenv from 'dotenv';
dotenv.config();
import {
  SendMessageCommand,
  SQSClient,
  SendMessageCommandOutput,
} from '@aws-sdk/client-sqs';
import { BadRequestException } from '@nestjs/common';

export class AwsConfig {
  private SQSurl: string;
  private sqsClient: SQSClient;

  constructor() {
    const publicKey = process.env.awsPublicKey;
    const secretKey = process.env.awsSecretKey;

    this.SQSurl = process.env.SQSurl;

    this.sqsClient = new SQSClient({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: publicKey,
        secretAccessKey: secretKey,
      },
    });
  }

  async sendMessage(message: object): Promise<SendMessageCommandOutput> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: this.SQSurl,
        MessageBody: JSON.stringify(message),
      });

      const messageSent = await this.sqsClient.send(command);

      return messageSent;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
