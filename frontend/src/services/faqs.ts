import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

export interface Faq {
    id: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
}

export const faqsService = {
    getAll: async (): Promise<Faq[]> => {
        const response = await axios.get(`${getApiUrl()}/faqs?isAdmin=false`);
        return response.data;
    }
};
