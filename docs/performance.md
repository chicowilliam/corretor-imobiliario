# Revisão integrada de movimento — 6 de setembro de 2026

## Resultado

A implementação de cards, seção Sobre e microinterações está concluída.
A meta de 120fps **não foi atingida nem certificada**. A máquina disponível
possui tela de 59Hz; não havia um celular físico intermediário de 120Hz para
medir. Não foram adicionados WebGL, dependências ou alterações ao Hero,
Navbar e sincronização de scroll já validados nesta entrega.

## Hardware e método

- Notebook Lenovo 81A3, Intel Celeron N3350 (2 núcleos/2 threads), Intel HD
  Graphics 500, tela 1366 × 768 a 59Hz.
- Build de produção com `next start`, porta 3001.
- Chrome local 152.0.7977.77, janela real, viewport 1280 × 720, sem flags
  forçando GPU. Composição, rasterização e decodificação de vídeo por GPU
  confirmadas pelo CDP; driver Intel 31.0.101.2140.
- Amostra parada de 4s e amostra integrada de 6,5s, com eventos de roda e
  ponteiro percorrendo a Home. Lenis, GSAP, parallax, reveals, cards e cursor
  permaneceram ativos. Métricas coletadas por requestAnimationFrame e
  PerformanceObserver. São intervalos de callbacks, não medição externa de
  frames efetivamente apresentados pela tela.

| Chrome local com GPU | Média | Mediana por frame | P95 por frame |
| --- | ---: | ---: | ---: |
| Home parada | 58,7fps | 16,7ms | 18,3ms |
| Rolagem + ponteiro + efeitos integrados | 23,7fps | 16,7ms | 101,5ms |

Na amostra integrada houve 18 intervalos acima de 33,4ms e nove tarefas
longas de 53–186ms. A passagem inicial pelas seções concentrou os engasgos:
houve intervalos de 867ms na região de busca e 1.616ms quando o ponto de
amostragem chegou à seleção. No rodapé, após a passagem pelas seções, o P95
foi de 19,2ms (133 amostras).

Esses marcadores identificam **onde os atrasos foram observados**, não a
origem exclusiva do trabalho: cada intervalo pode incluir a seção anterior,
carregamento/decodificação de mídia e atividade da máquina. Algumas seções
tiveram apenas 1–3 amostras. A varredura curta não é um perfil causal e não
permite atribuir uma travada especificamente a tilt, cursor ou Lenis. Seria
necessário um trace e comparações controladas para essa atribuição.

O headless usado nos testes funcionais tinha composição e vídeo por software
(SwiftShader): 8,9fps na amostra integrada e apenas 1,1fps na amostra parada.
Esse resultado não representa o Chrome acelerado e não foi usado como
conclusão sobre a experiência real. A simulação de CPU 4× também não equivale
a testar um telefone físico.

## Revisão funcional e visual

- Typecheck, lint, build e seis testes de domínio passaram.
- `scripts/verify-refinements.py`: passou com zero erros de navegador.
- Confirmados tilt limitado, zoom da mídia, sequência de 160ms, cards 4:3,
  object-fit cover e pontos focais específicos por foto.
- Confirmados valores intermediários e finais dos contadores, máscara da
  foto, magnetismo, cursor nativo ao usar teclado e sublinhado em todos os
  links da Home.
- Navegação Home/catálogo, filtros sem transição de página, voltar/avançar
  e retirada da camada de transição verificados.
- Mobile emulado com movimento reduzido: sem overflow, tilt ou cursor;
  conteúdo e valores finais visíveis, menu e navegação funcionando.
- Revisão visual da Home inteira em desktop e do card mobile com a imagem
  efetivamente decodificada. O primeiro screenshot automático ocorreu antes
  de terminar o lazy loading; a captura final aguarda a imagem carregar.
- Vídeos de imóveis continuam opcionais e ausentes nos mocks. Poster e
  fallback estáticos foram verificados; reprodução com clipes reais fica
  pendente de receber esses arquivos.

Evidências locais em `artifacts/refinements/`: `checks.json`,
`local-browser.json`, `performance.json`, `visual-checks.json`,
`home-complete.png`, `cards-desktop.png`, `advisor-desktop.png` e
`cards-mobile-reduced.png`. Essa pasta é ignorada pelo Git; este relatório
preserva os resultados essenciais no projeto.

## Limite da entrega

O comportamento foi validado, mas fluidez sustentada em hardware intermediário
de 120Hz permanece pendente. O notebook disponível apresentou engasgos com
o conjunto ativo. Não há declaração de aprovação de performance a 120fps.

## Conferência final retomada — 7 de setembro de 2026

A foto da seção Sobre foi conferida novamente no navegador, após a
decodificação da imagem e a conclusão das duas camadas do reveal. A imagem
estava carregada (`naturalWidth: 576`), visível e com as duas transformações
na posição final; os contadores exibiam 12 e 140+. Evidência:
`artifacts/refinements/advisor-resumed.png`.

A captura completa `home-complete.png` foi refeita após percorrer todas as
seções e conferida com os três cards e a foto do corretor visíveis. Também
foram conferidos o card e a seção Sobre em mobile emulado com movimento
reduzido (`cards-mobile-reduced.png` e `advisor-mobile-reduced.png`).

