import { ContactCTA } from "@/components/lead/ContactCTA";

export function SiteFooter() {
  return <footer id="contato" className="shell">
    <div className="footer-top">
      <div><a href="/" className="wordmark"><span className="wordmark-name">TOMÁS AVELAR</span><span className="wordmark-caption">Curadoria imobiliária</span></a><p className="mt-6 max-w-60 text-xs leading-6 text-muted">Arquitetura, contexto e o seu jeito de viver.<br />São Paulo, SP.</p></div>
      <div><p className="display text-[32px]">Toda boa escolha começa<br />com uma conversa.</p><ContactCTA className="text-link mt-4" message="Olá, Tomás! Gostaria de conversar sobre imóveis em São Paulo.">Iniciar uma conversa</ContactCTA></div>
      <nav aria-label="Navegação do rodapé" className="flex flex-col gap-1 text-xs"><a className="py-2" href="#selecao">Imóveis selecionados</a><a className="py-2" href="#sobre">Meu olhar</a><a className="py-2" href="#proprietarios">Para proprietários</a></nav>
    </div>
    <div className="footer-bottom">
      <p>© 2026 Tomás Avelar · Portfólio demonstrativo.</p>
      <p className="max-w-xl">Perfil, imóveis, métricas e depoimentos fictícios. Fotografias ilustrativas.<br />Sem CRECI ou atendimento comercial ativo. Nenhum dado pessoal é enviado por este site.</p>
    </div>
  </footer>;
}
