import { demoSocial } from "@/data/mocks/social";
import { createWhatsAppLink } from "@/lib/whatsapp/create-link";

export function FloatingWhatsApp() {
  const href = createWhatsAppLink(demoSocial.whatsapp, "Olá, Tomás! Gostaria de conversar sobre sua curadoria imobiliária.")!;
  return <a className="floating-whatsapp" href={href} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp — contato demonstrativo" title="WhatsApp · número demonstrativo">
    <svg viewBox="0 0 32 32" width="27" height="27" fill="currentColor" aria-hidden="true"><path d="M16 .8A15.1 15.1 0 0 0 3 23.6L.9 31l7.6-2A15.2 15.2 0 1 0 16 .8Zm0 27.8a12.5 12.5 0 0 1-6.4-1.8l-.5-.3-4.5 1.2 1.2-4.4-.3-.5A12.6 12.6 0 1 1 16 28.6Zm7-9.4c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2-.3.4-1 1.2-1.2 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7.4-.6c.1-.3 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5Z" /></svg>
    <span className="floating-whatsapp-label">Vamos conversar<small>WhatsApp · demonstração</small></span>
  </a>;
}
