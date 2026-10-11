# Notion

Der **Notion**-Knoten verwaltet Datenbanken, Datenquellen, Seiten und Blöcke über die Notion-API.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | Internes Integrationstoken oder Notion OAuth |
| API-Version | `2026-03-11` |

Notion-Sammlungen im Datenbankstil verwenden in aktuellen API-Versionen **Datenquellen-IDs**. Gib jede Seite
oder Datenquelle, die der Workflow benötigt, für die Integration frei, bevor du den Knoten ausführst.
Ressourcenfelder akzeptieren entweder eine rohe Notion-ID oder eine vollständige Notion-URL. URLs werden vor
der API-Anfrage auf ihre eingebettete Ressourcen-ID normalisiert.

## Operationen

| Operation | Erforderliche Felder | Hauptausgabe |
|-----------|-----------------|-------------|
| Search | Optional query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID oder Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, eines von Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database Request mit `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, nicht-leerer Database Request | `.database`, `.id`, `.url` |
| Create Data Source | Data Source Request mit `parent` und nicht-leeren `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, nicht-leerer Data Source Request | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block- oder Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, Block-Update-Objekt | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block- oder Page ID, Children | `.results`, `.count` |

Alle Operationen geben außerdem `.success` und `.operation` zurück.

## JSON-Felder

Die Felder Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon und Cover akzeptieren
Notion-API-JSON. Ausdrücke innerhalb von JSON-Strings werden vor der Anfrage aufgelöst. Ein Feld kann auch
ein einzelner eigenständiger Ausdruck sein, der direkt zum erforderlichen Objekt oder Array aufgelöst wird, wie etwa
`$input.database`, `$input.properties` oder `$input.children`.

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

Für Seiten- oder Blockinhalte ist Children ein Array von Notion-Block-Objekten:

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

## Datenbanken und Datenquellen

In der aktuellen Notion-API ist eine **Datenbank** ein Container und eine **Datenquelle** enthält das
Eigenschaftenschema und abfragbare Zeilen. Retrieve Database gibt die `data_sources`-Liste der Datenbank zurück; verwende eine
dieser IDs mit Retrieve Data Source oder Query Data Source.

Create Database akzeptiert das vollständige Anfrageobjekt vom Notion-Endpoint „Create a database". Es
muss `parent` enthalten und kann `title`, `description`, `is_inline`,
`initial_data_source`, `icon` und `cover` enthalten. Zum Beispiel:

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

Update Database akzeptiert das Anfrageobjekt des Update-Endpoints, einschließlich `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` und `is_locked`. Database-ID-Felder akzeptieren
eine rohe ID, eine vollständige Notion-URL oder einen Ausdruck.

Verwende **Retrieve Data Source**, um das `properties`-Schema der Datenquelle abzurufen, bevor du ein
Create Page Properties-Objekt erstellst. **Create Data Source** erfordert ein Parent-Database-Objekt und ein
nicht-leeres `properties`-Schema. **Update Data Source** akzeptiert ein nicht-leeres Anfrageobjekt, das
vom entsprechenden Notion-Endpoint unterstützt wird.

Zum Beispiel eine Datenquelle innerhalb einer bestehenden Datenbank erstellen:

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

Die Selektoren Data Source und Parent Page unterstützen serverseitige Suche mit kurzem Debounce und
cursor-basierter **Load more**-Paginierung. Verwende **Refresh**, nachdem du eine neue Ressource in Notion freigegeben hast.
Wechsle zu **Use expression**, um einen Ausdruck, eine rohe ID oder eine URL einzugeben.

Suchfilter aus älteren Tutorials, die
`{"property":"object","value":"database"}` verwenden, werden auf den aktuellen `data_source`-Wert übersetzt.
Neue Workflows sollten `data_source` oder `page` direkt verwenden.

Append Blocks unterstützt die Positionen **Start**, **End** und **After Block**. Create Page und Append
Blocks teilen automatisch mehr als 100 Top-Level-Children in geordnete Anfragen auf, um Notions
Limit pro Anfrage zu erfüllen.