A captura anterior com a área vazia não comprova uma falha do componente:
o comportamento foi confirmado sem alterar o código da Home. A conferência
de captura passa a aguardar tanto `.depth-mask` quanto `.depth-image`.
Navbar, Hero, tipografia, paleta e dependências permaneceram preservados.
Esta retomada é uma conferência visual, não uma nova medição de performance;
os resultados e limites do teste integrado acima continuam válidos.

## Rodada cinematográfica — 7 de setembro de 2026

Nova medição depois de DrawSVG/SplitText, foco inicial, parallax de cursor,
Flip, cascata dos fatos e atmosfera da seleção. O carregamento da foto do
corretor também foi corrigido: uma máscara totalmente fechada podia impedir
o lazy loading. A solicitação agora ocorre quando o contêiner entra na tela.

Chrome local 152.0.7977.77, janela real, viewport 1280 × 720, Intel HD
Graphics 500 (driver 31.0.101.2140). Composição, rasterização e decodificação
de vídeo por GPU confirmadas pelo CDP. Não houve throttling de CPU.
O notebook continua sendo o Celeron N3350 com tela de 59Hz descrito acima.

| Amostra final | Média de callbacks RAF | P95 |
| --- | ---: | ---: |
| Home parada, primeira amostra de 3s | 58,7fps | 18,1ms |
| Primeira passagem integrada de 6,5s | 32,3fps | 119,4ms |
| Home parada após carregar mídias, 3s | 59,6fps | 18,2ms |
| Passagem integrada repetida, 6,5s | 46,1fps | 48,7ms |

Antes da amostra repetida, o Hero estava no topo, a abertura concluída,
o filtro de foco removido, o vídeo reproduzindo e a aba visível. A passagem
exercita eventos de roda/ponteiro, hover dos cards, Lenis, parallax, cursor,
tilt, cascata e as seções à medida que entram na tela.

A primeira passagem teve nove tarefas longas de 50–220ms; a repetida teve
quatro de 50–77ms. Os atrasos foram observados principalmente na região do
imóvel em destaque (P95 de 301,1ms, depois 149,8ms) e seleção (133,8ms, depois
68,9ms). Sobre passou de 167,1ms para 35ms; proprietários, de 165,8ms para
49ms. Algumas regiões tiveram poucas amostras. Esses marcadores mostram onde
os intervalos ocorreram, sem provar que uma animação específica os causou.

Um ensaio anterior desta mesma rodada registrou 14,2fps na amostra parada e
33,7fps na passagem integrada. A variação reforça o limite de amostras curtas
em uma máquina compartilhada e com carregamento inicial. Não se declara
taxa estável com base na melhor amostra nem melhoria causal contra a rodada
anterior. Aberturas a frio também acionaram o fallback de segurança em alguns
testes; a sequência completa foi validada separadamente.

**120fps não foi atingido nem certificado.** Os números medem intervalos
de callbacks RAF, não frames apresentados externamente por uma tela. Não
houve telefone físico intermediário de 120Hz disponível. Nenhum WebGL foi
acrescentado para tentar sustentar um resultado que o hardware não comprovou.

Reprodução: python scripts/measure-cinematic.py. Evidência da amostra final:
artifacts/cinematic/performance.json. A revisão funcional/visual está em
docs/cinematic-motion.md, com checks.json e fallback-checks.json aprovados.

## Acabamento e Belo Horizonte — 7 de setembro de 2026

A meta solicitada nesta rodada passou a ser **60fps em hardware intermediário
real**; 120fps apenas se medidos em aparelho e tela compatíveis. Não houve
acréscimo de WebGL ou do wireframe opcional.

No mesmo notebook Celeron N3350 / Intel HD Graphics 500, tela de 59Hz,
Chrome local com viewport 1280 × 720 e sem throttling, foram registrados:

| Amostra | Média RAF | P95 |
| --- | ---: | ---: |
| Home parada, 3s | 58,7fps | 18,3ms |
| Primeira passagem integrada, 6,5s | 30,3fps | 117,2ms |
| Home parada após a passagem, 3s | 47,1fps | 18,5ms |
| Passagem integrada repetida, 6,5s | 43,2fps | 51ms |

A primeira passagem registrou 21 tarefas longas de 52–162ms; a repetida,
11 de 50–94ms. Destaque, seleção e Sobre concentram parte dos atrasos;
os marcadores de região não isolam sua causa. Uma pausa isolada longa na
segunda amostra parada também derrubou a média. Não se afirma melhoria ou
regressão causal com amostras curtas em uma máquina compartilhada.

**60fps sustentados não foram atingidos nesse notebook.** Não houve telefone
físico intermediário disponível e a tela não permite validar 120fps. Medem-se
callbacks RAF, não frames apresentados por instrumentação externa.

Relatório completo, revisão visual e limites: [polish-bh.md](polish-bh.md).
Reprodução: `python scripts/measure-polish.py`. Evidência:
`artifacts/polish/performance.json`; suíte funcional/visual:
`python scripts/verify-polish.py`, aprovada com zero erros JavaScript.
