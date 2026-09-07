"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const visible = useInView(root, { once: true, amount: 0.7 });
  const formatted = value.toLocaleString("pt-BR");
  useEffect(() => {
    if (!visible || !digits.current) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const node = digits.current;
    let last = -1;
    const counter = animate(0, value, { duration: 1.15, ease: [0.22, 1, 0.36, 1], onUpdate: (current) => {
      const integer = Math.round(current);
      if (last !== integer) { node.textContent = integer.toLocaleString("pt-BR"); last = integer; }
    } });
    const finish = () => { counter.stop(); node.textContent = formatted; };
    preference.addEventListener("change", finish);
    return () => { finish(); preference.removeEventListener("change", finish); };
  }, [visible, value, formatted]);
  return <span ref={root} className="count-up display text-[40px]" style={{ minWidth: `${formatted.length + suffix.length}ch` }}>
    <span className="sr-only">{formatted}{suffix}</span>
    <span aria-hidden="true"><span ref={digits} data-count-value={value}>{formatted}</span>{suffix}</span>
  </span>;
}
