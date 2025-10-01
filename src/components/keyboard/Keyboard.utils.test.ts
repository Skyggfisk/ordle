import { describe, it, expect } from 'bun:test';

import { FEEDBACK } from '@shared-types/game';

import { getKeyboardFeedback } from './Keyboard.utils';

describe('getKeyboardFeedback', () => {
  it('returns correct feedback for guesses (correct word: DANSK)', () => {
    const guesses = [
      ['A', 'B', 'C', 'D', 'E'],
      ['D', 'A', 'N', 'S', 'K'],
      ['D', 'A', 'N', 'S', 'K'] // correct guess
    ];
    const feedbackRows = [
      [FEEDBACK.GREY, FEEDBACK.YELLOW, FEEDBACK.GREY, FEEDBACK.YELLOW, FEEDBACK.GREY],
      [FEEDBACK.GREEN, FEEDBACK.YELLOW, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.YELLOW],
      [FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN]
    ];
    const result = getKeyboardFeedback(guesses, feedbackRows);
    expect(result).toEqual({
      A: FEEDBACK.GREEN,
      B: FEEDBACK.YELLOW,
      C: FEEDBACK.GREY,
      D: FEEDBACK.GREEN,
      E: FEEDBACK.GREY,
      N: FEEDBACK.GREEN,
      S: FEEDBACK.GREEN,
      K: FEEDBACK.GREEN
    });
  });

  it('prioritizes GREEN over YELLOW and GREY (with repeated guesses)', () => {
    const guesses = [
      ['A', 'B', 'C', 'D', 'E'],
      ['A', 'B', 'C', 'D', 'E'],
      ['A', 'B', 'C', 'D', 'E']
    ];
    const feedbackRows = [
      [FEEDBACK.YELLOW, FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.YELLOW, FEEDBACK.GREY],
      [FEEDBACK.GREEN, FEEDBACK.YELLOW, FEEDBACK.YELLOW, FEEDBACK.GREEN, FEEDBACK.YELLOW],
      [FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN]
    ];
    const result = getKeyboardFeedback(guesses, feedbackRows);
    expect(result.A).toBe(FEEDBACK.GREEN);
    expect(result.B).toBe(FEEDBACK.GREEN);
    expect(result.C).toBe(FEEDBACK.GREEN);
    expect(result.D).toBe(FEEDBACK.GREEN);
    expect(result.E).toBe(FEEDBACK.GREEN);
  });
});
