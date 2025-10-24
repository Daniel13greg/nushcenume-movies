"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { fadeIn, smoothTransition } from "@/lib/animations";

/**
 * Wrapper component for page-level animations
 */
export function AnimatedPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        transition={smoothTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
