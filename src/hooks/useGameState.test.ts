import { describe, it, expect } from 'bun:test';
import {
  gameReducer,
  GAME_ACTION,
  validateHardModeGuess,
  type GameAction,
} from './useGameState';
import { GAME_RESULT, MAX_ATTEMPT_LIMIT, MAX_WORD_LENGTH, FEEDBACK, type GameState } from '~/types/game';

describe('gameReducer', () => {
  const initialState: GameState = {
    guesses: Array(MAX_ATTEMPT_LIMIT)
      .fill(null)
      .map(() => Array(MAX_WORD_LENGTH).fill('')),
    currentRow: 0,
    feedbackRows: Array(MAX_ATTEMPT_LIMIT)
      .fill(null)
      .map(() => Array(MAX_WORD_LENGTH).fill(null)),
    revealedRows: Array(MAX_ATTEMPT_LIMIT)
      .fill(null)
      .map(() => Array(MAX_WORD_LENGTH).fill(false)),
    gameResult: GAME_RESULT.UNSETTLED,
  };

  it('should add a letter to the current row', () => {
    const action: GameAction = { type: GAME_ACTION.ADD_LETTER, letter: 'A' };
    const newState = gameReducer(initialState, action);

    expect(newState.guesses[0][0]).toBe('A');
    expect(newState.currentRow).toBe(0);
  });

  it('should not add letter if row is full', () => {
    const fullRowState = {
      ...initialState,
      guesses: initialState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['A', 'B', 'C', 'D', 'E'] : row
      ),
    };
    const action: GameAction = { type: GAME_ACTION.ADD_LETTER, letter: 'F' };
    const newState = gameReducer(fullRowState, action);

    expect(newState.guesses[0]).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('should remove the last letter from current row', () => {
    const stateWithLetters = {
      ...initialState,
      guesses: initialState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['A', 'B', 'C', '', ''] : row
      ),
    };
    const action: GameAction = { type: GAME_ACTION.REMOVE_LETTER };
    const newState = gameReducer(stateWithLetters, action);

    expect(newState.guesses[0]).toEqual(['A', 'B', '', '', '']);
  });

  it('should not remove if row is empty', () => {
    const action: GameAction = { type: GAME_ACTION.REMOVE_LETTER };
    const newState = gameReducer(initialState, action);

    expect(newState.guesses[0]).toEqual(['', '', '', '', '']);
  });

  it('should submit a correct guess and update state', () => {
    const stateWithGuess = {
      ...initialState,
      guesses: initialState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['D', 'A', 'N', 'S', 'K'] : row
      ),
    };
    const checkGuessResult = {
      correct: true,
      feedback: [FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN],
      wordExists: true,
    };
    const action: GameAction = { type: GAME_ACTION.SUBMIT_GUESS, checkGuessResult };
    const newState = gameReducer(stateWithGuess, action);

    expect(newState.feedbackRows[0]).toEqual(checkGuessResult.feedback);
    expect(newState.revealedRows[0]).toEqual([true, true, true, true, true]);
    expect(newState.gameResult).toBe(GAME_RESULT.VICTORY);
    expect(newState.currentRow).toBe(1);
  });

  it('should submit an incorrect guess and continue', () => {
    const stateWithGuess = {
      ...initialState,
      guesses: initialState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['W', 'R', 'O', 'N', 'G'] : row
      ),
    };
    const checkGuessResult = {
      correct: false,
      feedback: [FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.GREY],
      wordExists: true,
    };
    const action: GameAction = { type: GAME_ACTION.SUBMIT_GUESS, checkGuessResult };
    const newState = gameReducer(stateWithGuess, action);

    expect(newState.gameResult).toBe(GAME_RESULT.UNSETTLED);
    expect(newState.currentRow).toBe(1);
  });

  it('should submit last incorrect guess and end game', () => {
    const lastAttemptState = {
      ...initialState,
      currentRow: MAX_ATTEMPT_LIMIT - 1,
      guesses: initialState.guesses.map((row: string[], i: number) =>
        i === MAX_ATTEMPT_LIMIT - 1 ? ['W', 'R', 'O', 'N', 'G'] : row
      ),
    };
    const checkGuessResult = {
      correct: false,
      feedback: [FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.GREY, FEEDBACK.GREY],
      wordExists: true,
    };
    const action: GameAction = { type: GAME_ACTION.SUBMIT_GUESS, checkGuessResult };
    const newState = gameReducer(lastAttemptState, action);

    expect(newState.gameResult).toBe(GAME_RESULT.DEFEAT);
    expect(newState.currentRow).toBe(MAX_ATTEMPT_LIMIT);
  });
});

