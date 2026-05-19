import axios from 'axios';
import { getApiUrl } from '../lib/api-url';

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
    const response = await axios.get(`${getApiUrl()}/settings/public`);
    return response.data;
  }
};
