import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Announcement {
    id: string;
    text: string;
    code?: string;
    link?: string;
    isActive: boolean;
    priority: number;
}

export const announcementsService = {
    getAllActive: async (): Promise<Announcement[]> => {
        const response = await axios.get(`${API_URL}/announcements?activeOnly=true`);
        return response.data;
    }
};
