# Notion

Il nodo **Notion** gestisce database, data source, pagine e blocchi tramite l'API di Notion.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziali | Token di integrazione interno o Notion OAuth |
| Versione API | `2026-03-11` |

Le raccolte in stile database di Notion utilizzano **ID data source** nelle versioni correnti dell'API. Condividere ogni pagina
o data source necessario al workflow con l'integrazione prima di eseguire il nodo.
I campi delle risorse accettano sia un ID Notion grezzo sia un URL Notion completo. Gli URL vengono normalizzati al loro
ID risorsa incorporato prima della richiesta API.

## Operazioni

| Operazione | Campi obbligatori | Output principale |
|-----------|-----------------|-------------|
| Search | Query/filtro/ordinamento opzionali | `.results`, `.count`, `.next_cursor` |
| Get Page | ID pagina | `.page` |
| Create Page | ID data source o ID pagina padre, Properties | `.page`, `.id`, `.url` |
| Update Page | ID pagina, uno tra Properties/Icon/Cover | `.page` |
| Move Page to Trash | ID pagina | `.page` |
| Restore Page | ID pagina | `.page` |
| Create Database | Richiesta database con `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | ID database | `.database` |
| Update Database | ID database, richiesta database non vuota | `.database`, `.id`, `.url` |
| Create Data Source | Richiesta data source con `parent` e `properties` non vuoto | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | ID data source, richiesta data source non vuota | `.data_source`, `.id`, `.url` |
| Query Data Source | ID data source | `.results`, `.count`, `.next_cursor` |
| Get Block Children | ID blocco o pagina | `.results`, `.count`, `.next_cursor` |
| Update Block | ID blocco, oggetto di aggiornamento blocco | `.block` |
| Delete Block | ID blocco | `.block` |
| Append Blocks | ID blocco o pagina, Children | `.results`, `.count` |

Tutte le operazioni restituiscono anche `.success` e `.operation`.

## Campi JSON

I campi Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon e Cover accettano
JSON conforme all'API di Notion. Le espressioni all'interno delle stringhe JSON vengono risolte prima della richiesta. Un campo può anche
essere una singola espressione autonoma che si risolve direttamente nell'oggetto o nell'array richiesto, come
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

Per il contenuto di una pagina o di un blocco, Children è un array di oggetti blocco Notion:

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
## Database e origini dati

Nell'attuale API di Notion, un **database** è un contenitore e un'**origine dati** contiene lo schema delle proprietà e le righe interrogabili. Retrieve Database restituisce l'elenco `data_sources` del database; utilizzare uno di questi ID con Retrieve Data Source o Query Data Source.

Create Database accetta l'oggetto di richiesta completo dell'endpoint Create a database di Notion. Deve contenere `parent` e può contenere `title`, `description`, `is_inline`, `initial_data_source`, `icon` e `cover`. Ad esempio:

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

Update Database accetta l'oggetto di richiesta dell'endpoint di aggiornamento, inclusi `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash` e `is_locked`. I campi Database ID accettano un ID non elaborato, un URL Notion completo o un'espressione.

Utilizzare **Retrieve Data Source** per recuperare lo schema `properties` dell'origine dati prima di costruire un oggetto properties per Create Page. **Create Data Source** richiede un oggetto database padre e uno schema `properties` non vuoto. **Update Data Source** accetta un oggetto di richiesta non vuoto supportato dall'endpoint Notion corrispondente.

Ad esempio, creare un'origine dati all'interno di un database esistente:

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

I selettori Data Source e Parent Page supportano la ricerca lato server con un breve debounce e la paginazione basata su cursore tramite **Load more**. Utilizzare **Refresh** dopo aver condiviso una nuova risorsa in Notion. Passare a **Use expression** per inserire un'espressione, un ID non elaborato o un URL.

I filtri di ricerca dei tutorial più datati che utilizzano
`{"property":"object","value":"database"}` vengono convertiti nell'attuale valore `data_source`.
I nuovi workflow devono utilizzare direttamente `data_source` o `page`.

Append Blocks supporta le posizioni **Start**, **End** e **After Block**. Create Page e Append Blocks suddividono automaticamente più di 100 elementi figli di primo livello in richieste ordinate per rispettare il limite per richiesta di Notion.

Le richieste soggette a rate limit (`429` o `529`) vengono ritentate fino a tre volte. Heym rispetta l'header `Retry-After` di Notion, limita ogni attesa a 10 secondi e aggiunge un jitter casuale. Le richieste a Notion condividono un pool di connessioni HTTP a livello di processo tra pagine e nodi del workflow.

## Limiti dell'API Notion

- Un singolo valore `text.content` in formato rich-text può contenere al massimo 2.000 caratteri. Suddividere il testo più lungo in più oggetti rich-text.
- Notion limita gli elementi figli di blocco di primo livello a 100 per richiesta. Heym raggruppa gli array Children più grandi, ma ogni singolo blocco deve comunque rispettare i limiti di payload di Notion.
- L'API accetta al massimo due livelli annidati di elementi figli di blocco in una singola richiesta. Creare strutture più profonde con operazioni Append Blocks successive.
- I payload delle richieste sono limitati a 1.000 elementi di blocco e 500 KB complessivi.

## Paginazione

Search, Query Data Source e Get Block Children accettano una dimensione di pagina da 1 a 100 e un cursore iniziale opzionale. Impostare la dimensione di pagina su `0` per seguire automaticamente i cursori e unire tutti i risultati, fino al limite di sicurezza di 10.000 risultati del nodo.

## Configurazione delle credenziali

Scegliere una delle due configurazioni nella finestra di dialogo delle credenziali (**Internal token** o **OAuth**):

- **Internal token:** Creare un'integrazione interna, copiare il relativo token in Heym, quindi condividere ogni pagina o origine dati richiesta con l'integrazione. Utilizzare **Test Connection** per verificare l'accesso.
- **OAuth:** Creare un'integrazione pubblica Notion e registrare
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` in Notion. Nella finestra di dialogo delle credenziali di Heym, scegliere **OAuth**, inserire il Client ID e il Client Secret dell'integrazione, quindi fare clic su **Connect** per autorizzare un workspace. Il secret viene memorizzato in forma crittografata insieme alla credenziale e non viene inserito nello stato OAuth né nella configurazione dell'ambiente. Dopo l'autorizzazione, la credenziale mostra il nome del workspace connesso (`connected (Workspace Name)`). Le credenziali OAuth in sospeso mostrano `Not connected`.

