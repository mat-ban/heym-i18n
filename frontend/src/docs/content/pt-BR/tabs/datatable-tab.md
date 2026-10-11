# DataTable

A aba **DataTable** permite criar e gerenciar tabelas de dados estruturados diretamente no Heym. As tabelas podem ser usadas em workflows por meio do [Nó DataTable](../nodes/datatable-node.md) para operações CRUD programáticas.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Assistir à demonstração do DataTable</a></p>

## Criando uma Tabela

1. Navegue até a aba DataTable a partir do dashboard
2. Clique em **Create DataTable**
3. Insira um nome e uma descrição opcional
4. Adicione colunas com o editor de colunas

## Colunas

Cada coluna possui:

| Propriedade | Descrição |
|----------|-------------|
| Name | Nome de exibição da coluna |
| Type | `string`, `number`, `boolean`, `date` ou `json` |
| Required | Se novas linhas devem incluir esta coluna |
| Unique | Se os valores devem ser únicos entre as linhas |
| Default Value | Preenchido automaticamente quando uma linha omite esta coluna |

Adicione, edite ou remova colunas no cabeçalho da visualização de detalhes da tabela.

## Gerar Colunas com IA

Em vez de adicionar colunas manualmente, você pode descrever a tabela em linguagem natural (ou colar um JSON de exemplo) e deixar um LLM propor o schema. Ambos os pontos de entrada abrem o mesmo diálogo:

- **Generate with AI** (cabeçalho da lista de DataTables) — cria uma tabela totalmente nova a partir da sua descrição.
- **AI columns** (visualização de detalhes da tabela, ao lado dos controles de colunas) — propõe *novas* colunas para anexar à tabela que você tem aberta.

### Como funciona

1. Escolha uma **credencial LLM** e um **modelo** (o padrão é sua primeira credencial LLM e seu modelo mais recente).
2. Digite uma descrição — por exemplo *"Uma tabela de livros com título, autor, número de páginas e se já li"* — ou cole um exemplo/schema JSON.
3. Clique em **Generate**. O modelo retorna um schema sugerido.
4. Revise as colunas geradas em um formulário editável: altere o **name**, **type**, **default**, **unique** e **notEmpty** (obrigatório) de cada uma, exclua colunas indesejadas ou clique em **Add column** manualmente. Para uma nova tabela, você também pode editar o **name** e a **description** sugeridos pela IA.
5. Clique em **Create Table** (nova tabela) ou **Add Columns** (tabela existente) para salvar. Pressione **Esc** para fechar o diálogo a qualquer momento.

### Somente anexação para tabelas existentes

Ao gerar colunas para uma tabela existente, o modelo vê suas colunas atuais como contexto e propõe **apenas novas** colunas. As colunas existentes e seus dados nunca são modificados ou removidos — as colunas geradas são anexadas. Nomes duplicados (sem distinção entre maiúsculas e minúsculas) são descartados automaticamente.

> É necessária uma credencial LLM (OpenAI, Google ou Custom). Se você não tiver nenhuma, adicione uma em Settings primeiro.

## Gerenciando Linhas

- **Adicionar linha**: Clique no botão de adicionar para criar uma nova linha
- **Edição inline**: Dê um duplo clique em qualquer célula para editar seu valor. Pressione Enter ou clique fora para salvar, Escape para cancelar
- **Excluir linha**: Use o menu de ações da linha para remover uma linha
- **Paginação**: As linhas são exibidas em 25 por página com navegação entre páginas

## Importação/Exportação de CSV

### Importação
1. Clique em **Import CSV** na visualização de detalhes da tabela
2. Selecione um arquivo CSV para enviar
3. Visualize as primeiras 5 linhas e o mapeamento de colunas
4. Colunas verdes correspondem a colunas existentes da tabela; amarelas não correspondem
5. Clique em Import para inserir linhas em massa

### Exportação
Clique em **Export CSV** para baixar todas as linhas como um arquivo CSV.

## Compartilhamento

