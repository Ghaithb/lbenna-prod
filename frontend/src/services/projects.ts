// Resolve API URL in a way that works both in the Vite-built app (where build-time
// replacement via `import.meta.env` may be available) and in Jest/Node tests
// (where `import.meta` is not available). Prefer process.env for tests, then
// fall back to a window-global (if your app injects one), then default.
const API = ((typeof process !== 'undefined' && process.env && (process.env.VITE_API_URL as string))
  || ((typeof window !== 'undefined') ? (window as any).__VITE_API_URL__ : undefined)
  || 'http://localhost:3001/api') as string;

async function http(path: string, init?: RequestInit) {
  const res = await fetch(API + path, { credentials: 'include', ...init });
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content?: any;
  imageUrl?: string;
  tags?: string[];
  published?: boolean;
};

export const projectsService = {
  async list(skip = 0, take = 20): Promise<{ data: Project[]; total: number }>{
    return http(`/projects?skip=${skip}&take=${take}`) as any;
  },
  async getBySlug(slug: string): Promise<Project> { return http(`/projects/slug/${slug}`) as any; },
};
