import { createContext } from 'react';

import type { NotificationOptions } from '@shared-types/notification';

export interface NotificationItem {
  id: number;
  message: string;
  options: NotificationOptions;
}

export interface NotificationContextType {
  notify: (message: string, options?: NotificationOptions) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
