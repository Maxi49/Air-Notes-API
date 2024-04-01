import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

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
}
