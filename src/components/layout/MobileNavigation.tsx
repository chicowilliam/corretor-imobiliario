"use client";

import { useRef } from "react";
import { Menu, X } from "lucide-react";

export function MobileNavigation() {
  const ref = useRef<HTMLDialogElement>(null);
  function close() { ref.current?.close(); document.body.style.overflow = ""; }
  return <>
    <button className="mobile-menu-button" aria-label="Abrir menu" onClick={() => { ref.current?.showModal(); document.body.style.overflow = "hidden"; }}><Menu size={23} strokeWidth={1.3} /></button>
    <dialog ref={ref} className="mobile-nav" aria-label="Menu principal" onClose={() => { document.body.style.overflow = ""; }} onClick={(event) => { if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) close(); }}>
      <button className="dialog-close" aria-label="Fechar menu" onClick={close}><X size={23} strokeWidth={1.3} /></button>
      <span className="eyebrow text-olive">Tomás Avelar</span>
      <nav>
        <a href="#selecao" onClick={close}>Imóveis selecionados</a>
        <a href="#sobre" onClick={close}>Meu olhar</a>
        <a href="#proprietarios" onClick={close}>Seu imóvel</a>
        <a href="#colecao-privada" onClick={close}>Coleção privada</a>
        <a href="#contato" onClick={close}>Vamos conversar</a>
      </nav>
      <p className="mt-10 text-xs leading-6 text-muted">Arquitetura, contexto e o seu jeito de viver.<br />São Paulo, SP</p>
    </dialog>
  </>;
}
