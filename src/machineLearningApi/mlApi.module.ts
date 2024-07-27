import { Module } from '@nestjs/common';
import { MlApiService } from './mlApi.service';

@Module({
  exports: [MlApiService],
  providers: [MlApiService],
})
export class MlApiModule {}
