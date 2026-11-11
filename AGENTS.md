# Trabalho neste repositório

- Leia a spec e o ADR pertinentes antes de implementar. Antes de declarar pronta qualquer spec, peça uma revisão independente seguindo `../Empatricks.IA.BACKS/docs/verificador-spec.md`, abrangendo front e back quando necessário.
- O agente principal corrige falhas e solicita nova rodada; o verificador não corrige. Se não houver verificador disponível, a spec permanece pendente.
- Não escreva em produção; não registre segredos. O usuário executa operações em banco e Storage de produção.
- Essas instruções não isolam tecnicamente o subagente. Não disponibilize credenciais de produção ao revisor.
