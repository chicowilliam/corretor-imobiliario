# Movimento — Navbar, Hero e refinamentos integrados

Primeira entrega: infraestrutura de movimento, Navbar e Hero. Fontes,
tokens de cor, conteúdo e mídias existentes foram preservados. Nenhuma imagem
foi gerada e nenhuma publicação foi feita.

## Responsabilidades

- `src/components/motion/MotionProvider.tsx`: MotionConfig e ciclo de vida do
  Lenis. Um único ticker GSAP chama `lenis.raf(seconds * 1000)`; Lenis informa
  o ScrollTrigger. Não existe RAF paralelo para controlar o scroll.
- `src/lib/scroll-runtime.ts`: registro compartilhado do ScrollTrigger,
  importado dinamicamente pelos componentes cliente.
- `src/components/layout/SiteHeader.tsx`: Motion observa o scroll nativo e
  interpola a opacidade entre 0 e 96px na Home. Outras rotas começam sólidas.
  Texto claro/escuro usa camadas visuais sobrepostas, mantendo um só link ou
  botão e um único nome acessível. O blur é fixo; apenas a opacidade varia.
- `src/app/(site)/_components/HeroMotion.tsx`: Motion controla a entrada
  por linhas em máscaras estáticas; GSAP controla exclusivamente o transform
  da mídia. O parallax vai de 0 a 60px no desktop e de 0 a 30px no mobile.
- `HomeHero.tsx` e `HeroMedia.tsx` continuam Server Components. O HTML do título
  e a imagem são legíveis mesmo sem JavaScript.

## Mídia

`HeroMedia` recebe `imageSrc`, `imageAlt`, `objectPosition` opcional e
`videoSrc` opcional. A imagem é obrigatória mesmo com vídeo: funciona como
poster e fallback independente. O mock de entrada continua em
`src/data/mocks/home.ts`; para usar somente imagem, defina `hero.video: null`.
O vídeo existente foi mantido e pode ser substituído depois.

O vídeo usa loop, muted e playsInline. Há pausa manual; ele pausa também fora
do viewport e com a aba oculta. Movimento reduzido e economia de dados
mantêm o poster sem carregar o vídeo. Os controles ficam fora da camada de
parallax. Falha de mídia preserva a imagem estática.

## Acessibilidade e ciclo de vida

- A preferência de movimento é observada também quando muda com a página
  aberta. Lenis é destruído e o parallax é revertido; CSS remove os transforms
  de entrada e o vídeo usa a imagem estática.
- O toque mantém scroll nativo (`syncTouch: false`). O scroll CSS suave foi
  removido para não competir com Lenis. Âncoras respeitam scroll-padding do
  cabeçalho fixo.
- Bloqueio de overflow nos diálogos existentes para o Lenis; fechar o diálogo
  libera o scroll. Eventos dentro de diálogos mantêm comportamento nativo.
- Eventos, observers, ticker e ScrollTriggers têm limpeza no desmontar.
- Todas as novas animações alteram apenas transform/opacity. Máscaras, blur,
  dimensões e enquadramento são estáticos.

## Verificação

Com o servidor iniciado (`npm run dev` ou `npm start`):

```sh
python scripts/verify-motion.py
```

O script usa a instalação Python/Playwright já utilizada pelo projeto e grava
relatório e screenshots em `artifacts/motion/` (ignorado pelo Git). Verifica
interpolação da navbar, navegação Home/catálogo, âncoras, bloqueio de scroll em
modal, menu mobile, movimento reduzido inicial e em tempo real, vídeo bloqueado
e conteúdo sem JavaScript. Não é um benchmark de FPS nem substitui teste em
dispositivos físicos.

Outras checagens: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## Segunda entrega: refinamentos integrados

- `ListingSequence`: entradas por viewport em sequência de 160ms; teclado e
  movimento reduzido exibem os cards imediatamente. Cada lote visível é
  ordenado pela posição na lista, evitando atrasar cards ainda fora da tela.
- `PropertyCardMotion`: perspective de 1200px e tilt limitado a ±2 graus,
  somente com ponteiro preciso. A camada de entrada não controla o tilt.
- `PropertyCardMedia`: enquadramento 4:3 em todas as posições e tamanhos,
  object-fit cover e ponto focal ajustável em `property.media.card.objectPosition`.
  Os mocks definem focos próprios por fotografia. Zoom de 1.035 apenas na mídia.
- `property.media.card.video`: opcional; permanece null nos mocks. Para trazer
  um clip, preencher um VideoAsset nesse campo. A imagem de capa é obrigatória.
  O vídeo só carrega no hover elegível, em loop mudo, com poster persistente,
  pausa ao sair/ocultar e fallback em falhas. Não carrega com saveData ou
  movimento reduzido. Nenhum filme de outro imóvel foi inserido como mock.
- `CountUp`: contagem única de 1.15s, sem render React por frame, largura
  reservada e valor final estático para tecnologias assistivas. A sinalização
  de métricas fictícias foi mantida.
- `DepthReveal`: máscara estática com duas translações opostas e escala leve.
  Aguarda a foto carregar; nenhuma animação de clip-path ou dimensão.
- `PointerEffects`: cursor por MotionValues, magnetismo limitado a 6px/4px
  nos botões sólidos, sem alterar os efeitos já validados de Navbar/Hero.
  Foco de teclado, inputs, diálogos, toque e movimento reduzido usam cursor nativo.
- `interactions.css`: sublinhado da esquerda para a direita em todos os links,
  incluindo marca, menu mobile, rodapé e link de pular conteúdo. Os links da
  navegação desktop mantêm seu sistema já existente de duas camadas de tinta.
- `RouteTransitions`: AnimatePresence controla uma camada persistente com a
  assinatura da marca. O App Router mantém o conteúdo e seus limites de RSC;
  não há congelamento de contexto interno, duplicação de páginas ou retenção
  de árvores antigas. Cliques de ponteiro recebem saída/entrada; voltar e
  avançar recebem transição de continuidade. Modificadores, teclado, links
  externos, downloads, âncoras e filtros da mesma página mantêm seu fluxo nativo.
  Escape, mudança da preferência e limite de 8s liberam uma navegação pendente.

Verificação integrada: `python scripts/verify-refinements.py`.
Para medir a versão de produção, definir `MOTION_TEST_URL` apontando para
`next start`. Evidências e amostras ficam em `artifacts/refinements/`.
Consultar `docs/performance.md` para resultados e limites do hardware disponível.

WebGL não foi incluído. Não há promessa de 120fps sem medição em hardware real.
