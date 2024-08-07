import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';
import { AuthGuard } from 'src/Guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateNoteDto } from './note-dto/update-note.dto';
import { CurrentUser } from 'src/CustomDecorators/getCurrentUser';
import { UserDto } from 'src/users/user-dto/user.dto';
import { CreateNoteDto } from './note-dto/create-note.dto';
import mongoose from 'mongoose';

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
    const notes = await this.notesService.findNotesNearUser(user._id);
    console.log(notes);
    return notes;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.notesService.findNoteById(id);
  }

  @Post('new-note')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Headers('Authorization') token: string,
    @Body() note: CreateNoteDto,
    @CurrentUser() user: any,
    @UploadedFile() file: any,
  ) {
    try {
      console.log(file.filename, file.path);
      console.log(token);
      const id = user._id;

      const createdNote = await this.notesService.createNote(
        id,
        note,
        file,
        token,
      );

      return createdNote;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @CurrentUser() user: UserDto,
    @Param('id') noteId: unknown,
    @Body()
    note: UpdateNoteDto,
  ) {
    try {
      const updatedNote = await this.notesService.updateNote(
        // @ts-expect-error Types conevrtions
        user._id as mongoose.Types.ObjectId,
        noteId as mongoose.Types.ObjectId,
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
