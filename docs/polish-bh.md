# Acabamento e verossimilhança — Tomás Avelar

## Ajuste fino posterior

### Navbar e navegação mobile

O fundo da navbar permanece transparente até o conteúdo seguinte cobrir
completamente o Hero; então entra ao longo de 220px de scroll, com curva
suave. A cor dos links acompanha o clareamento da imagem antes disso,
independentemente do fundo. A posição é recalculada ao mudar o tamanho da
tela; páginas internas continuam sólidas desde o início.

No mobile, o botão usa dois traços finos e o rótulo Menu. O painel ocupa a
tela, com navegação serifada, grupos espaçados, contato separado e áreas de
toque de pelo menos 48px. Mantém diálogo nativo, foco contido, fechamento por
Escape, retorno ao acionador e restauração da rolagem anterior. Teclado e
movimento reduzido abrem sem animação. Nenhuma dependência acrescentada.

Validação da navbar/menu: produção e lint aprovados; navegador em 1440,
390 e 320px sem erros JavaScript. Opacidade do fundo permaneceu em zero no
topo, em 96px e até o fim do Hero; chegou a .5 após mais 110px e a 1 após
220px. Retorno ao topo, páginas internas sólidas, Escape, foco devolvido,
rolagem restaurada e movimento reduzido conferidos. Capturas:
`artifacts/polish/menu-open-390.png` e `menu-open-320.png`.

A pedido do usuário, sem nova medição de FPS ou expansão de escopo:

- Removida a família técnica de fallback. Medidas, preço e referências usam a sans local já carregada, com `lnum` e `tnum`, e espaçamento menos comprimido.
- Navbar ajustada de 12px / .025em para 11,5px / .01em, mantendo peso 500 e as áreas de toque.
- Coleção privada: a inspeção do arquivo original e das camadas no navegador mostrou a fachada recortada no topo pelo enquadramento central. O novo `object-position: 50% 28%` conserva a linha superior do volume; não há nova fotografia nem máscara adicionada.
- Saída do Hero: sobreposição ampliada de 18dvh/160px para 42dvh/380px; opacidade vinculada ao scroll com `sine.inOut` e scrub de .6s. A emenda usa uma faixa gradual; o contorno/sombra anteriores foram retirados. No topo os efeitos ficam transparentes, preservando a cena inicial; com movimento reduzido são desativados.
- Enquadramentos pontuais: sala do destaque reposicionada verticalmente para valorizar luz/parede; loft deslocado para favorecer as aberturas à direita. Sem alteração dos arquivos ou da proporção 4:5 dos cards.

As descrições e medições abaixo documentam a rodada anterior. As capturas atuais desta correção usam o prefixo `artifacts/polish/fine-`.

Validação desta correção: build de produção/TypeScript e lint aprovados; navegador em 1440px e 390px sem erros JavaScript ou overflow horizontal, com caminho reduzido validado. A prova tipográfica mediu a mesma largura (89,28px) para seis zeros e seis uns usando a fonte local com `tnum`. Resultados: `artifacts/polish/fine-checks.json`. Nenhuma nova medição de performance.

Rodada concluída localmente em 7 de setembro de 2026. Preview de produção: http://127.0.0.1:3001. Nenhuma publicação, instalação de dependência ou geração de imagem nesta rodada.

## O que foi aplicado

- **Belo Horizonte:** sete áreas reais, com descrições, lugares próximos e referências à arquitetura, topografia e luz da cidade. Seis imóveis fictícios preservam as fotografias existentes, com localização e valores revisados. Savassi, Lourdes, Belvedere, Cidade Jardim e Mangabeiras aparecem nas ofertas; Santo Antônio também está disponível no filtro. Vila da Serra é identificada como **Nova Lima**, inclusive no catálogo e nos cards. O validador dos mocks agora confere cidade, bairro e estado contra a área vinculada.
- **Cena inicial:** Hero com `100dvh`; um trecho curto de posicionamento sticky permite que o conteúdo seguinte suba sobre a cena. Abertura, vídeo, poster, fallback, foco inicial, parallax e sincronização GSAP/Lenis permanecem no sistema existente. Com movimento reduzido, a passagem é direta.
- **CTAs:** borda com DrawSVG por hover/foco, preenchimento discreto do centro para fora, sombra rasa e deslocamento de 2px. Camadas separadas evitam disputar a transformação do magnetismo e do Flip. O contorno estático continua disponível antes do JavaScript ou se o carregamento do plugin falhar.
- **Navbar:** aplicada a variante com iniciais maiúsculas, 12px e peso 500, com espaçamento ampliado e underline mais evidente. A variante em caixa alta foi comparada nas capturas abaixo. O menu recolhe antes de os itens ficarem apertados.
- **Filtros:** componente compartilhado entre Home e catálogo, com dropdowns, ícones pontuais, abertura por altura/opacidade e opções com rolagem própria. Setas, Home/End, busca por letras, Enter, Escape e Tab são tratados; o foco permanece no combobox. Há rótulos, estados ARIA e selects nativos como fallback sem JavaScript. A animação de altura é a exceção explicitamente solicitada nesta rodada; teclado e movimento reduzido abrem imediatamente.
- **Cards:** moldura fina em cor de apoio, sombra curta, preços e medidas com maior contraste e fonte técnica do sistema. Imagens mantêm 4:5, `cover` e posição configurável. Tilt, zoom, cascata e preparação para vídeo permanecem.
- **Ritmo:** redução do espaçamento padrão de seção e dos intervalos entre títulos, fotos e cards. O Hero conserva a cena integral. A Home desktop revisada mede aproximadamente 5.558px de altura na captura de 1.440 × 900.
- **Fotografia:** seção do proprietário com composição assimétrica e imagem até a borda direita da viewport; legenda ocupa a junção entre texto e fotografia. A proporção desta seção difere dos cards. Foram reutilizados os arquivos existentes.
- **Hierarquia:** serifada editorial e sans original preservadas; papel técnico restrito a medidas, preço e referências, sem carregar uma terceira fonte remota. Os títulos das seções usam SplitText, seguidos por apoio e CTA. Teclado, foco, resize, mudança de preferência ou falha de carregamento encerram a sequência e deixam o conteúdo legível.
- **3D opcional:** não acrescentado. O resultado de performance não justifica mais custo gráfico neste hardware.

