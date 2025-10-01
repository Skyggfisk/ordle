import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import da from '~/locales/da.json';
import en from '~/locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      da: { translation: da },
    },
    supportedLngs: ['en', 'da'],
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      lookupLocalStorage: 'ordle-i18nextLng',
    },
  });

export default i18n;
