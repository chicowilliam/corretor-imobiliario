"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function PropertyCardMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const enabled = useRef(false);
  const bounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 230, damping: 28 });
  const rotateY = useSpring(y, { stiffness: 230, damping: 28 });

  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const reset = () => { bounds.current = null; x.set(0); y.set(0); };
    const sync = () => {
      enabled.current = query.matches;
      reset();
      if (!query.matches) { rotateX.jump(0); rotateY.jump(0); }
    };
    sync();
    query.addEventListener("change", sync);
    window.addEventListener("scroll", reset, { passive: true });
    document.addEventListener("visibilitychange", reset);
    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("scroll", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [x, y, rotateX, rotateY]);

  return <article ref={root} className="property-card" onPointerEnter={(event) => {
    if (enabled.current && event.pointerType !== "touch") bounds.current = event.currentTarget.getBoundingClientRect();
  }} onPointerMove={(event) => {
    if (!enabled.current || event.pointerType === "touch") return;
    const box = bounds.current ?? (bounds.current = event.currentTarget.getBoundingClientRect());
    x.set(Math.max(-2, Math.min(2, (0.5 - (event.clientY - box.top) / box.height) * 4)));
    y.set(Math.max(-2, Math.min(2, ((event.clientX - box.left) / box.width - 0.5) * 4)));
  }} onPointerLeave={() => { x.set(0); y.set(0); bounds.current = null; }}>
    <motion.div className="property-card-depth" style={{ rotateX, rotateY }}>{children}</motion.div>
  </article>;
}
