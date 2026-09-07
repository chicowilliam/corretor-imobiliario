import type { Testimonial } from "@/types/testimonial";
import { Reveal } from "@/components/motion/Reveal";
import { TestimonialCarousel } from "./TestimonialCarousel";

export function SocialProof({ testimonials }: { testimonials: Testimonial[] }) {
  return <section className="shell section-space" aria-labelledby="stories-heading"><Reveal className="testimonial-layout"><div><h2 id="stories-heading" className="display text-[44px] leading-[1.04]">O que fica<br />é a confiança.</h2></div><TestimonialCarousel testimonials={testimonials} /></Reveal></section>;
}
