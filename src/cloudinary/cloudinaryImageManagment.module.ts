import { Module } from '@nestjs/common';
import { CloudinaryImageManagmentService } from './cloudinaryImageManagment.service';
import { CloudinaryConfig } from './cloudinary.config';

@Module({
  providers: [CloudinaryImageManagmentService, CloudinaryConfig],
  exports: [CloudinaryImageManagmentService],
})
export class CloudinaryImageManagmentModule {}
