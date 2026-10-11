# Diálogo de Avaliação de Expressões

O Diálogo de Avaliação de Expressões é o editor expandido para campos compatíveis com expressões. Ele é aberto a partir do botão de expansão ao lado de um campo de expressão e oferece um espaço de trabalho maior, preenchimento automático, pré-visualização em tempo real do backend e navegação pela saída em um único local.

## Abrindo o Diálogo

- Clique no botão de expansão ao lado de um campo de expressão no painel de Propriedades.
- Campos de múltiplas linhas exibem o botão dentro do campo de entrada.
- Campos de linha única exibem o botão à direita do campo de entrada.

## Layout do Diálogo

- O diálogo é aberto como um modal centralizado em aproximadamente **80vw × 80vh**.
- O cabeçalho exibe **Evaluate — {field name}** quando o rótulo do campo é conhecido.
- O editor mantém o preenchimento automático, a navegação entre campos e as ações usuais **Apply** / **Cancel**.
- A pré-visualização é atualizada automaticamente cerca de **300 ms** após você parar de digitar.
- Pressione `Ctrl` / `Cmd` + `Enter` para aplicar o texto atual de volta ao campo e fechar o diálogo (o mesmo que **Apply**).

## Seção de Saída

A área de Saída é atualizada automaticamente após você pausar a digitação no editor.

### Avaliação

| Tipo de expressão | Resultado |
|---|---|
| `$expr` único (campo inteiro) | O valor nativo é preservado |
| Caminho de ponto simples isolado (campo inteiro, sem `$`, sem quebra de linha incorporada) | O mesmo que `$` + esse caminho (o backend normaliza para avaliação) |
| Texto com `$refs` incorporados | O resultado final é sempre uma string |
| Texto literal (sem `$`, não é um caminho de ponto simples) | Retornado como está |

**Exemplos**

| Entrada | Resultado |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (o mesmo que `$input.items` quando o valor inteiro é este caminho) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

O contexto de avaliação é construído nesta ordem:

- **Dados fixados** em nós upstream
- **Saídas da última execução** do canvas
- `null` quando nenhum dado upstream está disponível

Se o nó atual tiver dependências upstream, mas nenhuma delas tiver dados fixados ou um resultado de execução recente, o diálogo primeiro realiza uma execução de teste para construir o contexto e, em seguida, avalia o texto atual.

### Seletor de Caminho de Saída

Quando o resultado do backend é um objeto ou array, a área de Saída pode exibir um seletor de caminho interativo em vez do JSON bruto.

- Dê um duplo clique em uma linha para anexar esse caminho à referência `$node.path` atual.
- Dê um único clique em linhas expansíveis para abrir ou fechar ramificações.
- Use a caixa de consulta integrada para pesquisar chaves, valores e strings de caminho.

## Preenchimento Automático

- Digite `$` para abrir sugestões de nós upstream, built-ins e métodos.
- Pressione `Tab` ou `Enter` para inserir a sugestão selecionada.
- Use `↑` / `↓` para percorrer a lista de sugestões.

### Respostas de Exemplo

Quando você continua uma referência `$…` com um ponto, cada linha de sugestão exibe a resposta que essa sugestão produziria, em negrito à direita da linha.

- Digitar `$set.listItems.first().toString().u` lista `upper`, `urlEncode`, `urlDecode` e `unescape`, cada um com seu resultado avaliado — assim você pode escolher pelo resultado em vez de pelo nome.
- Digitar `$node.text.toJson()` analisa uma string JSON em um objeto ou array. Após `.toJson()`, o preenchimento automático pode oferecer as chaves analisadas (por exemplo, `repoUrl`) quando a saída da última execução ou fixada estiver disponível.
- Os resultados são avaliados no backend com os mesmos dados fixados e saídas da última execução que a pré-visualização do diálogo utiliza, portanto correspondem ao que o campo produzirá.
- Apenas sugestões que se sustentam sozinhas são avaliadas: métodos sem argumentos (`upper()`, `first()`, `keys()`, `toJson()`) e propriedades simples (`length`, `year`). Sugestões que precisam de argumentos primeiro — `map`, `filter`, `sort`, `replace` — são deixadas em branco.
- Uma linha permanece em branco quando o candidato não produz resposta: um erro, um `null` ou um método que não se aplica àquele valor.
- As respostas são encurtadas para uma linha. Passe o mouse sobre uma resposta encurtada para ver mais dela.

## Build with AI

O botão **Build with AI** aparece no canto superior direito do diálogo de avaliação quando um workflow está carregado. Ele abre um modal aninhado onde você pode descrever a expressão desejada em texto simples e fazer com que um LLM a gere para você.

### Como funciona

1. Clique em **Build with AI** na barra de ferramentas do diálogo de avaliação.
2. Selecione uma credencial de LLM e um modelo nos menus suspensos.
3. Digite uma descrição em texto simples do que você deseja — por exemplo, *"Get the customer name from the API response"*.
4. Clique em **Generate**. O modal chama o backend, que utiliza o prompt de sistema do [Expression DSL](./expression-dsl.md) juntamente com as saídas da última execução do seu workflow como contexto, e retorna uma única string de expressão.
5. A expressão gerada é imediatamente avaliada com os mesmos dados do canvas, para que você possa ver o resultado antes de aplicar.
6. Clique em **Apply** para substituir o conteúdo do editor pela expressão gerada, ou em **Regenerate** para tentar novamente.

### Contexto utilizado

O gerador recebe as saídas dos nós da última execução de teste no canvas. Se o workflow ainda não tiver sido executado, o LLM gera uma expressão de melhor esforço com base nos rótulos dos nós e nas convenções do DSL.
### Requisitos

- Uma credencial de LLM (OpenAI, Google ou Custom) deve estar configurada na aba [Credenciais](./credentials.md).
- O workflow deve estar aberto no editor.

## Atalhos de teclado

| Atalho | Ação |
|---|---|
| Pausa na digitação (~300 ms) | Atualizar a pré-visualização do backend |
| `Ctrl` / `Cmd` + `Enter` | Aplicar e fechar a caixa de diálogo |
| `Escape` | Fechar primeiro o preenchimento automático; caso contrário, fechar a caixa de diálogo |

## `$` aninhado em argumentos de método

Para avaliação em diálogo / backend, é possível passar outra referência com um `$` aninhado dentro de chamadas como `.get($other.field)` quando for necessária uma chave dinâmica. Também é possível utilizar um caminho simples dentro de `.get(...)` (por exemplo, `other.field`); o backend o resolve da mesma forma. Os campos salvos do workflow ainda devem seguir as regras da [Expression DSL](./expression-dsl.md); a API de avaliação também aceita um caminho pontilhado simples em linha completa por conveniência (consulte a tabela acima).

## Navegação

Os editores de mapeamento Set e Execute podem exibir os botões **Prev** / **Next** para que você possa mover-se entre os campos sem fechar a caixa de diálogo.

## Relacionados

- [Expression DSL](./expression-dsl.md)
- [Tipos de Nó](./node-types.md)
- [Credenciais](./credentials.md) — obrigatórias para o recurso Build with AI
- [Nó LLM](../nodes/llm-node.md)
- [Nó Output](../nodes/output-node.md)
- [Nó Condition](../nodes/condition-node.md)
