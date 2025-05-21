import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import App from './App';

// Mock fetch to always return a valid puzzle
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          initial_grid: [[0, 1], [1, 0]],
          target_grid: [[1, 1], [1, 1]],
          formulas: ['A+B'],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('App', () => {
  it('renders the main logo and footer', () => {
    render(<App />);
    // There may be multiple elements with "MuMu Game" (logo and footer)
    const titles = screen.getAllByText(/MuMu Game/i);
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getByText(/Built on Starknet/i)).toBeInTheDocument();
  });

  it('shows the GameBoard after loading puzzle', async () => {
    render(<App />);
    // Wait for loading to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading puzzle/i));
    // Now check for the formula
    expect(screen.getByText((content) => content.includes('A+B'))).toBeInTheDocument();
  });

  it('falls back to mock puzzle and shows GameBoard if backend fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('fail'));
    render(<App />);
    // Wait for the GameBoard to appear (formula "A+B" from mock)
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('A+B'))).toBeInTheDocument();
    });
  });
});
