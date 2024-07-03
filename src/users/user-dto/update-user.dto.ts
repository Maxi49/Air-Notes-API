import { IsOptional, IsString, IsInt, IsEmail, IsArray } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsArray()
  @IsOptional()
  likes: Array<mongoose.Types.ObjectId>;

  @IsOptional()
  location?: {
    type: string;
    coordinates: number[];
  };

  @IsString()
  @IsOptional()
  profilePicture: string;
}
