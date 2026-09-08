"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { ButtonContent } from "@/components/motion/ButtonContent";
import { DrawUnderline } from "@/components/motion/DrawUnderline";
import { Dialog } from "@/components/ui/Dialog";
import { createWhatsAppLink } from "@/lib/whatsapp/create-link";

export function ContactPanel({ message, whatsapp = null }: { message: string; whatsapp?: string | null }) {
  const [draft, setDraft] = useState(message);
  const [feedback, setFeedback] = useState("");
  const id = useId();
  const href = createWhatsAppLink(whatsapp, draft);

  async function copy() {
    try { await navigator.clipboard.writeText(draft); setFeedback("Mensagem copiada."); }
    catch { setFeedback("Selecione a mensagem acima para copiar manualmente."); }
  }

  return <div>
    <p className="text-[13px] leading-7 text-muted">{href ? "Conte um pouco sobre o que você procura. A conversa continua no WhatsApp." : "Este é um portfólio demonstrativo. Você pode preparar e copiar uma mensagem; nenhum contato será enviado."}</p>
    <label htmlFor={id} className="eyebrow mt-6">Sua mensagem</label>
    <textarea id={id} className="contact-message" value={draft} maxLength={2000} onChange={(event) => { setDraft(event.target.value); setFeedback(""); }} />
    {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="solid-button"><ButtonContent icon={<ArrowUpRight />}>Continuar no WhatsApp</ButtonContent><DrawUnderline /></a> :
      <button type="button" className="solid-button" onClick={copy} disabled={!draft.trim()}><ButtonContent icon={feedback === "Mensagem copiada." ? <Check size={16} /> : <ArrowUpRight size={16} />}>Copiar mensagem</ButtonContent></button>}
    <p role="status" className="mt-3 min-h-5 text-xs text-olive">{feedback}</p>
  </div>;
}

export function ContactCTA({ children, message, title = "Vamos conversar", className = "text-link", whatsapp = null, icon = <ArrowUpRight size={16} aria-hidden="true" /> }: { children: ReactNode; message: string; title?: string; className?: string; whatsapp?: string | null; icon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className={className} onClick={() => setOpen(true)}>{className.includes("header-contact") ? <>{children}{icon}</> : <ButtonContent icon={icon}>{children}</ButtonContent>}{className.includes("header-contact") ? null : <DrawUnderline />}</button>
    {open ? <Dialog open onClose={() => setOpen(false)} title={title}>
      <div className="dialog-inner pt-16">
        <span className="eyebrow text-olive">Atendimento pessoal</span>
        <h3 className="display my-5 text-4xl">{title}</h3>
        <ContactPanel message={message} whatsapp={whatsapp} />
      </div>
    </Dialog> : null}
  </>;
}
