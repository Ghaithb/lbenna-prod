import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Page {
    id: string;
    title: string;
    slug: string;
    content: any;
    metaTitle?: string;
    metaDescription?: string;
    isPublished: boolean;
    template: string;
}

export const pagesService = {
    getBySlug: async (slug: string): Promise<Page> => {
        const response = await axios.get(`${API_URL}/pages/slug/${slug}?isAdmin=false`);
        return response.data;
    }
};
