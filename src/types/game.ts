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
  solution: string | undefined;
};
