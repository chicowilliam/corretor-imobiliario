import Image from "next/image";
import { HeroVideo } from "./HeroVideo";

interface HeroMediaProps {
  /** Still image, also required as a resilient poster when videoSrc is supplied. */
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
  objectPosition?: string;
}

export function HeroMedia({ imageSrc, imageAlt, videoSrc, objectPosition = "center 58%" }: HeroMediaProps) {
  const poster = <Image className="hero-poster" src={imageSrc} alt={imageAlt} fill sizes="100vw" preload style={{ objectPosition }} />;
  return videoSrc
    ? <HeroVideo key={videoSrc} src={videoSrc} poster={imageSrc} objectPosition={objectPosition}>{poster}</HeroVideo>
    : <div className="hero-media" data-hero-media><div className="hero-pointer-layer"><div className="hero-focus-layer">{poster}</div></div></div>;
}
