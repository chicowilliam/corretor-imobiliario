"use client";

import { useLayoutEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);

  return (
    <dialog ref={ref} className="dialog" aria-labelledby={titleId} onCancel={onClose} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
    }}>
      <h2 id={titleId} className="sr-only">{title}</h2>
      <button className="dialog-close" onClick={onClose} aria-label="Fechar janela"><X size={20} strokeWidth={1.3} /></button>
      {open ? children : null}
    </dialog>
  );
}
