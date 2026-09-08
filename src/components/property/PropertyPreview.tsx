"use client";

import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { DrawUnderline } from "@/components/motion/DrawUnderline";
import { Dialog } from "@/components/ui/Dialog";
import type { Property } from "@/types/property";

const loadContent = () => import("./PropertyPreviewContent").then(module => module.PropertyPreviewContent);
const PreviewContent = dynamic(loadContent, {
  loading: () => <p className="dialog-inner pt-16" role="status">Carregando o imóvel…</p>,
});

export function PropertyPreview({ property, children, className = "text-link", whatsapp = null, showArrow = true }: { property: Property; children: ReactNode; className?: string; whatsapp?: string | null; showArrow?: boolean }) {
  const [open, setOpen] = useState(false);
  const warm = () => { void loadContent().catch(() => {}); };
  return <>
    <button type="button" className={className} onPointerEnter={warm} onFocus={warm} onClick={() => setOpen(true)} aria-label={`Conhecer ${property.title}`} aria-haspopup="dialog" aria-expanded={open}>
      {children}{showArrow ? <ArrowUpRight size={16} aria-hidden="true" /> : null}{className.includes("text-link") ? <DrawUnderline /> : null}
    </button>
    {open ? <Dialog title={property.title} open onClose={() => setOpen(false)}><PreviewContent property={property} whatsapp={whatsapp} /></Dialog> : null}
  </>;
}
