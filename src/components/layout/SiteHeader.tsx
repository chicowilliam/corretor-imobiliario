"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, Menu } from "lucide-react";
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
  const dark = useTransform(() => home ? Math.min(1, Math.max(0, scrollY.get() / 96)) : 1);
  const light = useTransform(() => 1 - dark.get());
  const ink = { dark, light };

  return <>
    <header className="site-header" data-hero-header={home}>
      <motion.div className="header-glass" style={{ opacity: dark }} aria-hidden="true" />
      <div className="shell header-inner flex h-full items-center justify-between gap-5">
        <Link href="/" className="wordmark" aria-label="Tomás Avelar — início">
          <HeaderInk {...ink}><span className="wordmark-name">TOMÁS AVELAR</span></HeaderInk>
          <HeaderInk {...ink}><span className="wordmark-caption">Curadoria imobiliária</span></HeaderInk>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([href, label]) => <Link key={href} href={href}><HeaderInk {...ink}>{label}</HeaderInk></Link>)}
        </nav>
        <ContactCTA className="header-contact" message="Olá, Tomás! Gostaria de conversar sobre o meu próximo imóvel."
          icon={<HeaderInk {...ink}><ArrowUpRight size={16} aria-hidden="true" /></HeaderInk>}>
          <HeaderInk {...ink} className="header-contact-outline"><span /></HeaderInk>
          <HeaderInk {...ink}>Vamos conversar</HeaderInk>
        </ContactCTA>
        <MobileNavigation icon={<HeaderInk {...ink}><Menu size={23} strokeWidth={1.3} aria-hidden="true" /></HeaderInk>} />
      </div>
    </header>
    {!home ? <div className="header-spacer" aria-hidden="true" /> : null}
  </>;
}
