import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { wordService } from '../../services/wordService';
import { storage } from '../../services/storage';
import { GAME_RESULT } from '../../types/game';

export const GameOverScreen = () => {
  const { t } = useTranslation();
  const gameData = storage.getCurrentGameState();
  const wotd = wordService.getWotd();
  const result = gameData?.gameResult || GAME_RESULT.UNSETTLED;
  const totalGuesses = gameData?.currentRow || 0;
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const pad = (n: number) => n.toString().padStart(2, '0');
      setCountdown(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const getI18nGuessMessageKey = () => {
    if (result === GAME_RESULT.DEFEAT)
      return 'GameOverScreen.totalGuesses.defeat';
    if (totalGuesses === 1) return 'GameOverScreen.totalGuesses.holeInOne';
    if (totalGuesses < 3) return 'GameOverScreen.totalGuesses.lessThan3';
    if (totalGuesses <= 5) return 'GameOverScreen.totalGuesses.between3and5';
    if (totalGuesses > 5) return 'GameOverScreen.totalGuesses.moreThan5';
    return 'GameOverScreen.totalGuesses.defeat';
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      {/* <h2 className="mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent"> */}
      <h2 className="mb-8 text-3xl font-bold">
        {result === GAME_RESULT.DEFEAT
          ? t('GameOverScreen.title.defeat')
          : t('GameOverScreen.title.victory')}
      </h2>

      <div className="mb-8 text-xl">
        <span>
          <Trans
            i18nKey={getI18nGuessMessageKey()}
            values={{ count: totalGuesses }}
            components={{
              1: (
                <span className="font-mono text-purple-500 dark:text-purple-300">
                  {totalGuesses}
                </span>
              ),
            }}
          />
        </span>
        :
        <a
          href={`https://ordnet.dk/ddo/ordbog?query=${wotd || 'N/A'}`}
          target="_blank"
          className="ml-1 font-semibold text-blue-500 underline underline-offset-2 transition-colors duration-200 hover:text-purple-600 dark:text-blue-200 dark:hover:text-purple-300"
        >
          {wotd || 'N/A'}
        </a>
      </div>
      <div className="mb-8 text-xl">
        <Trans
          i18nKey="GameOverScreen.endComment"
          values={{ countdown }}
          components={{
            1: (
              <span className="font-mono text-emerald-500 dark:text-emerald-300"></span>
            ),
          }}
        />
      </div>
    </div>
  );
};
