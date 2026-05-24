import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import * as fs from 'fs';
import path from 'path';

export const analyzeFile = async (filePath: string): Promise<string> => {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = await fs.promises.readFile(filePath);

  if (ext === '.pdf') {
    const data = new PDFParse({ url: filePath, data: buffer });
    return (await data.getText()).text;
  }
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  throw new Error(`Unsupported file type: ${ext}`);
};
