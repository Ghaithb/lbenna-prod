import { api } from '@/lib/api';

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  published?: boolean;
};

export const adminProjectsService = {
  async list(skip = 0, take = 50) {
    const res = await api.get<AdminProject[]>(`/projects?skip=${skip}&take=${take}`);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur chargement projets');
    return Array.isArray(res.data) ? res.data : [];
  },
  async get(id: string) {
    const res = await api.get<AdminProject>(`/projects/${id}`);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur chargement projet');
    return res.data;
  },
  async create(payload: Partial<AdminProject>) {
    const res = await api.post<AdminProject>('/projects', payload);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur création projet');
    return res.data;
  },
  async update(id: string, payload: Partial<AdminProject>) {
    const res = await api.put<AdminProject>(`/projects/${id}`, payload);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur mise à jour projet');
    return res.data;
  },
  async delete(id: string) {
    const res = await api.delete<{ message: string }>(`/projects/${id}`);
    if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur suppression projet');
    return res.data;
  }
};
