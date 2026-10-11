# BigQuery

Nodul **BigQuery** execută interogări SQL și inserează rânduri în seturile de date Google BigQuery prin intermediul API-ului REST BigQuery v2. Utilizați-l pentru a interoga seturi de date analitice mari sau pentru a transmite rânduri în tabele din datele workflow-ului.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | BigQuery (OAuth2) |
| Ieșire | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare BigQuery din [Acreditări](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operațiune: `query` sau `insertRows` |
| `bqProjectId` | expression | ID-ul proiectului Google Cloud (de ex. `my-gcp-project`) |
| `bqQuery` | expression | Șirul interogării SQL. Obligatoriu pentru `query`. |
| `bqMaxResults` | string | Numărul maxim de rânduri returnate de `query` (implicit `1000`). |
| `bqDatasetId` | expression | ID-ul setului de date (de ex. `my_dataset`). Obligatoriu pentru `insertRows`. |
| `bqTableId` | expression | ID-ul tabelului (de ex. `my_table`). Obligatoriu pentru `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Pentru `insertRows`: **Raw** = matrice JSON completă; **Selective** = un singur rând ca perechi câmp-valoare. |
| `bqRows` | expression | Matrice JSON de obiecte rând pentru modul raw (de ex. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Perechi cheie-valoare pentru modul selective. Fiecare cheie este un nume de coloană; fiecare valoare este o expresie. |

## Configurarea acreditărilor

BigQuery utilizează un model **OAuth2 "Bring Your Own App"**. Furnizați propriile acreditări OAuth2 Google Cloud.

**Configurare backend:** Setați **`FRONTEND_URL`** pe backend-ul Heym la URL-ul public al aplicației (adresa pe care utilizatorii o tastează în browser), de ex. `https://your-heym-domain`. URI-ul de redirecționare OAuth este întotdeauna `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Accesați [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activați **BigQuery API**.
2. Accesați **Credentials** → **Create Credentials** → **OAuth client ID** → selectați **Web application**.
3. La **Authorized redirect URIs**, adăugați exact: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Copiați **Client ID** și **Client Secret**.
5. În Heym Dashboard → **Credentials** → **New** → selectați **BigQuery (OAuth2)**.
6. Introduceți Client ID, Client Secret și un nume, apoi faceți clic pe **Connect** pentru a finaliza consimțământul OAuth2 într-o fereastră popup din browser.

Token-urile se reîmprospătează automat în fundal — nu este necesară gestionarea manuală a token-urilor.

## Operațiuni

| Operațiune | Câmpuri obligatorii | Descriere |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Execută o interogare SQL și returnează rânduri |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows sau bqMappings | Inserează unul sau mai multe rânduri prin API-ul de inserare în flux insertAll |

## Referință pentru ieșire

| Operațiune | Câmp de ieșire | Tip | Descriere |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Matrice de obiecte rând (nume coloană → valoare) |
| `query` | `.total` | number | Numărul de rânduri returnate |
| `query` | `.schema` | array | Câmpurile schemei tabelului |
| `insertRows` | `.insertedCount` | number | Numărul de rânduri inserate cu succes |
| `insertRows` | `.errors` | array | Erori de inserare pe rând (gol la succes complet) |

## Exemplu – Executarea unei interogări

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

Accesarea ieșirii: `$getUsers.rows` (matrice de obiecte rând), `$getUsers.rows[0].email`, `$getUsers.total`.

## Exemplu – Inserarea unui rând

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

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați acreditarea BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Model OAuth2 similar pentru date din foi de calcul
- [Integrări terțe](../reference/integrations.md) – Configurarea acreditărilor pentru integrări
