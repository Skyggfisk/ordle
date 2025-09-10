import { FEEDBACK, type GuessFeedback } from '../types/game';

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Æ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ø', 'Å'],
];

export interface KeyboardProps {
  keyFeedback?: Record<string, GuessFeedback>;
}

export const Keyboard = ({ keyFeedback = {} }: KeyboardProps) => {
  const getBg = (key: string) => {
    if (keyFeedback[key] === FEEDBACK.GREEN) return 'bg-green-600 text-white';
    if (keyFeedback[key] === FEEDBACK.YELLOW) return 'bg-yellow-400 text-white';
    if (keyFeedback[key] === FEEDBACK.GREY) return 'bg-gray-600 text-white';
    return 'bg-white/20 text-black';
  };

  function triggerKeydown(key: string) {
    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);
  }

  return (
    <div className="m-8 mx-auto flex w-full max-w-xl flex-col items-center gap-2 rounded bg-white/10 p-2 sm:p-4">
      {KEYS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex w-full flex-wrap justify-center gap-1 sm:gap-2"
        >
          {row.map((key) => (
            <button
              key={key}
              className={`max-w-[2.8rem] min-w-[2.2rem] flex-1 rounded px-2 py-2 text-base font-bold shadow transition-colors duration-150 hover:bg-white/40 sm:min-w-[2.5rem] sm:px-4 sm:py-2 sm:text-lg ${getBg(key)} cursor-pointer`}
              onClick={() => triggerKeydown(key)}
              type="button"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="mt-2 flex w-full flex-wrap justify-center gap-1 sm:gap-2">
        <button
          className="max-w-[4rem] min-w-[2.5rem] flex-1 cursor-pointer rounded bg-purple-300 px-2 py-2 text-base font-bold text-black shadow transition-colors duration-150 hover:bg-purple-400 sm:px-4 sm:py-2"
          onClick={() => triggerKeydown('Backspace')}
          type="button"
        >
          ⌫
        </button>
        <button
          className="max-w-fit min-w-[2.5rem] flex-1 cursor-pointer rounded bg-green-300 px-2 py-2 text-base font-bold text-black shadow transition-colors duration-150 hover:bg-green-400 sm:px-4 sm:py-2"
          onClick={() => triggerKeydown('Enter')}
          type="button"
        >
          Enter
        </button>
      </div>
    </div>
  );
};
