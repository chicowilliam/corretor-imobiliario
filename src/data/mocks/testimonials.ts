import type { Testimonial } from "@/types/testimonial";

export const testimonials = [
  { id: "testimonial-1", displayName: "Marina & André", context: "Compra de uma casa · Cidade Jardim", quote: "Ele entendeu o que buscávamos antes mesmo de conseguirmos colocar tudo em palavras. Visitamos poucos lugares, mas todos faziam sentido.", isFictional: true },
  { id: "testimonial-2", displayName: "Helena M.", context: "Venda de um apartamento · Lourdes", quote: "Meu apartamento foi apresentado com o mesmo cuidado que eu tinha com ele. O processo foi claro, do primeiro encontro à última conversa.", isFictional: true },
  { id: "testimonial-3", displayName: "Ricardo L.", context: "Locação · Savassi", quote: "Mais do que os metros quadrados, conversamos sobre a minha rotina. Foi isso que fez a escolha funcionar.", isFictional: true },
] satisfies Testimonial[];
