import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  uploadFromBuffer = (
    buffer: Buffer,
    folder: string,
    cv_id: string,
    fileName: string,
  ) => {
    return new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            public_id: `${cv_id}/${fileName}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string; public_id: string });
          },
        );
        stream.end(buffer);
      },
    );
  };

  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
  }

  getSignedUrl(publicId: string): string {
    return cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 10, // expires in 10 min
    });
  }
}
