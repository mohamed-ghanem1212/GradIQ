import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const downLoadFile = async (fileUrl: string): Promise<string> => {
  const ext = path.extname(fileUrl).split('?')[0]; // Handle URLs with query parameters
  const tempFilePath = path.join(os.tmpdir(), `cv_${Date.now()}${ext}`);
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to download file from ${fileUrl}: ${response.statusText}`,
    );
  }
  const buffer = await response.arrayBuffer();
  await fs.promises.writeFile(tempFilePath, Buffer.from(buffer));
  return tempFilePath;
};
