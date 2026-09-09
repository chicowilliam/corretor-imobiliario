"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { DrawUnderline } from "@/components/motion/DrawUnderline";
import { Dialog } from "@/components/ui/Dialog";
import type { Property } from "@/types/property";

const loadContent = () => import("./PropertyPreviewContent").then(module => module.PropertyPreviewContent);
const PreviewContent = dynamic(loadContent, {
  loading: () => <div className="property-preview-loading"><div className="presentation-hero" /><p className="presentation-rail" role="status">Carregando o imóvel…</p></div>,
});

export function PropertyPreview({ property, children, className = "text-link", whatsapp = null, showArrow = true }: { property: Property; children: ReactNode; className?: string; whatsapp?: string | null; showArrow?: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const button = trigger.current;
    if (!button || (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void loadContent().catch(() => {});
    }, { rootMargin: "400px" });
    observer.observe(button);
    return () => observer.disconnect();
  }, []);
  const warm = () => { void loadContent().catch(() => {}); };
  return <>
    <button ref={trigger} type="button" className={className} onPointerEnter={warm} onPointerDown={warm} onFocus={warm} onClick={() => setOpen(true)} aria-label={`Conhecer ${property.name}`} aria-haspopup="dialog" aria-expanded={open}>
      {children}{showArrow ? <ArrowUpRight size={16} aria-hidden="true" /> : null}{className.includes("text-link") ? <DrawUnderline /> : null}
    </button>
    {open ? <Dialog className="property-presentation" title={property.name} open onClose={() => setOpen(false)}><PreviewContent property={property} whatsapp={whatsapp} /></Dialog> : null}
  </>;
}
