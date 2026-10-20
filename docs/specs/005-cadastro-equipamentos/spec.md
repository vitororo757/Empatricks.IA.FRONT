# Spec 005 — Cadastro de equipamentos

## Objetivo

Permitir que Operações prepare o cadastro de um equipamento e retorne à tela de Operações, conforme o PRD e as seções 5.5, 6, 7 e 9 de `layout.md`.

## Escopo

- Implementar a tela de cadastro dentro do protótipo frontend.
- O cadastro é mantido somente em memória; não conectar API, Supabase ou banco.
- A tela é acessível pelo papel Operações e pelo botão de cadastro da tela Operações.

## Conteúdo e comportamento

- Grade principal `1fr 300px`, com formulário em card à esquerda e dois painéis de apoio à direita.
- Campos: Nome (obrigatório), Categoria (Notebook, Monitor, Cabo, Câmera, Acessório), Patrimônio (opcional), Observações (opcional) e situação inicial (Disponível ou Em manutenção).
- Painel “Regras em vigor” apresenta limite de 3 itens por pessoa, prazo de 14 dias, bloqueio por atraso e indisponibilidade durante manutenção.
- Painel “Fora desta versão” apresenta reserva futura, notificação por e-mail e importação da planilha com o tratamento visual discreto do layout.
- Sem nome, não cadastrar e mostrar toast “Informe o nome do equipamento”. Patrimônio vazio recebe `TI-—`.
- “Cadastrar equipamento” insere o novo item no topo dos dados locais, navega para Operações e exibe toast. “Cancelar” retorna para Operações sem cadastrar.

## Referência visual

- Seguir a seção 5.5 de `layout.md`, o design system das seções 1–4 e atalhos da seção 6.
- Formulário usa duas colunas para nome e observações conforme layout; os controles e painéis devem reorganizar-se em viewport menor.
- Interface em português brasileiro, sem incluir funcionalidades fora da v1.

## Critérios de aceitação

- CA-01: A grade, formulário e painéis laterais correspondem à hierarquia visual descrita.
- CA-02: Categorias e situações disponíveis são exatamente as especificadas; nome é obrigatório.
- CA-03: Patrimônio vazio é substituído por `TI-—`; nome vazio impede cadastro e apresenta o toast definido.
- CA-04: Cadastro válido adiciona item no início da lista local, retorna a Operações e mostra confirmação.
- CA-05: Cancelar retorna a Operações sem alterar dados.
- CA-06: Os painéis apresentam regras em vigor e itens fora da v1 sem sugerir que estes últimos foram implementados.
- CA-07: Layout permanece utilizável em viewport menor.
- CA-08: Nenhuma ação chama serviços externos ou persiste dados nesta etapa.

## Fora de escopo

- Persistência, upload de imagens, edição ou remoção de equipamentos, API e autorização real.
- Reserva futura, notificação por e-mail e importação de planilha.
