import { useState } from 'react';
import GameBoard from './gameboard';
import GameOverScreen from './GameOverScreen';
import { useTranslation } from 'react-i18next';
import { WordCard } from './WordCard';
import { StartGameButton } from './StartGameButton';

export function ShowGameBoard() {
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
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="gradient-bg bg-clip-text text-transparent">
              {t('FrontPage.title')}
            </span>
          </h1>

          <p className="text-2xl text-white">{t('FrontPage.description')}</p>

          <WordCard />

          <StartGameButton onClick={() => setShowGame(true)} />
        </>
      )}
      {showGame && !gameOver && <GameBoard onGameOver={handleGameOver} />}
      {gameOver && <GameOverScreen />}
    </>
  );
}
