import { FEEDBACK, type GuessFeedback } from '@shared-types/game';

interface LetterTileProps {
  feedback: GuessFeedback;
  bounce: boolean;
  letter: string;
  flip: boolean;
  animationDelay?: string;
  dance?: boolean;
}

export const LetterTile = ({
  letter,
  bounce,
  feedback,
  animationDelay,
  flip,
  dance = false,
}: LetterTileProps) => {
  // Determine tile color for the back face (feedback)
  let feedbackBg = 'bg-neutral-100 dark:bg-neutral-700';
  if (feedback === FEEDBACK.GREEN) feedbackBg = 'bg-green-600 ';
  else if (feedback === FEEDBACK.YELLOW) feedbackBg = 'bg-yellow-400 ';
  else if (feedback === FEEDBACK.GREY) feedbackBg = 'bg-gray-600';

  return (
    <div
      className={`relative h-12 w-12 border-2 border-neutral-300 text-center text-2xl font-bold select-none perspective-midrange transform-3d dark:border-neutral-400 ${flip ? 'flip' : ''} ${bounce ? 'bounce' : ''} ${dance ? 'dance' : ''}`}
      style={
        {
          '--animation-delay': animationDelay,
        } as React.CSSProperties
      }
    >
      {/* Front tile face (no feedback) */}
      <div className="tile-face bg-neutral-100 dark:bg-neutral-700">
        {letter}
      </div>
      {/* Back tile face (feedback revealed) */}
      <div className={`tile-face rotate-y-180 text-white ${feedbackBg}`}>
        {letter}
      </div>
    </div>
  );
};
