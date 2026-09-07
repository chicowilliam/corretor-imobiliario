"use client";

import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { stagger, useAnimate } from "motion/react";

export function HeroMotion({ children }: { children: ReactNode }) {
  const [scope, animate] = useAnimate<HTMLElement>();

  useLayoutEffect(() => {
    const root = scope.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // HTML is readable before hydration and without JavaScript.
    if (!root || preference.matches || window.scrollY > root.offsetHeight / 2) return;
    const lines = root.querySelectorAll<HTMLElement>("[data-hero-reveal]");
    const entrance = animate(lines, { transform: ["translateY(115%)", "translateY(0%)"] }, {
      duration: 0.85, delay: stagger(0.085), ease: [0.22, 1, 0.36, 1],
    });
    const clear = () => {
      entrance.stop();
      lines.forEach((line) => line.style.removeProperty("transform"));
    };
    preference.addEventListener("change", clear);
    return () => { preference.removeEventListener("change", clear); clear(); };
  }, [animate, scope]);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("@/lib/scroll-runtime").then(({ gsap }) => {
      if (disposed || !scope.current) return;
      const root = scope.current;
      const media = root.querySelector<HTMLElement>("[data-hero-media]");
      if (!media) return;
      const queries = gsap.matchMedia();
      queries.add({
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 768px)",
      }, (context) => {
        if (!context.conditions?.motion) return;
        gsap.fromTo(media, { y: 0 }, {
          y: context.conditions.desktop ? 60 : 30,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      });
      cleanup = () => queries.revert();
    });
    return () => { disposed = true; cleanup?.(); };
  }, [scope]);

  return <section ref={scope} className="hero on-dark" aria-labelledby="home-title">{children}</section>;
}
