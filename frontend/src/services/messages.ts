import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

export interface CreateMessageData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    content: string;
}

export const messagesService = {
    send: async (data: CreateMessageData) => {
        const response = await axios.post(`${getApiUrl()}/messages`, data);
        return response.data;
    },

    getAll: async (token: string) => {
        const response = await axios.get(`${getApiUrl()}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    markAsRead: async (id: string, token: string) => {
        const response = await axios.patch(`${getApiUrl()}/messages/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
