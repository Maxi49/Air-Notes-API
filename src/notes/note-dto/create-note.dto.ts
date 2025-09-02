import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Scope } from 'src/types/types';

type GeoPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  // En formularios multipart suele llegar como string; aceptamos ambos
  location: GeoPoint | string;

  @IsNotEmpty()
  @IsOptional()
  image: {
    imageUrl: string;
    publicImageId: string;
  };

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  scope: Scope;
}
