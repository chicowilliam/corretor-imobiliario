"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("@/lib/scroll-runtime").then(({ gsap }) => {
      if (disposed || !scope.current) return;
      const root = scope.current;
      const media = root.querySelector<HTMLElement>("[data-hero-media]");
      const pointer = root.querySelector<HTMLElement>(".hero-pointer-layer");
      if (!media || !pointer) return;
      const queries = gsap.matchMedia();
      queries.add({
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
        fine: "(hover: hover) and (pointer: fine)",
      }, (context) => {
        if (!context.conditions?.motion) return;
        const exit = root.querySelector<HTMLElement>(".hero-exit-veil");
        const edge = root.parentElement?.nextElementSibling?.querySelector<HTMLElement>(".hero-exit-edge");
        if (exit) gsap.fromTo(exit, { opacity: 0 }, {
          opacity: 1, ease: "sine.inOut",
          scrollTrigger: { trigger: root.parentElement, start: "top top", end: () => `+=${window.innerHeight}`, scrub: .6, invalidateOnRefresh: true },
        });
        if (edge) gsap.fromTo(edge, { opacity: 0 }, {
          opacity: 1, ease: "sine.out",
          scrollTrigger: { trigger: root.parentElement, start: "top top", end: () => `+=${window.innerHeight * .35}`, scrub: .6, invalidateOnRefresh: true },
        });
        // Scroll and pointer own different elements; Lenis keeps its single ticker.
        gsap.fromTo(media, { y: 0 }, {
          y: context.conditions.desktop ? 60 : 30, ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
        if (!context.conditions.fine) return;
        const x = gsap.quickTo(pointer, "x", { duration: .65, ease: "power3.out" });
        const y = gsap.quickTo(pointer, "y", { duration: .65, ease: "power3.out" });
        const reset = () => { x(0); y(0); };
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch" || root.hasAttribute("data-opening") || document.hidden) return;
          const rect = root.getBoundingClientRect();
          x(Math.max(-6, Math.min(6, (.5 - (event.clientX - rect.left) / rect.width) * 12)));
          y(Math.max(-4, Math.min(4, (.5 - (event.clientY - rect.top) / rect.height) * 8)));
        };
        root.addEventListener("pointermove", move, { passive: true });
        root.addEventListener("pointerleave", reset);
        window.addEventListener("blur", reset);
        document.addEventListener("visibilitychange", reset);
        return () => {
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", reset);
          window.removeEventListener("blur", reset);
          document.removeEventListener("visibilitychange", reset);
        };
      });
      cleanup = () => queries.revert();
    }).catch(() => { /* Static media and native scroll remain usable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <section ref={scope} className="hero on-dark" aria-labelledby="home-title">{children}</section>;
}
