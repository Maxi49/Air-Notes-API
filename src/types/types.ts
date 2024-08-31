import { Request } from 'express';

export interface IRequest extends Request {
  user?: any;
  notes?: any;
  id?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type Scope = 'global' | 'local';

export enum VectorType {
  user = 'user',
  note = 'note',
}
