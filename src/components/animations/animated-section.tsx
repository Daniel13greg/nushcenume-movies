"use client";

import { motion } from "framer-motion";
import { fadeInUp, smoothTransition } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Animated section with fade in up effect
 */
export function AnimatedSection({ 
  children, 
  delay = 0, 
  className 
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      transition={{ ...smoothTransition, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
