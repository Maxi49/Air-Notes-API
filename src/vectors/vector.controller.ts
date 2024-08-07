import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { VectorService } from './vector.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CurrentUser } from 'src/CustomDecorators/getCurrentUser';
import { User } from 'src/users/userSchema/user-schema';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';

@Controller('vector')
@UseFilters(new HttpExceptionFilter())
export class VectorController {
  constructor(private readonly vectorService: VectorService) {}

  @Post('create-vector')
  @UseGuards(AuthGuard)
  async createVector(@CurrentUser() user: User, @Body() data: any) {
    const createdVector = await this.vectorService.createVector(
      user._id,
      data.note,
      data.vector,
    );

    return createdVector;
  }
}
