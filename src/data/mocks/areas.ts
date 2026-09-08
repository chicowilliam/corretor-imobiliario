import type { Area, NearbyPlace } from "@/types/area";
import type { ImageAsset } from "@/types/shared";
import { media } from "./media";

function area(slug: string, name: string, description: string, heroImage: ImageAsset, places: [string, NearbyPlace["category"]][], city = "Belo Horizonte"): Area {
  return {
    id: `area-${slug}`, slug, name, city, state: "MG", description,
    highlights: [], heroImage, gallery: [], map: null,
    nearbyPlaces: places.map(([name, category], index) => ({ id: `${slug}-${index}`, name, category, location: null, distanceMeters: null, travelMinutes: null, travelMode: null })),
    seo: { title: `${name}, ${city} — Tomás Avelar`, description, socialImage: heroImage, noIndex: true },
  };
}

// Real geography; photographs and residential scenarios remain illustrative.
// Distances are deliberately absent without an actual property address.
export const areas: Area[] = [
  area("cidade-jardim", "Cidade Jardim", "Casas, jardins maduros e a memória residencial de Belo Horizonte. Um bairro para olhar a arquitetura de perto.", media.interior, [["Museu Histórico Abílio Barreto", "CULTURE"]]),
  area("lourdes", "Lourdes", "Apartamentos amplos, restaurantes e a vida cultural do entorno da Praça da Liberdade.", media.apartment, [["Praça da Liberdade", "CULTURE"], ["Restaurantes de Lourdes", "DINING"]]),
  area("belvedere", "Belvedere", "Casas e apartamentos na paisagem de relevo da região Centro-Sul, com o horizonte da serra como referência.", media.courtyard, [["BH Shopping", "SHOPPING"]]),
  area("savassi", "Savassi", "Esquinas vivas, cafés e espaços culturais. A cidade acontece na escala de uma caminhada pelo bairro.", media.loft, [["Praça Diogo de Vasconcelos", "CULTURE"], ["Cafés da Savassi", "DINING"]]),
  area("santo-antonio", "Santo Antônio", "Ruas em diferentes cotas, comércio de vizinhança e edifícios que abrem novas perspectivas sobre a cidade.", media.terrace, [["Comércio da Rua Leopoldina", "SHOPPING"]]),
  area("mangabeiras", "Mangabeiras", "Casas ao pé da Serra do Curral, perto da paisagem preservada do Parque das Mangabeiras. A topografia participa do projeto.", media.hero, [["Parque das Mangabeiras", "PARK"], ["Parque da Serra do Curral", "PARK"]]),
  area("vila-da-serra", "Vila da Serra", "Em Nova Lima, na continuidade metropolitana de Belo Horizonte: apartamentos contemporâneos e um horizonte de montanhas.", media.apartment, [["Comércio da Alameda Oscar Niemeyer", "SHOPPING"]], "Nova Lima"),
];
