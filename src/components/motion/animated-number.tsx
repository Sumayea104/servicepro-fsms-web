'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';

/** Counts up from 0 when scrolled into view. Respects reduced-motion by showing the final value. */
export function AnimatedNumber({ value, currency, decimals = 0, duration = 1.2 }: { value: number; currency?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDisplay(value); return; }
    const controls = animate(0, value, { duration, ease: 'easeOut', onUpdate: (v) => setDisplay(v) });
    return () => controls.stop();
  }, [inView, value, duration]);

  const shown = inView ? display : 0;
  return <span ref={ref}>{currency ? formatCurrency(shown, currency) : shown.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}
