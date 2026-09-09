import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";
import type { ImageAsset } from "@/types/shared";

const steps = [
  ["Curadoria", "Entender o que torna seu imóvel particular."],
  ["Posicionamento", "Definir seu lugar no mercado."],
  ["Apresentação", "Dar à arquitetura a atenção que merece."],
  ["Compradores adequados", "Conectar o endereço à pessoa certa."],
];

export function OwnerInvitation({ image, whatsapp }: { image: ImageAsset; whatsapp: string | null }) {
  return <section id="proprietarios" className="showroom-owner" aria-labelledby="owner-heading">
    <div className="showroom-owner-heading"><p>Para quem tem um imóvel especial</p><Reveal><h2 id="owner-heading" className="display">Seu imóvel.<br /><span>Um olhar à altura.</span></h2></Reveal></div>
    <div className="showroom-owner-body">
      <figure className="showroom-owner-image"><Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(max-width: 767px) 100vw, 58vw" /><figcaption>O valor começa no olhar.</figcaption></figure>
      <div className="showroom-owner-copy"><p>A orientação da luz, a relação com a rua, o jardim que cresceu com a casa. Antes de apresentar um imóvel em Belo Horizonte, é preciso entender o que faz dele um lugar particular.</p><ol className="showroom-process">{steps.map(([title, description]) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol><ContactCTA className="solid-button" whatsapp={whatsapp} title="Apresentar meu imóvel" message="Olá, Tomás! Sou proprietário e gostaria de conversar sobre a apresentação e o valor do meu imóvel em Belo Horizonte ou região.">Apresentar meu imóvel</ContactCTA><p className="showroom-note">Uma primeira conversa, sem compromisso.</p></div>
    </div>
  </section>;
}
