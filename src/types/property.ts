import type { Currency, ID, ImageAsset, ISODateTime, SEO, VideoAsset } from "./shared";

export type PropertyStatus = "DRAFT" | "PUBLISHED" | "JUST_LISTED" | "EXCLUSIVE" | "PRICE_REDUCED" | "SOLD" | "RENTED" | "OFF_MARKET" | "COMING_SOON" | "ARCHIVED";
export type PropertyType = "APARTMENT" | "PENTHOUSE" | "HOUSE" | "CONDOMINIUM_HOUSE" | "STUDIO" | "LAND" | "COUNTRY_HOUSE" | "COMMERCIAL";
export type PropertyPurpose = "SALE" | "RENT";
export type PropertyHighlight = "JUST_LISTED" | "EXCLUSIVE" | "PRICE_REDUCED";

export interface PropertyAddress {
  street: string | null;
  number: string | null;
  complement: string | null;
  postalCode: string | null;
  state: string;
  countryCode: "BR";
  visibility: "EXACT" | "APPROXIMATE" | "NEIGHBORHOOD";
}

export interface PropertyFeature {
  id: ID;
  label: string;
  category: "INTERIOR" | "BUILDING" | "OUTDOOR" | "SECURITY" | "SUSTAINABILITY" | "ACCESSIBILITY";
}

export interface PropertyMedia {
  card?: { objectPosition: string; video: VideoAsset | null };
  cover: ImageAsset;
  gallery: ImageAsset[];
  video: VideoAsset | null;
  floorPlans: ImageAsset[];
  virtualTourUrl: string | null;
}

export interface Property {
  id: ID;
  reference: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  status: PropertyStatus;
  highlights: PropertyHighlight[];
  type: PropertyType;
  purpose: PropertyPurpose;
  collection: "PUBLIC" | "PRIVATE";
  price: number | null;
  previousPrice: number | null;
  currency: Currency;
  priceVisibility: "PUBLIC" | "ON_REQUEST";
  pricePeriod: "TOTAL" | "MONTH";
  condominiumFee: number | null;
  propertyTax: number | null;
  propertyTaxPeriod: "MONTH" | "YEAR" | null;
  city: string;
  neighborhood: string;
  address: PropertyAddress;
  lat: number | null;
  lng: number | null;
  areaId: ID | null;
  area: number;
  areaKind: "PRIVATE" | "BUILT" | "LAND";
  lotArea: number | null;
  bedrooms: number | null;
  suites: number | null;
  bathrooms: number | null;
  parking: number | null;
  features: PropertyFeature[];
  media: PropertyMedia;
  agentId: ID;
  developmentId: ID | null;
  seo: SEO;
  publishedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface HomePropertySearch {
  purpose?: PropertyPurpose;
  areaId?: ID;
  type?: PropertyType;
}
