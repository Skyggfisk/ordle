import { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  duration?: number;
  className?: string;
}

export const Notification = ({
  message,
  duration = 1500,
  className,
}: NotificationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  return (
    <div
      className={`fixed top-10 left-1/2 -translate-x-1/2 transform transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}
    >
      <div className={`${className}`}>{message}</div>
    </div>
  );
};
