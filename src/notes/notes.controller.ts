import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CreateNoteDto } from './note-dto/create-note.dto';
import { IRequest } from 'src/types/types';
import { UpdateNoteDto } from './note-dto/update-note.dto';
import { Response } from 'express';

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
  async getUserNotes(@Req() req: IRequest, @Res() res: Response) {
    const id = req.id;
    return res.json({
      userNotes: await this.notesService.findUserNotes(id),
      success: true,
    });
  }

  @Get('near-notes')
  @UseGuards(AuthGuard)
  async getNotesNearUser(@Req() req: IRequest, @Res() res: Response) {
    return res.json({
      nearNotes: await this.notesService.findNotesNearUser(req.id),
      success: true,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.notesService.findNoteById(id);
  }

  @Post('new-note')
  @UseGuards(AuthGuard)
  async create(
    @Body() note: CreateNoteDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    try {
      const id = req.id;
      return res.json({
        createdNote: await this.notesService.createNote(id, note),
        success: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') noteId: string,
    @Req() req: IRequest,
    @Body()
    note: UpdateNoteDto,
    @Res() res: Response,
  ) {
    try {
      const userId = req.id;
      const updatedNote = await this.notesService.updateNote(
        userId,
        noteId,
        note,
      );
      return res.json({
        updatedNote: updatedNote,
        success: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') noteId: string, @Req() req: IRequest) {
    const userId = req.id;
    await this.notesService.removeNote(noteId, userId);
    return null;
  }
}
