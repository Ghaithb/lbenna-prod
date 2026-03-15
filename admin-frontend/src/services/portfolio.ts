import { api } from '@/lib/api';

export interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    category?: {
        id: string;
        name: string;
    } | string;
    categoryId: string | null;
    coverUrl: string;
    galleryUrls: string[];
    videoUrl?: string;
    eventDate?: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreatePortfolioItemDto {
    title: string;
    description?: string;
    category: string;
    coverUrl: string;
    galleryUrls?: string[];
    videoUrl?: string;
    eventDate?: string;
    isActive?: boolean;
}

export const portfolioService = {
    getAll: async () => {
        const response = await api.get<PortfolioItem[]>('/portfolio-items');
        return response.data;
    },

    create: async (data: CreatePortfolioItemDto) => {
        const response = await api.post<PortfolioItem>('/portfolio-items', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreatePortfolioItemDto>) => {
        const response = await api.patch<PortfolioItem>(`/portfolio-items/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/portfolio-items/${id}`);
        return response.data;
    }
};
