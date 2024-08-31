import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { VectorType } from '../../types/types';

@Schema()
export class Vector extends mongoose.Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Note', required: false })
  noteId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: true })
  vectorType: VectorType;

  @Prop({ required: true })
  vector: Array<number> | number[];
}

export const VectorSchema = SchemaFactory.createForClass(Vector);
