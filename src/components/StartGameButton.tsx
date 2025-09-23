import { useTranslation } from 'react-i18next';

export const StartGameButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <button
      className="mt-8 w-full cursor-pointer rounded-xl bg-green-400 px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition-transform duration-200 hover:scale-110 sm:w-auto dark:bg-emerald-500"
      onClick={onClick}
    >
      {t('FrontPage.startGameButton.label').toUpperCase()}
    </button>
  );
};
