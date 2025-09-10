import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { I18nProvider } from './i18n/i18nProvider.tsx';
import { NotificationProvider } from './context/NotificationProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </I18nProvider>
  </StrictMode>
);
