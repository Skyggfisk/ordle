import { useReducer, useEffect } from 'react';
import { wordService, type CheckGuessResult } from '../services/wordService';

export type GuessFeedback = 'green' | 'yellow' | 'grey' | null;

type GameState = {
  guesses: string[][];
  currentRow: number;
  feedbackRows: GuessFeedback[][];
  revealedRows: boolean[][];
  gameResult: string;
};

type GameAction =
  | { type: 'ADD_LETTER'; letter: string }
  | { type: 'REMOVE_LETTER' }
  | { type: 'SUBMIT_GUESS'; checkGuessResult: CheckGuessResult };

export const WORD_LENGTH = 5;
const NUM_ATTEMPTS = 6;
const today = new Date().toISOString().slice(0, 10);
const gameKey = `ordle-game-${today}`;

function getInitialState(): GameState {
  const existingGame = localStorage.getItem(gameKey);
  if (existingGame) {
    return JSON.parse(existingGame);
  }
  const state = {
    guesses: Array(NUM_ATTEMPTS)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill('')),
    currentRow: 0,
    feedbackRows: Array(NUM_ATTEMPTS)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill(null)),
    revealedRows: Array(NUM_ATTEMPTS)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill(false)),
    gameResult: '',
    solution: null,
  };
  localStorage.setItem(gameKey, JSON.stringify(state));
  return state;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_LETTER':
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
    case 'REMOVE_LETTER':
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
    case 'SUBMIT_GUESS':
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
          ? 'victory'
          : state.currentRow === NUM_ATTEMPTS - 1
            ? 'defeat'
            : '',
        guesses: state.guesses,
        currentRow: state.currentRow + 1,
      };
    default:
      return state;
  }
}

export const useGameState = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem(gameKey, JSON.stringify(state));
  }, [state]);

  const addLetter = (letter: string) => {
    // Only allow valid letters (A-Z, ÆØÅ)
    const upperLetter = letter.toUpperCase();
    if (!/^[A-ZÆØÅ]$/.test(upperLetter)) return false;
    dispatch({ type: 'ADD_LETTER', letter: upperLetter });
    return true;
  };

  const removeLetter = () => {
    dispatch({ type: 'REMOVE_LETTER' });
  };

  const submitGuess = (guess: string[]) => {
    // Only submit if row is filled
    if (!guess.every((c) => c !== '')) return;
    const checkGuessResult = wordService.checkGuess(guess.join(''));
    if (checkGuessResult.wordExists) {
      dispatch({ type: 'SUBMIT_GUESS', checkGuessResult });
    }
    return checkGuessResult.wordExists;
  };

  return { state, addLetter, removeLetter, submitGuess };
};