Lasciare vuoto il campo del token interno durante la modifica preserva il token memorizzato.

Per le richieste [HTTP](../nodes/http-node.md) personalizzate, `$credentials.YourNotionCredential` viene risolto nello stesso bearer token utilizzato dal nodo Notion (token interno o access token OAuth).
## Note sulla versione API

Heym fissa le richieste Notion alla versione API `2026-03-11`. Questa versione utilizza:

- parent `data_source_id` e endpoint `/data_sources` anziché i percorsi legacy di query del database
- `in_trash` anziché `archived` per le operazioni di cestino/ripristino delle pagine
- oggetti `position` (`start`, `end`, `after_block`) per Append Block Children

In fase di migrazione di esempi di automazione Notion più datati:

- Sostituire i riferimenti al parent/query del database con gli ID dell'origine dati ottenuti tramite **Retrieve Database** o il
  selettore dell'origine dati nell'editor
- Sostituire `archived: true` con `in_trash: true`
- Sostituire i parametri `after` di append con il campo **Append Position** del nodo

I filtri di ricerca che utilizzano ancora il valore oggetto `database` vengono normalizzati automaticamente in `data_source`.

## Correlati

- [Credenziali](../reference/credentials.md)
- [Integrazioni di terze parti](../reference/integrations.md)
- [Tipi di nodo](../reference/node-types.md)
