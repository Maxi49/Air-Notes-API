import { BadRequestException, Injectable } from '@nestjs/common';
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
    return await this.userModel.findById(id);
  }

  getProfile() {
    return this.firebaseAuthService.getProfile();
  }

  async register(user: CreateUserDto) {
    try {
      const { age, email, lastname, location, name, password, username } = user;
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
      throw new BadRequestException(error);
    }
  }

  async login(email: string, pass: string) {
    const user = await this.firebaseAuthService.login(email, pass);

    return user;
  }

  async updateUserEmail(userId: string, email: string): Promise<boolean> {
    await this.firebaseAdminService.updateEmail(userId, email);
    return true;
  }

  async updateUserPass(userId: string, pass: string): Promise<boolean> {
    try {
      console.log('pa loco la concha de tu madre :D');
      await this.firebaseAdminService.updatePassword(userId, pass);
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
