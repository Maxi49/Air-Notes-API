import { VectorType } from 'src/types/types';

export interface vectorDto {
  _id?: string;
  noteId?: string;
  userId?: string;
  vectorType?: VectorType;
  vector?: Array<number> | number[];
}
