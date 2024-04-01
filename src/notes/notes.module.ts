import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './noteSchema/note-schema';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  exports: [NotesService, MongooseModule],
  imports: [
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
    ]),
  ],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
