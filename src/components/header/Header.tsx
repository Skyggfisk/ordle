import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaQuestionCircle, FaCog } from 'react-icons/fa';

import FlagDK from '@icons/flag_dk.svg?react';
import FlagGB from '@icons/flag_gb.svg?react';
import { storage, THEME, type OrdleTheme } from '@services/storage';

import { MenuButton } from './MenuButton';

// Helper to apply system theme
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)');
};

const applySystemTheme = () => {
  const prefersDark = getSystemTheme().matches;
  if (prefersDark) {
    document.documentElement.classList.add(THEME.DARK);
  } else {
    document.documentElement.classList.remove(THEME.DARK);
  }
};

export const Header = () => {
  const { t, i18n } = useTranslation();

  // Init state
  const [hardMode, setHardMode] = useState(false);
  // Determine initial theme: use config if present, else use 'system'
  const getInitialTheme = () => {
    const config = storage.getConfig();
    return config.theme || THEME.SYSTEM;
  };
  const [theme, setTheme] = useState<OrdleTheme>(getInitialTheme());
  const [loaded, setLoaded] = useState(false);

  // Load config from storage on mount
  useEffect(() => {
    try {
      const config = storage.getConfig();
      setHardMode(!!config.hardMode);
      // If no theme in config, set to 'system'
      if (!config.theme) {
        storage.setConfig({ ...config, theme: THEME.SYSTEM });
        setTheme(THEME.SYSTEM);
      } else {
        setTheme(config.theme);
      }
    } catch {
      setHardMode(false);
      setTheme(THEME.SYSTEM);
      storage.setConfig({ hardMode: false, theme: THEME.SYSTEM });
    }
    setLoaded(true);
  }, []);

  // Automatically sync config state and storage, but only after initial load
  useEffect(() => {
    if (!loaded) return;
    storage.setConfig({ ...storage.getConfig(), hardMode, theme });
    // Apply theme to document root
    if (theme === THEME.DARK) {
      document.documentElement.classList.add(THEME.DARK);
    } else if (theme === THEME.LIGHT) {
      document.documentElement.classList.remove(THEME.DARK);
    } else {
      // System: follow OS preference
      const prefersDark = getSystemTheme().matches;
      if (prefersDark) {
        document.documentElement.classList.add(THEME.DARK);
      } else {
        document.documentElement.classList.remove(THEME.DARK);
      }
    }
  }, [hardMode, theme, loaded]);

  const handleLangChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
  };

  const handleSwitch = (key: 'hardMode', value: boolean) => {
    const config = storage.getConfig();
    config[key] = value;
    if (key === 'hardMode') setHardMode(value);
  };

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== THEME.SYSTEM) return;
    applySystemTheme();
    const media = getSystemTheme();
    media.addEventListener('change', applySystemTheme);
    return () => {
      media.removeEventListener('change', applySystemTheme);
    };
  }, [theme]);

  const handleThemeChange = (mode: OrdleTheme) => {
    setTheme(mode);
    storage.setConfig({ ...storage.getConfig(), theme: mode });
    if (mode === THEME.DARK) {
      document.documentElement.classList.add(THEME.DARK);
    } else if (mode === THEME.LIGHT) {
      document.documentElement.classList.remove(THEME.DARK);
    } else {
      applySystemTheme();
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 flex gap-4 p-2">
      <MenuButton
        icon={<FaQuestionCircle className="text-lg" />}
        label={t('Header.howToPlay.label')}
      >
        <div className="w-64">
          <div className="mb-2 text-lg font-bold">
            {t('Header.howToPlay.label')}
          </div>
          <ul className="mb-2 list-disc pl-5">
            <li>{t('Header.howToPlay.instructions.0')}</li>
            <li>{t('Header.howToPlay.instructions.1')}</li>
            <li>{t('Header.howToPlay.instructions.2')}</li>
          </ul>
          <div className="mb-1 font-bold">
            {t('Header.howToPlay.legend.legendTitle')}:
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded border border-gray-300 bg-green-600"></span>
            <span>{t('Header.howToPlay.legend.correct')}</span>
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded border border-gray-300 bg-yellow-400"></span>
            <span>{t('Header.howToPlay.legend.present')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded border border-gray-300 bg-gray-600"></span>
            <span>{t('Header.howToPlay.legend.absent')}</span>
          </div>
        </div>
      </MenuButton>
      <MenuButton
        icon={<FaGlobe className="text-lg" />}
        label={t('Header.language.label')}
      >
        <ul className="space-y-1">
          <li>
            <button
              className={`w-full cursor-pointer rounded px-2 py-1 text-left ${i18n.language === 'en' ? 'bg-gray-100 font-bold dark:bg-neutral-500' : ''} flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-neutral-700`}
              onClick={() => handleLangChange('en')}
            >
              <FlagGB className="mr-1 inline-block h-5 w-5 align-text-bottom" />
              {t('Header.language.options.en')}
            </button>
          </li>
          <li>
            <button
              className={`w-full cursor-pointer rounded px-2 py-1 text-left ${i18n.language === 'da' ? 'bg-gray-100 font-bold dark:bg-neutral-500' : ''} flex items-center gap-1 hover:bg-gray-300 dark:hover:bg-neutral-700`}
              onClick={() => handleLangChange('da')}
            >
              <FlagDK className="mr-1 inline-block h-5 w-5 align-text-bottom" />
              {t('Header.language.options.da')}
            </button>
          </li>
        </ul>
      </MenuButton>
      <MenuButton
        icon={<FaCog className="text-lg" />}
        label={t('Header.settings.label')}
      >
        <div className="mb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-nowrap">{t('Header.settings.hardMode')}</span>
            <label className="inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={hardMode}
                onChange={(e) => handleSwitch('hardMode', e.target.checked)}
                className="sr-only"
              />
              <span
                className={`ml-2 flex h-5 w-10 cursor-pointer items-center rounded-full p-1 transition-colors ${hardMode ? 'bg-green-500 dark:bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
              >
                <span
                  className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${hardMode ? 'translate-x-4 dark:bg-neutral-200' : 'dark:bg-neutral-400'}`}
                ></span>
              </span>
            </label>
          </div>
          <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
            {'> '}
            {t('Header.settings.hardModeDescription')}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-nowrap">
            {t('Header.settings.themeMode.label')}
          </span>
          <div className="flex rounded-lg bg-gray-300 p-1 dark:bg-neutral-700">
            {Object.values(THEME).map((mode) => (
              <button
                key={mode}
                className={`min-w-max flex-1 rounded-lg px-2 py-1 transition-colors sm:min-w-[120px] sm:px-4 sm:py-2 ${
                  theme === mode
                    ? 'bg-white font-bold text-black shadow dark:bg-neutral-800 dark:text-white'
                    : 'bg-transparent text-gray-700 dark:text-neutral-300'
                } `}
                onClick={() => handleThemeChange(mode)}
                aria-pressed={theme === mode}
              >
                <span className="inline-block w-full cursor-pointer text-center">
                  {mode === THEME.LIGHT &&
                    `☀️ ${t('Header.settings.themeMode.light')}`}
                  {mode === THEME.DARK &&
                    `🌙 ${t('Header.settings.themeMode.dark')}`}
                  {mode === THEME.SYSTEM &&
                    `🖥️ ${t('Header.settings.themeMode.system')}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      </MenuButton>
    </div>
  );
};
