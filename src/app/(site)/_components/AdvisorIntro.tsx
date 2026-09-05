import Image from "next/image";
import type { Agent } from "@/types/agent";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";

export function AdvisorIntro({ agent }: { agent: Agent }) {
  return <section id="sobre" className="shell section-space" aria-labelledby="advisor-heading"><Reveal className="advisor-layout">
    <figure><div className="advisor-photo"><Image src={agent.photo.src} alt={agent.photo.alt} fill sizes="(max-width: 767px) 90vw, 40vw" /></div><figcaption className="mt-4 text-[9px] tracking-wide text-muted">Fotografia ilustrativa · Perfil demonstrativo</figcaption></figure>
    <div><span className="eyebrow mb-5 text-olive">O olhar por trás da seleção</span><h2 id="advisor-heading" className="display section-title">Imóveis são sobre<br /><em>pessoas.</em></h2><p className="mt-7 max-w-md text-base leading-7">{agent.headline}</p><p className="mt-5 max-w-md text-[13px] leading-7 text-muted">{agent.bio}</p><p className="advisor-signature mt-7">{agent.name}</p>
      <div className="mt-8 flex gap-10 border-t border-line pt-6">{agent.metrics.map((metric) => <div key={metric.id}><span className="display text-[40px]">{metric.value}{metric.unit === "PROPERTIES" ? "+" : ""}</span><span className="mt-1 block text-[10px] text-muted">{metric.label}</span></div>)}</div>
      <p className="mt-3 text-[9px] text-muted">Métricas fictícias para demonstração. CRECI não informado.</p>
      <ContactCTA className="text-link mt-7" whatsapp={agent.whatsapp} message="Olá, Tomás! Gostaria de contar um pouco sobre o que procuro no meu próximo imóvel.">Vamos nos conhecer</ContactCTA>
    </div>
  </Reveal></section>;
}
