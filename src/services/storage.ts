import type { GameState } from '@shared-types/game';

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type OrdleTheme = (typeof THEME)[keyof typeof THEME];

export type OrdleConfig = {
  hardMode: boolean;
  theme: OrdleTheme;
};

const CONFIG_KEY = 'ordle-config';
const GAME_KEY_PREFIX = 'ordle-game-';

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentGameState(): GameState | null {
  return getGameState(getTodayKey());
}

function setCurrentGameState(state: GameState) {
  setGameState(getTodayKey(), state);
}

// Persisted configuration
function getConfig(): OrdleConfig {
  return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
}

function setConfig(config: OrdleConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// Game state by date (YYYY-MM-DD)
function getGameState(date: string): GameState | null {
  const data = localStorage.getItem(`${GAME_KEY_PREFIX}${date}`);
  return data ? JSON.parse(data) : null;
}

function setGameState(date: string, state: GameState) {
  localStorage.setItem(`${GAME_KEY_PREFIX}${date}`, JSON.stringify(state));
}

export const storage = {
  getConfig,
  setConfig,
  getGameState,
  setGameState,
  getCurrentGameState,
  setCurrentGameState,
};
