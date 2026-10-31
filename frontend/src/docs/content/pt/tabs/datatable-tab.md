# DataTable

O separador **DataTable** permite criar e gerir tabelas de dados estruturados diretamente no Heym. As tabelas podem ser utilizadas em workflows através do [nó DataTable](../nodes/datatable-node.md) para operações CRUD programáticas.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Ver demonstração do DataTable</a></p>

## Criar uma tabela

1. Navegue até ao separador DataTable a partir do painel de controlo
2. Clique em **Criar DataTable**
3. Introduza um nome e uma descrição opcional
4. Adicione colunas com o editor de colunas

## Colunas

Cada coluna tem:

| Propriedade | Descrição |
|----------|-------------|
| Nome | Nome de apresentação da coluna |
| Tipo | `string`, `number`, `boolean`, `date` ou `json` |
| Obrigatório | Se as novas linhas têm de incluir esta coluna |
| Único | Se os valores têm de ser únicos entre linhas |
| Valor predefinido | Preenchido automaticamente quando uma linha omite esta coluna |

Adicione, edite ou remova colunas a partir do cabeçalho da vista de detalhe da tabela.

## Gerar colunas com IA

Em vez de adicionar colunas manualmente, pode descrever a tabela em linguagem natural (ou colar um JSON de exemplo) e deixar que um LLM proponha o esquema. Ambos os pontos de entrada abrem a mesma caixa de diálogo:

- **Gerar com IA** (cabeçalho da lista DataTable) — cria uma tabela totalmente nova a partir da sua descrição.
- **Colunas IA** (vista de detalhe da tabela, junto aos controlos de colunas) — propõe *novas* colunas para acrescentar à tabela que tem aberta.

### Como funciona

1. Escolha uma **credencial LLM** e um **modelo** (predefinido para a sua primeira credencial LLM e o respetivo modelo mais recente).
2. Escreva uma descrição — por exemplo *"Uma tabela de livros com título, autor, número de páginas e se já o li"* — ou cole um exemplo/esquema JSON.
3. Clique em **Gerar**. O modelo devolve um esquema sugerido.
4. Reveja as colunas geradas num formulário editável: altere o **nome**, **tipo**, **predefinição**, **único** e **notEmpty** (obrigatório) de cada uma, elimine colunas indesejadas ou **Adicione uma coluna** manualmente. Para uma nova tabela, também pode editar o **nome** e a **descrição** sugeridos pela IA.
5. Clique em **Criar tabela** (nova tabela) ou **Adicionar colunas** (tabela existente) para guardar. Prima **Esc** para fechar a caixa de diálogo em qualquer momento.

### Apenas adição para tabelas existentes

Ao gerar colunas para uma tabela existente, o modelo vê as suas colunas atuais como contexto e propõe **apenas novas** colunas. As colunas existentes e os seus dados nunca são modificados nem removidos — as colunas geradas são acrescentadas. Nomes duplicados (sem distinção de maiúsculas/minúsculas) são eliminados automaticamente.

> É necessária uma credencial LLM (OpenAI, Google ou Personalizada). Se não tiver nenhuma, adicione uma primeiro nas Definições.

## Gerir linhas

- **Adicionar linha**: clique no botão de adição para criar uma nova linha
- **Edição em linha**: faça duplo clique em qualquer célula para editar o seu valor. Prima Enter ou clique fora para guardar, Escape para cancelar
- **Eliminar linha**: utilize o menu de ações da linha para remover uma linha
- **Paginação**: as linhas são apresentadas 25 por página com navegação entre páginas

## Importação/Exportação CSV

### Importação
1. Clique em **Importar CSV** na vista de detalhe da tabela
2. Selecione um ficheiro CSV para carregar
3. Pré-visualize as primeiras 5 linhas e o mapeamento de colunas
4. As colunas a verde correspondem a colunas existentes da tabela; as amarelas não correspondem
5. Clique em Importar para inserir linhas em massa

### Exportação
Clique em **Exportar CSV** para transferir todas as linhas como um ficheiro CSV.

## Partilha

Partilhe tabelas com outros utilizadores ou equipas:

1. Abra a caixa de diálogo de partilha a partir da vista de detalhe da tabela
2. Adicione utilizadores por email com permissão de **leitura** ou **escrita**
3. Adicione equipas com permissão de **leitura** ou **escrita**
4. Os utilizadores de apenas leitura podem ver dados; os utilizadores com permissão de escrita podem modificar linhas e colunas. Mudar o nome da tabela, alterar a respetiva descrição e gerir partilhas permanecem ações exclusivas do proprietário.

