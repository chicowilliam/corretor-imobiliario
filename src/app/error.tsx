"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="shell section-space"><h1 className="display section-title">Não foi possível carregar a seleção.</h1><p className="my-6 text-sm text-muted">Tente carregar a página novamente.</p><button className="solid-button" onClick={reset}>Tentar novamente</button></main>;
}
