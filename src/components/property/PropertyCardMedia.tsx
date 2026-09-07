"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface PropertyCardMediaProps {
  imageSrc: string;
  imageAlt: string;
  videoSrc?: string;
  objectPosition?: string;
}

export function PropertyCardMedia({ imageSrc, imageAlt, videoSrc, objectPosition = "center" }: PropertyCardMediaProps) {
  const root = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const film = video.current;
    const trigger = root.current?.closest("button");
    if (!videoSrc || !film || !trigger) return;
    const preference = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let hovered = false;
    let visible = false;
    let failed = false;
    let disposed = false;
    const sync = () => {
      const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
      if (!hovered || !visible || !preference.matches || saveData || document.hidden || failed) {
        film.pause();
        if (!preference.matches || saveData) { film.removeAttribute("src"); film.load(); }
        return;
      }
      if (!film.getAttribute("src")) { film.src = videoSrc; film.load(); }
      void film.play().catch(() => { if (!disposed && hovered) { failed = true; setPlaying(false); } });
    };
    const enter = () => { hovered = true; sync(); };
    const leave = () => { hovered = false; sync(); };
    const error = () => { failed = true; setPlaying(false); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.1 });
    observer.observe(trigger);
    trigger.addEventListener("pointerenter", enter);
    trigger.addEventListener("pointerleave", leave);
    film.addEventListener("error", error);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      film.removeEventListener("error", error);
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      film.pause();
      film.removeAttribute("src");
      film.load();
    };
  }, [videoSrc]);
  return <span ref={root} className="card-media">
    <Image src={imageSrc} alt={imageAlt} fill loading="lazy" sizes="(max-width: 767px) 90vw, (max-width: 1023px) 44vw, (max-width: 1600px) 29vw, 450px" style={{ objectPosition }} />
    {videoSrc ? <video ref={video} poster={imageSrc} muted loop playsInline preload="none" aria-hidden="true" className="card-hover-video" data-playing={playing} style={{ objectPosition }} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} /> : null}
  </span>;
}
