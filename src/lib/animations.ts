/**
 * Animation configurations for consistent animations throughout the site
 */

// Basic entrance animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const slideInFromBottom = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { opacity: 0, scale: 0.3 },
};

// Advanced entrance animations
export const fadeInUpWithBlur = {
  initial: { opacity: 0, y: 30, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, filter: "blur(10px)" },
};

export const slideInWithRotate = {
  initial: { opacity: 0, x: -50, rotate: -10 },
  animate: { opacity: 1, x: 0, rotate: 0 },
  exit: { opacity: 0, x: 50, rotate: 10 },
};

export const expandIn = {
  initial: { opacity: 0, scaleX: 0, transformOrigin: "left" },
  animate: { opacity: 1, scaleX: 1 },
  exit: { opacity: 0, scaleX: 0 },
};

export const popIn = {
  initial: { opacity: 0, scale: 0.5, rotate: -5 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  exit: { opacity: 0, scale: 0.5, rotate: 5 },
};

export const floatIn = {
  initial: { opacity: 0, y: 100, scale: 0.8 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  },
  exit: { opacity: 0, y: -100, scale: 0.8 },
};

// Transition configurations
export const smoothTransition = {
  duration: 0.4,
  ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smoother easing
};

export const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 26,
};

export const bouncySpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};

export const slowTransition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

export const fastTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const smoothEaseOut = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1], // Enhanced easeOut curve
};

// Stagger configurations for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerFastContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerSlowContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
};

export const hoverScaleBig = {
  scale: 1.1,
  transition: { type: "spring" as const, stiffness: 260, damping: 20 },
};

export const hoverLift = {
  y: -5,
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
};

export const hoverLiftBig = {
  y: -10,
  transition: { type: "spring" as const, stiffness: 260, damping: 20 },
};

export const hoverGlow = {
  boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
  transition: smoothTransition,
};

export const hoverGlowPrimary = {
  boxShadow: "0 0 30px rgba(var(--primary), 0.5)",
  transition: smoothTransition,
};

export const hoverRotate = {
  rotate: 5,
  scale: 1.05,
  transition: smoothTransition,
};

export const hoverShake = {
  x: [0, -2, 2, -2, 2, 0],
  transition: { duration: 0.4 },
};

// Tap animations
export const tapScale = {
  scale: 0.95,
};

export const tapShrink = {
  scale: 0.9,
};

export const tapRotate = {
  scale: 0.95,
  rotate: -2,
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: smoothTransition,
};

export const pageFadeTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: fastTransition,
};

export const pageSlideUpTransition = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: smoothEaseOut,
};

// Scroll reveal animations
export const scrollReveal = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: smoothTransition,
};

export const scrollRevealLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: smoothTransition,
};

export const scrollRevealRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: smoothTransition,
};

export const scrollRevealScale = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: bouncySpring,
};