describe('validateHardModeGuess', () => {
  const baseState: GameState = {
    guesses: Array(MAX_ATTEMPT_LIMIT)
      .fill(null)
      .map(() => Array(MAX_WORD_LENGTH).fill('')),
    currentRow: 1, // After first guess
    feedbackRows: Array(MAX_ATTEMPT_LIMIT)
      .fill(null)
      .map(() => Array(MAX_WORD_LENGTH).fill(null)),
    revealedRows: Array(MAX_ATTEMPT_LIMIT)
      .fill(null)
      .map(() => Array(MAX_WORD_LENGTH).fill(false)),
    gameResult: GAME_RESULT.UNSETTLED,
  };

  it('should allow first guess (no constraints)', () => {
    const firstGuessState = { ...baseState, currentRow: 0 };
    const guess = ['T', 'E', 'S', 'T', 'S'];
    expect(validateHardModeGuess(firstGuessState, guess)).toBe(true);
  });

  it('should enforce green position constraints', () => {
    const stateWithGreen = {
      ...baseState,
      guesses: baseState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['D', 'A', 'N', 'S', 'K'] : row
      ),
      feedbackRows: baseState.feedbackRows.map((row: (typeof FEEDBACK[keyof typeof FEEDBACK] | null)[], i: number) =>
        i === 0 ? [FEEDBACK.GREY, FEEDBACK.GREEN, FEEDBACK.YELLOW, FEEDBACK.YELLOW, FEEDBACK.GREY] : row
      ),
    };
    expect(validateHardModeGuess(stateWithGreen, ['B', 'A', 'N', 'S', 'X'])).toBe(true); // A in position 1, no grey letters
    expect(validateHardModeGuess(stateWithGreen, ['B', 'X', 'N', 'S', 'Y'])).toBe(false); // A not in position 1
  });

  it('should enforce yellow letter inclusion', () => {
    const stateWithYellow = {
      ...baseState,
      guesses: baseState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['D', 'A', 'N', 'S', 'K'] : row
      ),
      feedbackRows: baseState.feedbackRows.map((row: (typeof FEEDBACK[keyof typeof FEEDBACK] | null)[], i: number) =>
        i === 0 ? [FEEDBACK.GREY, FEEDBACK.GREEN, FEEDBACK.YELLOW, FEEDBACK.YELLOW, FEEDBACK.GREY] : row
      ),
    };
    expect(validateHardModeGuess(stateWithYellow, ['B', 'A', 'N', 'S', 'X'])).toBe(true); // Includes N and S
    expect(validateHardModeGuess(stateWithYellow, ['B', 'A', 'X', 'Y', 'Z'])).toBe(false); // Missing N and S
  });

  it('should enforce grey letter exclusion', () => {
    const stateWithGrey = {
      ...baseState,
      guesses: baseState.guesses.map((row: string[], i: number) =>
        i === 0 ? ['D', 'A', 'N', 'S', 'K'] : row
      ),
      feedbackRows: baseState.feedbackRows.map((row: (typeof FEEDBACK[keyof typeof FEEDBACK] | null)[], i: number) =>
        i === 0 ? [FEEDBACK.GREY, FEEDBACK.GREEN, FEEDBACK.YELLOW, FEEDBACK.YELLOW, FEEDBACK.GREY] : row
      ),
    };
    expect(validateHardModeGuess(stateWithGrey, ['B', 'A', 'N', 'S', 'X'])).toBe(true); // No D or K
    expect(validateHardModeGuess(stateWithGrey, ['D', 'A', 'N', 'S', 'K'])).toBe(false); // Includes D
  });

  it('should handle multiple previous guesses', () => {
    const multiGuessState = {
      ...baseState,
      currentRow: 2,
      guesses: baseState.guesses.map((row: string[], i: number) => {
        if (i === 0) return ['D', 'A', 'N', 'S', 'K'];
        if (i === 1) return ['B', 'A', 'N', 'S', 'K'];
        return row;
      }),
      feedbackRows: baseState.feedbackRows.map((row: (typeof FEEDBACK[keyof typeof FEEDBACK] | null)[], i: number) => {
        if (i === 0) return [FEEDBACK.GREY, FEEDBACK.GREEN, FEEDBACK.YELLOW, FEEDBACK.YELLOW, FEEDBACK.GREY];
        if (i === 1) return [FEEDBACK.GREY, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREEN, FEEDBACK.GREY];
        return row;
      }),
    };
    // Must have A in pos 1, N in pos 2, S in pos 3, no D or K
    expect(validateHardModeGuess(multiGuessState, ['X', 'A', 'N', 'S', 'Y'])).toBe(true);
    expect(validateHardModeGuess(multiGuessState, ['X', 'A', 'X', 'S', 'Y'])).toBe(false); // Missing N in pos 2
  });
});