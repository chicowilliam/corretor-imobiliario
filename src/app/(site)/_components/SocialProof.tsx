import type { Testimonial } from "@/types/testimonial";
import { Reveal } from "@/components/motion/Reveal";
import { TestimonialCarousel } from "./TestimonialCarousel";

export function SocialProof({ testimonials }: { testimonials: Testimonial[] }) {
  return <section className="shell section-space" aria-labelledby="stories-heading"><Reveal className="testimonial-layout"><div><span className="eyebrow mb-5 text-olive">Além das chaves</span><h2 id="stories-heading" className="display text-[44px] leading-[1.04]">O que fica<br />é a <em>confiança.</em></h2></div><TestimonialCarousel testimonials={testimonials} /></Reveal></section>;
}
