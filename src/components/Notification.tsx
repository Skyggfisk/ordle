import { useEffect, useState } from 'react';
import { type NotificationOptions, NOTIFICATION } from '../types/notification';

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

  return (
    <div
      className={`fixed top-10 left-1/2 -translate-x-1/2 transform transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}
    >
      <div
        className={`rounded bg-white/80 px-6 py-3 text-center text-xl font-bold shadow-lg ${type === NOTIFICATION.ERROR ? 'text-red-500' : 'text-black'}`}
      >
        {message}
      </div>
    </div>
  );
};
