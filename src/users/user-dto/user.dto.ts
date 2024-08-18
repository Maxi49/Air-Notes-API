export class UserDto {
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
