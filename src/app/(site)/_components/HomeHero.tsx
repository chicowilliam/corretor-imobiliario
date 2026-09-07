import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ImageAsset, VideoAsset } from "@/types/shared";
import { HeroMedia } from "./HeroMedia";
import { HeroMotion } from "./HeroMotion";

export function HomeHero({ hero }: { hero: { poster: ImageAsset; video: VideoAsset | null; location: string } }) {
  return <HeroMotion>
    <HeroMedia imageSrc={hero.poster.src} imageAlt={hero.poster.alt} videoSrc={hero.video?.src} />
    <div className="hero-shade pointer-events-none" />
    <div className="shell hero-content pointer-events-none">
      <p className="eyebrow hero-mask"><span data-hero-reveal>Um olhar particular sobre o morar</span></p>
      <h1 id="home-title" className="display hero-title"><span className="hero-mask"><span data-hero-reveal>Lugares que</span></span>{" "}<span className="hero-mask"><span data-hero-reveal>fazem <em>sentido.</em></span></span></h1>
      <p className="hero-copy hero-mask"><span data-hero-reveal>Arquitetura com intenção. Escolhas com calma.<br />Imóveis para o seu jeito de viver.</span></p>
      <div className="hero-cta-mask"><a href="#selecao" className="text-link mt-7 w-fit pointer-events-auto" data-hero-reveal>Explore a seleção <ArrowUpRight aria-hidden="true" /></a></div>
    </div>
    <div className="hero-bottom pointer-events-none"><div className="shell flex items-end gap-4"><ArrowDown size={15} strokeWidth={1} aria-hidden="true" /><p className="hero-location text-[9px] tracking-[.06em]">Arquitetura & vida ao ar livre<br /><span className="text-[8px] opacity-80">Filme e fotografia de referência</span></p></div></div>
  </HeroMotion>;
}
