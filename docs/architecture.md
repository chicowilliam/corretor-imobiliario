# Fase 1 — Home

## Direção

Ivory #F5F3EC, charcoal #252722, olive #5B634C e stone #777366. Cormorant Garamond para títulos; Manrope para interface. Abertura com fotografia/vídeo, destaque em composição dividida e seleção com proporções e alturas diferentes. Mobile preserva a hierarquia em coluna, com alternância de largura nas fotografias.

## Dados

Os mocks foram criados antes dos componentes: 1 Agent com `creci: null`, 6 Properties (4 de venda, 2 de aluguel), 4 Areas e 3 Testimonials. Todas as métricas e os depoimentos são marcados como fictícios. Preço sob consulta é nulo. Endereços e coordenadas reais não são expostos.

`app/(site)/page.tsx` acessa `data/queries/home.ts`; as seções não conhecem mocks. A consulta valida a curadoria, aplica regras de domínio e devolve dados tipados. Substituir essa consulta por um CMS/API não altera a UI. Não há repositórios abstratos ou endpoints sem uso.

## Interações e estados

- A busca é restrita à seleção da Home, com finalidade, região e tipo. Usa URL e histórico do navegador, suporta submit nativo sem JavaScript e tem estado vazio com recuperação. Não existe rota de catálogo nesta fase.
- Imóveis abrem prévias em `dialog` nativo: foco modal, Escape, retorno do foco, fechamento explícito e bloqueio da rolagem de fundo.
- CTAs mostram mensagem contextual editável e ação de copiar, com alternativa manual quando a área de transferência não está disponível. Não enviam ou persistem dados. Um contato válido configurado pode abrir WhatsApp; `null` nunca produz um destinatário inventado.
- Depoimentos têm navegação manual e anúncio acessível; não giram automaticamente.
- O vídeo só recebe `src` após verificar movimento reduzido e economia de dados. É mudo, inline, pausável e pausa fora da tela ou com a aba oculta. O poster é uma imagem independente sempre presente; erro ou bloqueio de autoplay preserva a imagem.
- Reveals preservam conteúdo no HTML inicial e desativam movimento quando solicitado pelo sistema. Componentes cliente ficam limitados a essas interações.

## Escopo

Apenas Home. Catálogo, páginas individuais, favoritos, comparação, Property Match, valuation e demais rotas aguardam a próxima aprovação. Coleção privada é uma apresentação ilustrativa pública, sem conteúdo confidencial.

## Verificação

`npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. Testes de navegador usam Python Playwright já disponível no ambiente, sem dependência adicionada à aplicação.
