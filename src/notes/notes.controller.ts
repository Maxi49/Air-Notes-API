import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CreateNoteDto } from './note-dto/create-note.dto';
import { UpdateNoteDto } from './note-dto/update-note.dto';
import { CurrentUser } from 'src/CustomDecorators/getCurrentUser';
import { UserDto } from 'src/users/user-dto/user.dto';

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
  async getUserNotes(@CurrentUser() user: UserDto) {
    const id = user._id;
    return await this.notesService.findUserNotes(id);
  }

  @Get('near-notes')
  @UseGuards(AuthGuard)
  async getNotesNearUser(@CurrentUser() user: UserDto) {
    return await this.notesService.findNotesNearUser(user._id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.notesService.findNoteById(id);
  }

  @Post('new-note')
  @UseGuards(AuthGuard)
  async create(@Body() note: CreateNoteDto, @CurrentUser() user: UserDto) {
    try {
      const id = user._id;
      return await this.notesService.createNote(id, note);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @CurrentUser() user: UserDto,
    @Param('id') noteId: string,
    @Body()
    note: UpdateNoteDto,
  ) {
    try {
      const updatedNote = await this.notesService.updateNote(
        user._id,
        noteId,
        note,
      );
      return updatedNote;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') noteId: string, @CurrentUser() user: UserDto) {
    await this.notesService.removeNote(noteId, user._id);
    return null;
  }
}
