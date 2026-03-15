import { Controller, Get, Param, Query } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('assets')
export class AssetsController {
  private rootDir = path.resolve(__dirname, '../../assets');

  private listFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];
    const walk = (d: string, baseUrl: string) => {
      const entries = fs.readdirSync(d, { withFileTypes: true });
      for (const e of entries) {
        const p = path.join(d, e.name);
        const url = baseUrl + '/' + e.name;
        if (e.isDirectory()) walk(p, url);
        else results.push(url.replace(/\\/g, '/'));
      }
    };
    walk(dir, '');
    return results.filter(Boolean).map((u) => u.startsWith('/') ? u : '/' + u);
  }

  @Get()
  getAll(@Query('type') type?: string) {
    const map: Record<string, string> = {
      hdri: 'hdri',
      models: 'models',
      textures: 'textures',
    };
    const res: Record<string, string[]> = {};
    const types = type && map[type] ? [type] : Object.keys(map);
    for (const t of types) {
      const dir = path.join(this.rootDir, map[t]);
      res[t] = this.listFiles(dir).map((u) => `/assets/${map[t]}${u}`);
    }
    return res;
  }
}
