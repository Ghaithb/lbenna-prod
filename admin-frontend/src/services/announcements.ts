import { api } from '../lib/api';

export interface Announcement {
    id: string;
    text: string;
    code?: string;
    link?: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAnnouncementDto {
    text: string;
    code?: string;
    link?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    priority?: number;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> { }

export const announcementsService = {
    getAll: async (activeOnly?: boolean) => {
        const response = await api.get<Announcement[]>('/announcements', {
            params: { activeOnly }
        });
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<Announcement>(`/announcements/${id}`);
        return response.data;
    },

    create: async (data: CreateAnnouncementDto) => {
        const response = await api.post<Announcement>('/announcements', data);
        return response.data;
    },

    update: async (id: string, data: UpdateAnnouncementDto) => {
        const response = await api.patch<Announcement>(`/announcements/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/announcements/${id}`);
        return response.data;
    },
};
