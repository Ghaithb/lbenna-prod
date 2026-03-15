import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectsPage } from '../pages/ProjectsPage';

test('renders ProjectsPage header', () => {
  render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>
  );
  expect(screen.getByText(/Projets/i)).toBeInTheDocument();
});
