import { v2 as cloudinary } from 'cloudinary';

export const uploadFromBuffer = (buffer: Buffer, folder: string) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as { secure_url: string });
      },
    );
    stream.end(buffer);
  });
};
