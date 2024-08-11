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

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  vectorId?: mongoose.Types.ObjectId;

  @IsArray()
  @IsOptional()
  vector?: number[];

  @IsOptional()
  scope?: Scope;
}
