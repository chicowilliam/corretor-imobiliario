# Otimização sem remoção de recursos

## Alterações

- O vídeo do Hero reutiliza o poster otimizado pelo Next Image, evitando o download adicional da imagem original (235.928 bytes). O fallback estático permanece.
- Vídeo e ticker do Lenis deixam de trabalhar quando estão ocultos ou quando a interação está bloqueada; retomam respeitando as preferências do usuário.
- Eventos globais de movimento são compartilhados e o processamento do cursor é agrupado por frame.
- O cursor é carregado apenas em dispositivos compatíveis com ponteiro preciso e movimento permitido.
- Conteúdo dos detalhes de imóvel é carregado sob demanda. Modais fechados não mantêm sua árvore no DOM.
- Imagens recebem tamanhos responsivos correspondentes aos frames reais, sem trocar fotografias ou enquadramentos.
- Dígitos decorativos das métricas são montados quando entram em cena; o valor acessível permanece disponível.
- Componentes Motion utilizam LazyMotion com as funcionalidades necessárias. Animações, navegação e interações foram preservadas.

## Verificação

Build de produção e TypeScript passaram. ESLint e os sete testes automatizados passaram, incluindo o compartilhamento e a limpeza dos listeners.

Regressão funcional aprovada em desktop e mobile emulado: filtros, detalhes sob demanda, contato contextual, fechamento e restauração de foco, menu mobile, transições de rota e fallback com vídeo bloqueado. Pausa e retomada do vídeo ao sair e retornar à cena também foram verificadas.

Na comparação intermediária de carregamento, o DOM inicial caiu de 703 para 577 elementos e os dialogs de 10 para 1. Listeners de resize na janela caíram de 14 para 7; keydown no documento de 16 para 5; visibilitychange de 20 para 6. Essa amostra antecede a última simplificação dos imports Motion. Não é uma medição de FPS nem uma garantia para hardware real.

A comparação final de bytes JavaScript e a repetição da revisão integrada ficaram sem conclusão nesta retomada por lentidão generalizada do ambiente, inclusive na leitura de arquivos. Não se afirma redução final do bundle JavaScript com base na amostra intermediária. Os scripts e resultados locais estão em artifacts/polish/.

Nenhuma dependência nova, imagem gerada ou recurso visual removido. Sem novo benchmark de FPS, conforme solicitado.
