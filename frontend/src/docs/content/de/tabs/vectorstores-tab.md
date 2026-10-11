# Reiter Vektorspeicher

Der Reiter **Vektorspeicher** (Vectorstores) verwaltet Sammlungen für semantische Ähnlichkeitssuche und Retrieval-Augmented Generation (RAG).

## Unterstützte Backends

1. **Postgres (pgvector)**: Nutzt Heyms integrierte relationale Datenbank. Keine externe Infrastruktur erforderlich.
2. **Qdrant**: Hochperformante dedizierte Vektordatenbank für sehr große Datenmengen und verteilte Setups.

## Sammlungen verwalten

- Erstellen Sie neue Vektor-Sammlungen mit konfigurierbarer Distanzmetrik (Cosine, Dot Product, Euclidean) und Dimensionsgröße
- Laden Sie Dokumente (PDF, TXT, Markdown, CSV) hoch; Heym übernimmt automatisches Chunking und Einbettung (Embedding)
- Testen Sie Ähnlichkeitssuchen interaktiv direkt im UI mit Ähnlichkeits-Scores

## Nutzung in Workflows

Der [RAG-Knoten](../nodes/rag-node.md) greift direkt auf diese Sammlungen zu, um Benutzerfragen mit relevanten Kontext-Dokumenten anzureichern.

## Verwandte Themen

- [RAG-Knoten](../nodes/rag-node.md) – Vektorsuche im Workflow
- [Reiter Anmeldedaten](./credentials-tab.md) – Embedding- und Qdrant-Keys\n