import { useEffect, useMemo, useState } from 'react';

import { useGameState } from '@hooks/useGameState';
import { GAME_RESULT, MAX_WORD_LENGTH } from '@shared-types/game';

import { GameBoard } from './GameBoard';
import { GameFront } from './GameFront';
import { GameOverScreen } from './GameOverScreen';

type GameScreen = 'front' | 'playing' | 'finished';

export const Game = () => {
  const { state, startGame, addLetter, removeLetter, submitGuess } =
    useGameState();

  const [isGameOverAnimating, setIsGameOverAnimating] = useState(false);

  useEffect(() => {
    if (state.gameResult === GAME_RESULT.VICTORY) {
      setIsGameOverAnimating(true);
      const animationDuration = MAX_WORD_LENGTH * 120 + 600; // 120ms per tile + 600ms buffer
      const gameOverTime = 2000;
      const totalDelay = animationDuration + gameOverTime;
      const timer = setTimeout(() => setIsGameOverAnimating(false), totalDelay);
      return () => clearTimeout(timer);
    } else if (state.gameResult === GAME_RESULT.DEFEAT) {
      setIsGameOverAnimating(true);
      const gameOverTime = 2000;
      const timer = setTimeout(
        () => setIsGameOverAnimating(false),
        gameOverTime
      );
      return () => clearTimeout(timer);
    } else {
      setIsGameOverAnimating(false);
    }
  }, [state.gameResult]);

  const screen = useMemo<GameScreen>(() => {
    if (isGameOverAnimating || state.gameResult === GAME_RESULT.UNSETTLED) {
      return state.started ? 'playing' : 'front';
    }
    return 'finished';
  }, [state.gameResult, state.started, isGameOverAnimating]);

  return (
    <>
      {screen === 'front' && <GameFront startGame={startGame} />}
      {screen === 'playing' && (
        <GameBoard
          state={state}
          addLetter={addLetter}
          removeLetter={removeLetter}
          submitGuess={submitGuess}
        />
      )}
      {screen === 'finished' && <GameOverScreen />}
    </>
  );
};
