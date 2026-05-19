import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    _count?: {
        serviceOffers: number;
        portfolioItems: number;
    };
    portfolioItems?: {
        coverUrl: string;
    }[];
}

export const categoriesService = {
    getAll: async () => {
        const res = await axios.get(`${getApiUrl()}/categories`);
        return res.data;
    },


    create: async (data: any) => {
        const res = await axios.post(`${getApiUrl()}/categories`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    },

    update: async (id: string, data: any) => {
        const res = await axios.patch(`${getApiUrl()}/categories/${id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    },

    delete: async (id: string) => {
        const res = await axios.delete(`${getApiUrl()}/categories/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        return res.data;
    }
};
