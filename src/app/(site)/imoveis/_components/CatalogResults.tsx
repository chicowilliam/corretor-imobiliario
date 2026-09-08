import { SiteLink as Link } from "@/components/ui/SiteLink";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/types/property";
import { ListingSequence } from "@/components/motion/ListingSequence";

export function CatalogResults({ properties, hasSearch, whatsapp }: { properties: Property[]; hasSearch: boolean; whatsapp: string | null }) {
  return <section id="catalogo" className="selected-section section-space" aria-labelledby="catalog-heading">
    <div className="shell">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 id="catalog-heading" className="display section-title">Imóveis em<br />Belo Horizonte.</h1><p className="section-heading-note mt-5">E uma seleção no entorno, em Nova Lima.</p>
          </div>
          <Link className="text-link" href="/">Voltar à home<ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </Reveal>

      <p role="status" className="mb-7 text-xs text-muted">
        {properties.length === 0
          ? "Nenhum imóvel encontrado com esses critérios."
          : `${properties.length} ${properties.length === 1 ? "imóvel" : "imóveis"}${hasSearch ? " encontrados" : " disponíveis"}.`}
      </p>

      {properties.length ? (
        <ListingSequence key={properties.map((p) => p.id).join(",")}>
          {properties.map((property) => <PropertyCard key={property.id} property={property} whatsapp={whatsapp} />)}
        </ListingSequence>
      ) : (
        <div className="border-y border-line py-12">
          <h2 className="display text-4xl">Vamos ampliar o olhar?</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted">Ainda não há um imóvel com essa combinação. Experimente outro bairro ou retire um dos critérios acima.</p>
          <Link href="/imoveis" className="text-link mt-5">Limpar filtros e ver o catálogo<ArrowUpRight aria-hidden="true" /></Link>
        </div>
      )}
    </div>
  </section>;
}
