import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
        const response = await axios.get<PortfolioItem[]>(`${API_URL}/portfolio-items`);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await axios.get<PortfolioItem>(`${API_URL}/portfolio-items/${id}`);
        return response.data;
    }
};
