import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type PublicSettings = {
  paymentEnabled: boolean;
  subscriptionPrice: number;
  promoFreeUntil: string | null;
  // Contact info
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  social_linkedin: string;
};

export const settingsService = {
  async getPublic(): Promise<PublicSettings> {
    const response = await axios.get(`${API_URL}/settings/public`);
    return response.data;
  }
};
