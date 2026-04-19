export interface Cv {
  id?: string;
  user_id: string;
  title: string;
  summary: string;
  note: string;
  format: Format;
}

export type Format = 'PDF' | 'DOCX';
