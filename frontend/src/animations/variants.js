/* ─────────────────────────────────────────
   animations/variants.js
   Shared Framer Motion variants for UnityNet.
   Matches the cubic-bezier(.16,1,.3,1) system
   used throughout the landing page.
───────────────────────────────────────── */

export const EASE = [0.16, 1, 0.3, 1];
export const SPRING = { type: "spring", stiffness: 340, damping: 28 };
export const SPRING_SLOW = { type: "spring", stiffness: 200, damping: 24 };

/* Fade up — standard scroll/mount reveal */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.72, ease: EASE },
  },
};

/* Fade in — pure opacity, no movement */
export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* Slide up — tighter travel for small elements */
export const slideUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.48, ease: EASE },
  },
};

/* Slide in from left */
export const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

/* Slide in from right */
export const slideRight = {
  hidden: { opacity: 0, x: 32 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

/* Scale in — for modals, cards popping in */
export const softScale = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1, scale: 1,
    transition: { duration: 0.45, ease: EASE },
  },
};

/* Stagger container — applies stagger to children */
export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/* Stagger container — faster, for dense grids */
export const staggerFast = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.0,
    },
  },
};

/* Floating blob — for left panel decorative elements */
export const floatA = {
  animate: {
    y: [0, -12, 0],
    rotate: [0, 1.5, 0],
    transition: { duration: 6, ease: "easeInOut", repeat: Infinity },
  },
};

export const floatB = {
  animate: {
    y: [0, -9, 0],
    rotate: [0, -1.2, 0],
    transition: { duration: 8, ease: "easeInOut", repeat: Infinity, delay: 1 },
  },
};

export const floatC = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5.5, ease: "easeInOut", repeat: Infinity, delay: 0.6 },
  },
};

/* Page transition wrapper */
export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
  exit: {
    opacity: 0, y: -10,
    transition: { duration: 0.28, ease: "easeIn" },
  },
};

/* Gradient text pulse — for headings */
export const gradientPulse = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: { duration: 5, ease: "easeInOut", repeat: Infinity },
  },
};
