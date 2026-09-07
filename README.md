# Tomás Avelar — portfólio demonstrativo

Home editorial de um corretor fictício. Next.js App Router, React, TypeScript strict, Tailwind CSS, Framer Motion e Lucide React. Nenhum banco, autenticação ou dashboard.

## Executar

```sh
npm install
npm run dev
```

Abra **http://127.0.0.1:3000** (no Windows, prefira esse endereço a `localhost`).

A primeira compilação pode levar cerca de 1 minuto neste ambiente (o Next avisa “Slow filesystem”). As recargas seguintes ficam bem mais rápidas. Se a porta 3000 estiver ocupada, encerre o processo antigo antes de subir o `dev` de novo.

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

## Entrega atual

Home e catálogo em `/imoveis`. A busca da Home filtra a seleção curada; o catálogo lista todos os imóveis públicos com os mesmos filtros. Pré-visualizações abrem na própria página. Páginas individuais e demais fases ainda não foram construídas.
