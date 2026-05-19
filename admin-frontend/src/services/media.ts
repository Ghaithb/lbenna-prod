import { api } from '@/lib/api';

export interface UploadedFile {
  url: string;
  filename: string;
  size?: number;
  type?: string;
}

export const mediaService = {
  async uploadSingle(file: File, maxBytes = 4 * 1024 * 1024) {
    if (file.size > maxBytes) {
      throw new Error(
        `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum ~4 Mo par fichier sur Vercel.`,
      );
    }
    const form = new FormData();
    form.append('file', file);
    const res = await api.post<UploadedFile>('/upload', form);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur upload');
    return res.data;
  },
};
