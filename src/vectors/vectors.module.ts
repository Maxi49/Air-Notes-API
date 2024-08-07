import { forwardRef, Module } from '@nestjs/common';
import { VectorService } from './vector.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vector, VectorSchema } from './entity/vector-schema';
import { MlApiModule } from 'src/machineLearningApi/mlApi.module';
import { NotesModule } from 'src/notes/notes.module';
import { VectorController } from './vector.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => NotesModule),
    MlApiModule,
    MongooseModule.forFeature([
      {
        name: Vector.name,
        schema: VectorSchema,
      },
    ]),
  ],
  controllers: [VectorController],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