## Criar tabelas a partir do Assistente de IA

O [Assistente de IA](../reference/ai-assistant.md#data-tables) do canvas, o [Chat](./chat-tab.md) e a ferramenta `heym_chat` no [separador MCP](./mcp-tab.md) podem escolher uma das suas tabelas para um workflow que constroem, ou criar uma nova. Propõem um nome e colunas e criam a tabela quando submete o cartão de perguntas. O assistente do canvas configura os nós do workflow a partir dos metadados da tabela. O Chat e o `heym_chat` também podem inspecionar linhas, adicionar ou remover colunas e inserir, atualizar ou eliminar linhas diretamente. Forneça-lhes um nome de tabela ou a ligação deste separador. As escritas requerem propriedade ou acesso de **escrita** direto ou de equipa. A adição de colunas mantém os dados existentes; a remoção de colunas elimina os seus valores de cada linha. A remoção de colunas e a limpeza de todas as linhas solicitam confirmação, tal como neste separador.

## Utilizar em workflows

O [nó DataTable](../nodes/datatable-node.md) liga tabelas a workflows. As operações incluem find, getAll, getById, insert, update, remove e upsert. Não são necessárias credenciais.

## Tabela de custos LLM (tabela de sistema)

Uma secção fixa **Tabelas de sistema** aparece acima das suas tabelas criadas pelo utilizador com uma única entrada: **Tabela de custos LLM**. Esta é uma vista de esquema fixo, editável por utilizador, dos preços por modelo utilizados pelos gráficos de custos dos [Rastreios](./traces-tab.md).

### De onde vêm os dados

O Heym mantém uma tabela global de preços por modelo, preenchida a partir do endpoint público de preços da Helicone (`https://www.helicone.ai/api/llm-costs`). A sincronização é executada em segundo plano na primeira vez que abre a tabela ou os Rastreios e está limitada a uma obtenção por cada 24 horas. Prima **Atualizar** para forçar uma ressincronização imediata. As remoções da Helicone da lista de origem não são eliminadas localmente, para que as consultas de custos históricos se mantenham estáveis.

### Esquema (colunas só de leitura)

| Coluna | Significado |
|---|---|
| Fornecedor | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativo, utilizado pela Helicone) |
| Modelo | Identificador do modelo comparado com `trace.model` |
| Op | Operador de correspondência: `equals`, `startsWith` ou `includes` |
| Entrada $/1M | USD por 1 milhão de tokens de prompt |
| Saída $/1M | USD por 1 milhão de tokens de conclusão |
| Origem | `helicone`, `seed` ou `user` |

### Personalizar preços

- **Editar uma linha** para substituir os seus preços. A sua substituição é por utilizador e é marcada com um selo `Customized`; as sincronizações futuras do Helicone deixam-na intacta.
- **Repor predefinição** remove a substituição e restaura o valor global para essa linha.
- **Adicionar Modelo Personalizado** abre uma caixa de diálogo para criar uma linha exclusiva do utilizador (por exemplo, um modelo privado com ajuste fino que o Helicone não lista). As linhas personalizadas são marcadas como `User added` e, ao eliminá-las, são removidas por completo.

### Correspondência com rastreios

Quando o painel de Rastreios calcula o custo, corresponde cada `trace.model` a:

1. As suas substituições (correspondência exata no nome do modelo) primeiro
2. Caso contrário, a tabela global — a correspondência exata `equals` tem prioridade sobre `startsWith`/`includes`; os empates dentro do mesmo operador são resolvidos pelo prefixo/subcadeia de modelo correspondente mais longo

Se nenhuma linha corresponder, o modelo é listado no aviso **Unpriced models** na página Rastreios; a sua contribuição de custo é zero até adicionar uma linha personalizada ou substituir uma.

## Relacionado

- [Nó DataTable](../nodes/datatable-node.md) - Referência do nó de Workflow
- [Separador Rastreios](./traces-tab.md) - Utiliza a Tabela de Custos LLM para o gráfico circular de custos e os cartões de KPI
- [Nó Grist](../nodes/grist-node.md) - Alternativa de folha de cálculo externa
- [Separador Variáveis](./global-variables-tab.md) - Alternativa de armazenamento de chave-valor