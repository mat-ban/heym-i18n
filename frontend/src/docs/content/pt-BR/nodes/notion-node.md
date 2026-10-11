# Notion

O nó **Notion** gerencia bancos de dados, fontes de dados, páginas e blocos por meio da API do Notion.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Token de integração interna ou Notion OAuth |
| Versão da API | `2026-03-11` |

Coleções no estilo de banco de dados do Notion usam **IDs de fonte de dados** nas versões atuais da API. Compartilhe cada página
ou fonte de dados de que o workflow precisa com a integração antes de executar o nó.
Os campos de recurso aceitam tanto um ID bruto do Notion quanto uma URL completa do Notion. As URLs são normalizadas para o
ID de recurso incorporado antes da requisição à API.

## Operações

| Operação | Campos obrigatórios | Saída principal |
|-----------|-----------------|-------------|
| Search | Query/filter/sort opcionais | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID ou Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, um entre Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request com `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, database request não vazio | `.database`, `.id`, `.url` |
| Create Data Source | Data source request com `parent` e `properties` não vazio | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, data source request não vazio | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block ou Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, objeto de atualização de bloco | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block ou Page ID, Children | `.results`, `.count` |

Todas as operações também retornam `.success` e `.operation`.

## Campos JSON

Os campos Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon e Cover aceitam
JSON da API do Notion. Expressões dentro de strings JSON são resolvidas antes da requisição. Um campo também pode
ser uma expressão única que resolve diretamente para o objeto ou array necessário, como
`$input.database`, `$input.properties` ou `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Para conteúdo de página ou bloco, Children é um array de objetos de bloco do Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Bancos de dados e fontes de dados

Na API atual do Notion, um **banco de dados** é um contêiner e uma **fonte de dados** contém o esquema de propriedades
e as linhas consultáveis. Retrieve Database retorna a lista `data_sources` do banco de dados; use um desses
IDs com Retrieve Data Source ou Query Data Source.

Create Database aceita o objeto de requisição completo do endpoint Create a database do Notion. Ele
deve conter `parent` e pode conter `title`, `description`, `is_inline`,
`initial_data_source`, `icon` e `cover`. Por exemplo:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database aceita o objeto de requisição do endpoint de atualização, incluindo `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` e `is_locked`. Os campos Database ID aceitam
um ID bruto, uma URL completa do Notion ou uma expressão.

Use **Retrieve Data Source** para buscar o esquema `properties` da fonte de dados antes de construir um
objeto de propriedades do Create Page. **Create Data Source** exige um objeto de banco de dados pai e um
esquema `properties` não vazio. **Update Data Source** aceita um objeto de requisição não vazio suportado
pelo endpoint correspondente do Notion.

Por exemplo, crie uma fonte de dados dentro de um banco de dados existente:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Os seletores Data Source e Parent Page suportam busca no lado do servidor com um pequeno debounce e
paginação **Load more** baseada em cursor. Use **Refresh** após compartilhar um novo recurso no Notion.
Alterne para **Use expression** para inserir uma expressão, ID bruto ou URL.

Filtros de busca de tutoriais mais antigos que usam
`{"property":"object","value":"database"}` são traduzidos para o valor atual `data_source`.
Novos workflows devem usar `data_source` ou `page` diretamente.

Append Blocks suporta as posições **Start**, **End** e **After Block**. Create Page e Append
Blocks dividem automaticamente mais de 100 filhos de nível superior em requisições ordenadas para satisfazer
o limite por requisição do Notion.

Requisições com limite de taxa (`429` ou `529`) são repetidas até três vezes. O Heym respeita o
cabeçalho `Retry-After` do Notion, limita cada espera a 10 segundos e adiciona jitter aleatório. As requisições ao Notion
compartilham um pool de conexões HTTP de todo o processo entre páginas e nós de workflow.
## Limites da API do Notion

- Um único valor rich-text `text.content` pode conter no máximo 2.000 caracteres. Divida textos mais longos em múltiplos objetos rich-text.
- O Notion limita os blocos filhos de nível superior a 100 por requisição. O Heym agrupa arrays Children maiores, mas cada bloco individual ainda deve respeitar os limites de payload do Notion.
- A API aceita no máximo dois níveis aninhados de blocos filhos em uma única requisição. Crie estruturas mais profundas com operações Append Blocks subsequentes.
- Os payloads de requisição são limitados a 1.000 elementos de bloco e 500 KB no total.

## Paginação

Search, Query Data Source e Get Block Children aceitam um tamanho de página de 1 a 100 e um cursor inicial opcional. Defina o tamanho da página como `0` para seguir os cursores automaticamente e mesclar todos os resultados, até o limite de segurança de 10.000 resultados do nó.

## Configuração de credenciais

Escolha uma das configurações no diálogo de credenciais (**Internal token** ou **OAuth**):

- **Internal token:** Crie uma integração interna, copie seu token para o Heym e compartilhe cada página ou data source necessária com a integração. Use **Test Connection** para verificar o acesso.
- **OAuth:** Crie uma integração pública do Notion e registre
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` no Notion. No diálogo de credenciais do Heym,
  escolha **OAuth**, insira o Client ID e o Client Secret da integração e clique em **Connect** para
  autorizar um workspace. O secret é armazenado criptografado junto à credencial e não é colocado no
  OAuth state nem na configuração de ambiente. Após a autorização, a credencial exibe o nome do
  workspace conectado (`connected (Workspace Name)`). Credenciais OAuth pendentes exibem
  `Not connected`.

Deixar o campo internal token em branco durante a edição preserva o token armazenado.

Para requisições [HTTP](../nodes/http-node.md) personalizadas, `$credentials.YourNotionCredential` é resolvido para o mesmo bearer token que o nó do Notion utiliza (internal token ou OAuth access token).

## Notas sobre a versão da API

O Heym fixa as requisições ao Notion na versão de API `2026-03-11`. Esta versão utiliza:

- Parents `data_source_id` e endpoints `/data_sources` em vez de caminhos legados de consulta a banco de dados
- `in_trash` em vez de `archived` para operações de lixeira/restauração de páginas
- Objetos `position` (`start`, `end`, `after_block`) para Append Block Children

Ao migrar exemplos mais antigos de automação do Notion:

- Substitua referências de parent/consulta de banco de dados por IDs de data source obtidos em **Retrieve Database** ou pelo seletor de data source do editor
- Substitua `archived: true` por `in_trash: true`
- Substitua os parâmetros `after` de append pelo campo **Append Position** do nó

Filtros de busca que ainda usam o valor de objeto `database` são normalizados automaticamente para `data_source`.

## Relacionados

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)
