"use client";

import { useEffect, useRef } from "react";
import { m as motion, useMotionValue, useSpring } from "motion/react";
import { subscribeMotionEvent } from "@/lib/motion-events";

export function PointerEffects() {
  const label = useRef<HTMLSpanElement>(null);
  const active = useRef<HTMLElement | null>(null);
  const bounds = useRef<DOMRect | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const magnetX = useSpring(targetX, { stiffness: 250, damping: 25 });
  const magnetY = useSpring(targetY, { stiffness: 250, damping: 25 });

  useEffect(() => {
    const preference = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let pointerFrame = 0;
    let pendingPointer: PointerEvent | null = null;
    const clearMagnet = () => {
      if (!active.current && targetX.get() === 0 && targetY.get() === 0) return;
      active.current?.style.removeProperty("transform");
      active.current = null;
      bounds.current = null;
      magnetX.jump(0); magnetY.jump(0); targetX.set(0); targetY.set(0);
    };
    const hide = () => { cancelAnimationFrame(pointerFrame); pointerFrame = 0; pendingPointer = null; opacity.set(0); document.documentElement.removeAttribute("data-custom-cursor"); clearMagnet(); };
    const drawMagnet = () => {
      if (active.current) active.current.style.transform = `translate3d(${magnetX.get()}px, ${magnetY.get()}px, 0)`;
    };
    const unsubscribeX = magnetX.on("change", drawMagnet);
    const unsubscribeY = magnetY.on("change", drawMagnet);
    const move = (event: PointerEvent) => {
      if (!preference.matches || event.pointerType === "touch") { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest("input, textarea, select, [contenteditable], dialog")) { hide(); return; }
      x.set(event.clientX); y.set(event.clientY); opacity.set(1);
      if (!document.documentElement.hasAttribute("data-custom-cursor")) document.documentElement.setAttribute("data-custom-cursor", "true");
      scale.set(target.closest("a, button") ? 1.65 : 1);
      const context = target.closest(".property-card") ? "EXPLORAR ↗" : target.closest("a, button") ? "→" : target.closest("img, .advisor-photo, .feature-photo, .owner-art") ? "VER" : "";
      if (label.current && label.current.textContent !== context) label.current.textContent = context;
      // Preserve the already validated header/hero interactions.
      const button = target.closest<HTMLElement>(".solid-button");
      const candidate = button && !button.closest(".site-header, .hero") && !button.matches(":disabled") ? button : null;
      if (candidate !== active.current) {
        if (candidate) { clearMagnet(); active.current = candidate; bounds.current = candidate.getBoundingClientRect(); }
        else { targetX.set(0); targetY.set(0); }
      }
      if (!candidate || !bounds.current) return;
      const box = bounds.current;
      targetX.set(Math.max(-6, Math.min(6, (event.clientX - box.left - box.width / 2) * 0.08)));
      targetY.set(Math.max(-4, Math.min(4, (event.clientY - box.top - box.height / 2) * 0.12)));
    };
    const keyboard = () => hide();
    const queueMove = (event: PointerEvent) => {
      pendingPointer = event;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const latest = pendingPointer;
        pendingPointer = null;
        if (latest) move(latest);
      });
    };
    const syncPointer = () => {
      document.removeEventListener("pointermove", queueMove);
      if (preference.matches) document.addEventListener("pointermove", queueMove, { passive: true });
      else hide();
    };
    const exit = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    preference.addEventListener("change", syncPointer);
    syncPointer();
    document.addEventListener("pointerout", exit);
    const stops = [subscribeMotionEvent("keydown", keyboard), subscribeMotionEvent("visibilitychange", hide), subscribeMotionEvent("scroll", clearMagnet)];
    window.addEventListener("blur", hide);
    return () => {
      hide(); unsubscribeX(); unsubscribeY();
      preference.removeEventListener("change", syncPointer);
      document.removeEventListener("pointermove", queueMove);
      document.removeEventListener("pointerout", exit);
      stops.forEach(stop => stop());
      window.removeEventListener("blur", hide);
    };
  }, [x, y, opacity, scale, targetX, targetY, magnetX, magnetY]);

  return <motion.div className="site-cursor" aria-hidden="true" style={{ x, y, opacity }}>
    <motion.span className="cursor-ring" style={{ scale }} /><span className="cursor-dot" /><span ref={label} className="cursor-context" />
  </motion.div>;
}
