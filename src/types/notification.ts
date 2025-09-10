export const NOTIFICATION = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export type NotificationType = (typeof NOTIFICATION)[keyof typeof NOTIFICATION];

export type NotificationOptions = {
  duration?: number;
  type?: NotificationType;
};
