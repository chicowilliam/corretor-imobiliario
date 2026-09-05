"use client";

import { useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { HomePropertySearch } from "@/types/property";

export function HomeSearch({ areas, search }: { areas: { id: string; name: string }[]; search: HomePropertySearch }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    for (const [key, value] of form.entries()) if (typeof value === "string" && value) query.set(key, value);
    query.set("selection", "all");
    startTransition(() => router.push(`/?${query.toString()}#selecao`));
  }

  return <section className="search-shell" aria-label="Encontre um imóvel na seleção">
    <form key={JSON.stringify(search)} action="/#selecao" method="get" className="shell home-search" onSubmit={submit} aria-busy={pending}>
      <div className="search-field"><label htmlFor="purpose">Seu próximo passo</label><select id="purpose" name="purpose" defaultValue={search.purpose ?? ""}><option value="">Comprar ou alugar</option><option value="SALE">Quero comprar</option><option value="RENT">Quero alugar</option></select></div>
      <div className="search-field"><label htmlFor="area">Onde você quer viver</label><select id="area" name="area" defaultValue={search.areaId ?? ""}><option value="">Todos os bairros</option>{areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}</select></div>
      <div className="search-field"><label htmlFor="type">Tipo de imóvel</label><select id="type" name="type" defaultValue={search.type ?? ""}><option value="">Todas as possibilidades</option><option value="HOUSE">Casa</option><option value="APARTMENT">Apartamento</option><option value="PENTHOUSE">Cobertura</option></select></div>
      <input type="hidden" name="selection" value="all" />
      <button type="submit" className="solid-button search-submit" disabled={pending}>{pending ? "Buscando…" : "Encontrar meu lugar"}<ArrowRight aria-hidden="true" /></button>
    </form>
  </section>;
}
