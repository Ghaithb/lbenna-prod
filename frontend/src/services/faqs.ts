import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Faq {
    id: string;
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
}

export const faqsService = {
    getAll: async (): Promise<Faq[]> => {
        const response = await axios.get(`${API_URL}/faqs?isAdmin=false`);
        return response.data;
    }
};
