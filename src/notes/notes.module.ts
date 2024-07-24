import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './noteSchema/note-schema';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { UsersModule } from 'src/users/users.module';
import { MlApiModule } from 'machineLearningApi/mlApi.module';

@Module({
  imports: [
    MlApiModule,
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
    ]),
  ],
  exports: [NotesService],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
