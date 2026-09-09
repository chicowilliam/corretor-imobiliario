# Tomás Avelar — Editorial Spatial Luxury

## Implementação

A Home alterna uma entrada cinematográfica, fotografia de imóvel em largura total, leitura de especificações, seleção editorial, retrato/manifesto, confiança, apresentação para proprietários e coleção reservada. As fontes, paleta, mídias, dados demonstrativos e rotas existentes foram preservados.

- Destaque: introdução descentralizada, imagem que ocupa a largura da tela, entrada visível “Ver imóvel” e especificações abaixo da fotografia.
- Seleção: pares com o mesmo enquadramento; quando há quantidade ímpar maior que um, o último imóvel fecha a composição em panorama. No mobile, fotografias verticais e fechamento mais aberto, sem scroll horizontal obrigatório.
- Meu olhar: retrato deslocado do eixo do texto, título e manifesto com escalas próprias, conteúdo integral preservado.
- Proprietários: composição própria, quatro etapas de apresentação e CTA “Apresentar meu imóvel”.
- Coleção privada: campo grafite, título e fotografia em camadas, formulário contextual “Solicitar acesso” e apresentação do imóvel demonstrativo mantida.
- Imóvel: apresentação em tela inteira dentro do dialog nativo existente; fotografia, especificações, descrição, características e contato. Galeria e plantas aparecem somente quando os dados possuem mídia correspondente; não foram inventadas plantas ou fotografias.
- WhatsApp: observação atualizada para respeitar os novos CTAs no mobile. Rodapé usa “Vamos conversar”.

## Sistema e performance

Composição isolada em `src/styles/showroom.css`, com espaço de cena e margens fluidas, hierarquia serifada para narrativa e sans para informação comercial. O catálogo mantém sua composição própria. As interações, navegação, reduced motion e sincronização Lenis/GSAP existentes continuam disponíveis.

Nenhuma dependência, fonte, imagem gerada, vídeo adicional ou loop de animação foi incluído. A apresentação continua carregada sob demanda; imagens usam `next/image`, proporções reservadas, `sizes` correspondente e lazy loading abaixo da dobra. O novo hover da imagem protagonista usa apenas transform.

## Validação em 9 de setembro de 2026

- Build final e TypeScript: aprovados.
- ESLint completo aprovado; nova execução direcionada após os últimos ajustes também aprovada.
- Sete testes existentes: aprovados.
- Chrome automatizado: 1366, 1440, 1920, 768, 360, 390 e 430 px.
- Sem overflow horizontal nessas larguras, tanto na Home quanto no catálogo; apresentação do imóvel verificada também internamente.
- Três ciclos de abrir/fechar imóvel por largura, Escape, retorno do foco, bloqueio e restauração do scroll.
- Formulário do imóvel preenchido e envio simulado concluído; formulários de proprietário e coleção privada abertos.
- Todos os cinco imóveis públicos e o imóvel privado abertos. Todas as âncoras do menu mobile testadas.
- Cinco ciclos rápidos de menu com movimento normal; reduced motion testado separadamente.
- Nenhum erro JavaScript capturado nos fluxos testados.
- Revisão visual encontrou e corrigiu uma regra antiga que zerava o padding mobile da coleção privada.
- Amostra de dois segundos com hover e movimento normal: 107 frames, p95 de 33,1 ms. Esta medição automatizada não certifica 60 FPS sustentados nem representa um celular físico. CLS observado na passagem final pelo catálogo: 0,0273; não é medição de campo.

Os scripts, resultados e capturas estão em `artifacts/polish/verify-showroom*.py` e `artifacts/polish/showroom/` (artefatos locais ignorados pelo Git).

## Arquivos relevantes

- `src/styles/showroom.css`, `src/app/globals.css`
- `src/app/(site)/page.tsx`
- `src/app/(site)/_components/{HomeHero,FeaturedProperty,SelectedListings,OwnerInvitation,PrivateCollectionPreview}.tsx`
- `src/components/property/{PropertyCard,PropertyPreview,PropertyPreviewContent}.tsx`
- `src/components/ui/Dialog.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/lead/FloatingWhatsApp.tsx`

## Autocrítica

O contraste entre o panorama, os pares de imóveis e a coleção reservada permanece sem animações. Por isso não foram acrescentados WebGL, partículas, transição compartilhada experimental ou novas timelines. A passagem ao imóvel usa o dialog nativo com entrada/saída curta: preserva contexto e acessibilidade sem duplicar uma fotografia animada pela tela. A fluidez precisa ainda ser avaliada em aparelho físico; o resultado automatizado não sustenta uma promessa de 60 FPS.
