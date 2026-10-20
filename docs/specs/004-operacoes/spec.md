# Spec 004 — Operações: empréstimos em aberto

## Objetivo

Dar à equipe de Operações uma visão dos empréstimos em aberto e permitir registrar devoluções no balcão, conforme o PRD e as seções 5.4, 6, 7 e 9 de `layout.md`.

## Escopo

- Implementar a tela Operações para o papel Operações.
- Usar dados e ações em memória; não conectar autenticação, API, Supabase ou banco.
- A ação “Cadastrar equipamento” navega para a tela de cadastro especificada em `005-cadastro-equipamentos`.

## Conteúdo e comportamento

- Cabeçalho com título, texto de apoio, busca por pessoa ou equipamento e botão “Cadastrar equipamento”.
- Quatro KPIs: Em aberto, Em atraso, Disponíveis e Manutenção, derivados dos dados atuais.
- Tabela com pessoa (avatar e nome), equipamento, patrimônio, retirada, prazo, situação e ação “Registrar devolução”.
- Busca imediata, sem diferenciar maiúsculas/minúsculas, por pessoa e item; exibir estado sem resultados quando não houver correspondência.
- Registrar devolução abre modal com pessoa e equipamento no resumo. Confirmar remove o empréstimo da lista, libera o item e atualiza KPIs em memória, depois mostra toast. Cancelar ou clicar fora não altera dados.
- Datas vencidas recebem a cor semântica de atraso; prazos em dia e próximos do vencimento seguem os estados definidos em `layout.md`.
- Navegação compartilhada exibe as abas de Operações e Equipamentos apenas no papel Operações.

## Referência visual e dados

- Seguir a seção 5.4 de `layout.md`, o design system das seções 1–4 e a navegação da seção 6.
- Usar empréstimos e inventário de exemplo da seção 9; os valores iniciais esperados são 6 em aberto, 1 em atraso, 4 disponíveis e 2 em manutenção.
- Manter tabela utilizável em viewport menor, permitindo rolagem horizontal da tabela se necessário sem perder ações.

## Critérios de aceitação

- CA-01: Cabeçalho, busca, botão de cadastro e quatro KPIs correspondem ao layout.
- CA-02: Tabela mostra os empréstimos de todas as pessoas e diferencia visualmente atraso e demais situações.
- CA-03: KPIs iniciais correspondem aos dados de demonstração e são recalculados após devolução local.
- CA-04: Busca filtra por pessoa ou equipamento e apresenta estado vazio próprio.
- CA-05: Registrar devolução exige confirmação; confirmar atualiza empréstimos e disponibilidade em memória e mostra toast.
- CA-06: A ação de cadastro navega para Equipamentos; a navegação de Operações respeita o papel atual.
- CA-07: Nenhuma ação chama serviços externos ou persiste dados nesta etapa.

## Fora de escopo

- Verificação real de papel, API, persistência e sincronização entre usuários.
- Exportação, importação de planilha, notificações e reservas futuras.
