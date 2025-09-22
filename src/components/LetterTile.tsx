import { FEEDBACK, type GuessFeedback } from '../types/game';

interface LetterTileProps {
  feedback: GuessFeedback;
  revealed: boolean;
  bounce: boolean;
  letter: string;
  delay: string | undefined;
  flip: boolean;
}

export const LetterTile = ({
  letter,
  bounce,
  feedback,
  revealed,
  delay,
  flip,
}: LetterTileProps) => {
  let bg = 'bg-neutral-100 dark:bg-neutral-700';
  if (revealed) {
    if (feedback === FEEDBACK.GREEN) bg = 'bg-green-600 text-white';
    else if (feedback === FEEDBACK.YELLOW) bg = 'bg-yellow-400 text-white';
    else if (feedback === FEEDBACK.GREY) bg = 'bg-gray-600 text-white';
  }

  return (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded border border-neutral-300 text-center text-2xl font-bold select-none ${bg} ${flip && 'flip'} ${bounce && 'bounce'}`}
      style={{ '--flip-delay': delay } as React.CSSProperties}
    >
      {letter}
    </span>
  );
};
