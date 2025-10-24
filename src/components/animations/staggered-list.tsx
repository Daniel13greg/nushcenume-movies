"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeInUp, smoothTransition } from "@/lib/animations";

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

/**
 * Container that staggers animation of children
 */
export function StaggeredList({ 
  children, 
  className,
  staggerDelay = 0.1 
}: StaggeredListProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Individual item in a staggered list
 */
export function StaggeredItem({ children, className }: StaggeredItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={smoothTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
