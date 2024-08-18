export interface vectorDto {
  _id?: string;
  postId?: string;
  userId?: string;
  vectorType?: 'user' | 'post';
  vector?: Array<number> | number[];
}
