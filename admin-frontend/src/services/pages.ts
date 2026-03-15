import { api } from '@/lib/api';

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: any;
    metaTitle?: string;
    metaDescription?: string;
    isPublished: boolean;
    showInMenu: boolean;
    menuOrder: number;
    template: string;
    createdAt: string;
    updatedAt: string;
}

export const pagesService = {
    getAll: async (isAdmin: boolean = true) => {
        const response = await api.get<Page[]>(`/pages?isAdmin=${isAdmin}`);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<Page>(`/pages/${id}`);
        return response.data;
    },

    getBySlug: async (slug: string, isAdmin: boolean = false) => {
        const response = await api.get<Page>(`/pages/slug/${slug}?isAdmin=${isAdmin}`);
        return response.data;
    },

    create: async (data: Partial<Page>) => {
        const response = await api.post<Page>('/pages', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Page>) => {
        const response = await api.put<Page>(`/pages/${id}`, data);
        return response.data;
    },

    togglePublish: async (id: string) => {
        const response = await api.put<Page>(`/pages/${id}/publish`);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/pages/${id}`);
    },
};
