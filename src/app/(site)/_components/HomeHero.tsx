import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ImageAsset, VideoAsset } from "@/types/shared";
import { HeroMedia } from "./HeroMedia";
import { HeroMotion } from "./HeroMotion";
import { HeroOpening } from "./HeroOpening";
import { WordmarkOutline } from "./WordmarkOutline";
import { DrawUnderline } from "@/components/motion/DrawUnderline";

export function HomeHero({ hero }: { hero: { poster: ImageAsset; video: VideoAsset | null; location: string } }) {
  return <HeroMotion>
    <HeroOpening><WordmarkOutline /></HeroOpening>
    <HeroMedia imageSrc={hero.poster.src} imageAlt={hero.poster.alt} videoSrc={hero.video?.src} />
    <div className="hero-grade" aria-hidden="true" />
    <div className="hero-shade pointer-events-none" />
    <div className="shell hero-content pointer-events-none">
      <p className="hero-eyebrow">Curadoria imobiliária · Belo Horizonte</p>
      <h1 id="home-title" className="display hero-title">Lugares que<br />fazem <em>sentido.</em></h1>
      <p className="hero-copy hero-mask"><span data-hero-reveal>Arquitetura com intenção. Escolhas com calma.<br />Imóveis para o seu jeito de viver.</span></p>
      <div className="hero-cta-mask"><a href="#selecao" className="text-link mt-7 w-fit pointer-events-auto" data-hero-reveal>Ver imóveis disponíveis <ArrowUpRight aria-hidden="true" /><DrawUnderline /></a></div>
    </div>
    <div className="hero-bottom pointer-events-none"><div className="shell flex items-end gap-4"><ArrowDown size={15} strokeWidth={1} aria-hidden="true" /><p className="hero-location text-[9px] tracking-[.06em]">Belo Horizonte e entorno<br /><span className="text-[8px] opacity-80">Filme e fotografia de referência</span></p></div></div>
    <div className="hero-exit-veil" aria-hidden="true" />
  </HeroMotion>;
}
