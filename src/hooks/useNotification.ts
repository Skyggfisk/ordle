import { useContext } from 'react';

import type { NotificationOptions } from '@shared-types/notification';
import { NotificationContext } from '~/context/NotificationContext';

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  return (message: string, options?: NotificationOptions) =>
    ctx.notify(message, options);
};
