import { useReducer, useEffect, useState } from 'react';
import { wordService } from '../services/wordService';
import {
  type CheckGuessResult,
  type GameResult,
  type GameState,
  GAME_RESULT,
  MAX_ATTEMPT_LIMIT,
  MAX_WORD_LENGTH,
  FEEDBACK,
} from '../types/game';
import { storage } from '../services/storage';

const GAME_ACTION = {
  ADD_LETTER: 'ADD_LETTER',
  REMOVE_LETTER: 'REMOVE_LETTER',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
} as const;

type GameAction =
  | { type: typeof GAME_ACTION.ADD_LETTER; letter: string }
  | { type: typeof GAME_ACTION.REMOVE_LETTER }
  | {
      type: typeof GAME_ACTION.SUBMIT_GUESS;
      checkGuessResult: CheckGuessResult;
    };

type AddLetterResult = { success: boolean; insertCol: number };

function getInitialState(): GameState {
  const existingGame = storage.getCurrentGameState();
  if (existingGame) {
    return existingGame;
  }
  const state = {
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
  storage.setCurrentGameState(state);
  return state;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GAME_ACTION.ADD_LETTER:
      return {
        ...state,
        guesses: state.guesses.map((row, r) =>
          row.map((char, c) =>
            r === state.currentRow && c === row.indexOf('')
              ? action.letter
              : char
          )
        ),
      };
    case GAME_ACTION.REMOVE_LETTER:
      return {
        ...state,
        guesses: state.guesses.map((row, r) => {
          if (r !== state.currentRow) return row;
          // Find the last filled tile
          const reversedIdx = [...row].reverse().findIndex((l) => l !== '');
          if (reversedIdx === -1) return row; // nothing to remove
          const lastFilled = row.length - 1 - reversedIdx;
          return row.map((char, c) => (c === lastFilled ? '' : char));
        }),
      };
    case GAME_ACTION.SUBMIT_GUESS:
      return {
        ...state,
        feedbackRows: state.feedbackRows.map((row, r) =>
          r === state.currentRow
            ? (action.checkGuessResult.feedback ?? row)
            : row
        ),
        revealedRows: state.revealedRows.map((row, r) =>
          r === state.currentRow ? row.map(() => true) : row
        ),
        gameResult: action.checkGuessResult.correct
          ? GAME_RESULT.VICTORY
          : state.currentRow === MAX_ATTEMPT_LIMIT - 1
            ? GAME_RESULT.DEFEAT
            : GAME_RESULT.UNSETTLED,
        guesses: state.guesses,
        currentRow: state.currentRow + 1,
      };
    default:
      return state;
  }
}

function validateHardModeGuess(state: GameState, guess: string[]): boolean {
  if (state.currentRow === 0) return true; // No constraints for first guess

  const mustInclude = new Set<string>();
  const mustNotInclude = new Set<string>();
  const positionConstraints: (string | null)[] = Array(MAX_WORD_LENGTH).fill(null);

  // Collect constraints from all previous feedback
  for (let row = 0; row < state.currentRow; row++) {
    const feedback = state.feedbackRows[row];
    const prevGuess = state.guesses[row];
    for (let col = 0; col < MAX_WORD_LENGTH; col++) {
      const fb = feedback[col];
      const letter = prevGuess[col];
      if (fb === FEEDBACK.GREEN) {
        // Must be in same position
        if (positionConstraints[col] && positionConstraints[col] !== letter) {
          return false; // Conflicting greens, but shouldn't happen
        }
        positionConstraints[col] = letter;
      } else if (fb === FEEDBACK.YELLOW) {
        mustInclude.add(letter);
      } else if (fb === FEEDBACK.GREY) {
        // Only exclude if not required elsewhere
        if (!mustInclude.has(letter) && !positionConstraints.includes(letter)) {
          mustNotInclude.add(letter);
        }
      }
    }
  }

  // Check position constraints
  for (let col = 0; col < MAX_WORD_LENGTH; col++) {
    if (positionConstraints[col] && guess[col] !== positionConstraints[col]) {
      return false;
    }
  }

  // Check must include
  for (const letter of mustInclude) {
    if (!guess.includes(letter)) {
      return false;
    }
  }

  // Check must not include
  for (const letter of mustNotInclude) {
    if (guess.includes(letter)) {
      return false;
    }
  }

  return true;
}

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);
  const [hardMode] = useState(() => !!storage.getConfig().hardMode);

  // Save game state
  useEffect(() => {
    storage.setCurrentGameState(state);
  }, [state]);

  const addLetter = (letter: string): AddLetterResult => {
    // Check if row is already full
    const nextIdx = state.guesses[state.currentRow].findIndex((c) => c === '');
    if (nextIdx === -1) return { success: false, insertCol: nextIdx };

    // Only allow valid letters (A-Z, ÆØÅ)
    const upperLetter = letter.toUpperCase();
    if (!/^[A-ZÆØÅ]$/.test(upperLetter))
      return { success: false, insertCol: nextIdx };

    // Add letter to current row
    dispatch({ type: GAME_ACTION.ADD_LETTER, letter: upperLetter });
    return { success: true, insertCol: nextIdx };
  };

  const removeLetter = () => {
    dispatch({ type: GAME_ACTION.REMOVE_LETTER });
  };

  const submitGuess = (
    guess: string[],
    onResult?: (result: GameResult) => void
  ): { success: boolean; reason?: 'invalid_word' | 'hard_mode_violation' } => {
    // Only submit if row is filled
    if (!guess.every((c) => c !== '')) return { success: false };
    // Check hard mode constraints
    if (hardMode && !validateHardModeGuess(state, guess)) {
      return { success: false, reason: 'hard_mode_violation' };
    }
    const checkGuessResult = wordService.checkGuess(guess.join(''));
    if (checkGuessResult.wordExists) {
      dispatch({ type: GAME_ACTION.SUBMIT_GUESS, checkGuessResult });
      if (checkGuessResult.correct) {
        if (onResult) onResult(GAME_RESULT.VICTORY);
      } else if (state.currentRow === MAX_ATTEMPT_LIMIT - 1) {
        if (onResult) onResult(GAME_RESULT.DEFEAT);
      }
      return { success: true };
    }
    return { success: false, reason: 'invalid_word' };
  };

  return { state, addLetter, removeLetter, submitGuess };
};
