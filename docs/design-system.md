# Tomás Avelar — fichas de curadoria

## Direção aplicada

A referência é a leitura de uma ficha de imóvel durante uma conversa com o
corretor: fotografia composta, localização, medidas comparáveis e referência
estável. Nada de numeração decorativa, plantas fictícias ou mosaico arbitrário.

### Paleta

| Nome | Hex | Papel |
| --- | --- | --- |
| Marfim | `#F5F3EC` | Fundo principal existente |
| Papel | `#EBE8DF` | Busca e convite ao proprietário |
| Tinta | `#282B25` | Texto principal |
| Grafite | `#252722` | Coleção Privada; fundo de segurança do Hero existente |
| Latão escuro | `#665638` | Acento fosco, controles, localização e foco |
| Pedra | `#686A61` | Legendas e informações secundárias |

O estado de hover do acento usa `#4D4029`; divisórias mantêm `#D6D6CA`.
O contraste do acento é 6,4:1 sobre marfim e 5,8:1 sobre papel.
Foram consideradas também oliva profundo (`#30483D`) e vinho escuro
(`#582F3B`). Latão escuro foi escolhido por remeter a ferragens e materiais
arquitetônicos, sem brilho metálico, gradiente dourado ou fundo preto/dourado.
Os aliases `--olive` existentes apontam para o novo acento para preservar
os consumidores já validados. A semântica nova é `--accent`.

### Tipografia

- Serifada editorial local existente: títulos e nomes dos imóveis, em romano.
- Itálico em headline: somente no Hero da Home. A assinatura pessoal existente
  é uma assinatura, não outro título de seção.
- Sans-serif local existente: interface, preços, medidas, referências e legendas.
- Medidas e preços usam algarismos alinhados e tabulares.
- Eyebrows decorativos foram removidos das seções. Permanecem rótulos
  funcionais de formulários e navegação; Hero preservado.

## Grid

Colunas de largura igual, preenchidas na ordem dos dados. Nenhum seletor
`nth-child` altera dimensão ou posição de um imóvel. A última linha fica
incompleta sem alargar os imóveis restantes.

```text
Desktop (>= 1024px)      Tablet (768–1023px)     Mobile (< 768px)
[ imóvel ][ imóvel ][ imóvel ]  [ imóvel ][ imóvel ]    [ imóvel ]
[ imóvel ][ imóvel ][ imóvel ]  [ imóvel ][ imóvel ]    [ imóvel ]
[ imóvel ]                     [ imóvel ]             [ imóvel ]

Cada ficha:
┌──────────────────────────────┐
│ Fotografia 4:5 / cover        │
│ Ponto focal por fotografia    │
└──────────────────────────────┘
Bairro                  Venda
Nome do imóvel
Área privativa   Suítes   Vagas
238 m²          3        3
R$ 4.850.000       Ref. TA-002
```

`PropertyFacts` fornece a mesma estrutura semântica `dl/dt/dd` para cards,
destaque e diálogo. O rótulo da área deriva de `areaKind`; valores ausentes
são identificados como não informados, sem serem convertidos em zero.

O destaque maior permanece fora do grid, escolhido por
`homeCuration.featuredPropertyId`. Exclusividade é informação do imóvel,
não uma instrução para mudar sua dimensão a cada filtro ou ordenação.

## Autocrítica

Uma nova cor com os mesmos slogans, itálicos e recuos continuaria genérica.
Por isso, além do acento, a hierarquia passou a usar conteúdo real: bairro
do destaque, referência persistente do imóvel e tipo de área. A grade
arquitetônica decorativa foi descartada; linhas existem para separar dados.
O grid regular serve à comparação, e a identidade vem das fotografias,
tipografia e ficha de curadoria. Movimento não foi reescrito.

## Conferência da entrega

- Build de produção, TypeScript e ESLint de `src` aprovados; diff sem erros
  de whitespace. A varredura ampla `eslint .` foi interrompida após demorar
  sem concluir; a checagem de todo o código da aplicação passou com `eslint src`.
- Home completa e recortes desktop/mobile conferidos no navegador.
- Grid exercitado com 3, 5 e 7 fichas em 1440, 1024, 768, 390 e 320px:
  15 combinações com larguras iguais, proporção 4:5, linhas alinhadas e
  ausência de overflow horizontal. Quantidades foram simuladas apenas no
  DOM do teste; os mocks e a seleção publicada não foram alterados.
- Abertura do diálogo com ficha técnica, tilt, reveal da foto, Hero e
  preferência de movimento reduzido conferidos; zero erros de página.
- Evidências locais: `artifacts/design-system/checks.json`,
  `cards-desktop.png`, `mobile-viewport-image.png`,
  `mobile-viewport-facts.png`, `home-desktop.png` e `catalog-seven.png`.
  As capturas normais de viewport substituem a captura isolada do card,
  que incluiu camadas fixas fora de posição. A pasta é ignorada pelo Git.
- Nenhuma nova medição de FPS nesta revisão visual; o relatório de
  performance anterior continua com seus limites explícitos.
