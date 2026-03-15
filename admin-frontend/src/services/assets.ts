import { api } from '@/lib/api';

export type AssetsList = {
  hdri: string[];
  models: string[];
  textures: string[];
};

export const assetsService = {
  async list(type?: 'hdri'|'models'|'textures'): Promise<AssetsList> {
    const res = await api.get('/assets', { params: type ? { type } : {} });
    if (res.status >= 400) throw new Error(res.data?.message || 'Failed to load assets');
    const data = res.data as AssetsList;
    // Normalize arrays
    return {
      hdri: Array.isArray((data as any).hdri) ? data.hdri : [],
      models: Array.isArray((data as any).models) ? data.models : [],
      textures: Array.isArray((data as any).textures) ? data.textures : [],
    };
  },
};
