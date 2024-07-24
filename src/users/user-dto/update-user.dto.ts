import { IsOptional, IsString, IsInt, IsEmail } from 'class-validator';

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

  @IsOptional()
  location?: {
    type: string;
    coordinates: number[];
  };

  @IsString()
  @IsOptional()
  profilePicture: string;
}
