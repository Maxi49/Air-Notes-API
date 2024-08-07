import { Module } from '@nestjs/common';
import { AwsConfig } from './aws.config';
import { AwsService } from './aws.service';

@Module({
  exports: [AwsService],
  providers: [AwsConfig, AwsService],
})
export class AwsModule {}
