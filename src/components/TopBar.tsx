import { useEffect, useRef, useState } from 'react';
import { FaGlobe, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export function TopBar() {
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

  // Init state for SSR
  const [hardMode, setHardMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    try {
      const config = JSON.parse(localStorage.getItem('config') || '{}');
      setHardMode(!!config.hardMode);
      setDarkMode(!!config.darkMode);
    } catch {
      setHardMode(false);
      setDarkMode(false);
    }
    setLoaded(true);
  }, []);

  // Automatically sync state and localStorage, but only after initial load
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('config', JSON.stringify({ hardMode, darkMode }));
    }
  }, [hardMode, darkMode, loaded]);

  const handleLangChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    setShowLangSelect(false);
  };

  const handleSwitch = (key: 'hardMode' | 'darkMode', value: boolean) => {
    const config = JSON.parse(localStorage.getItem('config') || '{}') || {};
    config[key] = value;
    if (key === 'hardMode') setHardMode(value);
    if (key === 'darkMode') setDarkMode(value);
  };

  return (
    <div className="fixed top-0 right-0 z-50 flex gap-4 p-4">
      <div className="relative">
        <button
          ref={howToButtonRef}
          className={`flex items-center overflow-hidden rounded-full px-3 py-2 text-white transition-all duration-200 hover:[&>span:last-of-type]:ml-2 hover:[&>span:last-of-type]:max-w-[200px] ${showHowTo ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20 hover:[&>span:last-of-type]:opacity-100`}
          aria-label={t('TopBar.howToPlay.label')}
          onClick={() => setShowHowTo((v) => !v)}
        >
          <span className="flex items-center">
            <FaQuestionCircle className="text-lg" />
          </span>
          <span
            className={`${showHowTo ? 'ml-2 max-w-[200px] opacity-100' : 'max-w-0 opacity-0'} text-nowrap transition-all duration-200 sm:inline-block`}
          >
            {t('TopBar.howToPlay.label')}
          </span>
        </button>
        {showHowTo && (
          <div
            ref={howToMenuRef}
            className="absolute right-[-50%] z-50 mt-2 w-80 rounded bg-white/50 px-4 py-3 text-sm text-black shadow-lg sm:right-0"
          >
            <div className="mb-2 text-lg font-bold">
              {t('TopBar.howToPlay.label')}
            </div>
            <ul className="mb-2 list-disc pl-5">
              <li>{t('TopBar.howToPlay.instructions.0')}</li>
              <li>{t('TopBar.howToPlay.instructions.1')}</li>
              <li>{t('TopBar.howToPlay.instructions.2')}</li>
            </ul>
            <div className="mb-1 font-bold">
              {t('TopBar.howToPlay.legend.legendTitle')}:
            </div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-5 w-5 rounded border border-gray-300 bg-green-600"></span>
              <span>{t('TopBar.howToPlay.legend.correct')}</span>
            </div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-5 w-5 rounded border border-gray-300 bg-yellow-400"></span>
              <span>{t('TopBar.howToPlay.legend.present')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-5 w-5 rounded border border-gray-300 bg-gray-600"></span>
              <span>{t('TopBar.howToPlay.legend.absent')}</span>
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          ref={langButtonRef}
          className={`flex items-center overflow-hidden rounded-full px-3 py-2 text-white transition-all duration-200 hover:[&>span:last-of-type]:ml-2 hover:[&>span:last-of-type]:max-w-[200px] ${showLangSelect ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20 hover:[&>span:last-of-type]:opacity-100`}
          aria-label={t('TopBar.language.label')}
          onClick={() => setShowLangSelect((v) => !v)}
        >
          <span className="flex items-center">
            <FaGlobe className="text-lg" />
          </span>
          <span
            className={`${showLangSelect ? 'ml-2 max-w-[200px] opacity-100' : 'max-w-0 opacity-0'} transition-all duration-200 sm:inline-block`}
          >
            {t('TopBar.language.label')}
          </span>
        </button>
        {showLangSelect && (
          <div
            ref={langMenuRef}
            className="absolute right-0 mt-2 rounded bg-white/50 px-3 py-2 text-black shadow-lg"
            style={{ minWidth: 120 }}
          >
            <ul>
              <li>
                <button
                  className={`w-full rounded px-2 py-1 text-left ${i18n.language === 'en' ? 'bg-purple-100 font-bold' : ''} hover:bg-purple-200`}
                  onClick={() => handleLangChange('en')}
                >
                  {t('TopBar.language.options.en')}
                </button>
              </li>
              <li>
                <button
                  className={`w-full rounded px-2 py-1 text-left ${i18n.language === 'da' ? 'bg-purple-100 font-bold' : ''} hover:bg-purple-200`}
                  onClick={() => handleLangChange('da')}
                >
                  {t('TopBar.language.options.da')}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="relative">
        <button
          ref={settingsButtonRef}
          className={`flex items-center overflow-hidden rounded-full px-3 py-2 text-white transition-all duration-200 hover:[&>span:last-of-type]:ml-2 hover:[&>span:last-of-type]:max-w-[200px] ${showSettings ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/20 hover:[&>span:last-of-type]:opacity-100`}
          aria-label={t('TopBar.settings.label')}
          onClick={() => setShowSettings((v) => !v)}
        >
          <span className="flex items-center">
            <FaCog className="text-lg" />
          </span>
          <span
            className={`${showSettings ? 'ml-2 max-w-[200px] opacity-100' : 'max-w-0 opacity-0'} transition-all duration-200 sm:inline-block`}
          >
            {t('TopBar.settings.label')}
          </span>
        </button>
        {showSettings && (
          <div
            ref={settingsMenuRef}
            className="absolute right-0 z-50 mt-2 w-56 rounded bg-white/50 px-4 py-3 text-sm text-black shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
              <span>{t('TopBar.settings.hardMode')}</span>
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
            <div className="flex items-center justify-between">
              <span>{t('TopBar.settings.darkMode')}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
