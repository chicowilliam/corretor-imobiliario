import type { Variants } from "motion/react";

export const reveal: Variants = {
  visible: { opacity: [0.8, 1], y: [12, 0], transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
