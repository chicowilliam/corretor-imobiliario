"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";

export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const visible = useInView(root, { once: true, amount: .7 });
  const formatted = value.toLocaleString("pt-BR");
  const columns = String(value).split("").map((digit, index, all) => {
    const steps = Math.min(40, Math.floor(value / 10 ** (all.length - index - 1)));
    // Whole rotations plus the final digit; bounded even with future larger metrics.
    return steps < 40 ? steps : 30 + Number(digit);
  });
  useEffect(() => {
    const node = root.current;
    if (!visible || !node) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const controls: ReturnType<typeof animate>[] = [];
    const finish = () => {
      controls.forEach(control => control.stop());
      node.removeAttribute("data-rolling");
    };
    node.setAttribute("data-rolling", "");
    node.querySelectorAll<HTMLElement>(".counter-strip").forEach(strip => {
      const steps = Number(strip.dataset.steps);
      controls.push(animate(strip, { transform: ["translateY(0)", "translateY(-" + (100 * steps / (steps + 1)) + "%)"] },
        { duration: value < 20 ? 1.8 : 2.4, ease: [.22, 1, .36, 1] }));
    });
    const timer = setTimeout(finish, 2500);
    preference.addEventListener("change", finish);
    document.addEventListener("visibilitychange", finish);
    return () => { clearTimeout(timer); finish(); preference.removeEventListener("change", finish); document.removeEventListener("visibilitychange", finish); };
  }, [visible, value]);
  return <span ref={root} className="count-up display text-[40px]" style={{ minWidth: formatted.length + suffix.length + "ch" }}>
    <span className="sr-only">{formatted}{suffix}</span>
    <span aria-hidden="true"><span className="counter-final" data-count-value={value}>{formatted}</span><span className="counter-wheels">{visible ? columns.map((steps, index) =>
      <span className="counter-wheel" key={index}><span className="counter-strip" data-steps={steps}>{Array.from({ length: steps + 1 }, (_, i) => <span key={i}>{i % 10}</span>)}</span></span>
    ) : null}</span>{suffix}</span>
  </span>;
}
