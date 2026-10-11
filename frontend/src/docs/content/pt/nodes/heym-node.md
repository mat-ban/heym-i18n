# Heym

O nó **Heym** lê os próprios dados do Heym: os workflows que você pode acessar, a estrutura de um workflow e o seu histórico de execuções. É assim que você constrói meta-workflows — inventários de instância, resumos de execuções e relatórios de integridade sobre o próprio Heym.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Operações | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credencial | Nenhuma necessária |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `heymOperation` | Select | Qual leitura executar |
| `heymWorkflowId` | UUID | Workflow de destino. Obrigatório para `getWorkflow` e `getExecutionHistory`. Aceita expressões. |
| `heymLimit` | String | Número máximo de linhas a retornar. **Deixe vazio ou insira `0` para retornar tudo** — esse é o padrão. Aceita expressões. |
| `heymStatus` | String | Filtro de status opcional para `getExecutionHistory`. Aceita expressões. |
| `heymSinceDays` | String | Período de retrospectiva opcional em dias para `getExecutionHistory`. Aceita expressões. |

O seletor de workflow é um menu suspenso pesquisável que lista todos os workflows que você pode acessar.

## Escopo de acesso

Os resultados são delimitados pelo **proprietário do workflow no qual o nó reside** — não por quem iniciou a execução. O conjunto visível é:

- workflows de propriedade do proprietário,
- workflows compartilhados diretamente com o proprietário,
- workflows compartilhados com uma equipe à qual o proprietário pertence.

O escopo por proprietário é o que faz o nó se comportar de forma idêntica, seja uma execução iniciada manualmente, por cron, a partir de um portal ou por um evento da plataforma. O escopo por ator não retornaria nada em toda execução não assistida. É a mesma regra que o Heym já utiliza para credenciais e variáveis globais.

Um workflow que você não pode acessar e um workflow que não existe produzem a mesma mensagem de erro, de modo que o nó não pode ser usado para sondar ids de workflows.

## Operações

### Listar Workflows

Retorna todos os workflows que o proprietário pode acessar, com os atualizados mais recentemente primeiro.

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.workflows` | Array de resumos de workflows |
| `$nodeLabel.workflows[0].id` | UUID do workflow |
| `$nodeLabel.workflows[0].name` | Nome do workflow |
| `$nodeLabel.workflows[0].description` | Descrição, ou `null` |
| `$nodeLabel.workflows[0].active` | Se o workflow está ativo |
| `$nodeLabel.workflows[0].folder_id` | UUID da pasta, ou `null` |
| `$nodeLabel.workflows[0].updated_at` | Timestamp ISO do último salvamento |
| `$nodeLabel.workflows[0].node_count` | Quantos nós o workflow contém |
| `$nodeLabel.total` | Contagem total acessível **antes** da aplicação do limite |

`total` é deliberadamente a contagem sem limite, de modo que `$inventory.total` ainda reporta o tamanho real quando você restringe as linhas retornadas. Limpar o campo **Limit**, ou defini-lo como `0`, retorna todos os workflows — que é o padrão.

### Obter Workflow

Retorna a identidade e a forma de um workflow.

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identidade do workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadados do workflow |
| `$nodeLabel.node_count` | Número de nós |
| `$nodeLabel.nodes` | Array de `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array de `{ id, source, target, sourceHandle, targetHandle }` |

`data` é a **configuração completa do nó** — cada campo exatamente como foi salvo. É isso que torna a auditoria possível: você não consegue escanear um workflow em busca de uma chave de API que alguém colou em um campo se o nó se recusa a mostrar o campo.

Isso não concede nenhum alcance que o chamador já não tivesse. O nó é delimitado aos workflows que o proprietário pode abrir no editor de qualquer forma, e os segredos de credenciais armazenados continuam ausentes: os dados do nó contêm apenas **ids** de credenciais, enquanto os segredos em si residem criptografados na tabela de credenciais.

### Escaneando em busca de segredos embutidos no código

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Forneça ao agent `$detail.nodes` e peça que ele sinalize qualquer valor de `data` que se pareça com uma chave ou token ativo. Os campos que merecem atenção são os de texto livre — `curl` em nós HTTP, `userMessage` e `systemInstruction` em nós LLM e Agent, e corpos de ferramentas Python — porque um id de credencial é um UUID inofensivo, mas um `sk-…` colado não é.
### Obter Histórico de Execuções

Retorna entradas do histórico de execuções de um workflow, da mais recente para a mais antiga.

| Expressão | Descrição |
|------------|-------------|
| `$nodeLabel.executions` | Array de entradas do histórico |
| `$nodeLabel.executions[0].id` | UUID da execução |
| `$nodeLabel.executions[0].status` | `success`, `error`, entre outros |
| `$nodeLabel.executions[0].started_at` | Timestamp ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Duração em tempo real |
| `$nodeLabel.executions[0].trigger_source` | O que iniciou a execução, por exemplo `cron` ou `heym_event` |
| `$nodeLabel.executions[0].recovered` | Indica se a execução foi recuperada após uma falha |
| `$nodeLabel.executions[0].inputs` | O que a execução recebeu — o payload do trigger ou a entrada do chamador |
| `$nodeLabel.executions[0].outputs` | A saída do workflow para essa execução |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | O workflow ao qual o histórico pertence |
| `$nodeLabel.total` | Total de execuções correspondentes **antes** do limite |
| `$nodeLabel.by_status` | Contagens indexadas por status, por exemplo `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Início da janela, ou `null` para o histórico completo |

As entradas carregam tanto `inputs` quanto `outputs` — o que a execução recebeu e o que ela respondeu — mas nunca `node_results`: o trace por nó é a maior coluna da tabela e ofuscaria todo o restante. Consulte uma única execução através da API quando precisar do trace completo.

`total` e `by_status` sempre descrevem o histórico correspondente **completo**, mesmo quando **Limit** restringe as entradas retornadas — assim é possível obter as cinco execuções mais recentes e ainda reportar uma contagem precisa de falhas.

Deixe **Since (days)** vazio para abranger tudo, **Status filter** vazio para incluir todos os status, e **Limit** vazio ou `0` para retornar todas as entradas.

## Workflow de Exemplo

**Resumo diário de instâncias**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` rotulado como `inventory`
- **Loop** sobre `$inventory.workflows`
- **Heym** `getExecutionHistory` com `heymWorkflowId` definido como o `id` do item do loop, `heymSinceDays` de `1` e `heymLimit` de `5`
- **LLM** transforma as execuções coletadas e as contagens de status em um resumo legível

## Observações

- Nenhuma credencial é necessária; o nó lê o mesmo banco de dados no qual o Heym é executado.
- **Limit** é o mesmo campo para ambas as operações de listagem, e significa a mesma coisa em ambas: vazio ou `0` retorna tudo.
- O nó recebe uma entrada normal e pode ser anexado a um nó Agent como ferramenta, permitindo que um agente responda a perguntas sobre a sua instância Heym — ou a audite.
- Os payloads de `getWorkflow` crescem com o workflow: prompts longos e corpos de ferramentas Python viajam dentro de `data`.
- Combine-o com o [Heym Trigger](./heym-trigger-node.md) para reagir a alterações de workflow conforme elas ocorrem, em vez de consultar periodicamente em um agendamento.

## Relacionados

- [Heym Trigger](./heym-trigger-node.md) – Inicia um workflow a partir de eventos da plataforma
- [Execute](./execute-node.md) – Executa outro workflow em vez de descrevê-lo
- [Loop](./loop-node.md) – Itera sobre a lista de workflows retornada
