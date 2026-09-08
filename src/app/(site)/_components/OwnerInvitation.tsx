import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";
import type { ImageAsset } from "@/types/shared";

export function OwnerInvitation({ image, whatsapp }: { image: ImageAsset; whatsapp: string | null }) {
  return <section id="proprietarios" className="owner-section" aria-labelledby="owner-heading">
    <div className="owner-layout">
      <Reveal className="owner-copy"><h2 id="owner-heading" className="display section-title">Seu imóvel merece<br />um olhar à altura.</h2>
        <p className="mt-6 max-w-sm text-[13px] leading-7 text-muted">A orientação da luz, a relação com a rua, o jardim que cresceu com a casa. Antes de apresentar um imóvel em Belo Horizonte, é preciso entender o que faz dele um lugar particular.</p>
        <ContactCTA className="text-link mt-6" whatsapp={whatsapp} title="Conte a história do seu imóvel" message="Olá, Tomás! Sou proprietário e gostaria de conversar sobre a apresentação e o valor do meu imóvel em Belo Horizonte ou região.">Conversar sobre meu imóvel</ContactCTA>
        <p className="mt-4 text-[10px] text-muted">Uma primeira conversa, sem compromisso.</p>
      </Reveal>
      <figure className="owner-art"><Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(max-width: 767px) 100vw, 54vw" /><figcaption>O valor começa no olhar.</figcaption></figure>
    </div>
  </section>;
}
