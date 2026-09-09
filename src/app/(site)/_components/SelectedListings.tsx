import { SiteLink as Link } from "@/components/ui/SiteLink";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import type { Property } from "@/types/property";
import { CuratedSelection } from "./CuratedSelection";

export function SelectedListings({ properties, hasSearch, whatsapp }: { properties: Property[]; hasSearch: boolean; whatsapp: string | null }) {
  return <section id="selecao" className="selected-section section-space" aria-labelledby="selected-heading"><div className="shell">
    <Reveal><div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><h2 id="selected-heading" className="display section-title">A seleção de<br />Tomás Avelar.</h2></div><Link className="text-link" href={hasSearch ? "/?selection=all#selecao" : "/imoveis"}>{hasSearch ? "Voltar à curadoria" : "Ver o catálogo"}<ArrowUpRight aria-hidden="true" /></Link></div></Reveal>
    {hasSearch ? <p role="status" className="mb-7 text-xs text-muted">{properties.length === 0 ? "Nenhum imóvel encontrado nesta seleção." : `${properties.length} ${properties.length === 1 ? "imóvel encontrado" : "imóveis encontrados"} nesta seleção.`}</p> : null}
    {properties.length ? <CuratedSelection key={properties.map((p) => p.id).join(",")} properties={properties} whatsapp={whatsapp} /> : <div className="border-y border-line py-12"><h3 className="display text-4xl">Vamos ampliar o olhar?</h3><p className="mt-4 max-w-md text-sm leading-7 text-muted">Ainda não há um imóvel com essa combinação. Experimente outro bairro ou retire um dos critérios acima.</p><Link href="/?selection=all#selecao" className="text-link mt-5">Limpar busca e ver a seleção<ArrowUpRight aria-hidden="true" /></Link></div>}
  </div></section>;
}
