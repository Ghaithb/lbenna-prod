import { api } from '@/lib/api';

export interface ServiceOffer {
    id: string;
    title: string;
    description?: string;
    price?: number;
    duration?: number;
    imageUrl?: string;
    badge?: string;
    categoryId?: string;
    isActive: boolean;
    isPromo: boolean;
    promoPrice?: number;
    promoExpiresAt?: string;
    isPack: boolean;
    createdAt: string;
}

export interface CreateServiceOfferDto {
    title: string;
    description?: string;
    price?: number;
    duration?: number;
    imageUrl?: string;
    badge?: string;
    categoryId?: string;
    isActive?: boolean;
    isPromo?: boolean;
    promoPrice?: number;
    promoExpiresAt?: string;
    isPack?: boolean;
}

export const serviceOffersService = {
    getAll: async () => {
        const response = await api.get('/service-offers?includeInactive=true');
        return response.data;
    },

    create: async (data: CreateServiceOfferDto) => {
        const response = await api.post('/service-offers', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateServiceOfferDto>) => {
        const response = await api.patch(`/service-offers/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/service-offers/${id}`);
        return response.data;
    }
};
