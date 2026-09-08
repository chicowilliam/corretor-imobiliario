import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";
import type { Property } from "@/types/property";
import { PropertyPreview } from "@/components/property/PropertyPreview";

export function PrivateCollectionPreview({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  return <section id="colecao-privada" className="shell pb-8" aria-labelledby="private-heading"><div className="private-layout on-dark"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill loading="lazy" sizes="(max-width: 767px) 100vw, 90vw" className="private-photo" /><div className="private-shade" /><Reveal className="private-content"><h2 id="private-heading" className="display text-[48px] md:text-[60px]">Coleção<br />privada.</h2><p className="mt-6 max-w-xs text-xs leading-7 text-ivory">Uma seleção reservada, apresentada em uma conversa pessoal. O próximo lugar pode estar aqui.</p><PropertyPreview property={property} whatsapp={whatsapp} className="text-link mt-6">Conhecer a coleção</PropertyPreview></Reveal></div></section>;
}
