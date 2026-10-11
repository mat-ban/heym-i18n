# Human-in-the-Loop

O Human-in-the-loop (HITL) permite que um [Nó Agente](../nodes/agent-node.md) solicite aprovação em momentos específicos, aguarde uma decisão humana e então continue o Workflow a partir do mesmo snapshot de execução.

## O Que Ele Faz

- Adiciona checkpoints explícitos de aprovação a um agente sem construir um Workflow de aprovação separado
- Cria uma URL pública de revisão de uso único em `/review/{token}`
- Permite que um revisor `Aceite`, `Edite e Continue` ou `Recuse`
- Marca a execução como `pending` até que uma decisão chegue
- Retoma a execução pausada e permite que o agente continue após a aprovação
- Suporta múltiplos checkpoints HITL sequenciais na mesma execução do agente

## Configuração do Agente

Habilite o HITL no painel de propriedades do agente.

| Configuração | Descrição |
|---------|-------------|
| `hitlEnabled` | Ativa a revisão humana para este agente |
| `hitlSummary` | Diretrizes de aprovação para quando o agente deve solicitar revisão humana |

O HITL adiciona uma ferramenta `request_human_review` ao agente. Use o system prompt e as diretrizes de `hitlSummary` para informar ao agente quais ações precisam de aprovação. Quando o agente decide que um checkpoint precisa de revisão, ele envia um único texto de revisão em Markdown para o humano. O resumo voltado ao revisor é gerado a partir da solicitação do agente em tempo de execução; se o agente o omitir, o Heym deriva um a partir do corpo em Markdown. Na v1, o HITL suporta apenas saídas de agente em modo texto, portanto não pode ser combinado com `jsonOutputEnabled`.

Para ferramentas MCP, o Heym pede ao modelo que interprete as instruções HITL escritas em um dos três escopos de aprovação:

- `always` para frases como "always", "on each" ou "for each"
- `once` para frases como "once" ou "only one time"
- `never` para frases como "never", "do not ask" ou "already approved"

Essa interpretação controla se chamadas MCP repetidas pausam novamente, permanecem aprovadas uma vez ou ignoram completamente a revisão humana.

Quando o HITL está habilitado, o agente também expõe um segundo handle de saída no canvas rotulado `review`. Use esse ramo para enviar a URL de revisão pendente e o resumo para Slack, e-mail, logging ou qualquer outro fluxo de notificação enquanto a execução principal aguarda uma pessoa.

## Fluxo de Revisão

1. O agente atinge uma etapa que exige aprovação e chama `request_human_review`
2. O Heym cria uma solicitação pública de revisão e retorna uma URL de revisão
3. Quaisquer Nós conectados ao handle `review` do agente são executados imediatamente com o Payload HITL pendente
4. A execução do Workflow passa para `pending`
5. Um revisor abre `/review/{token}` sem fazer login
6. O revisor escolhe uma ação:
   - `Aceite` continua com o Markdown original
   - `Edite e Continue` continua com o Markdown editado
   - `Recuse` continua com `decision: "refused"` e ignora ações adicionais do agente
7. O Heym retoma o Workflow a partir do snapshot armazenado e permite que o agente continue com o contexto do Markdown aprovado
8. Se uma etapa posterior também exigir aprovação, o agente pode chamar o HITL novamente e criar outro checkpoint pendente

Os links de revisão expiram após 168 horas se ninguém responder.

## Página Pública de Revisão

A página pública de revisão exibe:

- O nome do Workflow e o rótulo do agente
- Um resumo do revisor gerado automaticamente a partir da solicitação de revisão do agente
- O texto de revisão em Markdown primeiro, como conteúdo principal
- Uma caixa de edição que abre somente após o revisor clicar em `Editar`
- Uma pré-visualização de Markdown ao vivo durante a edição
- Botões de ação para `Aceite`, `Edite e Continue` e `Recuse`

Assim que uma decisão é enviada, o Token é bloqueado e não pode ser reutilizado.

## Saídas e Estado de Execução

Enquanto aguarda revisão, a saída do agente contém um Payload pendente:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Após o revisor responder e o Workflow ser retomado, a saída final do agente inclui os metadados da decisão:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Use `$agentLabel.decision` em Nós downstream para ramificar conforme os resultados accepted, edited ou refused.

## Ramo de Revisão no Canvas

O handle de saída `review` está disponível apenas quando `hitlEnabled` está ativado para um agente.

- Ele é executado antes que a decisão humana chegue
- Ele recebe o Payload HITL pendente, incluindo `summary`, `draftText`, `reviewUrl`, `shareText` e `shareMarkdown`
- Ele é destinado a etapas de notificação ou handoff, como Slack, e-mail ou logging de auditoria
- Ele é executado uma vez para cada checkpoint HITL
- Ele não é executado novamente após o revisor responder; apenas o caminho normal de saída do agente continua na retomada
## Onde Aparece

- [Histórico de Execução](./execution-history.md) mostra execuções `pending` imediatamente e armazena a URL de revisão nos resultados do Nó
- [Portal](./portal.md) as respostas do chat mostram o link de revisão humana em vez de uma resposta vazia
- O painel de Debug e os diálogos de histórico mostram a decisão final do HITL e o texto revisado
- O handle de saída da revisão pode notificar canais externos mesmo quando o Workflow foi acionado por cron, curl ou tráfego do portal
- Múltiplos checkpoints de HITL reutilizam a mesma entrada do histórico de execução enquanto criam um novo link de revisão de uso único para cada pausa

## Limites Atuais

- O HITL está disponível apenas em Nós Agente
- O HITL usa a saída de texto do agente e não oferece suporte a saída JSON na v1
- Uma execução pausada é retomada a partir do snapshot armazenado do Workflow, não da versão mais recente editada do Workflow
- Sub-workflows aninhados não podem entrar em um estado pendente de HITL na v1; solicite revisão ao agente pai antes de chamá-los

## Relacionado

- [Nó Agente](../nodes/agent-node.md) - Configure o HITL em um agente
- [Arquitetura de Agente](./agent-architecture.md) - Como agentes, ferramentas, sub-agentes e HITL se encaixam
- [Histórico de Execução](./execution-history.md) - Inspecione execuções pendentes e retomadas
- [Board](../tabs/board-tab.md) - Execuções em cadeia do Board pausam o card em um estado pendente (âmbar) no HITL
- [Portal](./portal.md) - Fluxos de chat públicos e links de revisão do HITL
