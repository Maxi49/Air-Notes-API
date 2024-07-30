import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Vector {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Post', required: false })
  postId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: true })
  vector: Array<number>;

  @Prop({ required: true })
  forEntity: 'user' | 'post';
}

export const VectorSchema = SchemaFactory.createForClass(Vector);

VectorSchema.index({ vector: 1 }, { name: 'AtlasVectorSearchIndex' });
