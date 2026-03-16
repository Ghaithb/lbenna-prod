import { api } from '@/lib/api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    _count?: {
        serviceOffers?: number;
        portfolioItems?: number;
    };
}

export const categoryService = {
    getAll: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    getTree: async () => {
        const response = await api.get<Category[]>('/categories/tree');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<Category>(`/categories/${id}`);
        return response.data;
    },

    create: async (data: Partial<Category>) => {
        const response = await api.post<Category>('/categories', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Category>) => {
        const response = await api.put<Category>(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },
};
