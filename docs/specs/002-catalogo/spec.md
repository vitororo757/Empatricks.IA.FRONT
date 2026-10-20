# Spec 002 — Catálogo de equipamentos

## Objetivo

Permitir que Colaboradores consultem equipamentos, identifiquem sua situação e solicitem um item disponível, conforme o PRD e as seções 5.2, 6, 7 e 9 de `layout.md`.

## Escopo

- Implementar a tela de Catálogo e sua navegação compartilhada com as demais telas da aplicação.
- Para esta etapa visual, manter equipamentos, empréstimos e ações em memória; não conectar autenticação, API, Supabase ou banco.
- Usar os dados de exemplo e as regras de negócio já descritos no PRD e em `layout.md`.

## Conteúdo e comportamento

- Cabeçalho com “Catálogo”, contagem de equipamentos disponíveis e busca alinhada à direita.
- Busca imediata, sem diferenciar maiúsculas/minúsculas, por nome e patrimônio.
- Filtros exclusivos: Todos, Disponíveis, Emprestados e Em manutenção.
- Cards exibem categoria, nome, patrimônio, situação, detalhe correspondente e ação.
- Itens disponíveis permitem solicitar empréstimo. Itens emprestados ou em manutenção não podem ser solicitados; o card informa a situação e, quando aplicável, pessoa, prazo ou observação.
- Solicitar abre modal de confirmação com devolução prevista em 14 dias. Confirmar atualiza o estado em memória e mostra toast; cancelar ou clicar fora fecha sem alterar dados.
- Com três itens ativos, a solicitação fica desabilitada com “Limite de 3 itens”. Com atraso ativo, exibir banner com atalho para Meus empréstimos e desabilitar solicitações com “Bloqueado por atraso”.
- Item já emprestado ao usuário atual exibe “Está com você”.
- Estado sem resultados próprio para busca/filtro.
- Navegação compartilhada: Colaborador vê Catálogo e Meus empréstimos; Operações também vê Operações e Equipamentos. A aba atual é visualmente indicada. Sair retorna ao Login.

## Referência visual e dados

- Seguir a seção 5.2 de `layout.md`, o design system das seções 1–4 e a navegação da seção 6.
- Usar a lista de equipamentos e o usuário Ana Ribeiro da seção 9 para o estado de demonstração. Manter português brasileiro e datas `DD/MM/AAAA`.
- Preservar comportamento responsivo sem quebra em viewport menor que a referência de 1360–1440px.

## Critérios de aceitação

- CA-01: Cabeçalho, contagem, busca, filtros exclusivos e cards refletem a estrutura visual especificada.
- CA-02: Busca filtra imediatamente por nome ou patrimônio, sem diferenciar caixa, e apresenta estado vazio quando necessário.
- CA-03: As situações disponível, emprestado e manutenção têm conteúdo, pill e ação compatíveis; manutenção nunca conta como disponível.
- CA-04: Solicitação confirma em modal, aplica o prazo de 14 dias, atualiza o estado local e mostra toast.
- CA-05: Limite de três itens e bloqueio por atraso desabilitam solicitações e mostram os avisos especificados.
- CA-06: Navegação e atalhos levam às telas correspondentes sem abrir janelas ou empilhar modais.
- CA-07: Nenhuma ação chama serviço externo ou persiste dados nesta etapa.

## Fora de escopo

- Autenticação real, autorização no servidor, persistência, API, RLS e sincronização entre usuários.
- Reserva futura, notificações por e-mail e importação de planilha.
