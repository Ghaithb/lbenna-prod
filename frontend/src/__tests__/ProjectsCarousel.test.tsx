import { render, screen, waitFor } from '@testing-library/react';
import ProjectsCarousel from '@/components/ProjectsCarousel';

describe('ProjectsCarousel', () => {
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      headers: new Map([['content-type', 'application/json']]),
      json: async () => ({ data: [{
        id: 'p1', slug: 'demo', title: 'Projet Démo', summary: 'Résumé', imageUrl: 'http://example.com/img.jpg', tags: ['demo'], published: true
      }], total: 1 }),
      text: async () => JSON.stringify({ data: [], total: 0 })
    })) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders section title and fetched project', async () => {
    render(<ProjectsCarousel />);
    expect(screen.getByText('Nos Réalisations')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Projet Démo')).toBeInTheDocument();
    });
  });
});
