import { Scope } from '@nestjs/common';
import { IsOptional, IsString, IsMongoId, IsNumber } from 'class-validator';

export class UpdateNoteDto {
  @IsMongoId()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  location?: {
    type: string;
    coordinates: number[];
  };

  @IsNumber()
  @IsOptional()
  likes: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsOptional()
  scope: Scope;
}
