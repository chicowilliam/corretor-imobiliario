import type { ImageAsset } from "@/types/shared";

// Existing reference photographs, downloaded locally. See docs/media-credits.md.
// They illustrate fictional listings; they do not depict actual offers.
function image(id: string, alt: string, width = 1536, height = 1024): ImageAsset {
  return { id, src: `/images/${id}.webp`, alt, width, height, blurDataURL: null };
}

export const media = {
  hero: image("hero", "Casa contemporânea branca com varanda, jardim e piscina", 1920, 1281),
  interior: image("interior", "Sala iluminada com sofá de couro, poltronas claras e uma composição de fotografias", 1400, 1050),
  apartment: image("apartment", "Sala integrada à cozinha, com painéis de madeira e portas abertas para o terraço", 1400, 952),
  courtyard: image("courtyard", "Fachada contemporânea com volumes brancos, revestimento de madeira e jardim", 1400, 1174),
  loft: image("loft", "Sala de jantar com mesa escura, escada e portas de vidro abertas para o deck", 1400, 933),
  terrace: image("terrace", "Sala de estar clara com escada de madeira e um cão deitado ao lado do sofá", 1400, 933),
  agent: image("agent", "Fotografia de referência de um homem de óculos e blazer; o perfil Tomás Avelar é fictício", 1400, 2100),
};
