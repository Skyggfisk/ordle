import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { NotificationContext } from './NotificationContext';
import type { NotificationItem } from './NotificationContext';
import { Notification } from '../components/Notification';
import { NOTIFICATION, type NotificationOptions } from '../types/notification';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<NotificationItem[]>([]);
  const nextId = useRef(1);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const showNext = useCallback(() => {
    setQueue((q) => (q.length > 0 ? q.slice(1) : q));
  }, []);

  const notify = useCallback(
    (message: string, options?: NotificationOptions) => {
      setQueue((q) => [
        ...q,
        {
          id: nextId.current++,
          message,
          options: {
            duration: options?.duration,
            type: options?.type || NOTIFICATION.INFO,
          },
        },
      ]);
    },
    []
  );

  useEffect(() => {
    if (queue.length === 0) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      showNext();
    }, queue[0].options.duration ?? 1500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [queue, showNext]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {queue.length > 0 && (
        <Notification
          message={queue[0].message}
          options={{
            duration: queue[0].options.duration,
            type: queue[0].options.type,
          }}
        />
      )}
    </NotificationContext.Provider>
  );
};
