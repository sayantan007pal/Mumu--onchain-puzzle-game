import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App component', () => {
  it('renders the main title', () => {
    render(<App />);
    const titles = screen.getAllByText(/MuMu Game/i);
    expect(titles.length).toBeGreaterThan(0);
  });
});