# Início Rápido

Coloque o seu primeiro workflow do Heym a funcionar em minutos.

Ainda não tem o Heym em execução? Consulte [Execução e Implementação](./running-and-deployment.md), ou siga o vídeo tutorial: [Configurar o Heym Localmente em Menos de 2 Minutos](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Criar um Workflow

1. Aceda ao separador [Workflows](../tabs/workflows-tab.md)
2. Clique em **Novo Workflow**
3. Atribua um nome ao seu workflow (por exemplo, "Hello World")

## 2. Adicionar Nós

1. Abra o painel **Nós** à esquerda
2. Arraste um nó [Input](../nodes/input-node.md) para o canvas
3. Arraste um nó [LLM](../nodes/llm-node.md) e ligue-o ao Input
4. Arraste um nó [Output](../nodes/output-node.md) e ligue-o ao LLM

```
[Input] --> [LLM] --> [Output]
```

Consulte [Tipos de Nó](../reference/node-types.md) para conhecer todos os nós disponíveis.

## 3. Configurar

- **Input**: Defina um valor predefinido ou deixe vazio para introdução pelo utilizador (consulte [Nó Input](../nodes/input-node.md))
- **LLM**: Selecione uma [credencial](../tabs/credentials-tab.md) e um modelo, adicione uma instrução de sistema e defina `userMessage` como `$input.text` (consulte [Nó LLM](../nodes/llm-node.md))
- **Output**: Defina `message` como `$llm.text` para transmitir a resposta do LLM (consulte [Nó Output](../nodes/output-node.md))

Utilize a sintaxe da [Expression DSL](../reference/expression-dsl.md) para `$input.text` e `$llm.text`. Clique no botão de expansão nos campos de expressão para abrir a [Caixa de Diálogo de Avaliação de Expressões](../reference/expression-evaluation-dialog.md) com pré-visualização em tempo real do backend.

## 4. Executar

Clique em **Executar**, prima `Ctrl + Enter`, ou utilize o painel de depuração para executar. O workflow é executado desde o nó Input, passando pelos nós ligados, até ao Output. Consulte [Triggers](../reference/triggers.md) para conhecer outras formas de executar workflows ([webhook](../reference/webhooks.md), portal, cron, etc.).

Consulte as execuções anteriores em **Histórico** (barra de ferramentas) e utilize **Trazer para o Canvas** para voltar a executar com os mesmos inputs.

Nas páginas Docs, Avaliações e outras páginas internas que não sejam o canvas, também pode utilizar a [Quick Drawer](../reference/quick-drawer.md) para escolher um workflow fixado e executá-lo sem regressar ao editor.

Se estiver a consultar a documentação e pretender esclarecimentos antes de construir, abra o [Chat com o Heym](../reference/chat-with-heym.md) a partir do cabeçalho dos Docs para colocar questões contextuais à página.

Em alternativa, utilize o [Assistente de IA](../reference/ai-assistant.md) a partir do painel de Depuração para criar workflows com linguagem natural—descreva o que pretende e a IA gera os nós e as ligações.

Já está a construir automações noutra ferramenta? [Migrar para o Heym](./migrate-to-heym.md) converte um workflow do n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces num workflow do Heym que pode importar.

## Relacionado

- [Conceitos Fundamentais](./core-concepts.md) – Workflows, nós e fluxo de execução
- [Migrar para o Heym](./migrate-to-heym.md) – Converta workflows do n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces para o Heym com IA
- [Execução e Implementação](./running-and-deployment.md) – Inicie localmente com `run.sh` ou implemente com `deploy.sh`
- [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referência completa de configuração
- [Definições](../reference/user-settings.md) – Configure nome, Regras do Utilizador e palavra-passe
- [Funcionalidades do Canvas](../reference/canvas-features.md) – Data pin, registos de execução, ativar/desativar, extrair para sub-workflow
- [Atalhos de Teclado](../reference/keyboard-shortcuts.md) – Atalhos do canvas e do editor
- [Expression DSL](../reference/expression-dsl.md) – Referenciar dados na configuração dos nós
- [Caixa de Diálogo de Avaliação de Expressões](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend
- [Triggers](../reference/triggers.md) – Todos os pontos de entrada de workflows ([webhook](../reference/webhooks.md), portal, cron, etc.)
- [Histórico de Execuções](../reference/execution-history.md) – Consulte execuções anteriores e Traga para o Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Execute workflows fixados a partir de páginas que não sejam o canvas
- [Chat com o Heym](../reference/chat-with-heym.md) – Coloque questões contextuais a partir do cabeçalho da documentação
- [Separador Workflows](../tabs/workflows-tab.md) – Crie e faça a gestão de workflows
- [Separador Credenciais](../tabs/credentials-tab.md) – Adicione chaves de API para nós LLM
- [Assistente de IA](../reference/ai-assistant.md) – Crie workflows com linguagem natural
