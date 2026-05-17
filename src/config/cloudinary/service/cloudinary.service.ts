import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  uploadFromBuffer = (buffer: Buffer, folder: string) => {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'raw' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as { secure_url: string });
        },
      );
      stream.end(buffer);
    });
  };

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  }
}
