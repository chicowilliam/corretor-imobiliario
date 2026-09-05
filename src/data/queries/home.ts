import { agents } from "@/data/mocks/agents";
import { areas } from "@/data/mocks/areas";
import { properties } from "@/data/mocks/properties";
import { testimonials } from "@/data/mocks/testimonials";
import { homeCuration } from "@/data/mocks/home";
import { validateMocks } from "@/data/mocks/validate";
import { filterHomeProperties } from "@/domain/property/filters";
import type { HomePropertySearch } from "@/types/property";

// Only this server-side query knows where the content comes from.
// A future CMS can replace these imports without changing Home components.
export async function getHomeContent(search: HomePropertySearch, showAll: boolean) {
  validateMocks({ agents, areas, properties, testimonials });
  const agent = agents.find((item) => item.id === homeCuration.agentId);
  const featured = properties.find((item) => item.id === homeCuration.featuredPropertyId);
  const privateProperty = properties.find((item) => item.id === homeCuration.privatePropertyId);
  if (!agent || !featured || !privateProperty) throw new Error("Home curation contains invalid references");

  const hasSearch = Boolean(search.purpose || search.areaId || search.type || showAll);
  const matches = filterHomeProperties(properties, search);
  const selected = hasSearch ? matches : homeCuration.selectedPropertyIds.map((id) => {
    const item = matches.find((property) => property.id === id);
    if (!item) throw new Error(`Invalid selected property: ${id}`);
    return item;
  });

  return { agent, featured, privateProperty, selected, areas, testimonials, hero: homeCuration.hero, hasSearch };
}
