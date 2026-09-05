import type { ID } from "./shared";

export interface Testimonial {
  id: ID;
  displayName: string;
  context: string;
  quote: string;
  isFictional: boolean;
}
