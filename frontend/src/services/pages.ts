import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
        const response = await axios.get(`${getApiUrl()}/pages/slug/${slug}?isAdmin=false`);
        return response.data;
    }
};
