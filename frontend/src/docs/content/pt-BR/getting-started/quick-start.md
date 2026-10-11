# Quick Start

Coloque seu primeiro Workflow do Heym em execução em poucos minutos.

Ainda não tem o Heym em execução? Consulte [Running & Deployment](./running-and-deployment.md) ou siga o passo a passo em vídeo: [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Crie um Workflow

1. Acesse a aba [Workflows](../tabs/workflows-tab.md)
2. Clique em **New Workflow**
3. Nomeie seu workflow (ex.: "Hello World")

## 2. Adicione Nós

1. Abra o painel **Nodes** à esquerda
2. Arraste um Nó [Input](../nodes/input-node.md) para o canvas
3. Arraste um Nó [LLM](../nodes/llm-node.md) e conecte-o ao Input
4. Arraste um Nó [Output](../nodes/output-node.md) e conecte-o ao LLM

```
[Input] --> [LLM] --> [Output]
```

Consulte [Node Types](../reference/node-types.md) para todos os Nós disponíveis.

## 3. Configure

- **Input**: Defina um valor padrão ou deixe vazio para entrada do usuário (consulte [Input Node](../nodes/input-node.md))
- **LLM**: Selecione uma [credential](../tabs/credentials-tab.md) e um modelo, adicione uma instrução de sistema e defina `userMessage` como `$input.text` (consulte [LLM Node](../nodes/llm-node.md))
- **Output**: Defina `message` como `$llm.text` para repassar a resposta do LLM (consulte [Output Node](../nodes/output-node.md))

Use a sintaxe do [Expression DSL](../reference/expression-dsl.md) para `$input.text` e `$llm.text`. Clique no botão de expandir nos campos de expressão para abrir o [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) com preview em tempo real do backend.

## 4. Execute

Clique em **Run**, pressione `Ctrl + Enter` ou use o painel de debug para executar. O workflow é executado a partir do Nó Input, passando pelos Nós conectados até o Output. Consulte [Triggers](../reference/triggers.md) para outras formas de executar workflows ([webhook](../reference/webhooks.md), portal, cron, etc.).

Visualize execuções anteriores em **History** (barra de ferramentas) e use **Bring to Canvas** para executar novamente com as mesmas entradas.

Em Docs, Evals e outras páginas internas que não são o canvas, você também pode usar o [Quick Drawer](../reference/quick-drawer.md) para selecionar um workflow fixado e executá-lo sem voltar ao editor.

Se você estiver lendo a documentação e quiser esclarecimentos antes de construir, abra o [Chat with Heym](../reference/chat-with-heym.md) no cabeçalho do Docs para fazer perguntas com contexto da página.

Como alternativa, use o [AI Assistant](../reference/ai-assistant.md) no painel de Debug para criar workflows com linguagem natural—descreva o que você deseja e a IA gera os Nós e as conexões.

Já está construindo automações em outra ferramenta? O [Migrate to Heym](./migrate-to-heym.md) converte um workflow do n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces em um workflow do Heym que você pode importar.

## Relacionados

- [Core Concepts](./core-concepts.md) – Workflows, Nós e fluxo de execução
- [Migrate to Heym](./migrate-to-heym.md) – Converta workflows do n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces para o Heym com IA
- [Running & Deployment](./running-and-deployment.md) – Inicie localmente com `run.sh` ou faça deploy com `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referência completa de configuração
- [Settings](../reference/user-settings.md) – Configure nome, User Rules e senha
- [Canvas Features](../reference/canvas-features.md) – Data pin, logs de execução, habilitar/desabilitar, extrair para sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Atalhos do canvas e do editor
- [Expression DSL](../reference/expression-dsl.md) – Referenciando dados na configuração de Nós
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor expansível com preview em tempo real do backend
- [Triggers](../reference/triggers.md) – Todos os pontos de entrada de workflow ([webhook](../reference/webhooks.md), portal, cron, etc.)
- [Execution History](../reference/execution-history.md) – Visualize execuções anteriores e use Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Execute workflows fixados a partir de páginas que não são o canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Faça perguntas contextuais no cabeçalho do Docs
- [Workflows Tab](../tabs/workflows-tab.md) – Crie e gerencie workflows
- [Credentials Tab](../tabs/credentials-tab.md) – Adicione API keys para Nós LLM
- [AI Assistant](../reference/ai-assistant.md) – Crie workflows com linguagem natural
