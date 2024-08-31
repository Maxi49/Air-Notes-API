import { Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Note extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({
    type: Object,
    imageUrl: { type: String, required: true },
    publicImageId: { type: String, required: true },
  })
  image: { imageUrl: string; publicImageId: string };

  @Prop({ required: true })
  country: string;

  @Prop({ required: false, ref: 'Vector', type: mongoose.Types.ObjectId })
  vectorId: string;

  @Prop({ required: false })
  vector: number[];

  // TODO add "completed" prop and set it as boolean

  @Prop({ required: true, type: String })
  scope: Scope;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ location: '2dsphere' });
