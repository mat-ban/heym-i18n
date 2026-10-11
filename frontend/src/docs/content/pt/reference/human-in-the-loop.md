# Human-in-the-Loop

O Human-in-the-loop (HITL) permite que um [Nó de agente](../nodes/agent-node.md) solicite aprovação em momentos específicos, aguarde uma decisão humana e, em seguida, continue o workflow a partir do mesmo snapshot de execução.

## O que faz

- Adiciona pontos de verificação de aprovação explícitos a um agente sem criar um workflow de aprovação separado
- Cria um URL de revisão público de utilização única em `/review/{token}`
- Permite que um revisor `Aceite`, `Edite e continue` ou `Recuse`
- Marca a execução como `pending` até que chegue uma decisão
- Retoma a execução em pausa e permite que o agente continue após a aprovação
- Suporta múltiplos pontos de verificação HITL sequenciais na mesma execução do agente

## Configuração do agente

Ative o HITL no painel de propriedades do agente.

| Definição | Descrição |
|---------|-------------|
| `hitlEnabled` | Ativa a revisão humana para este agente |
| `hitlSummary` | Diretrizes de aprovação para quando o agente deve solicitar revisão humana |

O HITL adiciona uma ferramenta `request_human_review` ao agente. Utilize o prompt do sistema e as diretrizes `hitlSummary` para indicar ao agente quais ações necessitam de aprovação. Quando o agente determina que um ponto de verificação necessita de revisão, envia um único texto de revisão em Markdown ao humano. O resumo apresentado ao revisor é gerado a partir do pedido do agente em tempo de execução; se o agente o omitir, o Heym deriva um a partir do corpo em Markdown. Na v1, o HITL suporta apenas saídas de agente em modo de texto, pelo que não pode ser combinado com `jsonOutputEnabled`.

Para ferramentas MCP, o Heym solicita ao modelo que interprete as instruções HITL escritas num de três âmbitos de aprovação:

- `always` para expressões como "sempre", "em cada" ou "para cada"
- `once` para expressões como "uma vez" ou "apenas uma vez"
- `never` para expressões como "nunca", "não perguntar" ou "já aprovado"

Essa interpretação controla se as chamadas MCP repetidas voltam a pausar, permanecem aprovadas uma vez ou ignoram completamente a revisão humana.

Quando o HITL está ativado, o agente também expõe um segundo ponto de saída no canvas com a etiqueta `review`. Utilize esse ramo para enviar o URL de revisão pendente e o resumo para Slack, email, registo ou qualquer outro fluxo de notificação enquanto a execução principal aguarda uma pessoa.

## Fluxo de revisão

1. O agente atinge um passo que requer aprovação e chama `request_human_review`
2. O Heym cria um pedido de revisão público e devolve um URL de revisão
3. Quaisquer nós ligados ao ponto de saída `review` do agente são executados imediatamente com o payload HITL pendente
4. A execução do workflow passa para `pending`
5. Um revisor abre `/review/{token}` sem iniciar sessão
6. O revisor escolhe uma ação:
   - `Aceitar` continua com o Markdown original
   - `Editar e continuar` continua com o Markdown editado
   - `Recusar` continua com `decision: "refused"` e ignora qualquer ação posterior do agente
7. O Heym retoma o workflow a partir do snapshot armazenado e permite que o agente continue com o contexto Markdown aprovado
8. Se um passo posterior também exigir aprovação, o agente pode chamar o HITL novamente e criar outro ponto de verificação pendente

As ligações de revisão expiram após 168 horas se ninguém responder.

## Página de revisão pública

A página de revisão pública apresenta:

- O nome do workflow e a etiqueta do agente
- Um resumo do revisor gerado automaticamente a partir do pedido de revisão do agente
- O texto de revisão em Markdown em primeiro lugar, como conteúdo principal
- Uma caixa de edição que só abre depois de o revisor clicar em `Editar`
- Uma pré-visualização em Markdown em tempo real durante a edição
- Botões de ação para `Aceitar`, `Editar e continuar` e `Recusar`

Assim que uma decisão é submetida, o token é bloqueado e não pode ser reutilizado.

## Saídas e estado de execução

Enquanto aguarda revisão, a saída do agente contém um payload pendente:

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

Depois de o revisor responder e o workflow ser retomado, a saída final do agente inclui os metadados da decisão:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Utilize `$agentLabel.decision` nos nós subsequentes para ramificar consoante os resultados aceite, editado ou recusado.

## Ramo de revisão no canvas

O ponto de saída `review` está disponível apenas quando `hitlEnabled` está ativado para um agente.

- É executado antes de a decisão humana chegar
- Recebe o payload HITL pendente, incluindo `summary`, `draftText`, `reviewUrl`, `shareText` e `shareMarkdown`
- Destina-se a passos de notificação ou transferência, como Slack, email ou registo de auditoria
- É executado uma vez por cada ponto de verificação HITL
- Não é executado novamente após o revisor responder; apenas o caminho normal de saída do agente continua na retoma

## Onde Aparece

- O [Histórico de Execuções](./execution-history.md) mostra execuções `pending` imediatamente e armazena o URL de revisão nos resultados do nó
- As respostas de chat do [Portal](./portal.md) mostram a ligação de revisão humana em vez de uma resposta vazia
- O painel de Depuração e os diálogos de histórico mostram a decisão final de HITL e o texto revisto
- O handle de saída de revisão pode notificar canais externos mesmo quando o workflow foi acionado por cron, curl ou tráfego do portal
- Múltiplos checkpoints de HITL reutilizam a mesma entrada do histórico de execuções, criando simultaneamente uma nova ligação de revisão de utilização única para cada pausa

## Limites Atuais

- O HITL está disponível apenas em nós de Agente
- O HITL utiliza a saída de texto do agente e não suporta saída JSON na v1
- Uma execução em pausa é retomada a partir do snapshot armazenado do workflow, não da versão mais recente do workflow editado
- Sub-workflows aninhados não podem entrar num estado HITL pendente na v1; solicite revisão ao agente principal antes de os invocar

## Relacionado

- [Nó de Agente](../nodes/agent-node.md) - Configurar HITL num agente
- [Arquitetura de Agentes](./agent-architecture.md) - Como agentes, ferramentas, sub-agentes e HITL se integram
- [Histórico de Execuções](./execution-history.md) - Inspecionar execuções pendentes e retomadas
- [Board](../tabs/board-tab.md) - As execuções em cadeia do Board colocam o cartão num estado pendente (âmbar) em HITL
- [Portal](./portal.md) - Fluxos de chat públicos e ligações de revisão HITL
