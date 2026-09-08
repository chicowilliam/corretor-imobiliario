"use client";

import { ActionFrame } from "@/components/motion/ActionFrame";
import { useEffect, type ReactNode } from "react";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { ContactCTA } from "@/components/lead/ContactCTA";
import { MobileNavigation } from "./MobileNavigation";

const links = [
  ["/imoveis", "Imóveis"], ["/#selecao", "Seleção"], ["/#sobre", "Meu olhar"],
  ["/#proprietarios", "Seu imóvel"], ["/#colecao-privada", "Coleção privada"],
] as const;

// Only visual ink is doubled; links, buttons and accessible labels remain singular.
function HeaderInk({ children, dark, light, className = "" }: {
  children: ReactNode; dark: MotionValue<number>; light: MotionValue<number>; className?: string;
}) {
  return <span className={`header-ink ${className}`}>
    <motion.span className="header-ink-dark" style={{ opacity: dark }}>{children}</motion.span>
    <motion.span className="header-ink-light" style={{ opacity: light }} aria-hidden="true">{children}</motion.span>
  </span>;
}

export function SiteHeader() {
  const home = usePathname() === "/";
  const { scrollY } = useScroll();
  const sceneEnd = useMotionValue(1000);
  useEffect(() => {
    if (!home) return;
    const measure = () => {
      const content = document.querySelector(".home-content");
      sceneEnd.set(content ? content.getBoundingClientRect().top + window.scrollY : window.innerHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.documentElement);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [home, sceneEnd]);
  const smooth = (value: number) => { const p = Math.min(1, Math.max(0, value)); return p * p * (3 - 2 * p); };
  // Ink follows readability; the glass waits until content has covered the scene.
  const dark = useTransform(() => home ? smooth((scrollY.get() - sceneEnd.get() * .25) / (sceneEnd.get() * .4)) : 1);
  const glass = useTransform(() => home ? smooth((scrollY.get() - sceneEnd.get()) / 220) : 1);
  const light = useTransform(() => 1 - dark.get());
  const ink = { dark, light };

  return <>
    <header className="site-header" data-hero-header={home}>
      <motion.div className="header-glass" style={{ opacity: glass }} aria-hidden="true" />
      <div className="shell header-inner flex h-full items-center justify-between gap-5">
        <Link href="/" className="wordmark" aria-label="Tomás Avelar — início">
          <HeaderInk {...ink}><span className="wordmark-name">TOMÁS AVELAR</span></HeaderInk>
          <HeaderInk {...ink}><span className="wordmark-caption">Curadoria imobiliária</span></HeaderInk>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([href, label]) => <Link key={href} href={href} aria-current={href === "/imoveis" && !home ? "page" : undefined}><HeaderInk {...ink}>{label}</HeaderInk></Link>)}
        </nav>
        <ContactCTA className="header-contact" message="Olá, Tomás! Gostaria de conversar sobre o meu próximo imóvel."
          icon={<HeaderInk {...ink}><ArrowUpRight size={16} aria-hidden="true" /></HeaderInk>}>
          <HeaderInk {...ink} className="header-contact-outline"><ActionFrame /></HeaderInk>
          <HeaderInk {...ink}>Vamos conversar</HeaderInk>
        </ContactCTA>
        <MobileNavigation icon={<HeaderInk {...ink}><span className="menu-mark"><span>Menu</span><svg width="27" height="18" viewBox="0 0 27 18" fill="none" aria-hidden="true"><path d="M1 5H26M8 13H26" stroke="currentColor" strokeWidth="1" /></svg></span></HeaderInk>} />
      </div>
    </header>
    {!home ? <div className="header-spacer" aria-hidden="true" /> : null}
  </>;
}
