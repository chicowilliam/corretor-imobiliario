# Continuidade editorial — 8 de setembro de 2026

- Meu olhar: retrato sticky limitado à seção, com frases que evoluem pelo scroll. O texto continua legível sem JavaScript e a versão reduzida usa fotografia estática.
- Transições: fundos e espaçamentos conectados, mantendo a direção vertical. Removida a atmosfera animada automática da seleção.
- Títulos: preservado o SplitText com máscara por linha já instalado. Não foi acrescentado outro reveal concorrente.
- Cursor: EXPLORAR ↗ nos imóveis, → nos links/botões, VER nas fotografias. Desativado para toque, teclado, diálogos e movimento reduzido.
- Header: recolhe após 60px de deslocamento para baixo e retorna após 24px para cima; fica disponível no Hero, em foco e com diálogo aberto. Mantida a entrada tardia do fundo. Removido o backdrop-blur.
- Métricas: colunas de dígitos rolantes, com valor final estático acessível e fallback imediato. Rotações limitadas para evitar crescimento desnecessário do DOM.
- Seleção: composição em duas colunas de larguras diferentes, deslocamento sistemático dos pares e último item ímpar centralizado. No celular, fluxo vertical. Todas as imagens conservam 4:5. Fotos maiores e deslocamento discreto no hover; catálogo conserva seu grid.

A hierarquia é leitura, espaço, orientação e resposta à ação. Sem animações,
o retrato, as frases e a composição editorial continuam completos. Mantidos
somente os efeitos existentes necessários à leitura/interação, sem novo
controlador de scroll, fontes, fotografias ou dependências.

Coleção Privada **não tem rota própria**: atualmente abre PropertyPreview.
Não foi criada página ou transição portal. Galeria horizontal permanece
adiada até validação do usuário em aparelho físico. Nenhuma medição de FPS
foi repetida nesta rodada.

Validação: build/TypeScript e lint aprovados. Chrome em 1440, 390 e 320px:
foto mantém a posição durante a leitura, header recolhe/retorna, métricas
terminam em 12 e 140, imagens preservam 4:5, sem overflow horizontal ou
erros JavaScript. Cursor contextual e caminho de movimento reduzido
conferidos. Corrigida a largura mínima intrínseca da fotografia no grid
mobile. Evidências locais: `artifacts/polish/story-*.png`,
`editorial-*.png` e `verify-continuity.py`.
