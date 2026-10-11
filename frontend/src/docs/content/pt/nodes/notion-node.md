# Notion

O nó **Notion** gerencia bancos de dados, fontes de dados, páginas e blocos por meio da API do Notion.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Token de integração interna ou Notion OAuth |
| Versão da API | `2026-03-11` |

As coleções no estilo de banco de dados do Notion utilizam **IDs de fonte de dados** nas versões atuais da API. Compartilhe cada página
ou fonte de dados de que o workflow necessite com a integração antes de executar o nó.
Os campos de recurso aceitam tanto um ID bruto do Notion quanto uma URL completa do Notion. As URLs são normalizadas para o seu
ID de recurso incorporado antes da requisição à API.

## Operações

| Operação | Campos obrigatórios | Saída principal |
|-----------|-----------------|-------------|
| Search | Consulta/filtro/ordenação opcionais | `.results`, `.count`, `.next_cursor` |
| Get Page | ID da página | `.page` |
| Create Page | ID da fonte de dados ou ID da página pai, Propriedades | `.page`, `.id`, `.url` |
| Update Page | ID da página, um entre Propriedades/Ícone/Capa | `.page` |
| Move Page to Trash | ID da página | `.page` |
| Restore Page | ID da página | `.page` |
| Create Database | Requisição de banco de dados com `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | ID do banco de dados | `.database` |
| Update Database | ID do banco de dados, requisição de banco de dados não vazia | `.database`, `.id`, `.url` |
| Create Data Source | Requisição de fonte de dados com `parent` e `properties` não vazio | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Fonte de dados | `.data_source` |
| Update Data Source | ID da fonte de dados, requisição de fonte de dados não vazia | `.data_source`, `.id`, `.url` |
| Query Data Source | ID da fonte de dados | `.results`, `.count`, `.next_cursor` |
| Get Block Children | ID do bloco ou da página | `.results`, `.count`, `.next_cursor` |
| Update Block | ID do bloco, objeto de atualização de bloco | `.block` |
| Delete Block | ID do bloco | `.block` |
| Append Blocks | ID do bloco ou da página, Filhos | `.results`, `.count` |

Todas as operações também retornam `.success` e `.operation`.

## Campos JSON

Os campos Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon e Cover aceitam
JSON da API do Notion. As expressões dentro de strings JSON são resolvidas antes da requisição. Um campo também pode
ser uma única expressão autônoma que é resolvida diretamente para o objeto ou array necessário, como
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

Na API atual do Notion, um **banco de dados** é um contêiner e uma **fonte de dados** contém o esquema de propriedades e as linhas consultáveis. Retrieve Database retorna a lista `data_sources` do banco de dados; utilize um desses IDs com Retrieve Data Source ou Query Data Source.

Create Database aceita o objeto de requisição completo do endpoint Create a database do Notion. Ele deve conter `parent` e pode conter `title`, `description`, `is_inline`, `initial_data_source`, `icon` e `cover`. Por exemplo:

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

Update Database aceita o objeto de requisição do endpoint de atualização, incluindo `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` e `is_locked`. Os campos de ID do banco de dados aceitam um ID bruto, uma URL completa do Notion ou uma expressão.

Utilize **Retrieve Data Source** para obter o esquema `properties` da fonte de dados antes de construir um objeto de propriedades para Create Page. **Create Data Source** exige um objeto de banco de dados pai e um esquema `properties` não vazio. **Update Data Source** aceita um objeto de requisição não vazio suportado pelo endpoint correspondente do Notion.

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

Os seletores Data Source e Parent Page suportam pesquisa do lado do servidor com um breve debounce e paginação baseada em cursor através de **Load more**. Utilize **Refresh** após compartilhar um novo recurso no Notion. Alterne para **Use expression** para inserir uma expressão, ID bruto ou URL.

Os filtros de pesquisa de tutoriais mais antigos que utilizam
`{"property":"object","value":"database"}` são convertidos para o valor atual `data_source`.
Novos workflows devem utilizar `data_source` ou `page` diretamente.

Append Blocks suporta as posições **Start**, **End** e **After Block**. Create Page e Append
Blocks dividem automaticamente mais de 100 filhos de nível superior em requisições ordenadas para satisfazer o limite por requisição do Notion.

Requisições com limitação de taxa (`429` ou `529`) são repetidas até três vezes. O Heym respeita o cabeçalho `Retry-After` do Notion, limita cada espera a 10 segundos e adiciona jitter aleatório. As requisições ao Notion compartilham um pool de conexões HTTP de âmbito de processo entre páginas e nós de workflow.

## Limites da API do Notion

- Um único valor `text.content` de rich text pode conter no máximo 2.000 caracteres. Divida textos mais longos em múltiplos objetos rich text.
- O Notion limita os filhos de bloco de nível superior a 100 por requisição. O Heym agrupa arrays Children maiores, mas cada bloco individual ainda deve satisfazer os limites de payload do Notion.
- A API aceita no máximo dois níveis aninhados de filhos de bloco em uma requisição. Crie estruturas mais profundas com operações Append Blocks subsequentes.
- Os payloads de requisição são limitados a 1.000 elementos de bloco e 500 KB no total.

## Paginação

Search, Query Data Source e Get Block Children aceitam um tamanho de página de 1 a 100 e um cursor inicial opcional. Defina o tamanho da página como `0` para seguir os cursores automaticamente e mesclar todos os resultados, até o limite de segurança de 10.000 resultados do nó.

## Configuração de credenciais

Escolha uma das configurações no diálogo de credenciais (**Internal token** ou **OAuth**):

- **Internal token:** Crie uma integração interna, copie o token para o Heym e compartilhe cada página ou fonte de dados necessária com a integração. Utilize **Test Connection** para verificar o acesso.
- **OAuth:** Crie uma integração pública do Notion e registre
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` no Notion. No diálogo de credenciais do Heym, escolha **OAuth**, insira o Client ID e o Client Secret da integração e clique em **Connect** para autorizar um workspace. O secret é armazenado criptografado com a credencial e não é colocado no estado OAuth nem na configuração de ambiente. Após a autorização, a credencial exibe o nome do workspace conectado (`connected (Workspace Name)`). Credenciais OAuth pendentes exibem `Not connected`.

Deixar o campo de token interno em branco durante a edição preserva o token armazenado.

Para requisições [HTTP](../nodes/http-node.md) personalizadas, `$credentials.YourNotionCredential` é resolvido para o mesmo bearer token utilizado pelo nó do Notion (token interno ou token de acesso OAuth).
## Notas sobre a versão da API

O Heym fixa as requisições do Notion na versão de API `2026-03-11`. Esta versão utiliza:

- Parents com `data_source_id` e endpoints `/data_sources` em vez dos caminhos legados de consulta a banco de dados
- `in_trash` em vez de `archived` para operações de lixeira/restauração de páginas
- Objetos `position` (`start`, `end`, `after_block`) para Append Block Children

Ao migrar exemplos mais antigos de automação do Notion:

- Substitua as referências de parent/consulta de banco de dados pelos IDs de data source obtidos em **Retrieve Database** ou pelo
  seletor de data source do editor
- Substitua `archived: true` por `in_trash: true`
- Substitua os parâmetros `after` de append pelo campo **Append Position** do nó

Os filtros de busca que ainda utilizam o valor de objeto `database` são normalizados automaticamente para `data_source`.

## Relacionados

- [Credenciais](../reference/credentials.md)
- [Integrações de Terceiros](../reference/integrations.md)
- [Tipos de Nó](../reference/node-types.md)
