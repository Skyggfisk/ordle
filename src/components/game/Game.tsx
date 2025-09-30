import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GameBoard } from './GameBoard';
import { GameOverScreen } from './GameOverScreen';
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
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 px-4 py-8 sm:max-w-full">
          <h1 className="text-center text-3xl font-extrabold text-black sm:text-5xl dark:text-white">
            {t('FrontPage.title')}
          </h1>

          <p className="text-center text-base text-gray-500 sm:text-2xl dark:text-neutral-400">
            {t('FrontPage.description')}
          </p>

          <WordCard />

          <StartGameButton onClick={() => setShowGame(true)} />
        </div>
      )}
      {showGame && !gameOver && <GameBoard onGameOver={handleGameOver} />}
      {gameOver && <GameOverScreen />}
    </>
  );
};
