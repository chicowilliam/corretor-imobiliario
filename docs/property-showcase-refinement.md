# Vitrine de imóveis e reprodução de mídia

## Correções

A seleção desktop usava uma fileira de colunas limitadas a 385 px dentro de um container limitado a 1600 px. Isso deixava espaço sem uso em telas maiores e enquadrava fotografias horizontais em frames excessivamente verticais.

A seleção agora usa um container de até 1920 px, margens de 3vw e colunas que dividem o espaço disponível: duas entre 768 e 1279 px, três a partir de 1280 px. As fotografias desktop usam 6:5, cover e os pontos focais existentes. Mobile conserva sua fileira horizontal de 78vw e proporção 4:5. Sizes das imagens acompanha os novos frames. A orientação e o bloqueio de Lenis da fileira horizontal se limitam ao mobile.

Foi acrescentado o campo name ao domínio, separado do título editorial. Apartamento Mirante, Residência Alameda e Apartamento Praça identificam a seleção; Lourdes, Belvedere e Savassi continuam como localização. Residência Jardins, Cobertura Aurora e Residência Serra completam os mocks. Os títulos editoriais e as descrições foram preservados. Detalhes e mensagens contextuais usam o nome comercial.

## Modal e vídeo

Os modais existentes exibem fotografias, não vídeo. Foram preservados assim. Entrada e saída usam WAAPI com transform/opacity, sem React por frame. O conteúdo é preparado ao se aproximar da viewport (exceto saveData), além de foco/toque, e o fallback reserva espaço.

O vídeo ativo é o Hero. Seu elemento e src permanecem estáveis. Chamadas concorrentes de play foram evitadas; reprodução pausa ao bloquear o documento por modal/menu e retoma ao liberar, respeitando pausa manual, visibilidade e reduced motion. O efeito de foco da abertura agora desfoca uma imagem estática otimizada, em vez de filtrar cada novo frame do vídeo atrás do overlay. Animações e mídia original foram preservadas.

Asset inspecionado: MP4/H.264 High Level 3.1, 1280×720, 24 fps, 12 segundos, 2.353.250 bytes (aproximadamente 1,57 Mbps), moov antes de mdat (fast start). Keyframes nas amostras 1 e 251. Não há 4K ou bitrate excessivo; nenhuma recompressão com perda foi aplicada. Os 24 fps da filmagem são distintos da taxa de atualização da interface.

## Verificação

- Build de produção/TypeScript e lint aprovados; sete testes unitários aprovados.
- Chrome automatizado: grid em 1366, 1440, 1920, 1100, 768 e 390 px; proporções, ausência de overflow, nomes/localizações e três ciclos de modal por largura verificados.
- Carga fria e reload com cache: reprodução, pausa ao abrir modal, retomada ao fechar e pausa fora da cena verificadas. Sem erros JavaScript nos contextos de grid.
- Amostras de 2,5 s, após 6 s de acomodação em cada carga, em Chrome headless local: fria p95 250,2 ms e 45 frames descartados em 58; com cache p95 18,7 ms e nenhum descartado em 56. Long task máxima desde navegação: fria 2530 ms; cache 1281 ms. Não se certifica 60 fps constantes ou desempenho em telefone físico. O custo da primeira carga permanece uma limitação observada.
- O roteiro local concluiu suas asserções; um erro de serialização do relatório ao final foi corrigido no script. Capturas e roteiro ficam em artifacts/polish (ignorados pelo Git).

Nenhuma dependência, imagem gerada ou alteração no encoding do vídeo. Publicação acompanha o commit via integração GitHub–Vercel existente.
