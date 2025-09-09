import { LetterTile } from './LetterTile';

interface BoardRowProps {
  tiles: string[];
  feedback: ('green' | 'yellow' | 'grey' | null)[];
  revealed: boolean[];
  bounceTile: { row: number; col: number } | null;
  rowIdx: number;
  shake: boolean;
}

export const BoardRow = ({
  tiles,
  feedback,
  revealed,
  bounceTile,
  rowIdx,
  shake,
}: BoardRowProps) => {
  return (
    <div className={`flex justify-center gap-2 ${shake ? 'shake' : ''}`}>
      {tiles.map((char, letterIdx) => (
        <LetterTile
          key={letterIdx}
          letter={char}
          feedback={feedback[letterIdx]}
          revealed={revealed[letterIdx]}
          bounce={bounceTile?.row === rowIdx && bounceTile?.col === letterIdx}
          flip={feedback[letterIdx] != null}
          delay={`${letterIdx * 100}ms`}
        />
      ))}
    </div>
  );
};
