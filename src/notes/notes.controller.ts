import { Controller, Get, UseFilters } from '@nestjs/common';
import { NotesService } from './notes.service';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';

@Controller('notes')
@UseFilters(new HttpExceptionFilter())
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  async getNotes() {}
}
