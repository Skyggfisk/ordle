import { FEEDBACK, type GuessFeedback } from '~/types/game';
import { CONTROL_KEYS } from '~/types/keyboard';

import { BackspaceKey } from './BackspaceKey';
import { EnterKey } from './EnterKey';
import { LetterKey } from './LetterKey';

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Å'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Æ', 'Ø'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export interface KeyboardProps {
  keyFeedback?: Record<string, GuessFeedback>;
}

export const Keyboard = ({ keyFeedback = {} }: KeyboardProps) => {
  const getBg = (key: string) => {
    if (keyFeedback[key] === FEEDBACK.GREEN)
      return 'bg-green-600 text-white hover:bg-green-600/40 dark:hover:bg-green-600/80';
    if (keyFeedback[key] === FEEDBACK.YELLOW)
      return 'bg-yellow-400 text-white hover:bg-yellow-400/40 dark:hover:bg-yellow-400/80';
    if (keyFeedback[key] === FEEDBACK.GREY)
      return 'bg-gray-600 text-white hover:bg-gray-600/40 dark:hover:bg-gray-600/80';
    return 'text-black hover:bg-neutral-200 dark:hover:bg-white/40 dark:bg-white/20';
  };

  function triggerKeydown(key: string) {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
  }

  return (
    <div
      data-testid="keyboard"
      className="flex w-full max-w-lg flex-col items-center gap-1 rounded bg-neutral-200/40 p-2 select-none dark:bg-white/10"
    >
      {KEYS.map((row, rowIdx) => {
        // Add backspace and enter keys to the last row
        if (rowIdx === KEYS.length - 1) {
          return (
            <div
              key={rowIdx}
              className="flex w-full flex-wrap justify-center gap-1"
            >
              <BackspaceKey
                onClick={() => triggerKeydown(CONTROL_KEYS.BACKSPACE)}
              />
              {row.map((key) => (
                <LetterKey
                  key={key}
                  letter={key}
                  onClick={() => triggerKeydown(key)}
                  bg={getBg(key)}
                />
              ))}
              <EnterKey onClick={() => triggerKeydown(CONTROL_KEYS.ENTER)} />
            </div>
          );
        }

        return (
          <div
            key={rowIdx}
            className="flex w-full flex-wrap justify-center gap-1"
          >
            {row.map((key) => (
              <LetterKey
                key={key}
                letter={key}
                onClick={() => triggerKeydown(key)}
                bg={getBg(key)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
