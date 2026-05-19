import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
        const response = await axios.get(`${getApiUrl()}/announcements?activeOnly=true`);
        return response.data;
    }
};
