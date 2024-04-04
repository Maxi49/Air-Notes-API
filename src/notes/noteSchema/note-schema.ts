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
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ location: '2dsphere' });
