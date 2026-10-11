# Análise de Workflow

A **Análise de Workflow** é um painel lateral esquerdo que contém um documento Markdown compartilhado e editável por workflow. Utilize-o para explicar o que um workflow faz e para registar ideias de melhoria — e permita que a IA gere um primeiro rascunho por você.

O documento é compartilhado: todos os que têm acesso ao workflow podem lê-lo e editá-lo. É armazenado com o workflow e eliminado automaticamente quando o workflow é eliminado.

## Abrir o Painel

1. Abra um workflow no editor.
2. Clique em **Analyze** (ícone Sparkles) na barra de ferramentas do editor.
3. O painel abre-se à esquerda. A paleta de nós (painel esquerdo) recolhe-se enquanto este estiver aberto; reabrir a paleta de nós fecha o painel de análise.

O painel está disponível apenas para workflows guardados. Num workflow novo ainda não guardado, guarde-o primeiro.

## O Documento

O painel apresenta um único documento Markdown com duas vistas, alternadas pelos botões **Edit** (lápis) e **Preview** (olho):

| Vista | Finalidade |
|------|---------|
| **Edit** | Editor Markdown simples (textarea). |
| **Preview** | Markdown renderizado. |

O cabeçalho mostra **quem editou por último** o documento e quando.

### Guardar

Clique em **Save** para persistir as suas alterações. O botão Save só fica ativo quando existem edições não guardadas.

Uma vez que o documento é compartilhado, as gravações utilizam concorrência otimista:

- Se outra pessoa guardou uma versão mais recente desde que abriu o painel, a sua gravação é rejeitada e aparece um aviso com o nome do outro editor.
- Pode então escolher **Reload (discard mine)** para adotar a versão do servidor, ou **Overwrite** para forçar a gravação da sua versão sobre a deles.

## Análise por IA

Selecione uma **Credential** e um **Model** de LLM no topo do painel (a lista de modelos é carregada a partir da credencial selecionada — consulte [Credentials](../tabs/credentials-tab.md)). Em seguida, execute a análise:

- **Analyze my workflow** — apresentado quando o documento está vazio. Transmite um relatório Markdown gerado por IA diretamente para o editor como rascunho não guardado. Reveja e edite-o, e depois clique em **Save**.
- **Reanalyze** — apresentado quando o documento já tem conteúdo. Transmite um novo relatório para uma **preview** separada, deixando o seu documento atual intacto. Escolha **Accept** para substituir o conteúdo do editor pela nova análise, ou **Discard** para manter o que tinha.

Ambas as ações **executam primeiro o workflow** (quando este é válido e executável) e incluem os resultados da execução no prompt de análise, para que o relatório reflita o comportamento real do workflow. Se o workflow não puder ser executado, a análise prossegue a partir da sua estrutura estática.

O relatório gerado abrange três secções, por ordem: **Improvement areas** (sugestões concretas, incluindo uma perspetiva de **security** sempre que o workflow envolva credenciais, input do utilizador, pedidos externos ou exposição de dados), o **Purpose** do workflow e **What it does** (uma descrição passo a passo pelos nós).

A secção **Improvement areas** executa sempre quatro verificações explícitas:

1. **Error coverage** — se o canvas não tiver nenhum nó [Error Handler](../nodes/error-handler-node.md) e não estiver configurado nenhum workflow de erro, o relatório assinala-o e recomenda adicionar tratamento de erros.
2. **Time saved** — se não estiver definida uma estimativa de tempo poupado por execução, o relatório recomenda configurar uma, para que a métrica **Time Saved** das [Analytics](../tabs/analytics-tab.md) possa ser preenchida.
3. **Network nodes** — para nós que efetuam chamadas de rede (como [HTTP](../nodes/http-node.md) e nós de integração), o relatório recomenda tratamento de erros específico do nó (retry e/ou continue-on-error) nesses nós.
4. **Alerts** — quando não estão configurados [alerts](../tabs/alerts-tab.md) para o workflow, o relatório recomenda configurar alertas antes de ir para produção.

### Executar o Analyzer a partir das Properties

Quando um workflow tem nós no canvas mas ainda não tem documento de análise, aparece um botão **Run Analyzer** no painel [Properties](./canvas-features.md) ao nível do workflow (apresentado quando nenhum nó está selecionado). Este abre o painel de Análise de Workflow para que possa escolher uma credencial e um modelo e gerar o relatório.

Cada execução de análise é registada em [Traces](../tabs/traces-tab.md) sob a origem **Workflow Analysis**.

Se não estiver configurada nenhuma credencial de LLM, o botão Analyze fica desativado — adicione uma no [Credentials Tab](../tabs/credentials-tab.md).

## Relacionado

- [AI Assistant](./ai-assistant.md) — gerar ou modificar nós de workflow a partir de linguagem natural.
- [Sticky Note](../nodes/sticky-note-node.md) — para notas curtas afixadas diretamente no canvas.