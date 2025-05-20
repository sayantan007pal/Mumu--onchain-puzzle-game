import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App component', () => {
  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText(/MuMu Game/i)).toBeInTheDocument();
  });
});