import { ArrowUpRight } from "lucide-react";
import type { Property } from "@/types/property";
import { PropertyPreview } from "./PropertyPreview";
import { propertyPrice } from "@/lib/utils/format-money";
import { PropertyCardMotion } from "./PropertyCardMotion";
import { PropertyCardMedia } from "./PropertyCardMedia";
import { PropertyFacts } from "./PropertyFacts";

const labels = { JUST_LISTED: "Novo na seleção", EXCLUSIVE: "Exclusividade", PRICE_REDUCED: "Novo valor" };

export function PropertyCard({ property, whatsapp, imageSizes }: { property: Property; whatsapp: string | null; imageSizes?: string }) {
  const highlight = property.highlights[0];
  return <PropertyCardMotion>
    <PropertyPreview property={property} whatsapp={whatsapp} className="property-image" showArrow={false}>
      <PropertyCardMedia imageSrc={property.media.cover.src} imageAlt={property.media.cover.alt} objectPosition={property.media.card?.objectPosition} videoSrc={property.media.card?.video?.src} sizes={imageSizes} />
      {highlight ? <span className="property-badge">{labels[highlight]}</span> : null}
      <span className="image-arrow"><ArrowUpRight size={18} strokeWidth={1.3} aria-hidden="true" /></span>
    </PropertyPreview>
    <h3 className="property-card-title">{property.name}</h3>
    <div className="property-location"><span>{property.neighborhood}{property.city !== "Belo Horizonte" ? `, ${property.city}` : ""}</span><span>{property.purpose === "RENT" ? "Locação" : "Venda"}</span></div>
    <p className="property-editorial-title">{property.title}</p>
    <PropertyFacts property={property} />
    <div className="property-card-footer"><p className="property-price">{propertyPrice(property)}</p><span className="property-reference">Ref. {property.reference}</span></div>
  </PropertyCardMotion>;
}
