import { Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Note {
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

  @Prop({ required: true })
  likes: [{ type: mongoose.Schema.Types.ObjectId; ref: 'Like' }];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  country: string;

  //TODO add "completed" prop and set it as boolean

  @Prop({ required: true, type: String })
  scope: Scope;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ location: '2dsphere' });
