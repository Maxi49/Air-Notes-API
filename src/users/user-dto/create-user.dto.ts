import { IsNotEmpty, IsString, IsInt, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  location: {
    type: string;
    coordinates: number[];
  };

  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}
