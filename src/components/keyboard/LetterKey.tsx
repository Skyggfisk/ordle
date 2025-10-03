import { useTranslation } from 'react-i18next';

type LetterKeyProps = {
  letter: string;
  onClick: () => void;
  bg: string;
};

export const LetterKey = ({ letter, onClick, bg }: LetterKeyProps) => {
  const { t } = useTranslation();
  return (
    <button
      className={`max-w-[2.8rem] min-w-[0.5rem] flex-1 rounded px-1 py-2 font-mono text-sm font-bold shadow transition-colors duration-150 sm:min-w-[2.5rem] sm:px-4 sm:py-2 sm:text-lg md:min-w-[2.2rem] md:text-base ${bg} cursor-pointer`}
      onClick={onClick}
      aria-label={t('aria.keyboard.letter', { letter })}
      type="button"
    >
      {letter}
    </button>
  );
};
