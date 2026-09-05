import type { HomePropertySearch, PropertyType } from "@/types/property";

export type SearchParams = Record<string, string | string[] | undefined>;
const types: PropertyType[] = ["HOUSE", "APARTMENT", "PENTHOUSE"];

export function parseHomeSearch(params: SearchParams): HomePropertySearch {
  return {
    purpose: params.purpose === "SALE" || params.purpose === "RENT" ? params.purpose : undefined,
    areaId: typeof params.area === "string" ? params.area : undefined,
    type: typeof params.type === "string" && types.includes(params.type as PropertyType) ? params.type as PropertyType : undefined,
  };
}
