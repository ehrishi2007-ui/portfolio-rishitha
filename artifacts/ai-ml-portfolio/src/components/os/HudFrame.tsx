import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HudRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function HudFrame({ children, className = '', delay = 0 }: HudRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
