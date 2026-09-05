import Link from "next/link";

export default function NotFound() {
  return <main className="shell section-space min-h-[60svh]"><p className="eyebrow text-olive">Página não encontrada</p><h1 className="display section-title mt-6">Vamos voltar ao início?</h1><Link href="/" className="text-link mt-8">Voltar para a Home</Link></main>;
}
