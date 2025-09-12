import { useEffect, useState } from 'react';
import {
  type NotificationOptions,
  type NotificationType,
  NOTIFICATION,
} from '../types/notification';

interface NotificationProps {
  message: string;
  options: NotificationOptions;
}

export const Notification = ({
  message,
  options: { duration = 1500, type = NOTIFICATION.INFO },
}: NotificationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message && !visible) return null;

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NOTIFICATION.ERROR:
        return 'text-red-500';
      case NOTIFICATION.SUCCESS:
        return 'text-green-600';
      case NOTIFICATION.WARNING:
        return 'text-yellow-600';
      default:
        return 'text-black';
    }
  };

  return (
    <div
      className={`fixed top-10 left-1/2 -translate-x-1/2 transform transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}
    >
      <div
        className={`rounded bg-white/80 px-6 py-3 text-center text-xl font-bold shadow-lg ${getNotificationColor(type)}`}
      >
        {message}
      </div>
    </div>
  );
};
