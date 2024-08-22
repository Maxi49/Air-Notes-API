import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
@Schema()
export class Vector extends mongoose.document{
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    default: new ObjectId(),
  })
  _id: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Post', required: false })
  postId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: true })
  vectorType: 'user' | 'post';

  @Prop({ required: true })
  vector: Array<number> | number[];
}

export const VectorSchema = SchemaFactory.createForClass(Vector);

VectorSchema.index({ vector: 1 }, { name: 'AtlasVectorSearchIndex' });
