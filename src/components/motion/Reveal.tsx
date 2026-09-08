"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    const title = root?.querySelector<HTMLElement>("h1, h2");
    if (!root || !title) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    let disposed = false;
    let finished = false;
    let observer: IntersectionObserver | undefined;
    let context: ReturnType<typeof import("gsap").gsap.context> | undefined;
    let split: import("gsap/SplitText").SplitText | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      observer?.disconnect();
      context?.revert();
      split?.revert();
      root.dataset.textSequence = "complete";
    };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") finish(); };
    const hidden = () => { if (document.hidden) finish(); };
    preference.addEventListener("change", finish);
    root.addEventListener("focusin", finish);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("resize", finish);
    void Promise.all([import("@/lib/gsap-opening"), document.fonts.ready]).then(([{ gsap, SplitText }]) => {
      if (disposed || finished || preference.matches) return;
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || finished) return;
        observer?.disconnect();
        // Split only the visible title; no hidden content waiting below the viewport.
        context = gsap.context(() => {
          split = SplitText.create(title, { type: "lines", mask: "lines", aria: "auto", linesClass: "section-split-line" });
          const support = root.querySelectorAll("p:not(.property-price)");
          const actions = root.querySelectorAll(".text-link, .solid-button");
          root.dataset.textSequence = "title";
          gsap.timeline({ onComplete: finish })
            .fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: .55, stagger: .085, ease: "power3.out" })
            .call(() => { root.dataset.textSequence = "support"; })
            .fromTo(support, { opacity: .15, y: 6 }, { opacity: 1, y: 0, duration: .24, stagger: .035, clearProps: "transform,opacity" }, "+=.03")
            .call(() => { root.dataset.textSequence = "action"; })
            .fromTo(actions, { opacity: .15 }, { opacity: 1, duration: .2, clearProps: "opacity" }, "+=.02");
        }, root);
        watchdog = setTimeout(finish, 2200);
      }, { threshold: .12 });
      observer.observe(title);
    }).catch(finish);
    return () => {
      disposed = true;
      finish();
      preference.removeEventListener("change", finish);
      root.removeEventListener("focusin", finish);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("resize", finish);
    };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
