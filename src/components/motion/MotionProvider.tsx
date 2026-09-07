"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const refresh = useRef<(() => void) | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let generation = 0;
    let teardown: (() => void) | undefined;

    async function syncPreference() {
      const current = ++generation;
      teardown?.();
      teardown = undefined;
      refresh.current = null;
      if (preference.matches) return;

      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"), import("@/lib/scroll-runtime"),
      ]);
      if (disposed || current !== generation || preference.matches) return;

      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        prevent: (node) => node instanceof Element && Boolean(node.closest("dialog")),
      });
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      const syncLock = () => {
        if (document.hidden || document.body.style.overflow === "hidden") lenis.stop();
        else lenis.start();
      };
      const observer = new MutationObserver(syncLock);
      observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
      document.addEventListener("visibilitychange", syncLock);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);
      gsap.ticker.add(tick);
      syncLock();

      refresh.current = () => {
        lenis.resize();
        // Cancel old route inertia while preserving Next/browser scroll restoration.
        if (!lenis.isStopped) lenis.scrollTo(window.scrollY, { immediate: true });
        ScrollTrigger.refresh();
      };
      refresh.current();
      teardown = () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", syncLock);
        gsap.ticker.remove(tick);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
      };
    }

    void syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      disposed = true;
      generation++;
      preference.removeEventListener("change", syncPreference);
      teardown?.();
      refresh.current = null;
    };
  }, []);

  useEffect(() => { refresh.current?.(); }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
