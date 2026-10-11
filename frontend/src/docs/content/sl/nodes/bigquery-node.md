# BigQuery

Vozlišče **BigQuery** izvaja SQL poizvedbe in vstavi vrstice v Google BigQuery nabor podatkov prek BigQuery REST API v2. Uporabite ga za poizvedovanje po velikih analitičnih naborih podatkov ali za pretakanje vrstic v tabele iz podatkov delovnega toka.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | BigQuery (OAuth2) |
| Izhod | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica BigQuery iz [Poverilnic](../tabs/credentials-tab.md) |
| `bqOperation` | niz | Operacija: `query` ali `insertRows` |
| `bqProjectId` | izraz | ID Google Cloud projekta (npr. `my-gcp-project`) |
| `bqQuery` | izraz | Niz SQL poizvedbe. Obvezno za `query`. |
| `bqMaxResults` | niz | Maksimalno število vrstice, vrnjenih s `query` (privzeto `1000`). |
| `bqDatasetId` | izraz | ID nabora podatkov (npr. `my_dataset`). Obvezno za `insertRows`. |
| `bqTableId` | izraz | ID tabele (npr. `my_table`). Obvezno za `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Za `insertRows`: **Raw** = celoten JSON niz; **Selective** = ena vrstica kot par ključ-vrednost. |
| `bqRows` | izraz | JSON niz objektov vrstic za način raw (npr. `[{"col": "$input.value"}]`). |
| `bqMappings` | tabela | Ključ-vrednost pari za selektivni način. Vsak ključ je ime stolpca; vsaka vrednost je izraz. |

## Nastavitev Poverilnice

BigQuery uporablja model **OAuth2 "Bring Your Own App"**. Vi zagotovite svoje Google Cloud OAuth2 poverilnice.

**Konfiguracija v ozadju:** Nastavite **`FRONTEND_URL`** na Heym ozadju na javni URL aplikacije (naslov, ki ga uporabniki vpišejo v brskalnik), npr. `https://your-heym-domain`. URI za preusmeritev OAuth je vedno `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Pojdite na [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → omogočite **BigQuery API**.
2. Pojdite na **Credentials** → **Create Credentials** → **OAuth client ID** → izberite **Web application**.
3. Pod **Authorized redirect URIs** dodajte natančno: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Kopirajte **Client ID** in **Client Secret**.
5. V Heym Dashboard → **Credentials** → **New** → izberite **BigQuery (OAuth2)**.
6. Vnesite Client ID, Client Secret in ime, nato kliknite **Connect**, da dokončate soglasje OAuth2 v pojavnem oknu brskalnika.

Žetoni se samodejno osvežujejo v ozadju — ni potrebnega ročnega upravljanja z žetoni.

## Operacije

| Operacija | Obvezna polja | Opis |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Izvedite SQL poizvedbo in vrnite vrstice |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows ali bqMappings | Vstavite eno ali več vrstic prek API-ja za pretakanje insertAll |

## Referenca Izhoda

| Operacija | Izhodno polje | Tip | Opis |
|-----------|-------------|------|-------------|
| `query` | `.rows` | tabela | Tabela objektov vrstic (ime stolpca → vrednost) |
| `query` | `.total` | število | Število vrstice, vrnjenih |
| `query` | `.schema` | tabela | Polja sheme tabele |
| `insertRows` | `.insertedCount` | število | Število vrstic, ki so bile uspešno vstavljene |
| `insertRows` | `.errors` | tabela | Napake pri vstavljanju po vrsticah (prazno ob popolnem uspehu) |

## Primer – Izvedba Poizvedbe

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

Dostop do izhoda: `$getUsers.rows` (tabela objektov vrstic), `$getUsers.rows[0].email`, `$getUsers.total`.

## Primer – Vstavitev Vrste

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

## Sorodno

- [Vrste Vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek Poverilnic](../tabs/credentials-tab.md) – Dodajte BigQuery OAuth2 poverilnico
- [Google Sheets](./google-sheets-node.md) – Podoben vzorec OAuth2 za podatke preglednic
- [Integracije Tretjih Oseb](../reference/integrations.md) – Nastavitev poverilnic za integracijo
