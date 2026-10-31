# Análise de Workflow

A **Análise de Workflow** é um painel lateral esquerdo que contém um documento Markdown compartilhado e editável por workflow. Utilize-o para explicar o que um workflow faz e para registrar ideias de melhoria — e permita que a IA gere um primeiro rascunho para você.

O documento é compartilhado: todos que podem acessar o workflow podem lê-lo e editá-lo. Ele é armazenado junto com o workflow e excluído automaticamente quando o workflow é excluído.

## Abrindo o Painel

1. Abra um workflow no editor.
2. Clique em **Analyze** (ícone Sparkles) na barra de ferramentas do editor.
3. O painel abre à esquerda. A paleta de nós (painel esquerdo) é recolhida enquanto ele está aberto; reabrir a paleta de nós fecha o painel de análise.

O painel está disponível apenas para workflows salvos. Em um workflow novo ainda não salvo, salve-o primeiro.

## O Documento

O painel exibe um único documento Markdown com duas visualizações, alternadas pelos botões **Edit** (lápis) e **Preview** (olho):

| Visualização | Finalidade |
|------|---------|
| **Edit** | Editor Markdown simples (textarea). |
| **Preview** | Markdown renderizado. |

O cabeçalho mostra **quem editou por último** o documento e quando.

### Salvando

Clique em **Save** para persistir suas alterações. O botão Save é habilitado apenas quando há edições não salvas.

Como o documento é compartilhado, os salvamentos usam concorrência otimista:

- Se outra pessoa salvou uma versão mais recente desde que você abriu o painel, seu salvamento é rejeitado e um aviso aparece nomeando o outro editor.
- Você pode então escolher **Reload (discard mine)** para adotar a versão do servidor, ou **Overwrite** para forçar o salvamento da sua versão sobre a deles.

## Análise por IA

Selecione uma **Credential** e um **Model** de LLM no topo do painel (a lista de modelos é carregada a partir da credencial selecionada — consulte [Credentials](../tabs/credentials-tab.md)). Em seguida, execute a análise:

- **Analyze my workflow** — exibido quando o documento está vazio. Ele transmite um relatório Markdown gerado por IA diretamente no editor como um rascunho não salvo. Revise e edite-o, depois clique em **Save**.
- **Reanalyze** — exibido quando o documento já possui conteúdo. Ele transmite um novo relatório em uma **preview** separada, deixando seu documento atual intacto. Escolha **Accept** para substituir o conteúdo do editor pela nova análise, ou **Discard** para manter o que você tinha.

Ambas as ações primeiro **executam o workflow** (quando ele é válido e executável) e incluem os resultados da execução no prompt de análise, de modo que o relatório reflita como o workflow realmente se comporta. Se o workflow não puder ser executado, a análise prossegue a partir de sua estrutura estática.

O relatório gerado cobre três seções, em ordem: **Improvement areas** (sugestões concretas, incluindo uma perspectiva de **security** sempre que o workflow envolver credenciais, entrada do usuário, requisições externas ou exposição de dados), o **Purpose** do workflow e **What it does** (uma descrição passo a passo pelos nós).

A seção **Improvement areas** sempre executa cinco verificações explícitas:

1. **Error coverage** — se o canvas não tiver nenhum nó [Error Handler](../nodes/error-handler-node.md) e nenhum workflow de erro estiver configurado, o relatório destaca isso e recomenda adicionar tratamento de erros.
2. **Time saved** — se nenhum tempo estimado economizado por execução estiver definido, o relatório recomenda configurar um para que a métrica **Time Saved** do [Analytics](../tabs/analytics-tab.md) possa ser preenchida.
3. **Network nodes** — para nós que fazem chamadas de rede (como [HTTP](../nodes/http-node.md) e nós de integração), o relatório recomenda tratamento de erros específico do nó (retry e/ou continue-on-error) nesses nós.
4. **Alerts** — quando nenhum [alerts](../tabs/alerts-tab.md) estiver configurado para o workflow, o relatório recomenda configurar alertas antes de ir para produção.

5. **Evals**: quando o workflow possui um nó [Agent](../nodes/agent-node.md) sem uma suite de agente, o relatório recomenda uma **Agent Suite** (ou uma **Prompt Suite**) em [Evals](../tabs/evals-tab.md#agent-suites); quando possui um nó [LLM](../nodes/llm-node.md), recomenda uma **Prompt Suite** para testar esse prompt entre diferentes modelos.

### Executar o Analyzer a partir de Properties

Quando um workflow tem nós no canvas mas ainda não possui documento de análise, um botão **Run Analyzer** aparece no painel [Properties](./canvas-features.md) no nível do workflow (exibido quando nenhum nó está selecionado). Ele abre este painel de Análise de Workflow para que você possa escolher uma credencial e um modelo e gerar o relatório.

Cada execução de análise é registrada em [Traces](../tabs/traces-tab.md) sob a origem **Workflow Analysis**.

Se nenhuma credencial de LLM estiver configurada, o botão Analyze fica desabilitado — adicione uma na [Credentials Tab](../tabs/credentials-tab.md).

## Relacionados

- [AI Assistant](./ai-assistant.md) — gere ou modifique nós de workflow a partir de linguagem natural.
- [Sticky Note](../nodes/sticky-note-node.md) — para notas curtas fixadas diretamente no canvas.
