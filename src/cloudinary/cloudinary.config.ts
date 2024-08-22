import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class CloudinaryConfig {
  constructor() {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    const cloudName = process.env.cloudinaryCloudName;
    const apiKey = process.env.cloudinaryApiKey;
    const apiSecret = process.env.cloudinaryApiSecret;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(img: any) {
    try {
      const uploadResult = await cloudinary.uploader.upload(img.path, {
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

  async deleteCloudinaryImages(
    publicId?: string | boolean,
    imagesList?: string[],
  ): Promise<boolean> {
    try {
      if (imagesList.length) {
        await cloudinary.api.delete_resources(imagesList);
        return true;
      }

      await cloudinary.uploader.destroy(publicId as string);

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
