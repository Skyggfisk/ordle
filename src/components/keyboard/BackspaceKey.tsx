import { useTranslation } from 'react-i18next';

type BackspaceKeyProps = {
  onClick: () => void;
};

export const BackspaceKey = ({ onClick }: BackspaceKeyProps) => {
  const { t } = useTranslation();
  return (
    <button
      className="max-w-[4rem] min-w-fit flex-1 cursor-pointer rounded bg-red-400 px-4 py-2 text-base font-bold text-black shadow transition-colors duration-150 hover:bg-red-500 sm:px-4 sm:py-2 dark:bg-rose-300 dark:hover:bg-rose-400"
      onClick={onClick}
      aria-label={t('aria.keyboard.backspace')}
      type="button"
    >
      ⌫
    </button>
  );
};
