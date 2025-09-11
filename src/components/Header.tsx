import { useEffect, useRef, useState } from 'react';
import FlagGB from '../icons/flag_gb.svg?react';
import FlagDK from '../icons/flag_dk.svg?react';
import { FaGlobe, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { MenuButton } from './MenuButton';
import { storage } from '../services/storage';

export const Header = () => {
  const { t, i18n } = useTranslation();

  // Refs for menus
  const langMenuRef = useRef<HTMLDivElement>(null);
  const howToMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  // Refs for buttons
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const howToButtonRef = useRef<HTMLButtonElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showLangSelect, setShowLangSelect] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        showLangSelect &&
        langMenuRef.current &&
        langButtonRef.current &&
        !langMenuRef.current.contains(target) &&
        !langButtonRef.current.contains(target)
      ) {
        setShowLangSelect(false);
      }
      if (
        showHowTo &&
        howToMenuRef.current &&
        howToButtonRef.current &&
        !howToMenuRef.current.contains(target) &&
        !howToButtonRef.current.contains(target)
      ) {
        setShowHowTo(false);
      }
      if (
        showSettings &&
        settingsMenuRef.current &&
        settingsButtonRef.current &&
        !settingsMenuRef.current.contains(target) &&
        !settingsButtonRef.current.contains(target)
      ) {
        setShowSettings(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangSelect, showHowTo, showSettings]);

  // Init state
  const [hardMode, setHardMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load config from storage on mount
  useEffect(() => {
    try {
      const config = storage.getConfig();
      setHardMode(config.hardMode);
      setDarkMode(config.darkMode);
    } catch {
      setHardMode(false);
      setDarkMode(false);
    }
    setLoaded(true);
  }, []);

  // Automatically sync state and storage, but only after initial load
  useEffect(() => {
    if (loaded) {
      storage.setConfig({ hardMode, darkMode });
    }
  }, [hardMode, darkMode, loaded]);

  const handleLangChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    setShowLangSelect(false);
  };

  const handleSwitch = (key: 'hardMode' | 'darkMode', value: boolean) => {
    const config = storage.getConfig();
    config[key] = value;
    if (key === 'hardMode') setHardMode(value);
    if (key === 'darkMode') setDarkMode(value);
  };

  return (
    <div className="fixed top-0 right-0 z-50 flex gap-4 p-4">
      <MenuButton
        buttonRef={howToButtonRef}
        menuRef={howToMenuRef}
        showMenu={showHowTo}
        setShowMenu={setShowHowTo}
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
        buttonRef={langButtonRef}
        menuRef={langMenuRef}
        showMenu={showLangSelect}
        setShowMenu={setShowLangSelect}
        icon={<FaGlobe className="text-lg" />}
        label={t('Header.language.label')}
      >
        <ul className="space-y-1">
          <li>
            <button
              className={`w-full rounded px-2 py-1 text-left ${i18n.language === 'en' ? 'bg-purple-100 font-bold' : ''} flex items-center gap-1 hover:bg-purple-200`}
              onClick={() => handleLangChange('en')}
            >
              <FlagGB className="mr-1 inline-block h-5 w-5 align-text-bottom" />
              {t('Header.language.options.en')}
            </button>
          </li>
          <li>
            <button
              className={`w-full rounded px-2 py-1 text-left ${i18n.language === 'da' ? 'bg-purple-100 font-bold' : ''} flex items-center gap-1 hover:bg-purple-200`}
              onClick={() => handleLangChange('da')}
            >
              <FlagDK className="mr-1 inline-block h-5 w-5 align-text-bottom" />
              {t('Header.language.options.da')}
            </button>
          </li>
        </ul>
      </MenuButton>
      <MenuButton
        buttonRef={settingsButtonRef}
        menuRef={settingsMenuRef}
        showMenu={showSettings}
        setShowMenu={setShowSettings}
        icon={<FaCog className="text-lg" />}
        label={t('Header.settings.label')}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-nowrap">{t('Header.settings.hardMode')}</span>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={hardMode}
              onChange={(e) => handleSwitch('hardMode', e.target.checked)}
              className="sr-only"
              disabled
            />
            <span
              className={`ml-2 flex h-5 w-10 items-center rounded-full bg-gray-300 p-1 transition-colors ${hardMode ? 'bg-purple-400' : ''}`}
            >
              <span
                className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${hardMode ? 'translate-x-5' : ''}`}
              ></span>
            </span>
          </label>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-nowrap">{t('Header.settings.darkMode')}</span>
          <label className="inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => handleSwitch('darkMode', e.target.checked)}
              className="sr-only"
              disabled
            />
            <span
              className={`ml-2 flex h-5 w-10 items-center rounded-full bg-gray-300 p-1 transition-colors ${darkMode ? 'bg-purple-400' : ''}`}
            >
              <span
                className={`h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${darkMode ? 'translate-x-5' : ''}`}
              ></span>
            </span>
          </label>
        </div>
      </MenuButton>
    </div>
  );
};
