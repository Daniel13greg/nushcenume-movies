"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPresenceWrapperProps {
  children: ReactNode;
  show: boolean;
  className?: string;
}

/**
 * Wrapper for conditional rendering with animations
 */
export function AnimatedPresenceWrapper({ 
  children, 
  show, 
  className 
}: AnimatedPresenceWrapperProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
