"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m as motion } from "motion/react";

interface Navigation { id: number; from: string; href: string; started: boolean }

export function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState<Navigation | null>(null);
  const [historyTick, setHistoryTick] = useState<number | null>(null);
  const navigation = useRef<Navigation | null>(null);
  const covered = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const clear = () => {
      clearTimeout(timer.current);
      navigation.current = null; covered.current = false;
      setPending(null); setHistoryTick(null);
    };
    const click = (event: MouseEvent) => {
      if (preference.matches || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.detail === 0) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      // The mobile menu owns its exit and navigation as one short sequence.
      if (link.closest(".mobile-nav")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      event.preventDefault();
      const next = { id: performance.now(), from: pathname, href: url.pathname + url.search + url.hash, started: covered.current };
      navigation.current = { ...next };
      setPending(next);
      router.prefetch(next.href);
      if (next.started) startTransition(() => router.push(next.href));
      clearTimeout(timer.current);
      // A stalled request must never strand the visitor behind an opaque layer.
      timer.current = setTimeout(clear, 8000);
    };
    const history = () => {
      const changedPage = location.pathname !== pathname;
      clear();
      if (!preference.matches && changedPage) setHistoryTick(performance.now());
    };
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") clear(); };
    document.addEventListener("click", click, true);
    window.addEventListener("popstate", history);
    document.addEventListener("keydown", key);
    preference.addEventListener("change", clear);
    return () => {
      document.removeEventListener("click", click, true);
      window.removeEventListener("popstate", history);
      document.removeEventListener("keydown", key);
      preference.removeEventListener("change", clear);
    };
  }, [pathname, router]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return <>
    <AnimatePresence onExitComplete={() => {
      if (navigation.current?.from !== pathname) {
        clearTimeout(timer.current); covered.current = false; navigation.current = null; setPending(null);
      }
    }}>
      {pending && pending.from === pathname ? <motion.div key="route-cover" className="route-veil" aria-hidden="true"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={(definition) => {
          const current = navigation.current;
          if (typeof definition === "object" && !Array.isArray(definition) && definition.opacity === 1 && current && !current.started) {
            covered.current = true; current.started = true;
            startTransition(() => router.push(current.href));
          }
        }}><span className="route-signature">Tomás Avelar</span></motion.div> : null}
    </AnimatePresence>
    <AnimatePresence>
      {historyTick !== null ? <motion.div key={historyTick} className="route-veil" aria-hidden="true"
        initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        onAnimationComplete={() => setHistoryTick(null)}><span className="route-signature">Tomás Avelar</span></motion.div> : null}
    </AnimatePresence>
  </>;
}
