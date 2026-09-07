import { agents } from "@/data/mocks/agents";
import { areas } from "@/data/mocks/areas";
import { properties } from "@/data/mocks/properties";
import { testimonials } from "@/data/mocks/testimonials";
import { validateMocks } from "@/data/mocks/validate";
import { filterHomeProperties } from "@/domain/property/filters";
import type { HomePropertySearch } from "@/types/property";

export async function getCatalogContent(search: HomePropertySearch) {
  validateMocks({ agents, areas, properties, testimonials });
  const agent = agents.find((item) => item.id === "agent-tomas");
  if (!agent) throw new Error("Catalog agent is missing");

  const hasSearch = Boolean(search.purpose || search.areaId || search.type);
  const listings = filterHomeProperties(properties, search);

  return { agent, areas, listings, hasSearch, totalPublic: filterHomeProperties(properties, {}).length };
}
