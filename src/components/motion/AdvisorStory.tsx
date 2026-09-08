"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AdvisorStory({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("@/lib/scroll-runtime").then(({ gsap }) => {
      if (disposed || !ref.current) return;
      const root = ref.current;
      const query = gsap.matchMedia();
      query.add("(prefers-reduced-motion: no-preference)", () => {
        const phrases = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".story-phrase"));
        phrases.forEach(phrase => {
          gsap.fromTo(phrase, { y: 18, opacity: .35 }, {
            y: 0, opacity: 1, ease: "sine.out", force3D: true,
            scrollTrigger: {
              trigger: phrase,
              start: "top 85%",
              end: "top 55%",
              scrub: .4,
              // Keep progress work off-screen until the phrase is near the viewport.
              fastScrollEnd: true,
            },
          });
        });
      });
      cleanup = () => query.revert();
    }).catch(() => {});
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return <div ref={ref} className="advisor-story">{children}</div>;
}
