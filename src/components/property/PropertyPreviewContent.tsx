"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ContactPanel } from "@/components/lead/ContactCTA";
import { propertyPrice } from "@/lib/utils/format-money";
import { PropertyFacts } from "./PropertyFacts";
import type { Property } from "@/types/property";

export function PropertyPreviewContent({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  const [contact, setContact] = useState(false);
  const contactRegion = useRef<HTMLDivElement>(null);
  const gallery = property.media.gallery.filter(image => image.src !== property.media.cover.src);
  const openContact = () => {
    setContact(true);
    requestAnimationFrame(() => {
      contactRegion.current?.scrollIntoView({ behavior: "instant", block: "start" });
      contactRegion.current?.focus({ preventScroll: true });
    });
  };
  return <article className="presentation">
    <div className="presentation-hero"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill sizes="100vw" style={{ objectPosition: property.media.card?.objectPosition }} /><div className="presentation-hero-copy"><p>{property.neighborhood} / {property.city}</p><h3 className="display">{property.name}</h3><span>{property.purpose === "RENT" ? "Locação" : "Venda"} · Ref. {property.reference}</span></div></div>
    <div className="presentation-rail"><PropertyFacts property={property} /><div><p className="property-price">{propertyPrice(property)}</p><button type="button" className="text-link" onClick={openContact}>Receber detalhes <span aria-hidden="true">↗</span></button></div></div>
    <div className="presentation-story"><h4 className="display">{property.title}</h4><div><p>{property.description}</p><dl className="presentation-extra-facts"><div><dt>Quartos</dt><dd>{property.bedrooms ?? "Não informado"}</dd></div><div><dt>Banheiros</dt><dd>{property.bathrooms ?? "Não informado"}</dd></div>{property.lotArea ? <div><dt>Terreno</dt><dd>{property.lotArea.toLocaleString("pt-BR")} m²</dd></div> : null}</dl>{property.features.length ? <ul className="presentation-features">{property.features.map(feature => <li key={feature.id}>{feature.label}</li>)}</ul> : null}</div></div>
    {gallery.length ? <section className="presentation-gallery" aria-label="Ambientes">{gallery.map(image => <figure key={image.id}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" sizes="(max-width: 767px) 100vw, 80vw" /></figure>)}</section> : null}
    {property.media.floorPlans.length ? <section className="presentation-plans" aria-label="Plantas do imóvel"><h4 className="display">A organização dos espaços.</h4>{property.media.floorPlans.map(image => <Image key={image.id} src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" sizes="(max-width: 767px) 90vw, 70vw" />)}</section> : null}
    <div className="presentation-contact" ref={contactRegion} tabIndex={-1}><div><p>{property.neighborhood}, {property.city}</p><h4 className="display">Vamos conhecer<br />de perto?</h4>{property.purpose === "RENT" ? <p>Condomínio e IPTU não incluídos no valor da locação.</p> : null}</div><div>{contact ? <ContactPanel propertyTitle={property.name} whatsapp={whatsapp} message={`Olá, Tomás! Tenho interesse no imóvel “${property.name}” (${property.reference}), em ${property.neighborhood}. Gostaria de conversar sobre uma visita.`} /> : <button type="button" className="solid-button" onClick={openContact}>Vamos conversar <span aria-hidden="true">↗</span></button>}</div></div>
    <p className="presentation-disclaimer">Imóvel e valores fictícios. Fotografias de referência; não representam uma oferta real.</p>
  </article>;
}
