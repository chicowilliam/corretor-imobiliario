import type { Metadata } from "next";
import { getCatalogContent } from "@/data/queries/catalog";
import { parseHomeSearch, type SearchParams } from "@/lib/catalog/search-params";
import { CatalogSearch } from "./_components/CatalogSearch";
import { CatalogResults } from "./_components/CatalogResults";

export const metadata: Metadata = {
  title: "Imóveis — Tomás Avelar",
  description: "Catálogo demonstrativo de imóveis selecionados em São Paulo.",
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const search = parseHomeSearch(params);
  const content = await getCatalogContent(search);

  return <main id="conteudo">
    <CatalogSearch areas={content.areas.map(({ id, name }) => ({ id, name }))} search={search} />
    <CatalogResults properties={content.listings} hasSearch={content.hasSearch} whatsapp={content.agent.whatsapp} />
  </main>;
}
