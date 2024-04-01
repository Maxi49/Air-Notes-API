import { IsOptional, IsString, IsMongoId } from 'class-validator';

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
}
