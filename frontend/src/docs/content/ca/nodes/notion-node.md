# Notion

El node **Notion** gestiona bases de dades, fonts de dades, pàgines i blocs mitjançant l'API de Notion.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Token d'integració interna o Notion OAuth |
| Versió de l'API | `2026-03-11` |

Les col·leccions d'estil base de dades de Notion utilitzen **IDs de font de dades** a les versions actuals de l'API. Compartiu cada pàgina o font de dades que el workflow necessiti amb la integració abans d'executar el node.
Els camps de recurs accepten tant un ID de Notion en cru com una URL completa de Notion. Les URL es normalitzen al seu ID de recurs incrustat abans de la sol·licitud a l'API.

## Operacions

| Operació | Camps obligatoris | Sortida principal |
|-----------|-----------------|-------------|
| Search | Query/filter/sort opcional | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID o Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, un de Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Sol·licitud de base de dades amb `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, sol·licitud de base de dades no buida | `.database`, `.id`, `.url` |
| Create Data Source | Sol·licitud de font de dades amb `parent` i `properties` no buit | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, sol·licitud de font de dades no buida | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block o Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, objecte d'actualització de bloc | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block o Page ID, Children | `.results`, `.count` |

Totes les operacions també retornen `.success` i `.operation`.

## Camps JSON

Els camps Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon i Cover accepten JSON de l'API de Notion. Les expressions dins de cadenes JSON es resolen abans de la sol·licitud. Un camp també pot ser una expressió independent que es resolgui directament a l'objecte o array requerit, com ara
`$input.database`, `$input.properties` o `$input.children`.

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

Per al contingut de pàgines o blocs, Children és un array d'objectes de bloc de Notion:

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
## Bases de dades i fonts de dades

A l'API actual de Notion, una **base de dades** és un contenidor i una **font de dades** conté l'esquema de propietats i les files consultables. Retrieve Database retorna la llista `data_sources` de la base de dades; utilitzeu un d'aquests IDs amb Retrieve Data Source o Query Data Source.

Create Database accepta l'objecte de sol·licitud complet de l'endpoint Create a database de Notion. Ha de contenir `parent` i pot contenir `title`, `description`, `is_inline`, `initial_data_source`, `icon` i `cover`. Per exemple:

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

Update Database accepta l'objecte de sol·licitud de l'endpoint d'actualització, incloent-hi `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` i `is_locked`. Els camps Database ID accepten un ID en brut, una URL completa de Notion o una expressió.

Utilitzeu **Retrieve Data Source** per obtenir l'esquema `properties` de la font de dades abans de construir un objecte de propietats de Create Page. **Create Data Source** requereix un objecte de base de dades pare i un esquema `properties` no buit. **Update Data Source** accepta un objecte de sol·licitud no buit admès per l'endpoint corresponent de Notion.

Per exemple, creeu una font de dades dins d'una base de dades existent:

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

Els selectors Data Source i Parent Page admeten cerca al costat del servidor amb un debounce curt i paginació **Load more** basada en cursor. Utilitzeu **Refresh** després de compartir un recurs nou a Notion. Canvieu a **Use expression** per introduir una expressió, un ID en brut o una URL.

Els filtres de cerca de tutorials antics que utilitzen
`{"property":"object","value":"database"}` es tradueixen al valor actual `data_source`.
Els workflows nous haurien d'utilitzar `data_source` o `page` directament.

Append Blocks admet les posicions **Start**, **End** i **After Block**. Create Page i Append Blocks divideixen automàticament més de 100 fills de nivell superior en sol·licituds ordenades per satisfer el límit per sol·licitud de Notion.

Les sol·licituds limitades per rate limit (`429` o `529`) es reintenten fins a tres vegades. Heym respecta la capçalera `Retry-After` de Notion, limita cada espera a 10 segons i afegeix jitter aleatoritzat. Les sol·licituds a Notion comparteixen un pool de connexions HTTP a tot el procés entre pàgines i nodes de workflow.

## Límits de l'API de Notion

- Un valor únic de rich-text `text.content` pot contenir com a màxim 2.000 caràcters. Dividiu el text més llarg en múltiples objectes rich-text.
- Notion limita els fills de bloc de nivell superior a 100 per sol·licitud. Heym agrupa en lots les matrius Children més grans, però cada bloc individual ha de satisfer igualment els límits de payload de Notion.
- L'API accepta com a màxim dos nivells imbricats de fills de bloc en una sol·licitud. Creeu estructures més profundes amb operacions Append Blocks de seguiment.
- Els payloads de sol·licitud estan limitats a 1.000 elements de bloc i 500 KB en total.

## Paginació

Search, Query Data Source i Get Block Children accepten una mida de pàgina d'1 a 100 i un cursor d'inici opcional. Establiu la mida de pàgina a `0` per seguir els cursors automàticament i fusionar tots els resultats, fins al límit de seguretat de 10.000 resultats del node.

## Configuració de credencials

Trieu una de les dues configuracions al diàleg de credencials (**Internal token** o **OAuth**):

- **Internal token:** Creeu una integració interna, copieu-ne el token a Heym i compartiu cada pàgina o font de dades necessària amb la integració. Utilitzeu **Test Connection** per verificar l'accés.
- **OAuth:** Creeu una integració pública de Notion i registreu
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` a Notion. Al diàleg de credencials de Heym, trieu **OAuth**, introduïu el Client ID i el Client Secret de la integració i feu clic a **Connect** per autoritzar un workspace. El secret s'emmagatzema xifrat amb la credencial i no es col·loca a l'estat d'OAuth ni a la configuració d'entorn. Després de l'autorització, la credencial mostra el nom del workspace connectat (`connected (Workspace Name)`). Les credencials OAuth pendents mostren `Not connected`.

Deixar el camp del token intern en blanc durant l'edició preserva el token emmagatzemat.

Per a sol·licituds [HTTP](../nodes/http-node.md) personalitzades, `$credentials.YourNotionCredential` es resol al mateix bearer token que utilitza el node de Notion (token intern o testimoni d'accés OAuth).
## Notes sobre la versió de l'API

Heym fixa les sol·licituds a Notion a la versió d'API `2026-03-11`. Aquesta versió utilitza:

- Pares `data_source_id` i endpoints `/data_sources` en lloc de les rutes heretades de consulta de bases de dades
- `in_trash` en lloc de `archived` per a les operacions de paperera i restauració de pàgines
- Objectes `position` (`start`, `end`, `after_block`) per a Append Block Children

En migrar exemples d'automatització de Notion més antics:

- Substituïu les referències de pare o consulta de base de dades pels IDs d'origen de dades obtinguts de **Retrieve Database** o del selector d'origen de dades de l'editor
- Substituïu `archived: true` per `in_trash: true`
- Substituïu els paràmetres `after` d'append pel camp **Append Position** del node

Els filtres de cerca que encara utilitzen el valor d'objecte `database` es normalitzen automàticament a `data_source`.

## Relacionat

- [Credencials](../reference/credentials.md)
- [Integracions de tercers](../reference/integrations.md)
- [Tipus de node](../reference/node-types.md)