Compartilhe tabelas com outros usuários ou equipes:

1. Abra o diálogo de compartilhamento na visualização de detalhes da tabela
2. Adicione usuários por e-mail com permissão de **read** ou **write**
3. Adicione equipes com permissão de **read** ou **write**
4. Usuários somente leitura podem visualizar os dados; usuários com permissão de escrita podem modificar linhas

## Criando Tabelas a partir do Assistente de IA

O [AI Assistant](../reference/ai-assistant.md#data-tables) do canvas, o [Chat](./chat-tab.md) e a ferramenta `heym_chat` na [aba MCP](./mcp-tab.md) podem escolher uma de suas tabelas para um workflow que construírem, ou criar uma nova. Eles propõem um nome e colunas, e criam a tabela quando você envia o cartão de pergunta. Eles nunca alteram as colunas de uma tabela existente nem tocam em suas linhas: adicione ou edite colunas aqui.

## Usando em Workflows

O [Nó DataTable](../nodes/datatable-node.md) conecta tabelas a workflows. As operações incluem find, getAll, getById, insert, update, remove e upsert. Nenhuma credencial é necessária.

## Tabela de Custos de LLM (tabela de sistema)

Uma seção fixada **System tables** aparece acima das suas tabelas criadas pelo usuário com uma única entrada: **LLM Cost Table**. Esta é uma visualização de schema fixo, editável por usuário, dos preços por modelo usados pelos gráficos de custo do [Traces](./traces-tab.md).

### De onde vêm os dados

O Heym mantém uma tabela global de preços por modelo, populada a partir do endpoint público de preços da Helicone (`https://www.helicone.ai/api/llm-costs`). A sincronização é executada em segundo plano na primeira vez que você abre a tabela ou o Traces e é limitada a uma busca a cada 24 horas. Pressione **Refresh** para forçar uma ressincronização imediata. Modelos removidos da lista upstream da Helicone não são excluídos localmente, para que as consultas de custo histórico permaneçam estáveis.

### Schema (colunas somente leitura)

| Coluna | Significado |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativo, usado pela Helicone) |
| Model | Identificador do modelo comparado com `trace.model` |
| Op | Operador de correspondência: `equals`, `startsWith` ou `includes` |
| Input $/1M | USD por 1 milhão de tokens de prompt |
| Output $/1M | USD por 1 milhão de tokens de conclusão |
| Source | `helicone`, `seed` ou `user` |
### Personalizando preços

- **Edite uma linha** para substituir seus preços. Sua substituição é por usuário e é marcada com um selo `Customized`; sincronizações futuras do Helicone não a alteram.
- **Redefinir para o padrão** remove a substituição e restaura o valor global para aquela linha.
- **Adicionar Modelo Personalizado** abre um diálogo para criar uma linha exclusiva do usuário (por exemplo, um modelo fine-tuned privado que o Helicone não lista). Linhas personalizadas são marcadas como `User added` e, ao excluí-las, elas são removidas completamente.

### Correspondência com traces

Quando o dashboard de Traces calcula o custo, ele compara cada `trace.model` com:

1. Suas substituições (correspondência exata no nome do modelo) primeiro
2. Caso contrário, a tabela global — a correspondência exata `equals` tem prioridade sobre `startsWith`/`includes`; empates dentro do mesmo operador são resolvidos pelo prefixo/substring de modelo correspondente mais longo

Se nenhuma linha corresponder, o modelo é listado no aviso **Unpriced models** na página de Traces; sua contribuição de custo é zero até que você adicione uma linha personalizada ou substitua uma.

## Relacionados

- [Nó DataTable](../nodes/datatable-node.md) - Referência do nó de Workflow
- [Aba Traces](./traces-tab.md) - Usa a LLM Cost Table para o gráfico de rosca de custos e os cards de KPI
- [Nó Grist](../nodes/grist-node.md) - Alternativa de planilha externa
- [Aba Variables](./global-variables-tab.md) - Alternativa de armazenamento chave-valor
