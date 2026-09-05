import { ContactCTA } from "@/components/lead/ContactCTA";
import { MobileNavigation } from "./MobileNavigation";

export function SiteHeader() {
  return <header className="site-header">
    <div className="shell flex h-full items-center justify-between gap-5">
      <a href="/" className="wordmark" aria-label="Tomás Avelar — início"><span className="wordmark-name">TOMÁS AVELAR</span><span className="wordmark-caption">Curadoria imobiliária</span></a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <a href="#selecao">Imóveis selecionados</a><a href="#sobre">Meu olhar</a><a href="#proprietarios">Seu imóvel</a><a href="#colecao-privada">Coleção privada</a>
      </nav>
      <ContactCTA className="header-contact" message="Olá, Tomás! Gostaria de conversar sobre o meu próximo imóvel.">Vamos conversar</ContactCTA>
      <MobileNavigation />
    </div>
  </header>;
}
