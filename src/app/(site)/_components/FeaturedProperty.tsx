import Image from "next/image";
import type { Property } from "@/types/property";
import { Reveal } from "@/components/motion/Reveal";
import { PropertyPreview } from "@/components/property/PropertyPreview";
import { ContactCTA } from "@/components/lead/ContactCTA";
import { propertyPrice } from "@/lib/utils/format-money";
import { PropertyFacts } from "@/components/property/PropertyFacts";

export function FeaturedProperty({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  return <section className="showroom-feature" aria-labelledby="featured-heading">
    <Reveal className="showroom-feature-intro"><p>Uma casa da seleção, vista de perto.</p><h2 id="featured-heading" className="display">Uma visita a<br />{property.neighborhood}.</h2><p>Arquitetura, espaços<br />e o entorno.</p></Reveal>
    <div className="showroom-feature-stage">
      <PropertyPreview property={property} whatsapp={whatsapp} className="showroom-feature-image" showArrow={false}>
        <Image src={property.media.cover.src} alt={property.media.cover.alt} fill loading="lazy" sizes="100vw" style={{ objectPosition: property.media.card?.objectPosition }} />
        <span className="showroom-image-entry">Ver imóvel <span aria-hidden="true">↗</span></span>
      </PropertyPreview>
      <div className="showroom-feature-caption"><span>{property.city} / {property.neighborhood}</span><span>{property.highlights.includes("EXCLUSIVE") ? "Exclusividade · " : ""}Ref. {property.reference}</span></div>
    </div>
    <div className="showroom-feature-details">
      <div><p className="showroom-property-name">{property.name}</p><h3 className="display">{property.title}</h3></div>
      <p className="showroom-description">{property.excerpt}</p>
      <div className="showroom-feature-specs"><PropertyFacts property={property} /><div className="showroom-feature-actions"><p className="property-price">{propertyPrice(property)}</p><ContactCTA whatsapp={whatsapp} title="Receber detalhes" message={`Olá, Tomás! Gostaria de receber detalhes de ${property.name}, referência ${property.reference}, em ${property.neighborhood}.`}>Receber detalhes</ContactCTA></div></div>
    </div>
  </section>;
}
