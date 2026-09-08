"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

type ConnectionNavigator = Navigator & { connection?: { saveData?: boolean } };

export function HeroVideo({ src, poster, objectPosition, children }: { src: string; poster: string; objectPosition?: string; children: ReactNode }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(true);
  const pausedByUser = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const image = video.parentElement?.querySelector("img");
    const edge = video.closest(".hero-chapter")?.nextElementSibling?.querySelector(".hero-exit-edge");
    // Reuse the responsive, preloaded poster instead of fetching the raw file again.
    const syncPoster = () => { video.poster = image?.currentSrc || poster; };
    syncPoster();
    image?.addEventListener("load", syncPoster);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let covered = edge ? edge.getBoundingClientRect().bottom <= 0 : false;
    function sync() {
      if (!video) return;
      const staticOnly = media.matches || Boolean((navigator as ConnectionNavigator).connection?.saveData);
      setReduced(staticOnly);
      if (staticOnly) { video.pause(); if (video.getAttribute("src")) { video.removeAttribute("src"); video.load(); } return; }
      if (!visible || covered || document.hidden || pausedByUser.current) { video.pause(); return; }
      if (!video.getAttribute("src")) { video.src = src; video.load(); }
      if (visible && !document.hidden && !pausedByUser.current) void video.play().catch(() => { setPlaying(false); });
      else video.pause();
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    observer.observe(video);
    const coverage = new IntersectionObserver(([entry]) => { covered = entry.boundingClientRect.bottom <= 0; sync(); });
    if (edge) coverage.observe(edge);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => { observer.disconnect(); coverage.disconnect(); image?.removeEventListener("load", syncPoster); media.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); video.pause(); };
  }, [src, poster]);

  return <>
    <div className="hero-media" data-hero-media>
      <div className="hero-pointer-layer"><div className="hero-focus-layer">
      {children}
      <video ref={ref} className="hero-video" style={{ objectPosition }} data-playing={ready && !failed && !reduced} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => { setReady(true); setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => { setFailed(true); setPlaying(false); }} />
      <div className="hero-soft-veil" aria-hidden="true" />
      </div></div>
    </div>
    {!reduced && !failed ? <div className="absolute inset-x-0 bottom-8 z-10 pointer-events-none"><div className="shell flex justify-end"><button type="button" className="video-toggle pointer-events-auto" onClick={() => {
      if (!ref.current) return;
      if (playing) { pausedByUser.current = true; ref.current.pause(); }
      else { pausedByUser.current = false; void ref.current.play().catch(() => setFailed(true)); }
    }} aria-label={playing ? "Pausar vídeo de apresentação" : "Reproduzir vídeo de apresentação"}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}<span>{playing ? "Pausar filme" : "Ver filme"}</span></button></div></div> : null}
  </>;
}
