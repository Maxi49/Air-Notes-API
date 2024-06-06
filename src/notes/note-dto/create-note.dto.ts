import { Scope } from '@nestjs/common';
import { IsNotEmpty, IsString, IsMongoId, IsNumber } from 'class-validator';

export class CreateNoteDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: {
    type: string;
    coordinates: number[];
  };

  @IsNumber()
  @IsNotEmpty()
  likes: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  scope: Scope;
}