Ratenbegrenzte Anfragen (`429` oder `529`) werden bis zu dreimal wiederholt. Heym beachtet Notions
`Retry-After`-Header, begrenzt jede Wartezeit auf 10 Sekunden und fügt randomisierten Jitter hinzu. Notion-Anfragen
teilen sich einen prozessweiten HTTP-Verbindungspool über Seiten und Workflow-Knoten hinweg.

## Notion-API-Limits

- Ein einzelner Rich-Text-Wert `text.content` kann höchstens 2.000 Zeichen enthalten. Teile längeren Text
  in mehrere Rich-Text-Objekte auf.
- Notion begrenzt Top-Level-Block-Children auf 100 pro Anfrage. Heym bündelt größere Children-Arrays,
  aber jeder einzelne Block muss weiterhin Notions Payload-Limits erfüllen.
- Die API akzeptiert höchstens zwei verschachtelte Ebenen von Block-Children in einer Anfrage. Erstelle tiefere
  Strukturen mit nachfolgenden Append Blocks-Operationen.
- Anfrage-Payloads sind auf 1.000 Block-Elemente und insgesamt 500 KB begrenzt.
## Pagination

Search, Query Data Source und Get Block Children akzeptieren eine Seitengröße von 1 bis 100 sowie einen optionalen
Start-Cursor. Setze die Seitengröße auf `0`, um Cursors automatisch zu folgen und alle Ergebnisse zusammenzuführen, bis zum
Sicherheitslimit des Knotens von 10.000 Ergebnissen.

## Anmeldedaten einrichten

Wähle eine der beiden Einrichtungen im Anmeldedaten-Dialog (**Internal token** oder **OAuth**):

- **Internal token:** Erstelle eine interne Integration, kopiere ihren Token in Heym und teile dann jede
  erforderliche Seite oder Datenquelle mit der Integration. Verwende **Test Connection**, um den Zugriff zu überprüfen.
- **OAuth:** Erstelle eine öffentliche Notion-Integration und registriere
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` in Notion. Wähle im Heym-Anmeldedaten-Dialog
  **OAuth**, gib die Client ID und das Client Secret der Integration ein und klicke dann auf **Connect**, um
  einen Workspace zu autorisieren. Das Secret wird verschlüsselt mit den Anmeldedaten gespeichert und nicht im
  OAuth-State oder in der Umgebungskonfiguration abgelegt. Nach der Autorisierung zeigt die Anmeldedaten den
  verbundenen Workspace-Namen an (`connected (Workspace Name)`). Ausstehende OAuth-Anmeldedaten zeigen
  `Not connected`.

Wenn das Feld für den internen Token beim Bearbeiten leer gelassen wird, bleibt der gespeicherte Token erhalten.

Für benutzerdefinierte [HTTP](../nodes/http-node.md)-Anfragen löst `$credentials.YourNotionCredential` zu
demselben Bearer-Token auf, den der Notion-Knoten verwendet (interner Token oder OAuth-Zugriffstoken).

## Hinweise zur API-Version

Heym bindet Notion-Anfragen an die API-Version `2026-03-11`. Diese Version verwendet:

- `data_source_id`-Parents und `/data_sources`-Endpoints anstelle der veralteten Datenbank-Abfragepfade
- `in_trash` anstelle von `archived` für Papierkorb-/Wiederherstellungsvorgänge von Seiten
- `position`-Objekte (`start`, `end`, `after_block`) für Append Block Children

Beim Migrieren älterer Notion-Automatisierungsbeispiele:

- Ersetze Datenbank-Parent-/Abfrageverweise durch Datenquellen-IDs aus **Retrieve Database** oder dem
  Datenquellen-Auswahldialog des Editors
- Ersetze `archived: true` durch `in_trash: true`
- Ersetze die `after`-Parameter beim Anhängen durch das Feld **Append Position** des Knotens

Suchfilter, die noch den Objektwert `database` verwenden, werden automatisch zu `data_source` normalisiert.

## Verwandte Themen

- [Anmeldedaten](../reference/credentials.md)
- [Drittanbieter-Integrationen](../reference/integrations.md)
- [Knotentypen](../reference/node-types.md)
