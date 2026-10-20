# Spec 001 — Tela de Login

## Objetivo

Criar a primeira tela do Emprest.AI conforme o layout visual definido em `layout.md`, preparando a entrada dos papéis Colaborador e Operações.

## Escopo desta tarefa

- Implementar somente a apresentação visual da tela de Login.
- Usar React com TypeScript e Vite como ferramenta de build do frontend.
- Exibir os campos de e-mail e senha.
- Exibir as ações “Entrar” e “Entrar como Operações”.
- Não conectar autenticação real, Supabase ou banco nesta primeira tarefa.

## Referência visual

Seguir a seção 5.1 de `layout.md`:

- grade `1.05fr 0.95fr`;
- altura mínima de `820px`;
- fundo escuro baseado em `#161826` e superfícies `#232532`;
- acento teal `#2fb8ac`;
- tipografia Raleway;
- marca EMPREST.AI;
- painel esquerdo com título, lead, três estatísticas e rodapé;
- painel direito com formulário centralizado em coluna de `340px`.

## Critérios de aceitação

- CA-01: A tela apresenta os dois painéis na proporção visual definida no layout.
- CA-02: O painel esquerdo exibe a marca, o título, o texto de apoio, as estatísticas “3 itens por pessoa”, “14 dias de prazo” e “0 linhas para preencher”, além do rodapé “Operações · TI interno”.
- CA-03: O painel direito exibe o título “Entrar”, texto de apoio, campos “E-mail” e “Senha”, botão primário “Entrar”, botão “Entrar como Operações →” e a nota de isolamento dos empréstimos.
- CA-04: A tela respeita as cores, espaçamentos, tipografia, foco e estados de controle descritos em `layout.md`.
- CA-05: A implementação funciona em viewport de referência de 1360–1440px e não quebra em viewport menor.
- CA-06: Os botões podem emitir uma ação visual local, mas não fazem autenticação nem acessam serviços externos.
- CA-07: O projeto frontend inicia e gera build usando os scripts definidos pelo scaffold Vite.

## Fora de escopo

- Autenticação real e integração com Supabase.
- Persistência, RLS e API.
- Navegação para Catálogo ou Operações.
- Responsividade completa das telas seguintes.
