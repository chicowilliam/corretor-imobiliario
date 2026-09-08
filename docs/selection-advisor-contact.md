# Seleção, retrato editorial e contato

## Implementado

- A seleção da Home utiliza uma única fileira de cards uniformes, imagens 4:5 e overflow horizontal nativo. Foram removidos deslocamentos e larguras alternadas; o catálogo permanece independente. A fileira recebe foco pelo teclado e mantém os reveals e hovers existentes.
- Meu olhar ganhou título maior, um campo de papel discreto e retrato ampliado com contorno fino. O retrato permanece à esquerda e sticky no desktop; no mobile, a composição empilha para manter texto e fotografia legíveis.
- WhatsApp flutuante e Instagram no rodapé usam placeholders isolados em src/data/mocks/social.ts. Não representam atendimento ativo.
- Os CTAs abrem formulário sob demanda com nome, e-mail ou telefone, interesse e mensagem. Os detalhes preenchem o interesse com o imóvel escolhido. Validação nativa, envio simulado, confirmação acessível, nova mensagem e cópia estão implementados. Não há backend nem armazenamento de dados pessoais.

## Autocrítica

A composição depende de proporção, alinhamento e tipografia para funcionar mesmo sem animações. Foi escolhido somente o fundo de papel, evitando acumular grade técnica e marca d'água no mesmo retrato. Navbar e Hero não foram alterados.

## Validação pendente

Nesta rodada, build, lint/testes e Playwright foram iniciados, mas não concluíram durante a execução devido à lentidão generalizada do ambiente. Não há resultado aprovado de build ou revisão visual para estas alterações.

O roteiro artifacts/polish/verify-contact-row.py cobre larguras 1440/390/320, uniformidade da fileira com 3/5/7 cards, overflow, formulário por e-mail/telefone, contexto do imóvel, links e foco. Pode ser executado com TEST_URL apontando para o servidor local. Capturas previstas em artifacts/polish/.

Retomar: npm run build; npm run lint; npm test; iniciar o servidor e executar o roteiro. Conferir as capturas antes de considerar a revisão visual concluída.
