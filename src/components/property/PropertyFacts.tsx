import type { Property } from "@/types/property";

const areaLabels = { PRIVATE: "Área privativa", BUILT: "Área construída", LAND: "Terreno" };
const number = new Intl.NumberFormat("pt-BR");

/** A consistent reading order for listing, featured property and preview. */
export function PropertyFacts({ property }: { property: Pick<Property, "area" | "areaKind" | "suites" | "parking"> }) {
  return <dl className="property-facts" aria-label="Ficha técnica do imóvel">
    <div><dt>{areaLabels[property.areaKind]}</dt><dd>{number.format(property.area)} <span>m²</span></dd></div>
    <div><dt>Suítes</dt><dd>{property.suites ?? <span>Não informado</span>}</dd></div>
    <div><dt>Vagas</dt><dd>{property.parking ?? <span>Não informado</span>}</dd></div>
  </dl>;
}
