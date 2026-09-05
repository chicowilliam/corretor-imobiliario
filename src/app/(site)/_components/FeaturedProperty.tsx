import Image from "next/image";
import type { Property } from "@/types/property";
import { Reveal } from "@/components/motion/Reveal";
import { PropertyPreview } from "@/components/property/PropertyPreview";
import { propertyPrice } from "@/lib/utils/format-money";

export function FeaturedProperty({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  return <section className="shell section-space" aria-labelledby="featured-heading"><Reveal>
    <div className="feature-intro"><div><span className="eyebrow mb-4 text-olive">Em foco</span><h2 id="featured-heading" className="display section-title">Há casas. E há <em>encontros.</em></h2></div><p className="mt-5 max-w-60 text-xs leading-6 text-muted">Uma seleção que começa na arquitetura<br className="hidden lg:block" /> e termina no que você sente.</p></div>
    <div className="feature-layout">
      <div className="feature-photo"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill sizes="(max-width: 767px) 90vw, 57vw" /><span className="property-badge">Exclusividade</span></div>
      <div className="feature-copy"><p className="eyebrow text-olive">{property.neighborhood} · São Paulo</p><h3 className="display mt-5 text-[44px] lg:text-[54px]">{property.title}</h3><p className="mt-5 max-w-80 text-[13px] leading-7 text-muted">{property.excerpt}</p><div className="fact-row mt-7"><span>{property.area} m²</span><span>{property.suites} suítes</span><span>{property.parking} vagas</span></div><p className="mt-7 text-base font-medium">{propertyPrice(property)}</p><PropertyPreview property={property} whatsapp={whatsapp} className="text-link mt-6">Conhecer esta casa</PropertyPreview></div>
    </div>
  </Reveal></section>;
}