## Comparação da navegação

Escolhida: **iniciais maiúsculas**, por legibilidade e por diferenciar navegação dos pequenos rótulos editoriais. A caixa alta resulta mais densa e decorativa ao lado da wordmark, sem ganho funcional.

### Aplicada — iniciais maiúsculas

![Navbar aplicada](../artifacts/polish/nav-sentence.png)

### Alternativa — caixa alta espaçada

![Navbar alternativa](../artifacts/polish/nav-uppercase.png)

## Validação

- `npx tsc --noEmit`: aprovado.
- `npx eslint src`: aprovado.
- `npm test`: seis testes aprovados.
- `npm run build`: compilação e verificação TypeScript aprovadas, rotas de produção geradas.
- `git diff --check`: sem erros de whitespace; avisos locais de normalização LF/CRLF apenas.
- `python scripts/verify-polish.py`: aprovado. Hero/overlap, seleções com mouse e teclado, submissão, estado vazio, cinco ofertas públicas no catálogo, Nova Lima explícita, três imagens 4:5, foto até a borda, contador, navegação mobile e busca nativa sem JS. Nenhum erro JavaScript observado.
- Revisão das capturas desktop da Home inteira, cards, proprietário e duas navbars; revisão mobile do Hero e dropdown. Mobile **emulado**, nas duas preferências de movimento; não equivale a teste em telefone físico.

Capturas e resultados: `artifacts/polish/`. Essa pasta é ignorada pelo Git; os arquivos permanecem disponíveis nesta máquina. Os scripts de reprodução e este relatório ficam no projeto.

## Performance real disponível

Chrome local em janela, viewport 1.280 × 720, notebook Celeron N3350 / Intel HD Graphics 500, tela de 59Hz. Sem throttling artificial. Medição por intervalos de callbacks RAF, não por equipamento externo que conte frames efetivamente apresentados.

| Amostra | Média RAF | P95 do intervalo |
| --- | ---: | ---: |
| Home parada, 3s | 58,7 fps | 18,3 ms |
| Primeira passagem integrada, 6,5s | 30,3 fps | 117,2 ms |
| Home parada após a passagem, 3s | 47,1 fps | 18,5 ms |
| Passagem integrada repetida, 6,5s | 43,2 fps | 51,0 ms |

O ensaio combina eventos de roda e ponteiro, Lenis, cursor, parallax, tilt, entrada dos cards e das seções. A primeira passagem registrou 21 tarefas longas (52–162ms); a repetida, 11 (50–94ms). Na primeira, os maiores intervalos ocorreram durante busca/destaque/seleção/Sobre, com P95 aproximado de 216–233ms; várias dessas regiões têm poucas amostras. Na repetida, destaque e Sobre ficaram em aproximadamente 66–67ms, seleção em 52ms e a passagem inicial pelo Hero em 84ms. A localização temporal dos atrasos **não isola sua causa** em uma animação específica.

A amostra parada posterior teve uma pausa isolada longa, apesar de mediana próxima de 16,7ms; por isso a média foi menor. O notebook é compartilhado e os ensaios curtos variam com carga e decodificação. Não se afirma regressão ou melhoria causal em relação à rodada anterior com base nesses números.

**A meta de 60fps sustentados não foi atingida neste notebook.** O teste não certifica hardware intermediário atual nem telefone físico, indisponíveis nesta sessão. A tela disponível não permite validar 120fps. Não foi acrescentado o wireframe opcional. A verificação física em aparelho intermediário continua pendente.

Reprodução: `python scripts/measure-polish.py`. Dados completos: `artifacts/polish/performance.json`.

## Verossimilhança e fontes

Imóveis, valores, agente, métricas e depoimentos continuam demonstrativos. CRECI permanece nulo; fotografias e filme são referências, não comprovação de imóveis localizados nesses bairros. Não foram inventados endereços precisos, distâncias ou coordenadas.

- [Prefeitura de Nova Lima — Vila da Serra](https://www.novalima.mg.gov.br/inicio/noticias/lixo_certo_na_hora_certa_vila_da_serra).
- [Prefeitura de Belo Horizonte — Parque das Mangabeiras](https://prefeitura.pbh.gov.br/fundacao-de-parques-e-zoobotanica/informacoes/parques/parque-das-mangabeiras).
- [Prefeitura de Belo Horizonte — Parque da Serra do Curral](https://prefeitura.pbh.gov.br/fundacao-de-parques-e-zoobotanica/informacoes/parques/parque-da-serra-do-curral).
