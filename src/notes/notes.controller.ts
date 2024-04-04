import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CreateNoteDto } from './note-dto/create-note.dto';
import { IRequest } from 'src/types/types';
import { UpdateNoteDto } from './note-dto/update-note.dto';

@Controller('notes')
@UseFilters(new HttpExceptionFilter())
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  async getAll() {
    return await this.notesService.findAllNotes();
  }

  @Get('user-notes')
  @UseGuards(AuthGuard)
  async getUserNotes(@Req() req: IRequest) {
    const id = req.id;
    return await this.notesService.findUserNotes(id);
  }

  @Get('near-notes')
  @UseGuards(AuthGuard)
  async getNotesNearUser(@Req() req: IRequest) {
    return await this.notesService.findNotesNearUser(req.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.notesService.findNoteById(id);
  }

  @Post('new-note')
  @UseGuards(AuthGuard)
  async create(@Body() note: CreateNoteDto, @Req() req: IRequest) {
    const id = req.id;
    return await this.notesService.createNote(id, note);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') noteId: string,
    @Req() req: IRequest,
    @Body()
    note: UpdateNoteDto,
  ) {
    const userId = req.id;
    const updatedNote = await this.notesService.updateNote(
      userId,
      noteId,
      note,
    );
    return updatedNote;
  }

  @Delete(':id')
  async remove(@Param('id') noteId: string, @Req() req: IRequest) {
    const userId = req.id;
    await this.notesService.removeNote(noteId, userId);
    return;
  }
}
