'use client';

import { motion } from 'framer-motion';

/** Used from `template.tsx` files, which re-mount on every navigation — so each page change animates in. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
