import { api } from '@/lib/api';

export interface Tutorial {
    id: string;
    slug: string;
    title: string;
    description?: string;
    content?: string;
    videoUrl?: string;
    duration?: number;
    category: string;
    level: string;
    language?: string;
    tags: string[];
    thumbnailUrl?: string;
    coverUrl?: string;
    isPublished: boolean;
    isFree: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTutorialDto {
    title: string;
    slug: string;
    description?: string;
    content?: string;
    category?: string;
    level?: string;
    language?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    isPublished?: boolean;
    isFree?: boolean;
}

export interface UpdateTutorialDto extends Partial<CreateTutorialDto> { }

export const tutorialsService = {
    async getAll(params?: {
        page?: number;
        limit?: number;
        category?: string;
        level?: string;
        language?: string;
        published?: boolean;
    }) {
        const res = await api.get<{ data: Tutorial[], meta: any }>('/learning/tutorials', { params });
        if (res.status >= 400) throw new Error(res.data as any);
        return res.data; // Backend returns { data: [], meta: {} }
    },

    async getById(id: string) {
        const res = await api.get<Tutorial>(`/learning/tutorials/${id}`);
        if (res.status >= 400) throw new Error(res.data as any);
        return res.data;
    },

    async create(data: CreateTutorialDto) {
        const res = await api.post<Tutorial>('/learning/tutorials', data);
        if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur création tutoriel');
        return res.data;
    },

    async update(id: string, data: UpdateTutorialDto) {
        const res = await api.patch<Tutorial>(`/learning/tutorials/${id}`, data);
        if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur mise à jour tutoriel');
        return res.data;
    },

    async remove(id: string) {
        const res = await api.delete<{ message: string }>(`/learning/tutorials/${id}`);
        if (res.status >= 400) throw new Error((res.data as any)?.message || 'Erreur suppression tutoriel');
        return res.data;
    },
};
