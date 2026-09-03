# ADR 001 — Stack

## Decisões

| Item | Escolha |
| --- | --- |
| Host | SUPABASE |
| Front | TypeScript → React |
| Back | TypeScript → Nest |
| ORM | Prisma → Zod |
| Autenticação | RLS |
| Autorização | Supabase |
| Banco | Postgres — Supabase |
| API | REST → MVC |
| Testes | Jest |
| Migration | não decidido |

### Justificativas

- **Host:** o host é o Supabase.
- **Front:** o front é TypeScript; em cima disso, React.
- **Back:** o back é TypeScript; em cima disso, Nest.
- **ORM:** o ORM é Prisma; em seguida, Zod.
- **Autenticação:** autenticação por RLS.
- **Autorização:** autorização no Supabase.
- **Banco:** o banco é Postgres, no Supabase.
- **API:** a API é REST, organizada em MVC.
- **Testes:** os testes são Jest.
- **Migration:** não decidido.

## Alternativas descartadas

Nenhuma alternativa foi ditada para descarte. Não há motivo de descarte registrado. O que não está na tabela não entra como escolha deste ADR.

## Consequências

**Fica mais fácil**
- Subir host, banco, autenticação e autorização no mesmo lugar (Supabase).
- Usar a mesma linguagem no front e no back (TypeScript).
- Ligar o modelo do Prisma ao Zod sem mudar de linguagem.
- Colocar regra de acesso no banco via RLS.
- Expor a API em REST com o recorte MVC.
- Rodar teste com Jest no Nest e no restante TypeScript.

**Fica mais difícil**
- Sair do Supabase sem mexer em host, Postgres, RLS e autorização juntos.
- Rodar o Nest se o host for só o que o Supabase oferece de runtime.
- Mudar o contrato da API sem atravessar o MVC REST.
- Trocar ORM ou validação sem refazer Prisma e Zod.
- Tratar migration: o item ficou em branco, então o caminho de schema no tempo não está definido.

**O que isso impede depois sem custo**
- Trocar o host sem custo de migração para fora do Supabase.
- Trocar o banco para algo que não seja Postgres no Supabase.
- Trocar autenticação/autorização para um modelo que não seja RLS + Supabase, sem reescrever política e cliente.
- Trocar o front para outro stack que não seja TypeScript → React, sem reescrever a UI.
- Trocar o back para outro stack que não seja TypeScript → Nest, sem reescrever a API.
- Trocar REST/MVC por outro estilo de API, sem reescrever os endpoints e a organização.
- Trocar Jest por outro runner, sem reescrever a suíte.
- Assumir uma ferramenta ou processo de migration: isso não foi decidido; escolher depois ainda custa o desenho e a adoção.

## O que este ADR não decide

- Migration (fica “não decidido”).
- Onde o Nest sobe se o runtime do Supabase não for o suficiente.
- CI/CD, ambientes, monorepo, pastas, biblioteca de UI, estado no client.
- Como Prisma e Zod se encaixam no dia a dia (só a ordem Prisma → Zod).
- Qualquer item que não esteja na tabela.
- Alternativas, prazos, tamanho de time ou produto.
