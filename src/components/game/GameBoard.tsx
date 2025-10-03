import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNotification } from '@hooks/useNotification';
import { ANIMATION } from '@shared-types/animation';
import {
  GAME_RESULT,
  MAX_WORD_LENGTH,
  type BounceTile,
  type GameResult,
  type GameState,
  type GuessFeedback,
} from '@shared-types/game';
import { CONTROL_KEYS } from '@shared-types/keyboard';
import { NOTIFICATION } from '@shared-types/notification';

import { BoardRow } from './BoardRow';
import { Keyboard } from '../keyboard/Keyboard';
import { getKeyboardFeedback } from '../keyboard/Keyboard.utils';

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
  const [animatingRows, setAnimatingRows] = useState<Set<number>>(new Set());

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
        if (submitGuessResult.success) {
          const currentRow = state.currentRow;
          setAnimatingRows((prev) => new Set(prev).add(currentRow));
          setTimeout(
            () =>
              setAnimatingRows((prev) => {
                const newSet = new Set(prev);
                newSet.delete(currentRow);
                return newSet;
              }),
            ANIMATION.CASCADE_TIMEOUT_MS
          );
        } else {
          if (submitGuessResult.reason === 'hard_mode_violation') {
            notify(t('GameBoard.hardMode.violation'), {
              type: NOTIFICATION.WARNING,
            });
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), ANIMATION.SHAKE_DURATION_MS);
          } else if (submitGuessResult.reason === 'invalid_word') {
            notify(t('GameBoard.invalidWord.notFound'), {
              type: NOTIFICATION.INFO,
            });
            setShakeRow(true);
            setTimeout(() => setShakeRow(false), ANIMATION.SHAKE_DURATION_MS);
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
          setTimeout(() => setBounceTile(null), ANIMATION.BOUNCE_DURATION_MS);
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
      const animationDuration =
        MAX_WORD_LENGTH * ANIMATION.TILE_FLIP_DELAY_MS +
        ANIMATION.TILE_FLIP_DURATION_MS +
        ANIMATION.DANCE_DELAY_MS;
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

  // Get revealed state for a specific row
  const getRowRevealed = (rowIdx: number): boolean[] => {
    if (rowIdx < state.currentRow) {
      return state.feedbackRows[rowIdx].map((f) => f !== null);
    }
    return Array(MAX_WORD_LENGTH).fill(false);
  };

  return (
    <section
      className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 px-4 py-8 sm:max-w-full"
      aria-label={t('aria.gameBoard')}
    >
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
                revealed={getRowRevealed(rowIdx)}
                bounceTile={bounceTile}
                rowIdx={rowIdx}
                dance={dancingRow === rowIdx}
                animating={animatingRows.has(rowIdx)}
              />
            );
          })}
        </div>
      </div>
      <Keyboard
        keyFeedback={getKeyboardFeedback(state.guesses, state.feedbackRows)}
      />
    </section>
  );
};
