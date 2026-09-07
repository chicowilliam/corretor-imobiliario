"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNavigation({ icon }: { icon?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  function close() { ref.current?.close(); document.body.style.overflow = ""; }
  return <>
    <button className="mobile-menu-button" aria-label="Abrir menu" onClick={() => { ref.current?.showModal(); document.body.style.overflow = "hidden"; }}>{icon ?? <Menu size={23} strokeWidth={1.3} aria-hidden="true" />}</button>
    <dialog ref={ref} className="mobile-nav" aria-label="Menu principal" onClose={() => { document.body.style.overflow = ""; }} onClick={(event) => { if (event.target === event.currentTarget && event.clientX < event.currentTarget.getBoundingClientRect().left) close(); }}>
      <button className="dialog-close" aria-label="Fechar menu" onClick={close}><X size={23} strokeWidth={1.3} /></button>
      <span className="eyebrow text-olive">Tomás Avelar</span>
      <nav>
        <Link href="/imoveis" onClick={close}>Imóveis</Link>
        <Link href="/#selecao" onClick={close}>Seleção</Link>
        <Link href="/#sobre" onClick={close}>Meu olhar</Link>
        <Link href="/#proprietarios" onClick={close}>Seu imóvel</Link>
        <Link href="/#colecao-privada" onClick={close}>Coleção privada</Link>
        <Link href="/#contato" onClick={close}>Vamos conversar</Link>
      </nav>
      <p className="mt-10 text-xs leading-6 text-muted">Arquitetura, contexto e o seu jeito de viver.<br />São Paulo, SP</p>
    </dialog>
  </>;
}
