import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";
import type { Property } from "@/types/property";
import { PropertyPreview } from "@/components/property/PropertyPreview";
import { ContactCTA } from "@/components/lead/ContactCTA";

export function PrivateCollectionPreview({ property, whatsapp }: { property: Property; whatsapp: string | null }) {
  return <section id="colecao-privada" className="showroom-private on-dark" aria-labelledby="private-heading">
    <div className="showroom-private-top"><span>Tomás Avelar</span><span>Apresentação reservada</span></div>
    <Reveal className="showroom-private-title"><h2 id="private-heading" className="display">Coleção<br /><span>privada.</span></h2></Reveal>
    <figure className="showroom-private-image"><Image src={property.media.cover.src} alt={property.media.cover.alt} fill loading="lazy" sizes="(max-width: 767px) 88vw, 49vw" style={{ objectPosition: property.media.card?.objectPosition }} /></figure>
    <div className="showroom-private-copy"><p className="display">Nem todo imóvel precisa estar exposto para estar disponível.</p><p>Uma seleção reservada, apresentada em uma conversa pessoal. O próximo lugar pode estar aqui.</p><ContactCTA whatsapp={whatsapp} className="text-link" title="Solicitar acesso à coleção privada" message="Olá, Tomás! Gostaria de solicitar acesso à coleção privada e compartilhar o que procuro no próximo imóvel.">Solicitar acesso</ContactCTA><PropertyPreview property={property} whatsapp={whatsapp} className="text-link showroom-private-preview">Conhecer a coleção</PropertyPreview></div>
  </section>;
}
