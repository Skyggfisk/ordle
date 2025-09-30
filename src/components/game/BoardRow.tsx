import { LetterTile } from './LetterTile';

import type { BounceTile, GuessFeedback } from '../../types/game';

interface BoardRowProps {
  tiles: string[];
  feedback: GuessFeedback[];
  revealed: boolean[];
  bounceTile: BounceTile;
  rowIdx: number;
  shake: boolean;
  dance?: boolean;
}

export const BoardRow = ({
  tiles,
  feedback,
  revealed,
  bounceTile,
  rowIdx,
  shake,
  dance = false,
}: BoardRowProps) => {
  return (
    <div className={`flex justify-center gap-1 ${shake ? 'shake' : ''}`}>
      {tiles.map((char, letterIdx) => (
        <LetterTile
          key={letterIdx}
          letter={char}
          feedback={feedback[letterIdx]}
          bounce={bounceTile?.row === rowIdx && bounceTile?.col === letterIdx}
          flip={revealed[letterIdx]}
          animationDelay={`${letterIdx * 120}ms`}
          dance={dance}
        />
      ))}
    </div>
  );
};
