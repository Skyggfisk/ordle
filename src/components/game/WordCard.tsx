import { useTranslation } from 'react-i18next';

export const WordCard = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mb-2 max-w-xl rounded-lg bg-amber-50 px-4 py-3 text-left shadow-md dark:bg-stone-900">
      <span className="mb-1 block text-3xl font-semibold">
        {t('FrontPage.wordCard.title')}{' '}
        <span className="text-lg font-normal text-gray-400">[ˈoɐ̯dlə]</span>
      </span>
      <span className="text-gray-500 italic dark:text-gray-400">
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
      <div className="mt-2 text-sm text-gray-400 italic">
        "{t('FrontPage.wordCard.usageExample')}"
      </div>
    </div>
  );
};
