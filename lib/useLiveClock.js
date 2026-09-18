'use client';

import { useEffect, useState } from 'react';

export function useLiveClock(refreshKey = 0) {
  const [started, setStarted] = useState(() => Date.now());
  useEffect(() => setStarted(Date.now()), [refreshKey]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.max(0, Math.floor((now - started) / 1000));
  return seconds < 1 ? 'Updated just now' : `Updated ${seconds}s ago`;
}
