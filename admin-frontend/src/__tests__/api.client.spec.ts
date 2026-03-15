describe('admin api client base URL', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, VITE_API_URL: '/api' } as any;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('uses process.env VITE_API_URL when provided', async () => {
    const mod = await import('../lib/api');
    // axios instance stores baseURL on defaults
    expect((mod.api.defaults as any).baseURL).toBe('/api');
  });
});
