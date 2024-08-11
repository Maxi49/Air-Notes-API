import mongoose from 'mongoose';

export class UserDto {
  _id: mongoose.Types.ObjectId;
  username: string;
  name: string;
  age: number;
  email: string;
  password: string;
  location: {
    type: string;
    coordinates: number[];
  };
  firebaseUID: string; // Nuevo campo
  profilePicture: string; // Nuevo campo
}
