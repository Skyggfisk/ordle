import { describe, test, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Keyboard } from './Keyboard';

describe('Keyboard component', () => {
  test('keyboard renders', () => {
    render(<Keyboard />);

    const keyboardElement = screen.getByTestId('keyboard');
    expect(keyboardElement).toBeInTheDocument();
  });

  test('renders expected amount of letters and control keys', () => {
    render(<Keyboard />);

    const letterKeys = screen.getAllByRole('button');
    expect(letterKeys).toHaveLength(31); // 29 letters (A-Z, ÆØÅ) + 2 control keys (Enter, Backspace)
  });
});
