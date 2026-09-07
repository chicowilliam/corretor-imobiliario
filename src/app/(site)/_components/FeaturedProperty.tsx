import Image from "next/image";
import type { Property } from "@/types/property";
import { Reveal } from "@/components/motion/Reveal";
import { PropertyPreview } from "@/components/property/PropertyPreview";
import { propertyPrice } from "@/lib/utils/format-money";
import { PropertyFacts } from "@/components/property/PropertyFacts";

export function FeaturedProperty({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  return <section className="shell section-space" aria-labelledby="featured-heading"><Reveal>
    <div className="feature-intro"><h2 id="featured-heading" className="display section-title">Uma visita a<br />{property.neighborhood}.</h2><p className="section-heading-note">Uma casa da seleção, vista de perto.<br />Arquitetura, espaços e o entorno.</p></div>
    <div className="feature-layout">
      <div className="feature-photo"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill loading="lazy" sizes="(max-width: 767px) 90vw, 57vw" style={{ objectPosition: property.media.card?.objectPosition }} />{property.highlights.includes("EXCLUSIVE") ? <span className="property-badge">Exclusividade</span> : null}</div>
      <div className="feature-copy">
        <div className="feature-register"><span>{property.city}</span><span>Ref. {property.reference}</span></div>
        <h3 className="display mt-5 text-[44px] lg:text-[54px]">{property.title}</h3>
        <p className="mt-5 max-w-80 text-[13px] leading-7 text-muted">{property.excerpt}</p>
        <PropertyFacts property={property} />
        <p className="property-price mt-7">{propertyPrice(property)}</p>
        <PropertyPreview property={property} whatsapp={whatsapp} className="text-link mt-6">Conhecer esta casa</PropertyPreview>
      </div>
    </div>
  </Reveal></section>;
}
