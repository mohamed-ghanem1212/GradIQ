import { Module } from '@nestjs/common';
import { CvController } from '../controller/cv.controller';
import { CvService } from '../service/cv.service';
import { UsersModule } from '@modules/users/module/users.module';
import { UsersService } from '@modules/users/service/users.service';
import { CloudinaryService } from '../../../config/cloudinary/service/cloudinary.service';
import { CloudinaryModule } from '../../../config/cloudinary/module/cloudinary.module';

@Module({
  imports: [UsersModule, CloudinaryModule],
  controllers: [CvController],
  providers: [CvService, UsersService, CloudinaryService],
})
export class CvModule {}
