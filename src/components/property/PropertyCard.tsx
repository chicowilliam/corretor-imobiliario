import { ArrowUpRight } from "lucide-react";
import type { Property } from "@/types/property";
import { PropertyPreview } from "./PropertyPreview";
import { propertyPrice } from "@/lib/utils/format-money";
import { PropertyCardMotion } from "./PropertyCardMotion";
import { PropertyCardMedia } from "./PropertyCardMedia";

const labels = { JUST_LISTED: "Novo na seleção", EXCLUSIVE: "Exclusividade", PRICE_REDUCED: "Novo valor" };

export function PropertyCard({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  const highlight = property.highlights[0];
  return <PropertyCardMotion>
    <PropertyPreview property={property} whatsapp={whatsapp} className="property-image" showArrow={false}>
      <PropertyCardMedia imageSrc={property.media.cover.src} imageAlt={property.media.cover.alt} objectPosition={property.media.card?.objectPosition} videoSrc={property.media.card?.video?.src} />
      {highlight ? <span className="property-badge">{labels[highlight]}</span> : null}
      <span className="image-arrow"><ArrowUpRight size={18} strokeWidth={1.3} aria-hidden="true" /></span>
    </PropertyPreview>
    <div className="mt-6 flex flex-wrap justify-between gap-2 text-[9px] font-medium uppercase tracking-[.13em] text-olive"><span>{property.neighborhood}</span><span>{property.purpose === "RENT" ? "Locação" : "Venda"}</span></div>
    <h3 className="property-card-title">{property.title}</h3>
    <div className="fact-row"><span>{property.area} m²</span><span>{property.suites} {property.suites === 1 ? "suíte" : "suítes"}</span><span>{property.parking} {property.parking === 1 ? "vaga" : "vagas"}</span></div>
    <p className="mt-5 border-t border-line pt-4 text-[13px] font-medium">{propertyPrice(property)}</p>
  </PropertyCardMotion>;
}
