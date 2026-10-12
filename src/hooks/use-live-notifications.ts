'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getValidAccessToken } from '@/lib/api-client';
import { WS_URL } from '@/lib/constants';
import type { Notification } from '@/types/api';

/**
 * Real-time updates: connects to the API's WebSocket, and when a notification arrives it shows a toast,
 * refreshes the bell and re-renders the current Server Component page so lists and statuses update
 * without a reload. If the API host can't hold WebSockets (e.g. serverless), it quietly gives up and
 * the bell's 30-second polling keeps working.
 */
export function useLiveNotifications() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const attempts = useRef(0);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let closed = false;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;

    async function connect() {
      const token = await getValidAccessToken();
      if (!token || closed) return;
      try {
        socket = new WebSocket(`${WS_URL}/ws?token=${encodeURIComponent(token)}`);
      } catch {
        return;
      }
      socket.onopen = () => { attempts.current = 0; setConnected(true); };
      socket.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as { type: string; payload: Notification };
          if (msg.type !== 'notification') return;
          toast(msg.payload.title, { description: msg.payload.message });
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => router.refresh(), 400); // coalesce bursts into one refresh
        } catch {
          // ignore malformed frames
        }
      };
      socket.onclose = () => {
        setConnected(false);
        if (closed || attempts.current >= 4) return;
        attempts.current += 1;
        timer = setTimeout(connect, Math.min(1000 * 2 ** attempts.current, 15000));
      };
      socket.onerror = () => socket?.close();
    }

    connect();
    return () => { closed = true; clearTimeout(timer); clearTimeout(refreshTimer); socket?.close(); };
  }, [queryClient, router]);

  return connected;
}
