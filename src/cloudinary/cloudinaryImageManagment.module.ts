import { Module } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';

@Module({
  providers: [CloudinaryConfig],
  exports: [CloudinaryConfig],
})
export class CloudinaryImageManagmentModule {}
