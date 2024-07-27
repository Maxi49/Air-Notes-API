import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';

@Injectable()
export class CloudinaryImageManagmentService {
  constructor(private readonly cloudinaryService: CloudinaryConfig) {
    CloudinaryConfig.initializeCloudinary();
  }

  async uploadImage(img: string) {
    try {
      const imgUrl = this.cloudinaryService.uploadImage(img);

      return imgUrl;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
