# BigQuery

**BigQuery** čvor izvršava SQL upite i umeće retke u Google BigQuery skupove podataka putem BigQuery REST API v2. Koristite ga za upite nad velikim analitičkim skupovima podataka ili za strujanje redaka u tablice iz podataka workflowa.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnica | BigQuery (OAuth2) |
| Izlaz | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery vjerodajnica iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operacija: `query` ili `insertRows` |
| `bqProjectId` | expression | ID Google Cloud projekta (npr. `my-gcp-project`) |
| `bqQuery` | expression | SQL upit. Obavezno za `query`. |
| `bqMaxResults` | string | Maksimalan broj redaka koje vraća `query` (zadano `1000`). |
| `bqDatasetId` | expression | ID skupa podataka (npr. `my_dataset`). Obavezno za `insertRows`. |
| `bqTableId` | expression | ID tablice (npr. `my_table`). Obavezno za `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Za `insertRows`: **Raw** = puni JSON array; **Selective** = jedan redak kao parovi polje-vrijednost. |
| `bqRows` | expression | JSON array objekata redaka za raw način (npr. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Parovi ključ-vrijednost za selective način. Svaki ključ je naziv stupca; svaka vrijednost je expression. |

## Postavljanje vjerodajnica

BigQuery koristi **OAuth2 model "Bring Your Own App"**. Vi prilažete vlastite Google Cloud OAuth2 vjerodajnice.

**Konfiguracija pozadinskog sustava:** Postavite **`FRONTEND_URL`** na Heym pozadinskom sustavu na javni URL aplikacije (adresu koju korisnici upisuju u preglednik), npr. `https://your-heym-domain`. OAuth redirect URI uvijek je `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Idite na [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → omogućite **BigQuery API**.
2. Idite na **Credentials** → **Create Credentials** → **OAuth client ID** → odaberite **Web application**.
3. Pod **Authorized redirect URIs** dodajte točno: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopirajte **Client ID** i **Client Secret**.
5. U Heym Dashboard → **Vjerodajnice** → **New** → odaberite **BigQuery (OAuth2)**.
6. Unesite Client ID, Client Secret i naziv, zatim kliknite **Connect** kako biste dovršili OAuth2 pristanak u skočnom prozoru preglednika.

Tokeni se automatski osvježavaju u pozadini — nije potrebno ručno upravljanje tokenima.

## Operacije

| Operacija | Obavezna polja | Opis |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Pokreni SQL upit i vrati retke |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows ili bqMappings | Umetni jedan ili više redaka putem streaming insertAll API-ja |

## Referenca izlaza

| Operacija | Izlazno polje | Tip | Opis |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array objekata redaka (naziv stupca → vrijednost) |
| `query` | `.total` | number | Broj vraćenih redaka |
| `query` | `.schema` | array | Polja sheme tablice |
| `insertRows` | `.insertedCount` | number | Broj uspješno umetnutih redaka |
| `insertRows` | `.errors` | array | Pogreške umetanja po retku (prazno kod potpunog uspjeha) |

## Primjer – Pokretanje upita

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Pristup izlazu: `$getUsers.rows` (array objekata redaka), `$getUsers.rows[0].email`, `$getUsers.total`.

## Primjer – Umetanje retka

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodavanje BigQuery OAuth2 vjerodajnice
- [Google Sheets](./google-sheets-node.md) – Sličan OAuth2 obrazac za podatke proračunskih tablica
- [Integracije trećih strana](../reference/integrations.md) – Postavljanje vjerodajnica integracija
