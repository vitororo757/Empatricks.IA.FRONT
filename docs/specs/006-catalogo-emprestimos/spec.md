# Spec 006 — Catálogo e solicitação de empréstimos: frontend

Estado: implementação publicada e em revisão; aprovação integral ainda depende de evidências dos critérios. Esta spec substitui os comportamentos de demonstração das specs 001, 002 e 003 nesta entrega.

## Objetivo e decisões

A pessoa se autentica com Supabase Auth e usa o catálogo e seus empréstimos persistentes pelo backend REST. A solicitação cria o empréstimo imediatamente, sem fila ou aprovação. A regra escolhida para esta prática é de até cinco empréstimos abertos e prazo de 14 dias úteis (supera o limite de três e os 14 dias anteriores do protótipo); a conferência obrigatória é no backend. Um empréstimo vencido, manutenção e indisponibilidade impedem nova solicitação conforme as regras de negócio do backend. Devolução e operações ficam fora do escopo. A lista de dados da prática prevalece: TI-0004, TI-0007 e TI-0010 estão em manutenção.

A solicitação posterior do usuário altera a origem das fotos para Pixabay, em substituição a Pexels. O catálogo e a página de empréstimos exibem o crédito com link Pixabay; a escolha da fonte, direitos e revisão de cada imagem são responsabilidade da skill e de seu processo de preparação. Nenhuma imagem fictícia é introduzida no frontend.

## Contrato

- Configuração pública: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e `VITE_API_URL`; nenhuma chave privilegiada é enviada ao navegador.
- Login por senha no Supabase Auth; o access token fica apenas na memória da página, enviado como Bearer à API; ao recarregar a página é necessário entrar novamente. O logout limpa a sessão local e solicita a revogação ao serviço.
- `GET /equipment` retorna `id`, `assetTag`, `name`, `category`, `status` (`available`, `on_loan`, `maintenance`) e `imageUrl`.
- `GET /loans` retorna somente os empréstimos em aberto do usuário autenticado, com `id`, `equipmentId`, `borrowedAt`, `dueAt` e `equipment` com `id`, `name`, `assetTag`, `imageUrl`.
- `POST /loans` aceita `{ equipmentId }` e retorna `id`, `equipmentId`, `borrowedAt`, `dueAt`; erros HTTP devolvem mensagem em português. O servidor é a autoridade de todas as regras e resolve concorrência. A interface atualiza catálogo e empréstimos após a tentativa e informa a recusa.

## Critérios de aceitação

- CA-01: Login real e falhas de autenticação visíveis; não há entrada de demonstração ou senha fixa.
- CA-02: O catálogo autenticado mostra imagem, nome, patrimônio, categoria e situação dos itens recebidos; busca e filtro refletem os dados.
- CA-03: Manutenção e item emprestado não permitem solicitar; uma solicitação disponível pede confirmação e chama a API uma vez.
- CA-04: Sucesso mostra a data informada pelo servidor e atualiza dados; rejeições, incluindo atraso, limite e concorrência, mostram o motivo fornecido pelo backend.
- CA-05: Meus empréstimos mostra apenas os empréstimos recebidos para a sessão, seus equipamentos e datas; lista vazia é identificável.
- CA-06: As páginas que exibem fotos creditam Pixabay com link. As imagens dependem do processo de origem e revisão, fora do controle desta interface.
- CA-07: A interface não contém segredos e solicita autenticação novamente após recarga; carregamento e erros são apresentados.

## Lacunas e limites

- 14 dias úteis, definição de atraso e exclusão ou não de feriados são responsabilidades e decisões da spec de backend. O frontend usa sempre a data retornada pelo servidor, sem calcular um prazo próprio.
- A ausência de URL de imagem é tratada sem usar origem alternativa; a presença de todas as fotos é garantida no processo de dados, não pelo componente.
- O deploy, login e catálogo foram observados em produção; o usuário relatou teste de empréstimo com outra conta. Revisão independente por critério e verificações integradas adicionais permanecem pendentes.
