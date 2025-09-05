import { useTranslation } from 'react-i18next';

export const WordCard = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-6 mb-2 max-w-xl rounded-lg bg-white/10 px-4 py-3 text-left text-white shadow-md">
      <span className="mb-1 block text-3xl font-bold text-yellow-300">
        {t('FrontPage.wordCard.title')}{' '}
        <span className="text-lg font-normal text-white/70">[ˈoɐ̯dlə]</span>
      </span>
      <span className="text-purple-200 italic">
        {t('FrontPage.wordCard.wordClass').toLowerCase()}
      </span>
      <div className="mt-2">
        <span className="block text-lg">
          {t('FrontPage.wordCard.description_1')}
        </span>
        <span className="mt-1 block text-lg">
          {t('FrontPage.wordCard.description_2')}
        </span>
      </div>
      <div className="mt-2 text-sm text-pink-200 italic">
        "{t('FrontPage.wordCard.usageExample')}"
      </div>
    </div>
  );
};
