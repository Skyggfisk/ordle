export const ANIMATION = {
  // Tile flip animation
  TILE_FLIP_DELAY_MS: 150,
  TILE_FLIP_DURATION_MS: 800,

  // Cascade timeout (total time for all tiles to flip)
  CASCADE_TIMEOUT_MS: 1400,

  // Shake animation for invalid guesses
  SHAKE_DURATION_MS: 600,

  // Bounce animation for letter input
  BOUNCE_DURATION_MS: 300,

  // Victory animation total duration (reveal + dance + buffer)
  VICTORY_TOTAL_DURATION_MS: 4150,

  // Defeat animation duration
  DEFEAT_DURATION_MS: 2000,

  // Dance animation delay after reveal
  DANCE_DELAY_MS: 600,
} as const;