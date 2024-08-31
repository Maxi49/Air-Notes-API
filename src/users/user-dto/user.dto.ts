import { User } from '../userSchema/user-schema';

export class UserDto extends User {
  _id?: string;
  username: string;
  name: string;
  age: number;
  email: string;

  location: {
    type: string;
    coordinates: number[];
  };
  firebaseUID: string; // Nuevo campo
  profilePicture: string; // Nuevo campo
}
