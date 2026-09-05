import type { HomePropertySearch, Property } from "../../types/property";

export function isPublicListing(property: Property): boolean {
  return property.collection === "PUBLIC" && ["PUBLISHED", "EXCLUSIVE", "JUST_LISTED", "PRICE_REDUCED"].includes(property.status);
}

export function filterHomeProperties(properties: readonly Property[], search: HomePropertySearch): Property[] {
  return properties.filter((property) =>
    isPublicListing(property) &&
    (!search.purpose || property.purpose === search.purpose) &&
    (!search.areaId || property.areaId === search.areaId) &&
    (!search.type || property.type === search.type),
  );
}
