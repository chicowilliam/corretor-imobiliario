import Image from "next/image";
import type { Agent } from "@/types/agent";
import { Reveal } from "@/components/motion/Reveal";
import { ContactCTA } from "@/components/lead/ContactCTA";
import { CountUp } from "@/components/motion/CountUp";
import { DepthReveal } from "@/components/motion/DepthReveal";
import { AdvisorStory } from "@/components/motion/AdvisorStory";

export function AdvisorIntro({ agent }: { agent: Agent }) {
  return <section id="sobre" className="advisor-editorial" aria-labelledby="advisor-heading">
    <figure className="advisor-editorial-portrait">
      <DepthReveal className="advisor-editorial-photo"><Image src={agent.photo.src} alt={agent.photo.alt} fill loading="lazy" sizes="(max-width: 767px) 100vw, 46vw" /></DepthReveal>
      <figcaption><span>{agent.name} · Belo Horizonte</span><span>Retrato ilustrativo · Perfil demonstrativo</span></figcaption>
    </figure>
    <div className="advisor-editorial-copy">
      <p className="advisor-editorial-identification">Meu olhar — {agent.name}</p>
      <Reveal><h2 id="advisor-heading" className="display advisor-editorial-title">Primeiro, a sua vida.<br />Depois, o endereço.</h2></Reveal>
      <AdvisorStory>
        <p className="story-phrase advisor-editorial-lead">Sou {agent.name}. Faço curadoria de imóveis em Belo Horizonte. Meu trabalho começa numa conversa sobre a sua rotina: onde você trabalha, como recebe os amigos e o que gostaria de mudar na casa de hoje.</p>
        <p className="story-phrase">A partir daí, olho além da metragem. Observo a luz nos ambientes, a circulação da planta, a conservação do edifício e o ruído que chega da rua. Uma sala bonita na fotografia precisa funcionar numa terça-feira comum.</p>
        <p className="story-phrase">Em BH, também caminho pelo entorno. A subida até a padaria, o movimento no fim da tarde e a distância de quem faz parte da sua vida ajudam a decidir se aquele endereço merece uma visita.</p>
      </AdvisorStory>
      <blockquote className="advisor-editorial-quote">“Recomendar um imóvel é explicar por que ele faz sentido — e ser claro sobre o que ele não resolve.”</blockquote>
      <div className="advisor-editorial-signoff">
        <p className="advisor-signature">{agent.name}</p>
        <ContactCTA className="text-link" whatsapp={agent.whatsapp} message="Olá, Tomás! Gostaria de conversar sobre minha rotina e o que procuro no próximo imóvel.">Conte como você quer morar</ContactCTA>
      </div>
      <div className="advisor-editorial-metrics">{agent.metrics.map(metric => <div key={metric.id}><CountUp value={metric.value} suffix={metric.unit === "PROPERTIES" ? "+" : ""} /><span>{metric.label}</span></div>)}</div>
      <p className="advisor-editorial-note">Métricas fictícias para demonstração. CRECI não informado.</p>
    </div>
  </section>;
}
