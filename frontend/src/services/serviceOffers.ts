import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ServiceOffer {
    id: string;
    title: string;
    description?: string;
    price?: number;
    duration?: number;
    imageUrl?: string;
    badge?: string;
    isActive: boolean;
    isPromo: boolean;
    promoPrice?: number;
    promoExpiresAt?: string;
    isPack: boolean;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
}


export const serviceOffersService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/service-offers`);
        return response.data;
    }
};
