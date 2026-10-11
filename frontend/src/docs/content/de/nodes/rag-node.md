# RAG- / Vektorspeicher-Knoten

Der **RAG-Knoten** (Retrieval-Augmented Generation) durchsucht Vektordatenbanken nach semantisch relevanten Dokumentenabschnitten, fügt neue Dokumente ein oder aktualisiert bestehende Einträge.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1 |
| Ausgabe | `$nodeLabel.results` / `$nodeLabel.reranked` (Suche), `$nodeLabel.point_id` (Insert/Upsert), `$nodeLabel.deleted` (Delete) |

## Unterstützte Datenbanken

Wählen Sie das Backend über das Dropdown **Database**:
- **Qdrant**: Externe Qdrant-Instanz (erfordert Qdrant-Anmeldedaten)
- **Postgres (pgvector)**: Heyms eigene relationale PostgreSQL-Datenbank mit pgvector-Erweiterung

## Operationen

- **search**: Semantische Suche nach `$nodeLabel.queryText` mit Ähnlichkeitsschwellenwert und optionalem Cohere-Reranking
- **insert**: Fügt neue Dokumente mit Text und Metadaten ein
- **upsert**: Aktualisiert bestehende Dokumente basierend auf `documentIdField`
- **delete**: Entfernt Dokumente anhand ihrer ID

## Metadaten-Filter

Suchanfragen können über JSON-Filter auf bestimmte Metadaten eingeschränkt werden (z. B. `{"category": "faq"}`). Werte unterstützen DSL-Ausdrücke.

## Verwandte Themen

- [Reiter Vektorspeicher](../tabs/vectorstores-tab.md) – Sammlungen und Embeddings verwalten\n