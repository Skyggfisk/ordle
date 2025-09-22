type LetterKeyProps = {
  letter: string;
  onClick: () => void;
  bg: string;
};

export const LetterKey = ({ letter, onClick, bg }: LetterKeyProps) => {
  return (
    <button
      className={`max-w-[2.8rem] min-w-[2.2rem] flex-1 rounded px-2 py-2 font-mono text-base font-bold shadow transition-colors duration-150 sm:min-w-[2.5rem] sm:px-4 sm:py-2 sm:text-lg ${bg} cursor-pointer`}
      onClick={onClick}
      type="button"
    >
      {letter}
    </button>
  );
};
