"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { ArrowUpRight } from "lucide-react";

const links = [["/imoveis", "Imóveis"], ["/#selecao", "Seleção"], ["/#sobre", "Meu olhar"],
  ["/#proprietarios", "Seu imóvel"], ["/#colecao-privada", "Coleção privada"]] as const;

export function MobileNavigation({ icon }: { icon?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  function restoreScroll() {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
  }
  function close() { ref.current?.close(); }
  useEffect(() => () => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
  }, []);
  return <>
    <button className="mobile-menu-button" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
      onClick={event => {
        if (!ref.current || ref.current.open) return;
        ref.current.dataset.keyboard = String(event.detail === 0);
        previousOverflow.current = document.body.style.overflow;
        ref.current.showModal();
        document.body.style.overflow = "hidden";
        setOpen(true);
      }}>{icon ?? "Menu"}</button>
    <dialog ref={ref} id={id} className="mobile-nav" aria-label="Menu principal" data-lenis-prevent
      onClose={() => { restoreScroll(); setOpen(false); }}>
      <div className="mobile-nav-top">
        <span className="mobile-nav-brand">Tomás Avelar<span>Curadoria imobiliária</span></span>
        <button className="mobile-nav-close" aria-label="Fechar menu" onClick={close}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="m4 4 14 14M18 4 4 18" stroke="currentColor" strokeWidth="1" /></svg>
        </button>
      </div>
      <nav className="mobile-nav-links" aria-label="Navegação mobile">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={close}>{label}</Link>)}
      </nav>
      <div className="mobile-nav-bottom">
        <Link href="/#contato" className="mobile-nav-contact" onClick={close}>Vamos conversar <ArrowUpRight size={17} strokeWidth={1.2} aria-hidden="true" /></Link>
        <p>Belo Horizonte e entorno<span>Arquitetura, contexto e o seu jeito de viver.</span></p>
      </div>
    </dialog>
  </>;
}
