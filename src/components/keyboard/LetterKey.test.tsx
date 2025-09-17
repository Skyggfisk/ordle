import { describe, test, expect, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { LetterKey } from './LetterKey';

describe('LetterKey Component', () => {
  test('renders LetterKey with correct letter and background', () => {
    const mockOnClick = mock();
    render(
      <LetterKey
        letter="A"
        onClick={mockOnClick}
        bg="bg-green-600 text-white"
      />
    );

    const button = screen.getByText('A');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-green-600 text-white');
  });

  test('calls onClick when button is clicked', () => {
    const mockOnClick = mock();
    render(
      <LetterKey letter="B" onClick={mockOnClick} bg="bg-white/20 text-black" />
    );

    const button = screen.getByText('B');
    button.click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
