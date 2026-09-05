import type { GeoPoint, ID, ImageAsset, SEO } from "./shared";

export interface NearbyPlace {
  id: ID;
  name: string;
  category: "PARK" | "SCHOOL" | "DINING" | "SHOPPING" | "HEALTH" | "TRANSIT" | "CULTURE";
  location: GeoPoint | null;
  distanceMeters: number | null;
  travelMinutes: number | null;
  travelMode: "WALK" | "DRIVE" | "TRANSIT" | null;
}

export interface Area {
  id: ID;
  slug: string;
  name: string;
  city: string;
  state: string;
  description: string;
  highlights: string[];
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  map: { center: GeoPoint; zoom: number; externalUrl: string | null } | null;
  nearbyPlaces: NearbyPlace[];
  seo: SEO;
}
