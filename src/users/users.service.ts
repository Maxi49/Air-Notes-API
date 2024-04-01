import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './userSchema/user-schema';
import { Model } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateUserDto } from './user-dto/update-user.dto';
import { CreateUserDto } from './user-dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private firebaseService: FirebaseService,
  ) {}

  async findAllUsers() {
    return await this.userModel.find({});
  }

  async findUserById(id: string) {
    return await this.userModel.findById(id);
  }

  async getProfile() {
    return await this.firebaseService.getProfile();
  }

  async register(user: CreateUserDto) {
    try {
      const { age, email, lastname, location, name, password, username } = user;
      const { user: userId } = await this.firebaseService.register(
        email,
        password,
      );
      const newUser = await this.userModel.create({
        _id: userId.uid,
        email,
        username,
        name,
        lastname,
        age,
        location,
      });

      return newUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login(email: string, pass: string) {
    const user = await this.firebaseService.login(email, pass);

    return user;
  }

  async updateUserEmail(email: string): Promise<boolean> {
    await this.firebaseService.updateEmail(email);
    return true;
  }

  async updateUserPass(pass: string): Promise<boolean> {
    await this.firebaseService.updatePassword(pass);
    return true;
  }

  async updateUserProfile(id: string, user: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(
      id,
      { ...user },
      { new: true },
    );
  }

  async deleteUser(id: string) {
    await this.userModel.findByIdAndDelete(id);
    return;
  }
}
