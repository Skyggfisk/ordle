import { useTranslation } from 'react-i18next';

export const StartGameButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();

  return (
    <button
      className="gradient-bg mt-8 cursor-pointer rounded-xl px-8 py-4 text-2xl font-extrabold text-white shadow-lg transition-transform duration-200 hover:scale-110"
      onClick={onClick}
    >
      {t('FrontPage.startGameButton.label').toUpperCase()}
    </button>
  );
};
