import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { VectorService } from './vector.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CurrentUser } from 'src/CustomDecorators/getCurrentUser';

import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';
import { UserDto } from 'src/users/user-dto/user.dto';

@Controller('vector')
@UseFilters(new HttpExceptionFilter())
export class VectorController {
  constructor(private readonly vectorService: VectorService) {}

  @Post('create-vector')
  @UseGuards(AuthGuard) // TODO ADD TYPE FOR BODY
  async createVector(@CurrentUser() user: UserDto, @Body() data: any) {
    console.log(data);
    const { data: vector } = data;
    console.log(vector.note);
    console.log(vector);

    const createdVector = await this.vectorService.createVector(
      user._id.toString(),
      vector.note,
      vector.vector,
      vector.receiptHandle,
    );

    return createdVector;
  }
}
