"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonContent } from "@/components/motion/ButtonContent";
import { ContactPanel } from "@/components/lead/ContactCTA";
import { propertyPrice } from "@/lib/utils/format-money";
import { PropertyFacts } from "./PropertyFacts";
import type { Property } from "@/types/property";

export function PropertyPreviewContent({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  const [contact, setContact] = useState(false);
  return <><div className="dialog-image"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill sizes="(max-width: 767px) 92vw, 680px" /></div>
      <div className="dialog-inner">
        <div className="property-location"><span>{property.neighborhood}{property.city !== "Belo Horizonte" ? `, ${property.city}` : ""}</span><span>{property.purpose === "RENT" ? "Locação" : "Venda"}</span></div>
        <h3 className="display my-4 text-4xl">{property.name}</h3>
        <p className="mb-5 text-sm text-muted">{property.title}</p>
        <PropertyFacts property={property} />
        <p className="my-5 text-[13px] leading-7 text-muted">{property.description}</p>
        <p className="mb-6 text-lg">{propertyPrice(property)}</p>
        {property.purpose === "RENT" ? <p className="mb-6 text-xs text-muted">Condomínio e IPTU não incluídos no valor da locação.</p> : null}
        {contact ? <ContactPanel propertyTitle={property.name} whatsapp={whatsapp} message={`Olá, Tomás! Tenho interesse no imóvel “${property.name}” (${property.reference}), em ${property.neighborhood}. Gostaria de conversar sobre uma visita.`} /> :
          <button type="button" className="solid-button" onClick={() => setContact(true)}><ButtonContent icon={<ArrowUpRight size={16} />}>Conversar sobre este imóvel</ButtonContent></button>}
        <p className="mt-6 border-t border-line pt-4 text-[10px] leading-5 text-muted">Imóvel e valores fictícios. Fotografias de referência; não representam uma oferta real.</p>
      </div></>;
}
