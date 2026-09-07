"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

export function HeroOpening({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const overlay = ref.current;
    const root = overlay?.closest<HTMLElement>(".hero");
    if (!overlay || !root) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    const headline = root.querySelector<HTMLElement>("#home-title");
    const support = root.querySelector<HTMLElement>(".hero-copy");
    const cta = root.querySelector<HTMLElement>(".hero-cta-mask");
    const label = root.querySelector<HTMLElement>(".hero-eyebrow");
    const focus = root.querySelector<HTMLElement>(".hero-focus-layer");
    if (!headline || !support || !cta || !focus) return;
    // Deep links, restored scroll, data saving and keyboard users never wait.
    if (preference.matches || connection.connection?.saveData || location.hash || scrollY > 80) return;

    let disposed = false;
    let finished = false;
    let context: ReturnType<typeof import("gsap").gsap.context> | undefined;
    let split: import("gsap/SplitText").SplitText | undefined;
    let waiting: ReturnType<typeof setTimeout> | undefined;
    let waitCleanup: (() => void) | undefined;
    const finalState = (phase = "complete") => {
      if (finished) return;
      finished = true;
      clearTimeout(watchdog);
      clearTimeout(waiting);
      waitCleanup?.();
      context?.revert();
      split?.revert();
      root.removeAttribute("data-opening");
      root.dataset.openingPhase = phase;
      [headline, support, cta, label, focus, overlay].forEach(el => {
        ["opacity", "visibility", "filter", "transform", "will-change"].forEach(prop => el?.style.removeProperty(prop));
      });
    };
    const skip = () => finalState("skipped");
    const scroll = () => { if (scrollY > 80) skip(); };
    const key = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") skip(); };
    const hidden = () => { if (document.hidden) skip(); };
    root.setAttribute("data-opening", "");
    root.dataset.openingPhase = "preparing";
    preference.addEventListener("change", skip);
    root.addEventListener("focusin", skip);
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", skip, { passive: true });
    // Failed chunks/fonts/media cannot strand text behind a loader.
    const watchdog = setTimeout(() => finalState("fallback"), 5500);

    void Promise.all([import("@/lib/gsap-opening"), document.fonts.ready]).then(([{ gsap, SplitText }]) => {
      if (disposed || finished || preference.matches) return;
      context = gsap.context(() => {
        split = SplitText.create(headline, { type: "lines", mask: "lines", linesClass: "hero-split-line", aria: "auto" });
        gsap.set([headline, support, cta, label], { autoAlpha: 0 });
        gsap.set(focus, { filter: "blur(6px)" });
        const paths = overlay.querySelectorAll("path");
        gsap.set(paths, { drawSVG: "0%", fillOpacity: 0 });
        root.dataset.openingPhase = "drawing";
        const timeline = gsap.timeline({ onComplete: () => finalState() });
        timeline.to(paths, { drawSVG: "100%", duration: .92, stagger: .025, ease: "power1.inOut" }, 0)
          .to(paths, { fillOpacity: .94, duration: .22 }, .96)
          .addPause(1.2, () => {
            const video = root.querySelector("video");
            const poster = root.querySelector<HTMLImageElement>(".hero-poster");
            const candidate = video?.getAttribute("src") && !video.error ? video : poster;
            const ready = !candidate || (candidate instanceof HTMLVideoElement ? candidate.readyState >= 2 : candidate.complete);
            const resume = () => {
              clearTimeout(waiting);
              waitCleanup?.();
              if (!finished && !disposed) timeline.resume();
            };
            if (ready) { resume(); return; }
            candidate.addEventListener("loadeddata", resume, { once: true });
            candidate.addEventListener("load", resume, { once: true });
            candidate.addEventListener("error", resume, { once: true });
            waitCleanup = () => {
              candidate.removeEventListener("loadeddata", resume);
              candidate.removeEventListener("load", resume);
              candidate.removeEventListener("error", resume);
            };
            waiting = setTimeout(resume, 800);
          })
          .call(() => { root.dataset.openingPhase = "focus"; })
          .to(overlay, { opacity: 0, duration: .48, ease: "power2.inOut" }, 1.2)
          .to(focus, { filter: "blur(0px)", duration: .6, ease: "power2.out" }, 1.2)
          .call(() => { root.dataset.openingPhase = "headline"; }, [], 1.85)
          .set(headline, { autoAlpha: 1 }, 1.85)
          .fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: .65, stagger: .12, ease: "power3.out" }, 1.85)
          .call(() => { root.dataset.openingPhase = "support"; })
          .fromTo([label, support], { y: 8 }, { autoAlpha: 1, y: 0, duration: .3, stagger: .06 }, "+=.1")
          .call(() => { root.dataset.openingPhase = "cta"; })
          .fromTo(cta, { y: 8 }, { autoAlpha: 1, y: 0, duration: .25 }, "+=.1");
      }, root);
    }).catch(() => finalState("fallback"));

    return () => {
      disposed = true;
      finalState("unmounted");
      preference.removeEventListener("change", skip);
      root.removeEventListener("focusin", skip);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", skip);
    };
  }, []);

  return <div ref={ref} className="hero-opening" aria-hidden="true">
    {children}
    <span className="hero-opening-caption">Curadoria imobiliária</span>
  </div>;
}
