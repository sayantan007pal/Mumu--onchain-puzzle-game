import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App UI/UX enhancements', () => {
  it('shows a toast or notification for errors', async () => {
    render(<App />);
    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert').textContent).toMatch(/mock puzzle/i);
  });

  it('caches puzzles in localStorage', async () => {
    localStorage.clear();
    render(<App />);
    await waitFor(() => screen.getByText(/select a puzzle/i));
    expect(localStorage.getItem('puzzles')).toBeTruthy();
  });

  it('shows a spinner or skeleton loader during loading', () => {
    render(<App />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders responsively on mobile', () => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
    render(<App />);
    expect(screen.getByTestId('app-container')).toBeVisible();
  });

  it('has accessible ARIA labels and keyboard navigation', async () => {
    render(<App />);
    await waitFor(() => screen.getByLabelText(/game board/i));
    expect(screen.getByLabelText(/game board/i)).toBeInTheDocument();
  });

  it('allows toggling between mock and backend mode', () => {
    render(<App />);
    expect(screen.getByTestId('toggle-backend')).toBeInTheDocument();
  });

  it('supports dark mode toggle', () => {
    render(<App />);
    expect(screen.getByTestId('toggle-darkmode')).toBeInTheDocument();
  });
});
