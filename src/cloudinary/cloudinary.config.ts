import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryConfig {
  static initializeCloudinary() {
    cloudinary.config({
      cloud_name: 'dlkavvzmv',
      api_key: '711466671769883',
      api_secret: 'c_7VzklnvSm30UJ95ULzxg7mmoQ',
    });
  }

  async uploadImage(img: string) {
    try {
      const uploadResult = await cloudinary.uploader.upload(img, {
        public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      });

      return uploadResult;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async optiomizeUrl(public_id: string) {
    const optimizeUrl = cloudinary.url(public_id, {
      fetch_format: 'auto',
      quality: 'auto',
    });

    return optimizeUrl;
  }

  async cropUrl(public_id: string) {
    const autoCropUrl = cloudinary.url(public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    return autoCropUrl;
  }
}
