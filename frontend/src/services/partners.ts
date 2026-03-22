import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
    const response = await axios.get(`${API_URL}/partners`);
    return response.data;
  }
};
