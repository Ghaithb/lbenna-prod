import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PortfolioPage from '../pages/portfolio/PortfolioPage';

test('renders PortfolioPage header', () => {
  render(
    <MemoryRouter>
      <PortfolioPage />
    </MemoryRouter>
  );
  expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
});
