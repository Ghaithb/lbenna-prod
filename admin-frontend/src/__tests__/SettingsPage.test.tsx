/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Settings from '../pages/Settings';

test('renders Settings page header', () => {
  render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );
  expect(screen.getByText('Paramètres')).toBeInTheDocument();
});
