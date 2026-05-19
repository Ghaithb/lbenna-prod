import { resolveApiBaseUrl } from '../lib/api-base';

describe('resolveApiBaseUrl', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('forces /api on Vercel host even if env points to backend URL', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'https:',
        hostname: 'lbenna-prod-1n5x.vercel.app',
      },
      writable: true,
    });
    expect(resolveApiBaseUrl()).toBe('/api');
  });

  it('defaults to /api on localhost when env is unset', () => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http:', hostname: 'localhost' },
      writable: true,
    });
    expect(resolveApiBaseUrl()).toBe('/api');
  });
});
