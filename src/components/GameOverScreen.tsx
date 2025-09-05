import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { wordService } from '../services/wordService';

export const GameOverScreen = () => {
  const { t } = useTranslation();

  const gameData = JSON.parse(
    localStorage.getItem(
      `ordle-game-${new Date().toISOString().slice(0, 10)}`
    ) || '{}'
  );
  const wotd = wordService.getWotd();

  const result = gameData.gameResult || 'Game Over';
  const totalGuesses = gameData.currentRow + 1;

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

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <h2 className="mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent">
        {result === 'Game Over!'
          ? t('GameOverScreen.title.defeat')
          : t('GameOverScreen.title.victory')}
      </h2>

      <div className="mb-8 text-xl">
        <span>
          <Trans
            i18nKey={
              totalGuesses < 3
                ? 'GameOverScreen.totalGuesses.lessThan3'
                : totalGuesses <= 5
                  ? 'GameOverScreen.totalGuesses.between3and5'
                  : 'GameOverScreen.totalGuesses.moreThan5'
            }
            values={{ count: totalGuesses }}
            components={{
              1: (
                <span className="font-mono text-purple-300">
                  {totalGuesses}
                </span>
              ),
            }}
          >
            <span className="font-mono text-purple-300">{totalGuesses}</span>
          </Trans>
        </span>
        <a
          href={`https://ordnet.dk/ddo/ordbog?query=${wotd || 'N/A'}`}
          target="_blank"
          className="ml-1 font-semibold text-blue-200 underline underline-offset-2 transition-colors duration-200 hover:text-purple-300"
        >
          {wotd || 'N/A'}
        </a>
      </div>
      <div className="mb-8 text-xl">
        <Trans
          i18nKey="GameOverScreen.endComment"
          values={{ countdown }}
          components={{
            1: <span className="font-mono text-blue-300"></span>,
          }}
        >
          <span className="font-mono text-blue-300"></span>
        </Trans>
      </div>
    </div>
  );
};
