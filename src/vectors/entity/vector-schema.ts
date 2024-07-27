import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Vector {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  note: string;

  vector: Array<number>;
}

export const VectorSchema = SchemaFactory.createForClass(Vector);

VectorSchema.index({ vector: 1 }, { name: 'AtlasVectorSearchIndex' });
