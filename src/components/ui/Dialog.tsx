"use client";

import { useLayoutEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const dismiss = () => {
    if (closing.current) return;
    closing.current = true;
    const dialog = ref.current;
    animation.current?.cancel();
    if (!dialog || matchMedia("(prefers-reduced-motion: reduce)").matches) { onClose(); return; }
    animation.current = dialog.animate([{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: "translateY(10px) scale(.99)" }], { duration: 180, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
    void animation.current.finished.then(onClose).catch(() => {});
  };

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    closing.current = false;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.current = dialog.animate([{ opacity: 0, transform: "translateY(14px) scale(.985)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], { duration: 260, easing: "cubic-bezier(.22,1,.36,1)" });
    }
    document.body.style.overflow = "hidden";
    return () => { animation.current?.cancel(); dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <dialog ref={ref} className="dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); dismiss(); }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dismiss();
    }}>
      <h2 id={titleId} className="sr-only">{title}</h2>
      <button className="dialog-close" onClick={dismiss} aria-label="Fechar janela"><X size={20} strokeWidth={1.3} /></button>
      {open ? children : null}
    </dialog>
  );
}
