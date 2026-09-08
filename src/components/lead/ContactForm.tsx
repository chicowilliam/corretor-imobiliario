"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { ButtonContent } from "@/components/motion/ButtonContent";
import { createWhatsAppLink } from "@/lib/whatsapp/create-link";

export function ContactForm({ message, whatsapp = null, propertyTitle = "" }: { message: string; whatsapp?: string | null; propertyTitle?: string }) {
  const id = useId();
  const [method, setMethod] = useState("email");
  const [draft, setDraft] = useState(message);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const href = createWhatsAppLink(whatsapp, draft);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Portfolio only: no network request, storage or collection of personal data.
    setSent(true);
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function copy() {
    try { await navigator.clipboard.writeText(draft); setFeedback("Mensagem copiada."); }
    catch { setFeedback("Selecione a mensagem para copiar manualmente."); }
  }

  if (sent) return <div ref={statusRef} tabIndex={-1} className="contact-success" role="status">
    <Check size={28} strokeWidth={1.3} aria-hidden="true" />
    <h4 className="display mt-5 text-3xl">Conversa preparada.</h4>
    <p className="mt-4 text-sm leading-7 text-muted">Envio simulado com sucesso. Esta é uma demonstração: seus dados não foram enviados nem armazenados.</p>
    <button type="button" className="text-link mt-6" onClick={() => { setSent(false); setDraft(message); setFeedback(""); }}>Preparar outra mensagem <ArrowUpRight size={16} aria-hidden="true" /></button>
  </div>;

  return <form className="contact-form" onSubmit={submit}>
    <p id={`${id}-notice`} className="text-[13px] leading-7 text-muted">Conte o que faz sentido para você. Neste portfólio, o envio é simulado e nenhum dado é armazenado.</p>
    <label htmlFor={`${id}-name`}>Seu nome<input id={`${id}-name`} name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" /></label>
    <div className="contact-fields">
      <label htmlFor={`${id}-method`}>Prefere contato por<select id={`${id}-method`} value={method} onChange={event => setMethod(event.target.value)}><option value="email">E-mail</option><option value="tel">Telefone</option></select></label>
      <label htmlFor={`${id}-contact`}>{method === "email" ? "Seu e-mail" : "Seu telefone"}<input key={method} id={`${id}-contact`} name="contact" type={method} autoComplete={method} required maxLength={150} pattern={method === "tel" ? "(?=(?:\\D*\\d){8,15}\\D*$)[+0-9\\(\\) .\\-]{8,24}" : undefined} title={method === "tel" ? "Informe seu telefone com DDD." : undefined} /></label>
    </div>
    <label htmlFor={`${id}-interest`}>Imóvel ou tipo de interesse<input id={`${id}-interest`} name="interest" defaultValue={propertyTitle} maxLength={200} placeholder="Ex.: apartamento no Lourdes, venda do meu imóvel" /></label>
    <label htmlFor={`${id}-message`}>Sua mensagem<textarea id={`${id}-message`} name="message" value={draft} onChange={event => { setDraft(event.target.value); setFeedback(""); }} required minLength={5} maxLength={2000} /></label>
    <button type="submit" className="solid-button" aria-describedby={`${id}-notice`}><ButtonContent icon={<ArrowUpRight size={16} />}>Enviar mensagem</ButtonContent></button>
    <div className="flex flex-wrap gap-5">
      <button type="button" className="text-link" disabled={!draft.trim()} onClick={copy}>Copiar mensagem</button>
      {href ? <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
    </div>
    <p role="status" className="text-xs text-olive">{feedback}</p>
  </form>;
}
