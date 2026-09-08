import type { Agent } from "@/types/agent";
import { media } from "./media";

export const agents = [{
  id: "agent-tomas", name: "Tomás Avelar", slug: "tomas-avelar", photo: media.agent,
  creci: null,
  headline: "Antes de encontrar um imóvel, eu entendo o seu momento.",
  bio: "Em Belo Horizonte, o relevo muda a luz, a vista e o jeito de chegar em casa. Meu olhar parte dessa relação: uma planta bem resolvida, a memória modernista da cidade e o bairro que combina com a sua rotina.",
  phone: null, whatsapp: null, email: null, instagram: null,
  areas: ["area-cidade-jardim", "area-lourdes", "area-belvedere", "area-savassi", "area-santo-antonio", "area-mangabeiras", "area-vila-da-serra"],
  specialties: ["HOUSE", "APARTMENT", "PENTHOUSE"],
  languages: ["pt-BR", "en"],
  metrics: [
    { id: "experience", label: "anos de experiência", value: 12, unit: "YEARS", periodLabel: null, isFictional: true },
    { id: "homes", label: "histórias acompanhadas", value: 140, unit: "PROPERTIES", periodLabel: "Ao longo da trajetória", isFictional: true },
  ],
  isFictional: true,
}] satisfies Agent[];
