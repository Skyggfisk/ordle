import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'bun:test';

import { FEEDBACK } from '~/types/game';

import { Keyboard, type KeyboardProps } from './Keyboard';

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

  test('keys get correct bg color based on feedback', () => {
    const keyFeedback: KeyboardProps['keyFeedback'] = {
      A: FEEDBACK.GREEN,
      B: FEEDBACK.YELLOW,
      C: FEEDBACK.GREY,
      // D: undefined,
    };
    render(<Keyboard keyFeedback={keyFeedback} />);

    const aKey = screen.getByText('A');
    const bKey = screen.getByText('B');
    const cKey = screen.getByText('C');
    const dKey = screen.getByText('D');

    expect(aKey.className).toContain('bg-green-600');
    expect(bKey.className).toContain('bg-yellow-400');
    expect(cKey.className).toContain('bg-gray-600');
    expect(dKey.className).toContain('bg-white/20');
  });
});
