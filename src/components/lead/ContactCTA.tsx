"use client";

import { useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonContent } from "@/components/motion/ButtonContent";
import { DrawUnderline } from "@/components/motion/DrawUnderline";
import { Dialog } from "@/components/ui/Dialog";
import dynamic from "next/dynamic";

const Form = dynamic(() => import("./ContactForm").then(module => module.ContactForm), {
  loading: () => <p role="status" className="text-sm text-muted">Preparando formulário…</p>,
});

export function ContactPanel(props: { message: string; whatsapp?: string | null; propertyTitle?: string }) {
  return <Form {...props} />;
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
