import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from './Keyboard';
import { Notification } from './Notification';
import { BoardRow } from './BoardRow';
import {
  useGameState,
  WORD_LENGTH,
  type GuessFeedback,
} from '../hooks/useGameState';

type BounceTile = {
  row: number;
  col: number;
} | null;

interface GameBoardProps {
  onGameOver?: () => void;
}

// Sync guess feedback to the keyboard
function getKeyBoardFeedback(
  guesses: string[][],
  feedbackRows: GuessFeedback[][]
): Record<string, GuessFeedback> {
  const feedback: Record<string, GuessFeedback> = {};
  guesses.forEach((guess, rowIdx) => {
    guess.forEach((char, colIdx) => {
      const fb = feedbackRows[rowIdx]?.[colIdx];
      if (!char || !fb) return;
      // Prioritize green > yellow > grey
      if (
        fb === 'green' ||
        (fb === 'yellow' && feedback[char] !== 'green') ||
        (fb === 'grey' && !feedback[char])
      ) {
        feedback[char] = fb;
      }
    });
  });
  return feedback;
}

export const GameBoard = ({ onGameOver }: GameBoardProps) => {
  const { t } = useTranslation();

  const { state, addLetter, removeLetter, submitGuess } = useGameState();

  const [invalidWord, setInvalidWord] = useState<string>('');
  const [shakeRow, setShakeRow] = useState(false);
  const [bounceTile, setBounceTile] = useState<BounceTile>(null);

  // Global key handler
  useEffect(() => {
    if (state.gameResult) return; // Don't listen if game is over

    const handleKeyDown = (e: KeyboardEvent) => {
      const nextIdx = state.guesses[state.currentRow]?.findIndex(
        (c) => c === ''
      );

      if (e.key === 'Backspace') {
        removeLetter();
      } else if (e.key === 'Enter') {
        setInvalidWord('');
        const result = submitGuess(state.guesses[state.currentRow] ?? []);
        if (result === false) {
          setInvalidWord(t('GameBoard.invalidWord.notFound'));
          setShakeRow(true);
          setTimeout(() => setShakeRow(false), 600);
          return;
        }
      } else {
        if (nextIdx !== undefined && nextIdx !== -1) {
          const addLetterSuccess = addLetter(e.key);
          if (addLetterSuccess) {
            setBounceTile({ row: state.currentRow, col: nextIdx });
            setTimeout(() => setBounceTile(null), 300);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    state.guesses,
    state.currentRow,
    state.gameResult,
    removeLetter,
    submitGuess,
    t,
    addLetter,
  ]);

  // Notify when game is over, after delay
  useEffect(() => {
    if (state.gameResult && onGameOver) {
      const timer = setTimeout(() => {
        onGameOver();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.gameResult, onGameOver, state.guesses]);

  const getNotificationMessage = ({
    gameResult,
    invalidWord,
  }: {
    gameResult?: string;
    invalidWord?: string;
  }) => {
    if (gameResult === 'victory') {
      return t('GameBoard.result.victory');
    }
    if (gameResult === 'defeat') {
      return t('GameBoard.result.defeat');
    }
    if (invalidWord) {
      return t('GameBoard.invalidWord.notFound');
    }
    return '';
  };

  // Get feedback for a specific row
  const getRowFeedback = (rowIdx: number): GuessFeedback[] => {
    if (rowIdx < state.currentRow || !!state.gameResult) {
      return state.feedbackRows[rowIdx] ?? Array(WORD_LENGTH).fill(null);
    }
    return Array(WORD_LENGTH).fill(null);
  };

  return (
    <>
      <div className="relative mt-8 rounded bg-white/10 p-8 text-white">
        <Notification
          message={getNotificationMessage({
            gameResult: state.gameResult,
            invalidWord,
          })}
          className={`rounded bg-white/80 px-6 py-3 text-center text-xl font-bold ${invalidWord ? 'text-red-500' : 'text-black'} shadow-lg`}
        />
        <div className="flex flex-col gap-4">
          {state.guesses.map((guess, rowIdx) => {
            const feedback = getRowFeedback(rowIdx);
            return (
              <BoardRow
                key={rowIdx}
                shake={rowIdx === state.currentRow && shakeRow}
                tiles={guess}
                feedback={feedback}
                revealed={state.revealedRows[rowIdx]}
                bounceTile={bounceTile}
                rowIdx={rowIdx}
              />
            );
          })}
        </div>
      </div>
      <Keyboard
        keyFeedback={getKeyBoardFeedback(state.guesses, state.feedbackRows)}
      />
    </>
  );
};
