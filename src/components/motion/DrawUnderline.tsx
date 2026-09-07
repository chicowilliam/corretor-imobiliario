"use client";

import { useEffect, useRef } from "react";

/** React owns the SVG. CSS remains the fallback for failed or disabled scripts. */
export function DrawUnderline() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    const path = svg?.querySelector("path");
    const trigger = svg?.closest<HTMLElement>("a, button");
    if (!svg || !path || !trigger) return;
    const preference = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let disposed = false;
    let draw: ((show: boolean, instant?: boolean) => void) | undefined;
    let stop: (() => void) | undefined;
    const reset = () => { stop?.(); trigger.removeAttribute("data-draw-enhanced"); };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !preference.matches) return;
      if (draw) { draw(true); return; }
      void import("@/lib/gsap-draw").then(({ gsap }) => {
        if (disposed || !preference.matches) return;
        stop = () => gsap.killTweensOf(path);
        gsap.set(path, { drawSVG: "0%" });
        draw = (show, instant = false) => {
          trigger.setAttribute("data-draw-enhanced", "");
          gsap.to(path, { drawSVG: show ? "100%" : "0%", duration: instant ? 0 : show ? .32 : .18, ease: "power2.out", overwrite: true });
        };
        draw(trigger.matches(":hover"));
      }).catch(reset);
    };
    const leave = () => draw?.(false);
    // A keyboard focus gets immediate, visible feedback from the CSS fallback.
    const focus = () => reset();
    trigger.addEventListener("pointerenter", enter);
    trigger.addEventListener("pointerleave", leave);
    trigger.addEventListener("focus", focus);
    preference.addEventListener("change", reset);
    return () => {
      disposed = true;
      reset();
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      trigger.removeEventListener("focus", focus);
      preference.removeEventListener("change", reset);
    };
  }, []);
  return <svg ref={ref} className="draw-underline" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 1H100" vectorEffect="non-scaling-stroke" /></svg>;
}
