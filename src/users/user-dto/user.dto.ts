export class UserDto {
  _id: string;
  username: string;
  name: string;
  age: number;
  email: string;
  password: string;
  location: {
    type: string;
    coordinates: number[];
  };
}
