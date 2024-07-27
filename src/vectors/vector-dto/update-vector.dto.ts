import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVectorDto {
  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  vector: Array<number>;
}
