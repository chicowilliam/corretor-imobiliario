# Desktop motion performance — 8 de setembro de 2026

## Gargalos

- Filtro permanente em vídeo/poster do Hero enquanto o mesmo layer recebia parallax (transform + filter).
- Blur animado via `filter` no focus layer na abertura.
- `getBoundingClientRect` e springs/tilts sem RAF ou com listeners de scroll sempre ativos.
- Header atualizando React state a cada mudança de direção do scroll.
- `lagSmoothing(0)` no ticker GSAP, impedindo recuperação sob carga.

## Otimizações (visual preservado)

- Cor do Hero migrada para overlay estático (`.hero-grade`); vídeo/poster sem `filter`.
- Abertura usa véu (`.hero-soft-veil`) com opacity em vez de animar `filter` no media.
- Hero pointer: rect cacheado + pointermove coalescido em RAF; `force3D` nos tweens.
- Cards: tilt com RAF; reset de scroll só enquanto o card está em hover; perspectiva no MotionValue.
- Cursor customizado removido; o site usa o cursor padrão do sistema.
- Header: `data-hidden` via ref/atributo, sem re-render React no scroll.
- ListingSequence: não reinicia entrada quando a identidade de `children` muda.
- AdvisorStory: `force3D` + `fastScrollEnd` mantendo scrub por frase.
- MotionProvider: `lagSmoothing(500, 33)` e `ScrollTrigger.config({ ignoreMobileResize, limitCallbacks })`.

## Validação

Rodar: `npm run build`, `npm run lint`, `npm test`. Revisar desktop (scroll, hover, abertura, header) e smoke mobile.
