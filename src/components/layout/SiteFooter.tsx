import { SiteLink as Link } from "@/components/ui/SiteLink";
import { ContactCTA } from "@/components/lead/ContactCTA";
import { Reveal } from "@/components/motion/Reveal";
import { demoSocial } from "@/data/mocks/social";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  return <footer id="contato" className="shell">
    <div className="footer-top">
      <div><Link href="/" className="wordmark"><span className="wordmark-name">TOMÁS AVELAR</span><span className="wordmark-caption">Curadoria imobiliária</span></Link><p className="mt-6 max-w-60 text-xs leading-6 text-muted">Arquitetura, contexto e o seu jeito de viver.<br />Belo Horizonte, MG.</p></div>
      <Reveal><h2 className="display text-[32px]">Toda boa escolha começa<br />com uma conversa.</h2><ContactCTA className="text-link mt-4" message="Olá, Tomás! Gostaria de conversar sobre imóveis em Belo Horizonte.">Iniciar uma conversa</ContactCTA></Reveal>
      <nav aria-label="Navegação do rodapé" className="flex flex-col gap-1 text-xs"><Link className="py-2" href="/imoveis">Imóveis</Link><Link className="py-2" href="/#selecao">Seleção</Link><Link className="py-2" href="/#sobre">Meu olhar</Link><Link className="py-2" href="/#proprietarios">Para proprietários</Link></nav>
    </div>
    <div className="footer-bottom">
      <a href={demoSocial.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link" aria-label={`Instagram ${demoSocial.instagramHandle}, perfil demonstrativo`}><InstagramIcon size={18} />{demoSocial.instagramHandle}</a>
      <p>© 2026 Tomás Avelar · Portfólio demonstrativo.</p>
      <p className="max-w-xl">Perfil, imóveis, métricas e depoimentos fictícios. Fotografias ilustrativas.<br />Sem CRECI ou atendimento comercial ativo. Nenhum dado pessoal é enviado por este site.</p>
    </div>
  </footer>;
}
