import { Scope } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/userSchema/user-schema';

@Schema()
export class Note {
  @Prop({ type: String, ref: 'user' })
  user: User;

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
  likes: number;

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
