"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { reveal } from "@/lib/motion";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <LazyMotion features={domAnimation} strict><m.div className={className} initial={false} variants={reveal} whileInView={reduced ? undefined : "visible"} viewport={{ once: true, amount: 0.12 }}>{children}</m.div></LazyMotion>;
}
