import { media } from "./media";

export const homeCuration = {
  agentId: "agent-tomas",
  featuredPropertyId: "property-jardim",
  selectedPropertyIds: ["property-horizonte", "property-patio", "property-loft"],
  privatePropertyId: "property-reserva",
  hero: {
    poster: { ...media.hero, id: "hero-poster", src: "/images/hero-poster.jpg", width: 1920, height: 1080, alt: "Casa contemporânea com piscina, grandes janelas e jardim tropical; filmagem de referência" },
    video: { id: "home-film", src: "/videos/architecture-loop.mp4", poster: { ...media.hero, id: "hero-poster", src: "/images/hero-poster.jpg", width: 1920, height: 1080 }, title: "Arquitetura e vida ao ar livre — filmagem de referência", captionsSrc: null },
    location: "Filmagem de referência",
  },
};
