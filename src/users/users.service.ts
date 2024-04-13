import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './userSchema/user-schema';
import { Model } from 'mongoose';
import { FirebaseAuthService } from 'src/firebaseAuth/firebaseAuth.service';
import { UpdateUserDto } from './user-dto/update-user.dto';
import { CreateUserDto } from './user-dto/create-user.dto';
import { FirebaseAdminService } from 'src/firebaseAdmin/firebaseAdmin.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private firebaseAuthService: FirebaseAuthService,
    private firebaseAdminService: FirebaseAdminService,
  ) {}

  async findAllUsers() {
    return await this.userModel.find({});
  }

  async findUserById(id: string) {
    try {
      const user = await this.userModel.findOne({
        _id: id,
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getProfile() {
    const userId = this.firebaseAuthService.getProfile();
    return await this.userModel.findOne({ _id: userId });
  }

  async register(user: CreateUserDto) {
    try {
      const { age, email, lastname, location, name, password, username } = user;
      console.log(location);
      const { user: userId } = await this.firebaseAuthService.register(
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
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async login(email: string, pass: string) {
    const user = await this.firebaseAuthService.login(email, pass);

    return user;
  }

  async updateUserEmail(userId: string, newEmail: any): Promise<boolean> {
    try {
      const { email } = newEmail;
      await this.firebaseAdminService.updateEmail(userId, email);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async updateUserPass(userId: string, pass: any): Promise<boolean> {
    try {
      const { password } = pass;
      await this.firebaseAdminService.updatePassword(userId, password);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
