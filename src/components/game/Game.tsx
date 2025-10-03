import { useLayoutEffect, useState } from 'react';

import { useGameState } from '@hooks/useGameState';
import { ANIMATION } from '@shared-types/animation';
import { GAME_RESULT } from '@shared-types/game';

import { GameBoard } from './GameBoard';
import { GameFront } from './GameFront';
import { GameOverScreen } from './GameOverScreen';

type GameScreen = 'front' | 'playing' | 'finished';

export const Game = () => {
  const { state, startGame, addLetter, removeLetter, submitGuess } =
    useGameState();

  const [isGameOverAnimating, setIsGameOverAnimating] = useState(false);
  const [screen, setScreen] = useState<GameScreen>(() => {
    if (isGameOverAnimating || state.gameResult === GAME_RESULT.UNSETTLED) {
      return state.started ? 'playing' : 'front';
    }
    return 'finished';
  });

  useLayoutEffect(() => {
    if (state.gameResult === GAME_RESULT.VICTORY) {
      setIsGameOverAnimating(true);
      const timer = setTimeout(() => {
        setIsGameOverAnimating(false);
        setScreen('finished');
      }, ANIMATION.VICTORY_TOTAL_DURATION_MS);
      return () => clearTimeout(timer);
    } else if (state.gameResult === GAME_RESULT.DEFEAT) {
      setIsGameOverAnimating(true);
      const timer = setTimeout(() => {
        setIsGameOverAnimating(false);
        setScreen('finished');
      }, ANIMATION.DEFEAT_DURATION_MS);
      return () => clearTimeout(timer);
    } else {
      setIsGameOverAnimating(false);
    }
  }, [state.gameResult]);

  return (
    <>
      {screen === 'front' && (
        <GameFront
          startGame={() => {
            setScreen('playing');
            startGame();
          }}
        />
      )}
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
