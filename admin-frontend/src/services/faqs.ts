import { api } from '@/lib/api';

export interface Faq {
    id: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const faqsService = {
    getAll: async (isAdmin: boolean = true) => {
        const response = await api.get<Faq[]>(`/faqs?isAdmin=${isAdmin}`);
        return response.data;
    },

    create: async (data: Partial<Faq>) => {
        const response = await api.post<Faq>('/faqs', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Faq>) => {
        const response = await api.put<Faq>(`/faqs/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/faqs/${id}`);
    },
};
