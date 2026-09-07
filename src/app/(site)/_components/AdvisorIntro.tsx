import Image from "next/image";
import type { Agent } from "@/types/agent";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";
import { CountUp } from "@/components/motion/CountUp";
import { DepthReveal } from "@/components/motion/DepthReveal";

export function AdvisorIntro({ agent }: { agent: Agent }) {
  return <section id="sobre" className="shell section-space" aria-labelledby="advisor-heading"><div className="advisor-layout">
    <figure><DepthReveal className="advisor-photo"><Image src={agent.photo.src} alt={agent.photo.alt} fill loading="lazy" sizes="(max-width: 767px) 90vw, 40vw" /></DepthReveal><figcaption className="mt-4 text-[9px] tracking-wide text-muted">Fotografia ilustrativa · Perfil demonstrativo</figcaption></figure>
    <Reveal><h2 id="advisor-heading" className="display section-title">Imóveis são sobre<br />pessoas.</h2><p className="mt-7 max-w-md text-base leading-7">{agent.headline}</p><p className="mt-5 max-w-md text-[13px] leading-7 text-muted">{agent.bio}</p><p className="advisor-signature mt-7">{agent.name}</p>
      <div className="mt-8 flex gap-10 border-t border-line pt-6">{agent.metrics.map((metric) => <div key={metric.id}><CountUp value={metric.value} suffix={metric.unit === "PROPERTIES" ? "+" : ""} /><span className="mt-1 block text-[10px] text-muted">{metric.label}</span></div>)}</div>
      <p className="mt-3 text-[9px] text-muted">Métricas fictícias para demonstração. CRECI não informado.</p>
      <ContactCTA className="text-link mt-7" whatsapp={agent.whatsapp} message="Olá, Tomás! Gostaria de contar um pouco sobre o que procuro no meu próximo imóvel.">Vamos nos conhecer</ContactCTA>
    </Reveal>
  </div></section>;
}
