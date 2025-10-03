import { useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    // Update document lang attribute when language changes
    const updateLang = (lng: string) => {
      document.documentElement.lang = lng;
    };
    updateLang(i18n.language);
    i18n.on('languageChanged', updateLang);

    return () => {
      i18n.off('languageChanged', updateLang);
    };
  }, []);
  if (!mounted) return null;
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
