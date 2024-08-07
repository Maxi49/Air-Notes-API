import { Module } from '@nestjs/common';
import { MlApiService } from './mlApi.service';
import { AwsModule } from 'src/aws-sqs-service/aws.module';

@Module({
  imports: [AwsModule],
  exports: [MlApiService],
  providers: [MlApiService],
})
export class MlApiModule {}
