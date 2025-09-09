import type React from 'react';

interface LetterTileProps {
  feedback: 'green' | 'yellow' | 'grey' | null;
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
  let bg = 'bg-white/20';
  if (revealed) {
    if (feedback === 'green') bg = 'bg-green-600';
    else if (feedback === 'yellow') bg = 'bg-yellow-400';
    else if (feedback === 'grey') bg = 'bg-gray-600';
  }

  return (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded border border-white/30 text-center text-2xl font-bold select-none ${bg} ${flip && 'flip'} ${bounce && 'bounce'}`}
      style={{ '--flip-delay': delay } as React.CSSProperties}
    >
      {letter}
    </span>
  );
};
