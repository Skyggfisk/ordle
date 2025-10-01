import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotification } from '~/hooks/useNotification';
import {
  GAME_RESULT,
  MAX_WORD_LENGTH,
  type BounceTile,
  type GameResult,
  type GameState,
  type GuessFeedback,
} from '~/types/game';
import { CONTROL_KEYS } from '~/types/keyboard';
import { NOTIFICATION } from '~/types/notification';

import { Keyboard } from '../keyboard/Keyboard';
import { getKeyboardFeedback } from '../keyboard/Keyboard.utils';

import { BoardRow } from './BoardRow';

interface GameBoardProps {
  state: GameState;
  addLetter: (letter: string) => { success: boolean; insertCol: number };
  removeLetter: () => void;
  submitGuess: (
    guess: string[],
    onResult?: (result: GameResult) => void
  ) => { success: boolean; reason?: 'invalid_word' | 'hard_mode_violation' };
}

export const GameBoard = ({
  state,
  addLetter,
  removeLetter,
  submitGuess,
}: GameBoardProps) => {
  const { t } = useTranslation();
  const notify = useNotification();

  const [shakeRow, setShakeRow] = useState(false);
  const [bounceTile, setBounceTile] = useState<BounceTile>(null);
  const [dancingRow, setDancingRow] = useState<number | null>(null);

  // Global key handler
  useEffect(() => {
    if (state.gameResult !== GAME_RESULT.UNSETTLED) return; // Don't listen if game is over

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === CONTROL_KEYS.BACKSPACE) {
        removeLetter();
      } else if (e.key === CONTROL_KEYS.ENTER) {
        const submitGuessResult = submitGuess(
          state.guesses[state.currentRow] ?? [],
          (gameResult) => {
            if (gameResult === GAME_RESULT.VICTORY) {
              notify(t('GameBoard.result.victory'), {
                type: NOTIFICATION.SUCCESS,
              });
            } else if (gameResult === GAME_RESULT.DEFEAT) {
              notify(t('GameBoard.result.defeat'), {
                type: NOTIFICATION.ERROR,
              });
            }
          }
        );
        if (!submitGuessResult.success) {
          if (submitGuessResult.reason === 'hard_mode_violation') {
            notify(t('GameBoard.hardMode.violation'), {
              type: NOTIFICATION.WARNING,
            });
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), 600);
          } else if (submitGuessResult.reason === 'invalid_word') {
            notify(t('GameBoard.invalidWord.notFound'), {
              type: NOTIFICATION.INFO,
            });
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), 600);
          }
          // For incomplete guesses or other cases, do nothing
          return;
        }
      } else {
        const addLetterResult = addLetter(e.key);
        if (addLetterResult.success) {
          setBounceTile({
            row: state.currentRow,
            col: addLetterResult.insertCol,
          });
          setTimeout(() => setBounceTile(null), 300);
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
    notify,
  ]);

  // Winning dance trigger after reveal
  useEffect(() => {
    if (state.gameResult === GAME_RESULT.VICTORY) {
      const animationDuration = MAX_WORD_LENGTH * 120 + 600; // 120ms per tile + 600ms buffer
      // Do the victory dance! (wait for reveal flip)
      const animationTimer = setTimeout(() => {
        setDancingRow(state.currentRow - 1);
      }, animationDuration);

      return () => clearTimeout(animationTimer);
    }
  }, [state.gameResult, state.currentRow]);

  // Get feedback for a specific row
  const getRowFeedback = (rowIdx: number): GuessFeedback[] => {
    if (rowIdx < state.currentRow) {
      return state.feedbackRows[rowIdx] ?? Array(MAX_WORD_LENGTH).fill(null);
    }
    return Array(MAX_WORD_LENGTH).fill(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 px-4 py-8 sm:max-w-full">
      <div className="relative mt-8 rounded p-8 dark:text-white">
        <div className="flex flex-col gap-2">
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
                dance={dancingRow === rowIdx}
              />
            );
          })}
        </div>
      </div>
      <Keyboard
        keyFeedback={getKeyboardFeedback(state.guesses, state.feedbackRows)}
      />
    </div>
  );
};
