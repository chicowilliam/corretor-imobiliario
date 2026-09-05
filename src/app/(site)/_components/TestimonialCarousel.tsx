"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Testimonial } from "@/types/testimonial";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  if (!item) return null;
  return <div aria-roledescription="carrossel" aria-label="Depoimentos ilustrativos">
    <div aria-live="polite" aria-atomic="true"><blockquote className="quote-text">“{item.quote}”</blockquote><p className="mt-7 text-xs font-medium">{item.displayName}</p><p className="mt-2 text-[10px] text-muted">{item.context}</p></div>
    <div className="mt-8 flex items-center justify-between gap-3"><p className="text-[10px] text-muted">{String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</p><div className="flex gap-2"><button className="quote-control" aria-label="Depoimento anterior" onClick={() => setIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}><ArrowLeft size={16} strokeWidth={1.3} /></button><button className="quote-control" aria-label="Próximo depoimento" onClick={() => setIndex((current) => (current + 1) % testimonials.length)}><ArrowRight size={16} strokeWidth={1.3} /></button></div></div>
    <p className="mt-5 text-[9px] leading-5 text-muted">Depoimentos fictícios, escritos para demonstrar esta experiência.</p>
  </div>;
}
