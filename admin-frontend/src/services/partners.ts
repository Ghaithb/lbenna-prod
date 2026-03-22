import { api } from '@/lib/api';

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const partnersService = {
  getAll: async (): Promise<Partner[]> => {
    const response = await api.get('/partners');
    return response.data;
  },

  create: async (data: Partial<Partner>): Promise<Partner> => {
    const response = await api.post('/partners', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Partner>): Promise<Partner> => {
    const response = await api.patch(`/partners/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/partners/${id}`);
  }
};
