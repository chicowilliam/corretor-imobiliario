import Image from "next/image";
import type { Agent } from "@/types/agent";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";
import { CountUp } from "@/components/motion/CountUp";
import { DepthReveal } from "@/components/motion/DepthReveal";
import { AdvisorStory } from "@/components/motion/AdvisorStory";

export function AdvisorIntro({ agent }: { agent: Agent }) {
  return <section id="sobre" className="shell section-space" aria-labelledby="advisor-heading"><div className="advisor-layout">
    <figure><DepthReveal className="advisor-photo"><Image src={agent.photo.src} alt={agent.photo.alt} fill loading="lazy" sizes="(max-width: 767px) 35vw, (max-width: 1400px) 36vw, 485px" /></DepthReveal><figcaption className="mt-4 text-[9px] tracking-wide text-muted">Fotografia ilustrativa · Perfil demonstrativo</figcaption></figure>
    <div><Reveal><h2 id="advisor-heading" className="display section-title">Imóveis são sobre<br />pessoas.</h2></Reveal>
      <AdvisorStory>{[agent.headline, ...(agent.bio.match(/[^.!?]+[.!?]?/g) ?? [agent.bio])].map((phrase, index) => <p className="story-phrase" key={index}>{phrase.trim()}</p>)}</AdvisorStory>
      <p className="advisor-signature mt-7">{agent.name}</p>
      <div className="mt-8 flex gap-10 border-t border-line pt-6">{agent.metrics.map((metric) => <div key={metric.id}><CountUp value={metric.value} suffix={metric.unit === "PROPERTIES" ? "+" : ""} /><span className="mt-1 block text-[10px] text-muted">{metric.label}</span></div>)}</div>
      <p className="mt-3 text-[9px] text-muted">Métricas fictícias para demonstração. CRECI não informado.</p>
      <ContactCTA className="text-link mt-7" whatsapp={agent.whatsapp} message="Olá, Tomás! Gostaria de contar um pouco sobre o que procuro no meu próximo imóvel.">Vamos nos conhecer</ContactCTA>
    </div>
  </div></section>;
}
