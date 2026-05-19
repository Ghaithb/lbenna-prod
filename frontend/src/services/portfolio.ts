import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

export interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    category?: string;
    categoryObject?: {
        name: string;
        slug: string;
    };
    categoryId?: string;
    coverUrl: string;
    galleryUrls: string[];
    videoUrl?: string;
    eventDate?: string;
    isActive: boolean;
}

export const portfolioService = {
    getAll: async () => {
        const response = await axios.get<PortfolioItem[]>(`${getApiUrl()}/portfolio-items`);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await axios.get<PortfolioItem>(`${getApiUrl()}/portfolio-items/${id}`);
        return response.data;
    }
};
