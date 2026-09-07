"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { useAnimate } from "motion/react";

export function DepthReveal({ children, className }: { children: ReactNode; className?: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useLayoutEffect(() => {
    const root = scope.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches) return;
    const mask = root.querySelector<HTMLElement>(".depth-mask")!;
    const image = root.querySelector<HTMLElement>(".depth-image")!;
    const photo = image.querySelector("img");
    mask.style.transform = "translateY(100%)";
    image.style.transform = "translateY(-100%) scale(1.08)";
    const animations: ReturnType<typeof animate>[] = [];
    const show = () => {
      const transition = { duration: 0.95, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
      animations.push(animate(mask, { transform: "translateY(0%)" }, transition));
      animations.push(animate(image, { transform: "translateY(0%) scale(1)" }, transition));
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!photo || photo.complete) show();
      else {
        photo.addEventListener("load", show, { once: true });
        photo.addEventListener("error", show, { once: true });
      }
    }, { threshold: 0.18 });
    observer.observe(root);
    const clear = () => {
      observer.disconnect();
      photo?.removeEventListener("load", show);
      photo?.removeEventListener("error", show);
      animations.forEach((animation) => animation.stop());
      mask.style.removeProperty("transform");
      image.style.removeProperty("transform");
    };
    preference.addEventListener("change", clear);
    return () => { clear(); preference.removeEventListener("change", clear); };
  }, [animate, scope]);
  return <div ref={scope} className={`${className ?? ""} depth-reveal`}><div className="depth-mask"><div className="depth-image">{children}</div></div></div>;
}
