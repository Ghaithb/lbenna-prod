import { api } from '@/lib/api';

export interface UploadedFile {
  url: string;
  filename: string;
  size?: number;
  type?: string;
}

export const mediaService = {
  async uploadSingle(file: File) {
    const form = new FormData();
    form.append('file', file);
    // Ne pas fixer Content-Type : le navigateur doit ajouter le boundary multipart.
    const res = await api.post<UploadedFile>('/upload', form);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur upload');
    return res.data;
  },
};
