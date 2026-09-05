# Tomás Avelar — portfólio demonstrativo

Home editorial de um corretor fictício. Next.js App Router, React, TypeScript strict, Tailwind CSS, Framer Motion e Lucide React. Nenhum banco, autenticação ou dashboard.

## Executar

```sh
npm install
npm run dev
```

Abra http://localhost:3000.

## Verificar

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Node.js 24 foi usado no desenvolvimento. Os testes usam o test runner nativo do Node com remoção de tipos TypeScript.

## Conteúdo

- Mocks substituíveis: `src/data/mocks/`.
- Consulta da Home: `src/data/queries/home.ts`.
- Curadoria e mídia de abertura: `src/data/mocks/home.ts`.
- Tokens: `src/styles/tokens.css`.
- Seções: `src/app/(site)/_components/`.
- Arquitetura e estados: `docs/architecture.md`.
- Créditos das fotografias e filmagem: `docs/media-credits.md`.

Os imóveis, valores, perfil, métricas e depoimentos são fictícios. Nenhum CRECI foi inventado. As fotografias existentes são ilustrativas e não representam ofertas reais. Nenhuma imagem gerada por IA integra o site.

Os contatos estão nulos de propósito. As ações de conversa abrem uma mensagem editável e copiável; não enviam leads nem dados pessoais. Para configurar um WhatsApp real posteriormente, altere o campo `whatsapp` do Agent, usando o código de país 55.

## Limite desta entrega

Somente a Home. A busca filtra sua seleção local e os imóveis abrem uma prévia na mesma página. O catálogo e as demais fases ainda não foram construídos.
