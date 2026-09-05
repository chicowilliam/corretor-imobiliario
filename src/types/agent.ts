import type { ID, ImageAsset } from "./shared";
import type { PropertyType } from "./property";

export interface AgentMetric {
  id: ID;
  label: string;
  value: number;
  unit: "YEARS" | "PROPERTIES" | "PERCENT";
  periodLabel: string | null;
  isFictional: boolean;
}

export interface Agent {
  id: ID;
  name: string;
  slug: string;
  photo: ImageAsset;
  creci: { number: string; state: string; category: "F" | "J" } | null;
  headline: string;
  bio: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  areas: ID[];
  specialties: PropertyType[];
  languages: string[];
  metrics: AgentMetric[];
  isFictional: boolean;
}
