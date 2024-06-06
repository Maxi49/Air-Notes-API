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
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './userSchema/user-schema';
import { CreateUserDto } from './user-dto/create-user.dto';
import { UserCredentials } from 'src/types/types';
import { AuthGuard } from 'src/Guards/auth.guard';
import { HttpExceptionFilter } from 'src/ErrorHandlers/errorHandlers';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { CurrentUser } from 'src/CustomDecorators/getCurrentUser';
import { UserDto } from './user-dto/user.dto';

@Controller('user-actions')
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: User) {
    try {
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Post('register')
  async create(@Body() user: CreateUserDto) {
    const createdUser = await this.usersService.register(user);
    return createdUser;
  }

  @Post('login')
  async login(@Body() userCredentials: UserCredentials) {
    const { email, password } = userCredentials;
    return await this.usersService.login(email, password);
  }

  @Patch('update-email')
  @UseGuards(AuthGuard)
  async updateUserEmail(@Body() email: User, @CurrentUser() user: UserDto) {
    await this.usersService.updateUserEmail(user._id, email);
    return true;
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  async updateUserPass(
    @Body() password: string,
    @CurrentUser() user: UserDto,
  ): Promise<boolean> {
    await this.usersService.updateUserPass(user._id, password);
    return true;
  }

  @Patch('update-profile')
  @UseGuards(AuthGuard)
  async updateUserProfile(
    @Body() updatedCharacteristics: User,
    @CurrentUser() user: UserDto,
  ): Promise<User> {
    const updatedUser = await this.usersService.updateUserProfile(
      user._id,
      updatedCharacteristics,
    );
    return updatedUser;
  }

  @Delete('delete-Profile')
  @UseGuards(AuthGuard)
  async deleteUser(@CurrentUser() user: UserDto): Promise<void> {
    await this.usersService.deleteUser(user);
    return;
  }
}
