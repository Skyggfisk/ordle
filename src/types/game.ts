export const FEEDBACK = {
  GREEN: 'green',
  YELLOW: 'yellow',
  GREY: 'grey',
} as const;

export const GAME_RESULT = {
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  UNSETTLED: '',
} as const;

export const MAX_WORD_LENGTH = 5;
export const MAX_ATTEMPT_LIMIT = 6;

export type GuessFeedback = (typeof FEEDBACK)[keyof typeof FEEDBACK] | null;

export type GameResult = (typeof GAME_RESULT)[keyof typeof GAME_RESULT];

export type BounceTile = {
  row: number;
  col: number;
} | null;

export type CheckGuessResult = {
  feedback?: GuessFeedback[];
  correct: boolean;
  wordExists: boolean;
};

export type GameState = {
  guesses: string[][];
  currentRow: number;
  feedbackRows: GuessFeedback[][];
  gameResult: GameResult;
  started: boolean;
};
