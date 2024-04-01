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
import { UserService } from './users.service';
import { User } from './userSchema/user-schema';
import { CreateUserDto } from './user-dto/create-user.dto';
import { IRequest, UserCredentials } from 'src/types/types';
import { AuthGuard } from 'src/Guards/auth.guard';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';

@Controller('user-actions')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAllUsers();
  }

  @Get('profile')
  async getProfile() {
    try {
      return await this.usersService.getProfile();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Post('register')
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.register(user);
  }

  @Post('login')
  async login(@Body() userCredentials: UserCredentials) {
    const { email, password } = userCredentials;
    return await this.usersService.login(email, password);
  }

  @Patch('update-email')
  @UseGuards(AuthGuard)
  async updateUserEmail(@Body() email: string) {
    await this.usersService.updateUserEmail(email);
    return;
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  async updateUserPass(@Body() password: string) {
    await this.usersService.updateUserEmail(password);
    return;
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard)
  async updateUserProfile(@Body() user: User, req: IRequest): Promise<User> {
    const id = req.id;
    const updatedUser = await this.usersService.updateUserProfile(id, user);
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(req: IRequest) {
    const id = req.id;
    await this.usersService.deleteUser(id);
    return;
  }
}
