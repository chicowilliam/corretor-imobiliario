"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { m as motion, useMotionValue, useSpring } from "motion/react";
import { subscribeMotionEvent } from "@/lib/motion-events";

export function PropertyCardMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const enabled = useRef(false);
  const bounds = useRef<DOMRect | null>(null);
  const hovering = useRef(false);
  const moveFrame = useRef(0);
  const pendingPoint = useRef<{ x: number; y: number } | null>(null);
  const stopScroll = useRef<(() => void) | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 230, damping: 28 });
  const rotateY = useSpring(y, { stiffness: 230, damping: 28 });

  useEffect(() => {
    const card = root.current;
    if (!card) return;
    const preference = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const details = card.querySelectorAll<HTMLElement>(".property-facts > div, .property-price, .property-reference");
    let disposed = false;
    let hovered = false;
    let gsap: typeof import("gsap").gsap | undefined;
    const clear = () => {
      hovered = false;
      gsap?.killTweensOf(details);
      details.forEach(el => { el.style.removeProperty("transform"); el.style.removeProperty("opacity"); });
    };
    const enter = (event: PointerEvent) => {
      if (!preference.matches || event.pointerType === "touch") return;
      hovered = true;
      void import("gsap").then(runtime => {
        gsap = runtime.gsap;
        if (disposed || !hovered || !preference.matches) return;
        gsap.fromTo(details, { y: 6, opacity: .45 }, {
          y: 0, opacity: 1, duration: .24, delay: .06, stagger: .045,
          ease: "power2.out", overwrite: true, force3D: true, clearProps: "transform,opacity",
        });
      }).catch(clear);
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", clear);
    card.addEventListener("focusin", clear);
    preference.addEventListener("change", clear);
    return () => {
      disposed = true;
      clear();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", clear);
      card.removeEventListener("focusin", clear);
      preference.removeEventListener("change", clear);
    };
  }, []);

  useEffect(() => {
    const query = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const reset = () => {
      if (!bounds.current && x.get() === 0 && y.get() === 0) return;
      bounds.current = null; x.set(0); y.set(0);
    };
    const detachScroll = () => {
      stopScroll.current?.();
      stopScroll.current = null;
    };
    const sync = () => {
      enabled.current = query.matches;
      reset();
      detachScroll();
      if (!query.matches) { rotateX.jump(0); rotateY.jump(0); }
    };
    sync();
    query.addEventListener("change", sync);
    const stopVisibility = subscribeMotionEvent("visibilitychange", () => {
      reset();
      hovering.current = false;
      detachScroll();
    });
    return () => {
      cancelAnimationFrame(moveFrame.current);
      query.removeEventListener("change", sync);
      detachScroll();
      stopVisibility();
    };
  }, [x, y, rotateX, rotateY]);

  const attachScrollReset = () => {
    if (stopScroll.current) return;
    stopScroll.current = subscribeMotionEvent("scroll", () => {
      if (!bounds.current && x.get() === 0 && y.get() === 0) return;
      bounds.current = null; x.set(0); y.set(0);
    });
  };

  return <article ref={root} className="property-card" onPointerEnter={(event) => {
    if (!enabled.current || event.pointerType === "touch") return;
    hovering.current = true;
    bounds.current = event.currentTarget.getBoundingClientRect();
    attachScrollReset();
  }} onPointerMove={(event) => {
    if (!enabled.current || event.pointerType === "touch") return;
    pendingPoint.current = { x: event.clientX, y: event.clientY };
    if (moveFrame.current) return;
    moveFrame.current = requestAnimationFrame(() => {
      moveFrame.current = 0;
      const point = pendingPoint.current;
      pendingPoint.current = null;
      const card = root.current;
      if (!point || !card || !enabled.current) return;
      const box = bounds.current ?? (bounds.current = card.getBoundingClientRect());
      x.set(Math.max(-2, Math.min(2, (0.5 - (point.y - box.top) / box.height) * 4)));
      y.set(Math.max(-2, Math.min(2, ((point.x - box.left) / box.width - 0.5) * 4)));
    });
  }} onPointerLeave={() => {
    hovering.current = false;
    cancelAnimationFrame(moveFrame.current);
    moveFrame.current = 0;
    pendingPoint.current = null;
    x.set(0); y.set(0); bounds.current = null;
    stopScroll.current?.();
    stopScroll.current = null;
  }}>
    <motion.div className="property-card-depth" style={{ rotateX, rotateY, transformPerspective: 1200 }}>{children}</motion.div>
  </article>;
}
