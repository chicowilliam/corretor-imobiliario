import type { Area, NearbyPlace } from "@/types/area";
import { media } from "./media";

function place(id: string, name: string, category: NearbyPlace["category"]): NearbyPlace {
  return { id, name, category, location: null, distanceMeters: null, travelMinutes: null, travelMode: null };
}

export const areas: Area[] = [
  {
    id: "area-jardins", slug: "jardins", name: "Jardins", city: "São Paulo", state: "SP",
    description: "Ruas arborizadas, casas com história e uma vida cultural que se descobre a pé.",
    highlights: ["Arquitetura", "Cultura", "Ruas arborizadas"], heroImage: media.interior, gallery: [], map: null,
    nearbyPlaces: [place("jardins-culture", "Galerias de arte da região", "CULTURE"), place("jardins-shopping", "Comércio de bairro", "SHOPPING")],
    seo: { title: "Jardins — Tomás Avelar", description: "Um olhar sobre a arquitetura e a vida nos Jardins.", socialImage: media.interior, noIndex: true },
  },
  {
    id: "area-pinheiros", slug: "alto-de-pinheiros", name: "Alto de Pinheiros", city: "São Paulo", state: "SP",
    description: "Casas abertas para o verde e um ritmo mais tranquilo dentro da cidade.",
    highlights: ["Jardins", "Vida ao ar livre", "Casas"], heroImage: media.courtyard, gallery: [], map: null,
    nearbyPlaces: [place("pinheiros-park", "Parque Villa-Lobos", "PARK"), place("pinheiros-dining", "Cafés da vizinhança", "DINING")],
    seo: { title: "Alto de Pinheiros — Tomás Avelar", description: "Casas e jardins em Alto de Pinheiros.", socialImage: media.courtyard, noIndex: true },
  },
  {
    id: "area-itaim", slug: "itaim-bibi", name: "Itaim Bibi", city: "São Paulo", state: "SP",
    description: "A conveniência da vida urbana, entre bons restaurantes e espaços para respirar.",
    highlights: ["Gastronomia", "Vida urbana", "Apartamentos"], heroImage: media.terrace, gallery: [], map: null,
    nearbyPlaces: [place("itaim-park", "Parque do Povo", "PARK"), place("itaim-dining", "Restaurantes do bairro", "DINING")],
    seo: { title: "Itaim Bibi — Tomás Avelar", description: "Um olhar sobre a vida no Itaim Bibi.", socialImage: media.terrace, noIndex: true },
  },
  {
    id: "area-vila", slug: "vila-madalena", name: "Vila Madalena", city: "São Paulo", state: "SP",
    description: "Ateliês, cafés e uma arquitetura que deixa espaço para a personalidade.",
    highlights: ["Arte", "Cafés", "Vida de bairro"], heroImage: media.loft, gallery: [], map: null,
    nearbyPlaces: [place("vila-culture", "Ateliês e galerias locais", "CULTURE"), place("vila-transit", "Estação Vila Madalena", "TRANSIT")],
    seo: { title: "Vila Madalena — Tomás Avelar", description: "Arquitetura e vida de bairro na Vila Madalena.", socialImage: media.loft, noIndex: true },
  },
];
