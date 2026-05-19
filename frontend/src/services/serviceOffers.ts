import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
    features: string[];
}


export const serviceOffersService = {
    getAll: async () => {
        const response = await axios.get(`${getApiUrl()}/service-offers`);
        return response.data;
    }
};
