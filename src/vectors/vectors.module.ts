import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vector, VectorSchema } from './entity/vector-schema';
import { MlApiModule } from 'src/machineLearningApi/mlApi.module';

@Module({
  imports: [
    MlApiModule,
    MongooseModule.forFeature([
      {
        name: Vector.name,
        schema: VectorSchema,
      },
    ]),
  ],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
