"use client";

import { House, MapPin, KeyRound } from "lucide-react";
import { SelectField } from "@/components/ui/SelectField";
import type { HomePropertySearch } from "@/types/property";

export function PropertySearchFields({ areas, search, prefix }: {
  areas: { id: string; name: string }[]; search: HomePropertySearch; prefix: string;
}) {
  return <>
    <SelectField id={prefix + "-purpose"} name="purpose" label="Seu próximo passo" defaultValue={search.purpose ?? ""} icon={<KeyRound size={15} />}
      options={[{ value: "", label: "Comprar ou alugar" }, { value: "SALE", label: "Quero comprar" }, { value: "RENT", label: "Quero alugar" }]} />
    <SelectField id={prefix + "-area"} name="area" label="Onde você quer viver" defaultValue={search.areaId ?? ""} icon={<MapPin size={15} />}
      options={[{ value: "", label: "Todos os bairros" }, ...areas.map(area => ({ value: area.id, label: area.name === "Vila da Serra" ? "Vila da Serra · Nova Lima" : area.name }))]} />
    <SelectField id={prefix + "-type"} name="type" label="Tipo de imóvel" defaultValue={search.type ?? ""} icon={<House size={15} />}
      options={[{ value: "", label: "Todas as possibilidades" }, { value: "HOUSE", label: "Casa" }, { value: "APARTMENT", label: "Apartamento" }, { value: "PENTHOUSE", label: "Cobertura" }]} />
  </>;
}
