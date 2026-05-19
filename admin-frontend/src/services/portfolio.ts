import { api } from '@/lib/api';

export interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    category?: string;
    categoryObject?: {
        id: string;
        name: string;
    };
    categoryId: string | null;
    coverUrl: string;
    galleryUrls: string[];
    videoUrl?: string;
    eventDate?: string;
    isActive: boolean;
    createdAt: string;
}

export type PortfolioItemPayload = {
    title: string;
    description?: string;
    category?: string;
    categoryId?: string;
    coverUrl?: string;
    galleryUrls?: string[];
    videoUrl?: string;
    eventDate?: string;
    isActive?: boolean;
};

/** Vercel request body limit ~4.5 MB per HTTP call — upload files via /upload first. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export const portfolioService = {
    getAll: async () => {
        const response = await api.get<PortfolioItem[]>('/portfolio-items');
        return response.data;
    },

    create: async (data: PortfolioItemPayload) => {
        const response = await api.post<PortfolioItem>('/portfolio-items', data);
        return response.data;
    },

    update: async (id: string, data: Partial<PortfolioItemPayload>) => {
        const response = await api.patch<PortfolioItem>(`/portfolio-items/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/portfolio-items/${id}`);
        return response.data;
    }
};
