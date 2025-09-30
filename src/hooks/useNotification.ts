import { useContext } from 'react';
import { NotificationContext } from '~/context/NotificationContext';
import type { NotificationOptions } from '~/types/notification';

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  return (message: string, options?: NotificationOptions) =>
    ctx.notify(message, options);
};
