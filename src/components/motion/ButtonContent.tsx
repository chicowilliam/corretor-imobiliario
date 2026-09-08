"use client";

import { ActionFrame } from "./ActionFrame";
import { useEffect, useRef, type ReactNode } from "react";

/** Flip animates the content, leaving the button transform to the magnetic cursor. */
export function ButtonContent({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = ref.current;
    const button = root?.closest<HTMLElement>("button, a");
    if (!root || !button) return;
    const preference = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let disposed = false;
    let requested = false;
    let runtime: typeof import("@/lib/gsap-flip") | undefined;
    let animation: ReturnType<typeof import("gsap/Flip").Flip.from> | undefined;
    const items = root.querySelectorAll<HTMLElement>(":scope > span");
    const reset = () => {
      requested = false;
      animation?.kill();
      root.removeAttribute("data-expanded");
      root.removeAttribute("data-flip-active");
      items.forEach(item => item.removeAttribute("style"));
    };
    const apply = (expanded: boolean) => {
      if (!runtime || !preference.matches || button.matches(":disabled")) { reset(); return; }
      animation?.progress(1);
      const { gsap, Flip } = runtime;
      const state = Flip.getState(items);
      root.toggleAttribute("data-expanded", expanded);
      root.setAttribute("data-flip-active", "");
      animation = Flip.from(state, { duration: .24, scale: true, ease: "power2.out", onComplete: () => {
        root.removeAttribute("data-flip-active");
        gsap.set(items, { clearProps: "transform,width,height" });
      } });
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !preference.matches) return;
      requested = true;
      if (runtime) { apply(true); return; }
      void import("@/lib/gsap-flip").then(module => {
        runtime = module;
        if (!disposed && requested) apply(true);
      }).catch(reset);
    };
    const leave = () => { requested = false; apply(false); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") reset();
    };
    const visibility = () => { if (document.hidden) reset(); };
    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("focus", reset);
    button.addEventListener("click", reset);
    preference.addEventListener("change", reset);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      reset();
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("focus", reset);
      button.removeEventListener("click", reset);
      preference.removeEventListener("change", reset);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return <><ActionFrame /><span ref={ref} className="button-content"><span className="button-label">{children}</span><span className="button-icon" aria-hidden="true">{icon}</span></span></>;
}
