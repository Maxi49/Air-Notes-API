import { Scope } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  scope: Scope;
}
