import type { Property } from "@/types/property";
import type { ImageAsset } from "@/types/shared";
import { media } from "./media";

// All prices are integer BRL cents. No real addresses, listings or contacts.
const timestamp = "2026-09-01T12:00:00.000Z";
const cardFocalPoints: Record<string, string> = { interior: "50% 25%", apartment: "50% 58%", courtyard: "50% 45%", loft: "75% 50%", terrace: "50% 55%", hero: "50% 60%" };
type PropertyInput = Pick<Property, "id" | "reference" | "slug" | "title" | "excerpt" | "type" | "purpose" | "price" | "neighborhood" | "areaId" | "area" | "bedrooms" | "suites" | "bathrooms" | "parking"> & Partial<Property> & { cover: ImageAsset };

function property({ cover, ...input }: PropertyInput): Property {
  return {
    description: input.excerpt,
    status: "PUBLISHED", highlights: [], collection: "PUBLIC",
    previousPrice: null, currency: "BRL", priceVisibility: "PUBLIC",
    pricePeriod: input.purpose === "RENT" ? "MONTH" : "TOTAL",
    condominiumFee: null, propertyTax: null, propertyTaxPeriod: null,
    city: "Belo Horizonte",
    address: { street: null, number: null, complement: null, postalCode: null, state: "MG", countryCode: "BR", visibility: "NEIGHBORHOOD" },
    lat: null, lng: null, areaKind: input.type === "HOUSE" ? "BUILT" : "PRIVATE", lotArea: null,
    features: [],
    media: { cover, card: { objectPosition: cardFocalPoints[cover.id] ?? "center", video: null }, gallery: [cover], video: null, floorPlans: [], virtualTourUrl: null },
    agentId: "agent-tomas", developmentId: null,
    seo: { title: `${input.title} — Tomás Avelar`, description: input.excerpt, socialImage: cover, noIndex: true },
    publishedAt: timestamp, createdAt: timestamp, updatedAt: timestamp,
    ...input,
  };
}

export const properties: Property[] = [
  property({
    id: "property-jardim", reference: "TA-001", slug: "casa-entre-jardins", title: "Casa entre jardins",
    excerpt: "O verde entra, a cidade desacelera. Uma casa que faz da luz natural o seu melhor projeto.",
    description: "Ambientes que se abrem para um jardim maduro, materiais que envelhecem bem e espaço para viver sem pressa. A sala integra estar, leitura e refeições, enquanto a ala íntima preserva o silêncio. A planta valoriza o jardim e conversa com a tradição das casas modernistas de Belo Horizonte. Cenário residencial fictício em Cidade Jardim.",
    type: "HOUSE", purpose: "SALE", price: 640_000_000, neighborhood: "Cidade Jardim", areaId: "area-cidade-jardim",
    area: 420, lotArea: 680, bedrooms: 4, suites: 4, bathrooms: 6, parking: 4,
    status: "EXCLUSIVE", highlights: ["EXCLUSIVE"], cover: media.interior,
    features: [{ id: "garden", label: "Jardim privativo", category: "OUTDOOR" }, { id: "natural-light", label: "Luz natural", category: "INTERIOR" }],
  }),
  property({
    id: "property-horizonte", reference: "TA-002", slug: "horizonte-lourdes", title: "Um novo ponto de vista",
    excerpt: "Uma planta generosa em Lourdes, entre o recolhimento da casa e a vida cultural do entorno da Liberdade.",
    type: "APARTMENT", purpose: "SALE", price: 325_000_000, neighborhood: "Lourdes", areaId: "area-lourdes",
    area: 238, bedrooms: 3, suites: 3, bathrooms: 4, parking: 3,
    status: "JUST_LISTED", highlights: ["JUST_LISTED"], cover: media.apartment,
    condominiumFee: 380_000,
    features: [{ id: "open-plan", label: "Planta integrada", category: "INTERIOR" }],
  }),
  property({
    id: "property-patio", reference: "TA-003", slug: "casa-patio", title: "A vida ao redor do pátio",
    excerpt: "No Belvedere, volumes simples e um pátio protegido dão escala íntima à casa. O jardim participa da rotina.",
    type: "HOUSE", purpose: "SALE", price: 495_000_000, previousPrice: 540_000_000,
    neighborhood: "Belvedere", areaId: "area-belvedere", area: 360, lotArea: 510,
    bedrooms: 4, suites: 3, bathrooms: 5, parking: 3,
    status: "PRICE_REDUCED", highlights: ["PRICE_REDUCED"], cover: media.courtyard,
    features: [{ id: "pool", label: "Piscina", category: "OUTDOOR" }, { id: "garden", label: "Jardim privativo", category: "OUTDOOR" }],
  }),
  property({
    id: "property-loft", reference: "TA-004", slug: "duplex-savassi", title: "Texturas de uma vida urbana",
    excerpt: "Madeira e luz em um duplex na Savassi. Cafés, livrarias e a vida do bairro fazem parte do endereço.",
    type: "APARTMENT", purpose: "RENT", price: 880_000, neighborhood: "Savassi", areaId: "area-savassi",
    area: 112, bedrooms: 2, suites: 1, bathrooms: 2, parking: 1,
    status: "JUST_LISTED", highlights: ["JUST_LISTED"], cover: media.loft, condominiumFee: 130_000,
    features: [{ id: "open-plan", label: "Planta integrada", category: "INTERIOR" }],
  }),
  property({
    id: "property-terraco", reference: "TA-005", slug: "terraco-vila-da-serra", title: "Um jardim sobre a cidade",
    excerpt: "Em Vila da Serra, Nova Lima, um terraço para cultivar um jardim e acompanhar a luz sobre a paisagem de montanhas.",
    type: "PENTHOUSE", purpose: "RENT", price: 1_750_000, city: "Nova Lima", neighborhood: "Vila da Serra", areaId: "area-vila-da-serra",
    area: 285, bedrooms: 3, suites: 3, bathrooms: 4, parking: 3,
    highlights: ["EXCLUSIVE"], cover: media.terrace, condominiumFee: 420_000,
    features: [{ id: "terrace", label: "Terraço privativo", category: "OUTDOOR" }],
  }),
  property({
    id: "property-reserva", reference: "TA-006", slug: "casa-reserva", title: "Entre o concreto e a natureza",
    excerpt: "Em Mangabeiras, arquitetura horizontal e jardim na paisagem da Serra do Curral. Uma apresentação reservada, próxima ao parque.",
    type: "HOUSE", purpose: "SALE", price: null, priceVisibility: "ON_REQUEST", collection: "PRIVATE",
    neighborhood: "Mangabeiras", areaId: "area-mangabeiras", area: 580, lotArea: 920,
    bedrooms: 4, suites: 4, bathrooms: 6, parking: 5,
    status: "EXCLUSIVE", highlights: ["EXCLUSIVE"], cover: media.hero,
    features: [{ id: "garden", label: "Jardim privativo", category: "OUTDOOR" }, { id: "reflecting-pool", label: "Espelho d’água", category: "OUTDOOR" }],
  }),
];
