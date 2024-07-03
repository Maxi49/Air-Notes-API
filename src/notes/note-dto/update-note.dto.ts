import { Scope } from '@nestjs/common';
import { IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import mongoose from 'mongoose';

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

  @IsArray()
  @IsOptional()
  likes: Array<mongoose.Types.ObjectId>;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsOptional()
  scope: Scope;
}
