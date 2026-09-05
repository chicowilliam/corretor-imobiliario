import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ImageAsset, VideoAsset } from "@/types/shared";
import { HeroVideo } from "./HeroVideo";

export function HomeHero({ hero }: { hero: { poster: ImageAsset; video: VideoAsset | null; location: string } }) {
  return <section className="hero on-dark" aria-labelledby="home-title">
    <Image className="hero-poster" src={hero.poster.src} alt={hero.poster.alt} fill sizes="100vw" preload />
    {hero.video ? <HeroVideo src={hero.video.src} poster={hero.poster.src} /> : null}
    <div className="hero-shade pointer-events-none" />
    <div className="shell hero-content pointer-events-none">
      <p className="eyebrow">Um olhar particular sobre o morar</p>
      <h1 id="home-title" className="display hero-title">Lugares que<br />fazem <em>sentido.</em></h1>
      <p className="hero-copy">Arquitetura com intenção. Escolhas com calma.<br />Imóveis para o seu jeito de viver.</p>
      <a href="#selecao" className="text-link mt-7 w-fit pointer-events-auto">Explore a seleção <ArrowUpRight aria-hidden="true" /></a>
    </div>
    <div className="hero-bottom pointer-events-none"><div className="shell flex items-end gap-4"><ArrowDown size={15} strokeWidth={1} aria-hidden="true" /><p className="hero-location text-[9px] tracking-[.06em]">Arquitetura & vida ao ar livre<br /><span className="text-[8px] opacity-80">Filme e fotografia de referência</span></p></div></div>
  </section>;
}
