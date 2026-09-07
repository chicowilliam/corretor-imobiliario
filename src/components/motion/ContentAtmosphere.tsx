"use client";

import { useEffect, useRef } from "react";

export function ContentAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let animation: Animation | undefined;
    const sync = () => {
      if (preference.matches) { animation?.cancel(); animation = undefined; return; }
      if (!animation && visible) animation = layer.animate([
        { transform: "translate3d(-2%, 0, 0)" },
        { transform: "translate3d(2%, 2%, 0)" },
      ], { duration: 22000, iterations: Infinity, direction: "alternate", easing: "ease-in-out" });
      if (visible && !document.hidden) animation?.play();
      else animation?.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(layer.parentElement!);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); animation?.cancel(); preference.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);
  return <div ref={ref} className="content-atmosphere" aria-hidden="true" />;
}
