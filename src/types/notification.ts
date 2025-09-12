export const NOTIFICATION = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
} as const;

export type NotificationType = (typeof NOTIFICATION)[keyof typeof NOTIFICATION];

export type NotificationOptions = {
  duration?: number;
  type?: NotificationType;
};
