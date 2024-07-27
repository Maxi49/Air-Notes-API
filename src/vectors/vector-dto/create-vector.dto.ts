import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateVectorDto {
  @IsArray()
  @IsNotEmpty()
  vector: Array<number>;
}
