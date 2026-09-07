import type { Metadata } from "next";
import localFont from "next/font/local";
import { DrawUnderline } from "@/components/motion/DrawUnderline";
import "./globals.css";

const editorial = localFont({ src: [{ path: "../../public/fonts/editorial.woff2", style: "normal", weight: "400 600" }, { path: "../../public/fonts/editorial-italic.woff2", style: "italic", weight: "400" }], variable: "--font-editorial", display: "swap" });
const interfaceFont = localFont({ src: "../../public/fonts/interface.woff2", variable: "--font-interface", weight: "400 600", display: "swap" });

export const metadata: Metadata = {
  title: "Tomás Avelar — Um olhar particular sobre o morar",
  description: "Arquitetura com intenção. Escolhas com calma. Uma curadoria demonstrativa de imóveis em São Paulo.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${editorial.variable} ${interfaceFont.variable}`}><body><a className="skip-link" href="#conteudo">Pular para o conteúdo<DrawUnderline /></a>{children}</body></html>;
}
