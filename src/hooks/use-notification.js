import { useState, useEffect, useRef } from 'react';
import {
  sendNotification,
  permissionNotificationWindow,
} from '../services/notificationService';

export function useNotification() {
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  const USER_INFO = 'username';
  const NOTIFICATION_PERMISSION_KEY = 'notificationPermissionStatus';

  useEffect(() => {
    const username = localStorage.getItem(USER_INFO);
    if (!username) return;

    let reconnectTimeout = null;

    const connect = () => {
      const currentStatus = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);

      if (!currentStatus) {
        permissionNotificationWindow();
        return;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const es = new EventSource(
        `http://localhost:3001/notification/stream/?clientName=${encodeURIComponent(
          username
        )}`,
        { withCredentials: false }
      );

      es.onopen = () => {
        console.log('SSE 연결 성공');
        setIsConnected(true);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const updatedStatus = localStorage.getItem(
            NOTIFICATION_PERMISSION_KEY
          );
          if (
            updatedStatus === 'granted' &&
            ['analysis_complete', 'analysis_failed', 'analysis_error'].includes(
              data.type
            )
          ) {
            sendNotification(data);
          }
        } catch (error) {
          console.error('알림 파싱 실패:', error);
        }
      };

      es.onerror = (error) => {
        console.warn('SSE 오류 발생:', error);
        setIsConnected(false);
        es.close();
        eventSourceRef.current = null;

        if (!reconnectTimeout) {
          reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            connect(); // 재연결 시도
          }, 3000);
        }
      };

      eventSourceRef.current = es;
    };

    connect(); // 초기 연결

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  return { isConnected };
}
