# Supabase

Der **Supabase**-Knoten liest und verändert Tabellen, die von der PostgREST-API eines Supabase-Projekts bereitgestellt werden. Verwende ihn, wenn du Workflow-Zugriff auf SQL-gestützten App-Zustand möchtest, ohne HTTP-Anfragen von Hand zu schreiben.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | Supabase |
| Ausgabe | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operation: `select`, `insert`, `update`, `upsert` oder `delete` |
| `supabaseSchema` | expression | Schema-Name. Wenn leer, verwendet der Knoten das Standard-Schema der Anmeldedaten, dann `public`. |
| `supabaseTable` | expression | Einfacher Tabellenname zum Abfragen oder Verändern. Lege das Schema in `supabaseSchema` ab, nicht hier. |
| `supabaseSelectColumns` | expression | Kommagetrennte PostgREST-Select-Liste für `select` (Standard `*`) |
| `supabaseFilter` | expression | JSON-Filterobjekt. Unterstützt exakte Übereinstimmungen sowie Operator-Objekte und logische Gruppen, z. B. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` oder `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Maximale Anzahl zurückzugebender Zeilen für `select` (`0` = alle passenden Zeilen mit serverseitiger Paginierung abrufen, negative Werte fallen auf `100` zurück) |
| `supabaseOrderBy` | expression | Optionale Spalte zum Sortieren für `select` |
| `supabaseAscending` | boolean | Aufsteigend sortieren bei `true`, absteigend bei `false` |
| `supabaseRowsInputMode` | string | Für `insert`/`upsert`: `raw` JSON-Array-Modus oder `auto`, um die einzelne vorgelagerte Eingabe automatisch zuzuordnen |
| `supabaseDataInputMode` | string | Für `update`: `raw` JSON-Objekt-Modus oder `auto`, um die einzelne vorgelagerte Eingabe automatisch zuzuordnen |
| `supabaseIgnoredInputFields` | string | Optionale kommagetrennte Feldnamen, die beim automatischen Zuordnen der Eingabedaten ausgelassen werden |
| `supabaseRows` | expression | JSON-Array von Zeilenobjekten für `insert` und `upsert` |
| `supabaseOnConflict` | expression | Optionale kommagetrennte Konflikt-Zielspalten für `upsert`, zum Beispiel `id` oder `tenant_id,email` |
| `supabaseData` | expression | JSON-Objekt der aktualisierten Spaltenwerte für `update` |

## Anmeldedaten einrichten

Erstelle **Supabase**-Anmeldedaten im [Anmeldedaten-Reiter](../tabs/credentials-tab.md) mit:

1. Deiner **Projekt-URL**, zum Beispiel `https://your-project.supabase.co`
2. Einem **API-Schlüssel** mit Zugriff auf die Tabellen, die dieser Workflow verwenden soll
3. Einem optionalen **Standard-Schema** (standardmäßig `public`)

Der Knoten kommuniziert mit dem Supabase-PostgREST-Endpoint unter `/rest/v1/<table>`.
Verwende `supabaseTable` nur für die Tabelle, wie `users` oder `profiles`. Übergib dort nicht `schema.table`, `rpc/...` oder andere API-Pfade.

Wenn gültige Supabase-Anmeldedaten ausgewählt sind, kann der Editor bereitgestellte Tabellen und Tabellenspalten direkt aus den PostgREST-OpenAPI-Metadaten ermitteln. Verwende das Dropdown **discovered tables**, um eine Tabelle auszuwählen, und die **column chips** unter **Select Columns**, um schnell eine Select-Liste zu erstellen.

## Operationen

| Operation | Erforderliche Felder | Beschreibung |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Zeilen mit optionalen exakten Übereinstimmungsfiltern, Limit und Sortierung lesen |
| `insert` | `supabaseTable`, `supabaseRows` oder Auto-map-Eingabe | Eine oder mehrere Zeilen einfügen |
| `update` | `supabaseTable`, `supabaseData` oder Auto-map-Eingabe, `supabaseFilter` | Zeilen aktualisieren, die dem Filter entsprechen |
| `upsert` | `supabaseTable`, `supabaseRows` oder Auto-map-Eingabe | Zeilen mit Supabase-Upsert-Semantik einfügen oder zusammenführen. Verwende `supabaseOnConflict`, wenn du ein explizites Konflikt-Ziel benötigst. |
| `delete` | `supabaseTable`, `supabaseFilter` | Zeilen löschen, die dem Filter entsprechen |

## Filter-Syntax

`supabaseFilter` kompiliert strukturiertes JSON in PostgREST-Query-Parameter.

- Exakte Übereinstimmung: `{"status":"active"}`
- Vergleich: `{"created_at":{"gte":"2026-01-01"}}`
- Zugehörigkeit: `{"status":{"in":["active","paused"]}}`
- Mustervergleich: `{"email":{"ilike":"*@example.com"}}`
- Logisches OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Logisches AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Für mehrere Operatoren auf demselben Feld bevorzuge eine logische Gruppe:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginierung

`select` führt jetzt echte serverseitige Paginierung gegen PostgREST durch.

- `supabaseLimit: "0"` ruft alle passenden Zeilen Seite für Seite ab
- `supabaseLimit`-Werte über 1000 werden automatisch in mehrere Anfragen aufgeteilt
- Ergebnisse werden wieder in einem `.rows`-Array zusammengeführt und `.count` bleibt die Gesamtzahl der passenden Zeilen

Beim Lesen großer Tabellen setze ein stabiles `supabaseOrderBy`, um die Seitengrenzen vorhersehbar zu halten.

## Auto-map-Eingabe

Für `insert`, `upsert` und `update` schalte den Knoten auf **Auto-map input** um, wenn der einzelne
vorgelagerte Knoten bereits die Form ausgibt, die du schreiben möchtest.

- Ein einzelnes Objekt wird zu einer Zeile oder einem Update-Payload
- Ein Array von Objekten wird zu vielen Zeilen für `insert` / `upsert`
- Ein vorgelagertes Objekt mit einem `rows`-Array verwendet dieses Array direkt wieder
- `supabaseIgnoredInputFields` ermöglicht es dir, Felder wie `id`, `created_at` oder `success` zu verwerfen

## Ausgabe-Referenz

| Ausgabefeld | Typ | Beschreibung |
|-------------|------|-------------|
| `.rows` | array | Zurückgegebene Zeilenobjekte |
| `.count` | number | Anzahl der zurückgegebenen oder betroffenen Zeilen |
| `.success` | boolean | Ob die Operation erfolgreich war |
## Beispiel – Aktive Benutzer auswählen

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Auf die Ausgabe zugreifen: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Beispiel – Eine Profilzeile upserten

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Überblick über alle Knotentypen
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – Supabase-Anmeldedaten hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung von Integrations-Anmeldedaten
