import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { NotesService } from 'src/notes/notes.service';
import { UserDto } from './user-dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private firebaseAuthService: FirebaseAuthService,
    private firebaseAdminService: FirebaseAdminService,
    @Inject(forwardRef(() => NotesService)) private noteService: NotesService,
  ) {}

  async findAllUsers() {
    try {
      const users = await this.userModel.find({});
      const total = await this.userModel.countDocuments({});
      return { users, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findUserByFirebaseId(id: string) {
    try {
      const user = await this.userModel.findOne({
        firebaseUID: id,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async findUserById(id: string) {
    try {
      const user = await this.userModel.findById({
        _id: id,
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async register(user: CreateUserDto) {
    try {
      const { age, email, location, name, password, username, profilePicture } =
        user;
      const { user: userID } = await this.firebaseAuthService.register(
        email,
        password,
      );
      const newUser = await this.userModel.create({
        profilePicture,
        email,
        username,
        name,
        firebaseUID: userID.uid,
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

  async updateUserEmail(userId: string, newEmail: User) {
    try {
      const { email } = newEmail;
      await this.firebaseAdminService.updateEmail(userId, email);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async updateUserPass(userId: string, pass: any) {
    try {
      const { password } = pass;

      await this.firebaseAdminService.updatePassword(userId, password);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUserProfile(id: string, user: UpdateUserDto) {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { ...user },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteUser(user: UserDto) {
    try {
      const { _id } = user;
      await this.firebaseAdminService.deleteUser(_id);
      await this.noteService.removeAllUserNotes(_id);
      await this.userModel.findByIdAndDelete(_id);

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
