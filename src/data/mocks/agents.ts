import type { Agent } from "@/types/agent";
import { media } from "./media";

export const agents = [{
  id: "agent-tomas", name: "Tomás Avelar", slug: "tomas-avelar", photo: media.agent,
  creci: null,
  headline: "Antes de encontrar um imóvel, eu entendo o seu momento.",
  bio: "Uma boa escolha começa com uma conversa. Meu trabalho é aproximar o seu jeito de viver de lugares que fazem sentido — com um olhar atento à arquitetura, ao bairro e ao que realmente importa para você.",
  phone: null, whatsapp: null, email: null, instagram: null,
  areas: ["area-jardins", "area-pinheiros", "area-itaim", "area-vila"],
  specialties: ["HOUSE", "APARTMENT", "PENTHOUSE"],
  languages: ["pt-BR", "en"],
  metrics: [
    { id: "experience", label: "anos de experiência", value: 12, unit: "YEARS", periodLabel: null, isFictional: true },
    { id: "homes", label: "histórias acompanhadas", value: 140, unit: "PROPERTIES", periodLabel: "Ao longo da trajetória", isFictional: true },
  ],
  isFictional: true,
}] satisfies Agent[];
