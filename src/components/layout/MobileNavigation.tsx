"use client";

import { useEffect, useEffectEvent, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { ArrowUpRight } from "lucide-react";

const links = [["/imoveis", "Imóveis"], ["/#selecao", "Seleção"], ["/#sobre", "Meu olhar"],
  ["/#proprietarios", "Seu imóvel"], ["/#colecao-privada", "Coleção privada"]] as const;

export function MenuMark() {
  return <span className="menu-mark"><span>Menu</span><span className="menu-strokes" aria-hidden="true"><span /><span /></span></span>;
}

export function MobileNavigation({ icon }: { icon?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const frame = useRef(0);
  const afterClose = useRef<(() => void) | undefined>(undefined);
  const [phase, setPhase] = useState<"closed" | "entering" | "open" | "closing">("closed");
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  function restoreScroll() {
    if (previousOverflow.current !== null) {
      if (previousOverflow.current) document.body.style.setProperty("overflow", previousOverflow.current);
      else document.body.style.removeProperty("overflow");
    }
    previousOverflow.current = null;
  }
  function finish() {
    clearTimeout(timer.current);
    cancelAnimationFrame(frame.current);
    ref.current?.close();
    restoreScroll();
    setPhase("closed");
    const action = afterClose.current;
    afterClose.current = undefined;
    action?.();
  }
  function close(action?: () => void, immediate = false) {
    if (!ref.current?.open) return;
    cancelAnimationFrame(frame.current);
    clearTimeout(timer.current);
    afterClose.current = action;
    setPhase("closing");
    if (immediate || reduced()) finish();
    else timer.current = setTimeout(finish, 200);
  }
  const respondToEnvironment = useEffectEvent((wide: boolean, reduce: boolean) => {
    if (!ref.current?.open) return;
    if (wide || (reduce && ref.current.dataset.phase === "closing")) finish();
    else if (reduce) { clearTimeout(timer.current); cancelAnimationFrame(frame.current); setPhase("open"); }
  });
  useEffect(() => {
    const wide = matchMedia("(min-width: 1200px)");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const dismiss = () => respondToEnvironment(wide.matches, preference.matches);
    const settle = dismiss;
    wide.addEventListener("change", dismiss);
    preference.addEventListener("change", settle);
    return () => {
      clearTimeout(timer.current); cancelAnimationFrame(frame.current);
      wide.removeEventListener("change", dismiss); preference.removeEventListener("change", settle);
      if (previousOverflow.current !== null) {
        if (previousOverflow.current) document.body.style.setProperty("overflow", previousOverflow.current);
        else document.body.style.removeProperty("overflow");
      }
    };
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    event.currentTarget.dataset.selected = "true";
    close(() => {
      const [path, hash] = href.split("#");
      const target = path === pathname && hash ? document.getElementById(hash) : null;
      if (target) {
        history.pushState(null, "", href);
        target.scrollIntoView({ behavior: reduced() ? "instant" : "smooth", block: "start" });
        const old = target.getAttribute("tabindex");
        target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true });
        target.addEventListener("blur", () => { if (old === null) target.removeAttribute("tabindex"); else target.setAttribute("tabindex", old); }, { once: true });
      } else router.push(href);
    }, event.detail === 0);
  }

  return <>
    <button ref={trigger} className="mobile-menu-button" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={phase === "open" || phase === "entering"} aria-controls={id}
      onClick={event => {
        const dialog = ref.current;
        if (!dialog || dialog.open) return;
        clearTimeout(timer.current); cancelAnimationFrame(frame.current); afterClose.current = undefined;
        dialog.querySelectorAll('[data-selected]').forEach(link => link.removeAttribute('data-selected'));
        dialog.dataset.keyboard = String(event.detail === 0);
        previousOverflow.current = document.body.style.getPropertyValue("overflow");
        setPhase("entering"); dialog.showModal(); document.body.style.setProperty("overflow", "hidden");
        if (reduced() || event.detail === 0) setPhase("open");
        else frame.current = requestAnimationFrame(() => { frame.current = requestAnimationFrame(() => setPhase("open")); });
      }}>{icon ?? <MenuMark />}</button>
    <dialog ref={ref} id={id} className="mobile-nav" aria-label="Menu principal" data-lenis-prevent data-phase={phase}
      onCancel={event => { event.preventDefault(); close(undefined, true); }}
      onClose={() => { if (!ref.current?.open) { restoreScroll(); setPhase("closed"); } }}>
      <div className="mobile-nav-top">
        <span className="mobile-nav-brand">Tomás Avelar<span>Curadoria imobiliária</span></span>
        <button className="mobile-nav-close" aria-label="Fechar menu" onClick={event => close(undefined, event.detail === 0)}><MenuMark /></button>
      </div>
      <nav className="mobile-nav-links" aria-label="Navegação mobile">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={event => navigate(event, href)}>{label}</Link>)}
      </nav>
      <div className="mobile-nav-bottom">
        <Link href="/#contato" className="mobile-nav-contact" onClick={event => navigate(event, "/#contato")}>Vamos conversar <ArrowUpRight size={17} strokeWidth={1.2} aria-hidden="true" /></Link>
        <p>Belo Horizonte e entorno<span>Arquitetura, contexto e o seu jeito de viver.</span></p>
      </div>
    </dialog>
  </>;
}
