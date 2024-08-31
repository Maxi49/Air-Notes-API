import dotenv from 'dotenv';
dotenv.config();
import {
  SendMessageCommand,
  SQSClient,
  SendMessageCommandOutput,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { BadRequestException } from '@nestjs/common';
import { SQSMessage } from './aws.service';

export class AwsConfig {
  private SQSurl: string;
  private sqsClient: SQSClient;

  constructor() {
    const publicKey = process.env.awsPublicKey;
    const secretKey = process.env.awsSecretKey;

    this.SQSurl = process.env.SQSurl;

    this.sqsClient = new SQSClient({
      region: process.env.awsRegion,
      credentials: {
        accessKeyId: publicKey,
        secretAccessKey: secretKey,
      },
    });
  }

  async sendMessage(message: SQSMessage): Promise<SendMessageCommandOutput> {
    try {
      console.log('message id: ', message.noteId);

      const command = new SendMessageCommand({
        MessageGroupId: message.noteId,
        MessageDeduplicationId: message.noteId,
        QueueUrl: this.SQSurl,
        MessageBody: JSON.stringify(message),
      });

      const messageSent = await this.sqsClient.send(command);

      return messageSent;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async killMessage(handleReceipt: string) {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.SQSurl,
        ReceiptHandle: handleReceipt,
      });

      const deletedMessage = this.sqsClient.send(command);

      return deletedMessage;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
