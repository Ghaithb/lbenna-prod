import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
    const response = await axios.get(`${getApiUrl()}/partners`);
    return response.data;
  }
};
