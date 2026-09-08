"use client";

import { useLayoutEffect, useSyncExternalStore, type ReactNode } from "react";
import { useAnimate } from "motion/react";

const mobileSnapshot = () => matchMedia("(max-width: 767px)").matches;
const serverSnapshot = () => false;
const subscribeMobile = (notify: () => void) => {
  const query = matchMedia("(max-width: 767px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

export function ListingSequence({ children, horizontal = false }: { children: ReactNode; horizontal?: boolean }) {
  const horizontalActive = useSyncExternalStore(subscribeMobile, mobileSnapshot, serverSnapshot) && horizontal;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  useLayoutEffect(() => {
    const root = scope.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(":scope > article"));
    const animations: ReturnType<typeof animate>[] = [];
    cards.forEach((card) => { card.style.opacity = "0"; card.style.transform = "translateY(28px)"; });
    const reveal = (card: HTMLElement, delay = 0) => {
      observer.unobserve(card);
      card.dataset.revealDelay = String(delay);
      animations.push(animate(card, { opacity: 1, transform: "translateY(0px)" }, {
        duration: 0.7, delay, ease: [0.22, 1, 0.36, 1],
      }));
    };
    const observer = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => cards.indexOf(a.target as HTMLElement) - cards.indexOf(b.target as HTMLElement))
        .forEach((entry, index) => reveal(entry.target as HTMLElement, index * 0.16));
    }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });
    cards.forEach((card) => observer.observe(card));
    const clear = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.stop());
      cards.forEach((card) => { card.style.removeProperty("opacity"); card.style.removeProperty("transform"); });
    };
    // Keyboard navigation never waits for an entrance sequence.
    root.addEventListener("focusin", clear);
    preference.addEventListener("change", clear);
    return () => {
      clear();
      root.removeEventListener("focusin", clear);
      preference.removeEventListener("change", clear);
    };
    // Parent remounts with a stable key when the curated set changes.
  }, [animate, scope]);
  return <div ref={scope} className="editorial-listings" tabIndex={horizontalActive ? 0 : undefined} role={horizontalActive ? "region" : undefined} aria-label={horizontalActive ? "Seleção de imóveis, role horizontalmente para explorar" : undefined} data-lenis-prevent={horizontalActive ? "true" : undefined}>{children}</div>;
}
