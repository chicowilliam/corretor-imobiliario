# Abertura e interações — 7 de setembro de 2026

Esta rodada substitui a implementação parcial da abertura. Preserva a paleta
de latão escuro/papel, as fontes locais, o grid 4:5, a navbar interpolada,
o cursor e o controle de scroll existentes. Não gera fotografias ou vídeos.

## Sequência

1. Desenho dos contornos reais de TOMÁS AVELAR: aproximadamente 1,2s.
   O SVG foi derivado da Cormorant Garamond já licenciada e incluída no projeto.
2. Espera adicional pela primeira imagem do vídeo: no máximo 0,8s. Falha
   de vídeo mantém o poster independente.
3. Dissolução da wordmark e foco de blur(6px) para blur(0): 0,6s.
4. SplitText revela as linhas do H1: 0,65s, intervalo de 0,12s por linha.
5. Apoio: 0,3s com intervalo de 0,06s. CTA: 0,25s depois do apoio.

O percurso normal dura cerca de 3,4s depois que o módulo e as fontes estão
prontos, acrescido apenas da eventual espera de mídia. Um limite global de
5,5s desde a hidratação libera o conteúdo em falhas de chunks/fontes/mídia.
Não é um indicador de porcentagem de download.

Tab, Escape, foco no Hero, rolagem além de 80px, resize e aba oculta encerram
a abertura. Âncoras, scroll restaurado, economia de dados e movimento reduzido
pulam a sequência. Sem JavaScript, o título e o poster já estão visíveis.
SplitText é revertido ao terminar e ao desmontar; React conserva os elementos.

## Responsabilidades

- Motion mantém tilt, cursor, reveals e transições existentes.
- GSAP/ScrollTrigger mantém o parallax por scroll da camada exterior.
- HeroMotion acrescenta deslocamento oposto ao cursor de no máximo 6px/4px
  em uma camada interior, apenas com ponteiro preciso.
- HeroOpening usa GSAP DrawSVG e SplitText importados sob demanda.
- DrawUnderline usa SVG declarativo e DrawSVG em cada link. O sublinhado CSS
  continua disponível para teclado, movimento reduzido e falha de JavaScript.
- ButtonContent usa Flip para interpolar a posição do ícone em uma coluna
  reservada. A geometria exterior do botão não muda; o magnetismo continua
  controlando apenas o botão exterior.
- PropertyCardMotion acrescenta cascata de fatos, preço e referência: atraso
  inicial de 60ms e passos de 45ms. Os dados permanecem legíveis por padrão;
  sair do card ou focá-lo por teclado restaura imediatamente o estado final.
- ContentAtmosphere move apenas uma camada de gradiente quase transparente
  atrás da seleção. Pausa fora da tela/aba e para com movimento reduzido.
- DepthReveal solicita a foto quando seu contêiner entra no viewport. Isso
  resolve uma espera circular observada no Chrome: a máscara escondia toda
  a imagem e o lazy loading não iniciava (`currentSrc` vazio). O carregamento
  continua adiado fora da tela, e as duas translações da máscara são mantidas.

Não há outro RAF de scroll: Lenis permanece no ticker GSAP existente.
Os plugins não entram no módulo compartilhado de scroll. Nenhuma dependência
de aplicação foi acrescentada ou reinstalada.

## Exceções e limites

Transform e opacity continuam sendo a regra. O blur transitório pedido para
a abertura, os traços SVG e o preenchimento da wordmark são exceções explícitas.
Não há blur animado contínuo, WebGL ou partículas inventadas sobre o filme.
O grading é estático e sutil; não transforma qualquer gravação em golden hour.

A meta de 120fps exige medição em dispositivo e tela compatíveis. As medições
anteriores em docs/performance.md não certificam esta rodada. O hardware
disponível é um Celeron N3350 com tela de 59Hz; emulação mobile não é teste
em telefone físico.

## Verificação

Com um build de produção servindo na porta 3001:

    python scripts/verify-cinematic.py
    python scripts/verify-cinematic-fallbacks.py
    python scripts/measure-cinematic.py

Os testes cobrem ordem das fases, restauração do DOM, cascata dos cards,
proporção das fotos, links DrawSVG, Flip, navegação, teclado, preferência
alterada durante a abertura, vídeo bloqueado, mobile emulado e HTML sem JS.
Resultados e screenshots ficam em artifacts/cinematic (ignorado pelo Git).
O gerador de contornos scripts/outline-wordmark.py é uma ferramenta opcional
de manutenção; fontTools/brotli não participam do bundle nem do build Next.

## Resultado da verificação

- Build de produção, TypeScript strict, lint de src e seis testes de domínio
  passaram. As últimas correções passaram novamente por build/tipos e lint
  dos arquivos alterados.
- verify-cinematic.py e verify-cinematic-fallbacks.py passaram no Chrome
  local, sem erros de JavaScript.
- Confirmados desenho dos 11 glifos, ordem de fases, restauração do H1,
  cascata real dos fatos, tilt, enquadramento 4:5, pontos focais, DrawSVG nos
  links, Flip e encerramento de hover ao usar teclado.
- Confirmados navegação, mudança de preferência durante a abertura,
  poster com vídeo bloqueado e conteúdo sem JavaScript.
- Home inteira revisada visualmente. Fotos dos cards e do corretor carregadas;
  máscara concluída e contadores em 12/140+. Mobile emulado com e sem
  movimento: sem overflow e menu/navegação funcionando.
- Aberturas a frio nesta máquina às vezes acionaram o limite de segurança.
  O conteúdo foi liberado; a sequência completa também foi confirmada.
- Performance: 32,3fps na primeira passagem integrada e 46,1fps na passagem
  repetida após carregar mídias. A meta de 120fps não foi atingida.
  Método, variação e regiões com atrasos estão em docs/performance.md.

Evidências: artifacts/cinematic/checks.json, fallback-checks.json,
performance.json, home-complete.png, advisor-desktop.png e capturas mobile.
Mobile foi emulado; não houve teste em telefone físico de 120Hz.
