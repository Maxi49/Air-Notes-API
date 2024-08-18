import { Scope } from '@nestjs/common';
import { IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';

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

  @IsOptional()
  image?: {
    imageUrl: string;
    publicImageId: string;
  };

  @IsString()
  @IsOptional()
  country?: string;

  @IsOptional()
  vectorId?: string;

  @IsArray()
  @IsOptional()
  vector?: number[];

  @IsOptional()
  scope?: Scope;
}
