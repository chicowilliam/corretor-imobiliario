"use client";

import { useEffect, useRef } from "react";

/** Separate paint layers keep the exterior button geometry stable. */
export function ActionFrame() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current;
    const button = root?.closest<HTMLElement>("button, a");
    const trace = root?.querySelector<SVGRectElement>("[data-action-trace]");
    if (!root || !button || !trace || !button.matches(".solid-button, .header-contact")) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let active = false;
    let runtime: typeof import("@/lib/gsap-draw") | undefined;
    const paint = (instant: boolean) => {
      if (!runtime) return;
      runtime.gsap.to(trace, { drawSVG: active ? "100%" : "0%", duration: instant || reduced.matches ? 0 : active ? .36 : .18, ease: "power2.out", overwrite: true });
    };
    const show = (instant: boolean) => {
      if (button.matches(":disabled")) return;
      active = true;
      if (runtime) { paint(instant); return; }
      void import("@/lib/gsap-draw").then(module => {
        if (disposed) return;
        runtime = module;
        module.gsap.set(trace, { drawSVG: "0%" });
        root.setAttribute("data-action-ready", "");
        paint(instant);
      }).catch(() => { /* The complete CSS border remains the fallback. */ });
    };
    const enter = (event: PointerEvent) => { if (event.pointerType !== "touch") show(false); };
    const focus = () => show(true);
    const leave = () => { active = button.matches(":focus-visible"); paint(false); };
    const sync = () => paint(true);
    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("focus", focus);
    button.addEventListener("blur", leave);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      runtime?.gsap.killTweensOf(trace);
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("focus", focus);
      button.removeEventListener("blur", leave);
      reduced.removeEventListener("change", sync);
    };
  }, []);
  return <span ref={ref} className="action-frame" aria-hidden="true">
    <span className="action-base" /><span className="action-fill" /><span className="action-shadow" />
    <svg className="action-outline" viewBox="0 0 100 40" preserveAspectRatio="none" focusable="false">
      <rect className="action-track" x=".5" y=".5" width="99" height="39" vectorEffect="non-scaling-stroke" />
      <rect data-action-trace x=".5" y=".5" width="99" height="39" vectorEffect="non-scaling-stroke" />
    </svg>
  </span>;
}
