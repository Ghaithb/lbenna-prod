import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface CreateMessageData {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    content: string;
}

export const messagesService = {
    send: async (data: CreateMessageData) => {
        const response = await axios.post(`${API_URL}/messages`, data);
        return response.data;
    },

    getAll: async (token: string) => {
        const response = await axios.get(`${API_URL}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    markAsRead: async (id: string, token: string) => {
        const response = await axios.patch(`${API_URL}/messages/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
