import { api } from '@/lib/api';

export interface Chapter {
    id: string;
    tutorialId: string;
    title: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    mediaUrls?: any;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateChapterDto {
    tutorialId: string;
    title: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    mediaUrls?: any;
    order?: number;
}

export interface UpdateChapterDto extends Partial<CreateChapterDto> { }

export const chaptersService = {
    async getByTutorialId(tutorialId: string) {
        const res = await api.get<Chapter[]>(`/learning/chapters/tutorial/${tutorialId}`);
        if (res.status >= 400) throw new Error(res.data as any);
        return res.data;
    },

    async create(data: CreateChapterDto) {
        const res = await api.post<Chapter>('/learning/chapters', data);
        if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur création chapitre');
        return res.data;
    },

    async update(id: string, data: UpdateChapterDto) {
        const res = await api.patch<Chapter>(`/learning/chapters/${id}`, data);
        if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur mise à jour chapitre');
        return res.data;
    },

    async remove(id: string) {
        const res = await api.delete<{ message: string }>(`/learning/chapters/${id}`);
        if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur suppression chapitre');
        return res.data;
    },
};
