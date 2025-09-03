import { useState } from 'react';
import GameBoard from './gameboard';
import GameOverScreen from './GameOverScreen';
import { useTranslation } from 'react-i18next';

export function ShowGameBoard() {
  const { t } = useTranslation();

  const [showGame, setShowGame] = useState(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGameOver = () => {
    setGameOver(true);
  };

  return (
    <>
      {!showGame && !gameOver && (
        <>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span
              className="animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-[length:200%_200%] bg-clip-text text-transparent"
              style={{ display: 'inline-block' }}
            >
              {t('FrontPage.title')}
            </span>
            <style>{`
              @keyframes gradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .animate-gradient {
                animation: gradient 3s ease-in-out infinite;
              }
            `}</style>
          </h1>

          <p className="text-2xl text-white">{t('FrontPage.description')}</p>
          <div className="mx-auto mt-6 mb-2 max-w-xl rounded-lg bg-white/10 px-4 py-3 text-left text-white shadow-md">
            <span className="mb-1 block text-3xl font-bold text-yellow-300">
              {t('FrontPage.wordCard.title')}{' '}
              <span className="text-lg font-normal text-white/70">
                [ˈoɐ̯dlə]
              </span>
            </span>
            <span className="text-purple-200 italic">
              {t('FrontPage.wordCard.wordClass').toLowerCase()}
            </span>
            <div className="mt-2">
              <span className="block text-lg">
                {t('FrontPage.wordCard.description_1')}
              </span>
              <span className="mt-1 block text-lg">
                {t('FrontPage.wordCard.description_2')}
              </span>
            </div>
            <div className="mt-2 text-sm text-pink-200 italic">
              "{t('FrontPage.wordCard.usageExample')}"
            </div>
          </div>
          <button
            className="animate-gradient-bg animate-gradient mt-8 cursor-pointer rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-[length:200%_200%] px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition-transform duration-200 hover:scale-110"
            onClick={() => setShowGame(true)}
          >
            {t('FrontPage.startGameButton.label').toUpperCase()}
          </button>
          <style>{`
            @keyframes gradient-bg {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .animate-gradient-bg {
              animation: gradient-bg 3s ease-in-out infinite;
            }
          `}</style>
        </>
      )}
      {showGame && !gameOver && <GameBoard onGameOver={handleGameOver} />}
      {gameOver && <GameOverScreen />}
    </>
  );
}
