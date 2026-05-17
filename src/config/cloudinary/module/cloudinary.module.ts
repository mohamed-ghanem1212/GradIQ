import { Module } from '@nestjs/common';
import { CloudinaryService } from '../service/cloudinary.service';
import { CloudinaryProvider } from '../cloudinary.config';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
