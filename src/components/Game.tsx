import { useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameOverScreen } from './GameOverScreen';
import { useTranslation } from 'react-i18next';
import { WordCard } from './WordCard';
import { StartGameButton } from './StartGameButton';

export const Game = () => {
  const { t } = useTranslation();

  const [showGame, setShowGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = () => {
    setGameOver(true);
  };

  return (
    <>
      {!showGame && !gameOver && (
        <>
          <h1 className="text-5xl font-extrabold text-black sm:text-[5rem] dark:text-white">
            {t('FrontPage.title')}
          </h1>

          <p className="text-2xl text-gray-500 dark:text-neutral-400">
            {t('FrontPage.description')}
          </p>

          <WordCard />

          <StartGameButton onClick={() => setShowGame(true)} />
        </>
      )}
      {showGame && !gameOver && <GameBoard onGameOver={handleGameOver} />}
      {gameOver && <GameOverScreen />}
    </>
  );
};
