"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function PointerEffects() {
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
    const clearMagnet = () => {
      active.current?.style.removeProperty("transform");
      active.current = null;
      bounds.current = null;
      magnetX.jump(0); magnetY.jump(0); targetX.set(0); targetY.set(0);
    };
    const hide = () => { opacity.set(0); document.documentElement.removeAttribute("data-custom-cursor"); clearMagnet(); };
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
    const exit = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    preference.addEventListener("change", hide);
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", exit);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("scroll", clearMagnet, { passive: true });
    window.addEventListener("blur", hide);
    return () => {
      hide(); unsubscribeX(); unsubscribeY();
      preference.removeEventListener("change", hide);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", exit);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("scroll", clearMagnet);
      window.removeEventListener("blur", hide);
    };
  }, [x, y, opacity, scale, targetX, targetY, magnetX, magnetY]);

  return <motion.div className="site-cursor" aria-hidden="true" style={{ x, y, opacity }}>
    <motion.span className="cursor-ring" style={{ scale }} /><span className="cursor-dot" />
  </motion.div>;
}
