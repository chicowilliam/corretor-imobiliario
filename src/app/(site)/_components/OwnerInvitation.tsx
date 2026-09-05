import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";
import type { ImageAsset } from "@/types/shared";

export function OwnerInvitation({ image, whatsapp }: { image: ImageAsset; whatsapp: string | null }) {
  return <section id="proprietarios" className="owner-section on-dark section-space" aria-labelledby="owner-heading"><div className="shell"><Reveal className="owner-layout">
    <div><span className="eyebrow mb-5 text-[#c5c9b5]">Para quem tem uma história para passar adiante</span><h2 id="owner-heading" className="display section-title">Seu imóvel merece<br />um olhar à <em>altura.</em></h2><p className="mt-7 max-w-sm text-[13px] leading-7 text-[#d0d2c6]">Cada lugar tem algo que o torna singular. Meu trabalho é reconhecer esse valor e apresentá-lo às pessoas certas, com estratégia e cuidado em cada detalhe.</p><ContactCTA className="text-link mt-7" whatsapp={whatsapp} title="Conte a história do seu imóvel" message="Olá, Tomás! Sou proprietário e gostaria de conversar sobre a apresentação e o valor do meu imóvel.">Conversar sobre meu imóvel</ContactCTA><p className="mt-5 text-[10px] text-[#c5c9b5]">Uma primeira conversa, sem compromisso.</p></div>
    <div className="owner-art"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 90vw, 42vw" /></div>
  </Reveal></div></section>;
}
