# Spec 003 — Meus empréstimos

## Objetivo

Permitir que o Colaborador consulte somente seus empréstimos ativos e registre a devolução de um item, conforme o PRD e as seções 5.3, 6, 7 e 9 de `layout.md`.

## Escopo

- Implementar a tela Meus empréstimos e sua navegação pela aplicação.
- Usar dados e transições em memória para o protótipo; não conectar autenticação, API, Supabase ou banco.
- A visão é limitada ao usuário de demonstração atual (Ana Ribeiro); a garantia real de isolamento pertence ao backend e está fora desta tela.

## Conteúdo e comportamento

- Título e resumo “N de 3 itens em seu nome · prazo padrão de 14 dias”.
- Barra de três posições: ocupadas no acento, atrasadas em vermelho e vagas em transparência neutra.
- Cada empréstimo mostra item, retirada, prazo de devolução com cor semântica, situação e ação “Devolver”.
- A devolução abre modal de confirmação com a data da devolução. Confirmar libera uma posição, atualiza o equipamento para disponível, remove o empréstimo da lista local e mostra toast. Cancelar ou clicar fora não altera os dados.
- Quando não houver empréstimos, exibir estado vazio tracejado com atalho “Ir ao catálogo”.
- Rodapé apresenta as regras de limite, prazo e bloqueio por atraso.
- Exibir banner de atraso quando houver empréstimo vencido; o banner no Catálogo deve levar a esta tela.

## Referência visual e dados

- Seguir a seção 5.3 de `layout.md`, o design system das seções 1–4 e a navegação da seção 6.
- Usar Ana Ribeiro e os empréstimos de exemplo da seção 9; manter português brasileiro e datas `DD/MM/AAAA`.
- Em viewport menor, reorganizar as cinco colunas sem ocultar informações ou ações.

## Critérios de aceitação

- CA-01: Resumo, barra de três posições e linhas exibem quantidade, datas e situações coerentes com os dados locais.
- CA-02: A lista contém apenas empréstimos da pessoa de demonstração, nunca os de outras pessoas.
- CA-03: Devolver exige confirmação; confirmar atualiza a lista e disponibilidade em memória, libera vaga e mostra toast.
- CA-04: Estado vazio oferece navegação para Catálogo.
- CA-05: Regras de limite, prazo e atraso ficam visíveis e coerentes com o estado.
- CA-06: Layout é utilizável na largura de referência e em viewport menor.
- CA-07: Nenhuma ação chama serviços externos ou persiste dados nesta etapa.

## Fora de escopo

- Autenticação e isolamento garantidos por RLS/backend, API e persistência.
- Reserva futura, notificações por e-mail e importação de planilha.
