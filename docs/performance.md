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
