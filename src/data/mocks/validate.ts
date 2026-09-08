import type { Agent } from "@/types/agent";
import type { Area } from "@/types/area";
import type { Property } from "@/types/property";
import type { Testimonial } from "@/types/testimonial";

export function validateMocks(data: { agents: Agent[]; areas: Area[]; properties: Property[]; testimonials: Testimonial[] }): void {
  for (const [name, records] of Object.entries(data)) {
    if (new Set(records.map((record) => record.id)).size !== records.length) throw new Error(`Duplicate mock ID: ${name}`);
  }
  if (new Set(data.properties.map((property) => property.slug)).size !== data.properties.length) throw new Error("Duplicate property slug");
  for (const property of data.properties) {
    if (!data.agents.some((agent) => agent.id === property.agentId)) throw new Error(`Unknown agent: ${property.id}`);
    if (property.areaId && !data.areas.some((area) => area.id === property.areaId)) throw new Error(`Unknown area: ${property.id}`);
    const location = data.areas.find(area => area.id === property.areaId);
    if (location && (property.city !== location.city || property.neighborhood !== location.name || property.address.state !== location.state)) throw new Error(`Inconsistent mock geography: ${property.id}`);
    if (property.priceVisibility === "ON_REQUEST" && property.price !== null) throw new Error(`Private price exposed: ${property.id}`);
    if (property.price !== null && (!Number.isSafeInteger(property.price) || property.price <= 0)) throw new Error(`Invalid price: ${property.id}`);
    if (property.area <= 0 || (property.suites ?? 0) > (property.bedrooms ?? 0)) throw new Error(`Invalid property facts: ${property.id}`);
    if (property.highlights.includes("PRICE_REDUCED") && !(property.price !== null && property.previousPrice !== null && property.previousPrice > property.price)) throw new Error(`Invalid price reduction: ${property.id}`);
  }
  for (const agent of data.agents) {
    if (!agent.isFictional || agent.creci !== null || agent.metrics.some((metric) => !metric.isFictional)) throw new Error("Demo agent must be explicitly fictional");
  }
  if (data.testimonials.some((testimonial) => !testimonial.isFictional)) throw new Error("Testimonials must be fictional");
}
