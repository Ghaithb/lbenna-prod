describe('projectsService', () => {
  const oldEnv = process.env;
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv, VITE_API_URL: 'http://localhost:9999/api' } as any;
  global.fetch = jest.fn(async (_url: any, _init?: any) => {
      // minimal fake response
      return {
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => ({ data: [], total: 0 }),
        text: async () => JSON.stringify({ data: [], total: 0 }),
      } as any;
    });
  });

  afterEach(() => {
    process.env = oldEnv;
    global.fetch = originalFetch;
  });

  it('builds correct URL for list()', async () => {
  const { projectsService } = await import('@/services/projects');
  await projectsService.list();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const call = (global.fetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe('http://localhost:9999/api/projects?skip=0&take=20');
  });
});
