# HTTP

Il nodo **HTTP** consente di effettuare richieste HTTP utilizzando la sintassi cURL. Può costituire il punto di partenza di un workflow (senza edge in ingresso) oppure ricevere input dai nodi a monte.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 o 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `curl` | string | Comando cURL (es. `curl -X GET https://api.example.com`) |

## Formato della risposta

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Accesso alla risposta

- `$httpNode.status` – Codice di stato HTTP
- `$httpNode.body` – Corpo della risposta (stringa o JSON analizzato)
- `$httpNode.body.fieldName` – Accesso ai campi JSON
- `$httpNode.headers` – Header della risposta

## Esempio

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Utilizzare la sintassi cURL con `-H` per gli header, `-d` per il corpo POST, ecc. Le espressioni possono essere utilizzate in qualsiasi punto della stringa curl, incluso l'URL, un header o un'intera riga di header. Una [credenziale](../reference/credentials.md) di tipo Header viene risolta in `key: value`, pertanto `-H "$credentials.MyApiKey"` invia l'header completo:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Le virgolette e gli spazi all'interno di un'espressione appartengono all'espressione stessa, non al comando cURL, quindi i metodi che accettano argomenti stringa funzionano inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autenticazione tramite credenziali

`$credentials.Name` viene risolto in un valore diverso per ciascun tipo di [credenziale](../reference/credentials.md), pertanto la riga di header dipende dal tipo:

| Tipo di credenziale | `$credentials.Name` viene risolto in | Header |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | La chiave API grezza | `-H "Authorization: Bearer $credentials.Name"` |
| Google | La chiave API grezza | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | La chiave API grezza | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Un access token OAuth aggiornato, rinnovato alla scadenza | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Il token | `-H "Authorization: Bearer $credentials.Name"` |

Una credenziale di tipo Bearer contiene già il prefisso `Bearer `, pertanto aggiungerne un altro invierebbe `Bearer Bearer …`. Le credenziali Google Sheets e Google Drive consentono di chiamare le API Google non coperte dal rispettivo nodo, come l'aggiunta di una scheda a un foglio di calcolo, entro gli scope concessi alla credenziale. Quando un nome non è un identificatore semplice (contiene `-`, inizia con una cifra o è una parola riservata), utilizzare la forma con parentesi: `-H "Authorization: $credentials["my-api-key"]"`.

Quando l'[AI Assistant](../reference/ai-assistant.md) o la [Chat](../tabs/chat-tab.md) costruisce una richiesta HTTP che richiede autenticazione e nessun nodo dedicato copre il servizio, viene chiesto quale credenziale utilizzare. Selezionarne una, modificare il nome dell'header precompilato se l'API ne prevede uno diverso, e la riga di header verrà scritta automaticamente. L'assistant visualizza i nomi e i tipi delle credenziali, mai i relativi valori. Se non si dispone di una credenziale adatta, la domanda propone di crearne una. I segreti che raggiungono l'output del nodo, come gli `request.headers` inviati, vengono mascherati nei risultati di esecuzione.
## Sicurezza in uscita

- Per impostazione predefinita, l'URL deve utilizzare `http://` o `https://` e risolversi esclusivamente verso indirizzi pubblici. Le destinazioni loopback, private, link-local, multicast e cloud-metadata sono bloccate.
- Heym convalida gli indirizzi risolti e blocca la destinazione della connessione per prevenire il DNS rebinding. I proxy di ambiente sono disabilitati mentre la protezione è attiva. Per impostazione predefinita i redirect non vengono seguiti; aggiungere l'opzione `-L` di cURL per seguirli. Quando abilitata, ogni hop di redirect viene verificato rispetto alla medesima policy sugli indirizzi pubblici e bloccato prima della connessione.
- Le distribuzioni self-hosted attendibili che si connettono intenzionalmente a servizi interni possono impostare `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mantenere il valore predefinito nelle distribuzioni hosted o multi-tenant.

**Nota di aggiornamento per la v0.0.105:** questa policy a livello di istanza ora protegge anche le destinazioni derivate dalle Credenziali utilizzate da Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, l'esecuzione di LLM personalizzati e il rilevamento dei modelli, l'assistente IA, i guardrail e gli embedding RAG. Le Credenziali esistenti che puntano a indirizzi loopback, privati o link-local vengono rifiutate a meno che `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` non sia abilitato su un'istanza self-hosted attendibile. Mentre la protezione è attiva, i client HTTP protetti ignorano `HTTP_PROXY` e `HTTPS_PROXY`; l'abilitazione dell'opt-out li ripristina. I bundle CA dell'operatore configurati tramite `SSL_CERT_FILE` o `SSL_CERT_DIR` restano supportati. ClickHouse viene verificato prima dell'apertura della connessione ma non viene bloccato al momento della connessione, poiché clickhouse-connect utilizza un proprio trasporto urllib3.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Trigger](../reference/triggers.md) – HTTP come punto di ingresso del workflow
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere chiavi API per le richieste autenticate
