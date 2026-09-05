"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { ContactPanel } from "@/components/lead/ContactCTA";
import { propertyPrice } from "@/lib/utils/format-money";
import type { Property } from "@/types/property";

export function PropertyPreview({ property, children, className = "text-link", whatsapp = null, showArrow = true }: { property: Property; children: ReactNode; className?: string; whatsapp?: string | null; showArrow?: boolean }) {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState(false);

  return <>
    <button type="button" className={className} onClick={() => { setContact(false); setOpen(true); }} aria-label={`Conhecer ${property.title}`}>
      {children}{showArrow ? <ArrowUpRight size={16} aria-hidden="true" /> : null}
    </button>
    <Dialog title={property.title} open={open} onClose={() => setOpen(false)}>
      <div className="dialog-image"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill sizes="(max-width: 767px) 92vw, 680px" /></div>
      <div className="dialog-inner">
        <p className="eyebrow text-olive">{property.neighborhood} · {property.purpose === "RENT" ? "Locação" : "Venda"}</p>
        <h3 className="display my-4 text-4xl">{property.title}</h3>
        <div className="fact-row"><span>{property.area} m²</span><span>{property.suites} suítes</span><span>{property.parking} vagas</span></div>
        <p className="my-5 text-[13px] leading-7 text-muted">{property.description}</p>
        <p className="mb-6 text-lg">{propertyPrice(property)}</p>
        {property.purpose === "RENT" ? <p className="mb-6 text-xs text-muted">Condomínio e IPTU não incluídos no valor da locação.</p> : null}
        {contact ? <ContactPanel whatsapp={whatsapp} message={`Olá, Tomás! Tenho interesse no imóvel “${property.title}” (${property.reference}), em ${property.neighborhood}. Gostaria de conversar sobre uma visita.`} /> :
          <button type="button" className="solid-button" onClick={() => setContact(true)}>Conversar sobre este imóvel <ArrowUpRight size={16} aria-hidden="true" /></button>}
        <p className="mt-6 border-t border-line pt-4 text-[10px] leading-5 text-muted">Imóvel e valores fictícios. Fotografias de referência; não representam uma oferta real.</p>
      </div>
    </Dialog>
  </>;
}
