import { IsOptional, IsString, IsMongoId, IsArray } from 'class-validator';
import { Scope } from 'src/types/types';

type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};

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
  location?: GeoPoint;

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
