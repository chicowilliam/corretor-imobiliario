"use client";

import { useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PropertySearchFields } from "@/components/property/PropertySearchFields";
import { ButtonContent } from "@/components/motion/ButtonContent";
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
      <PropertySearchFields areas={areas} search={search} prefix="home" />
      <input type="hidden" name="selection" value="all" />
      <button type="submit" className="solid-button search-submit" disabled={pending}><ButtonContent icon={<ArrowRight />}>{pending ? "Buscando…" : "Encontrar meu lugar"}</ButtonContent></button>
    </form>
  </section>;
}
