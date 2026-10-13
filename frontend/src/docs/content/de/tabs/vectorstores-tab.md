# Reiter Vektorspeicher

Der Reiter **Vektorspeicher** verwaltet Vektorspeicher, die von [RAG](../nodes/rag-node.md)-Knoten verwendet werden. Erstellen Sie Speicher, laden Sie Dokumente hoch und teilen Sie diese mit Ihrem Team.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Video-Demo zu Vektorspeichern ansehen</a></p>

## Einen Vektorspeicher erstellen

1. Klicken Sie auf **New Vector Store**
2. Geben Sie einen Namen und optional eine Beschreibung ein
3. Wählen Sie eine Vektorspeicher-**Anmeldedaten**-Konfiguration (*Credential*) – *RAG: Qdrant + OpenAI* (externer Qdrant-Server), *RAG: Psql + OpenAI* (Heyms eigene Postgres-Datenbank über pgvector) oder *RAG: Custom Embeddings* (jeder OpenAI-kompatible Embedding-Endpoint für eines der beiden Backends). Die Anmeldedaten bestimmen das Backend des Speichers.
4. Legen Sie optional einen benutzerdefinierten Sammlungsnamen fest (standardmäßig automatisch generiert)
5. Speichern

> Das Backend eines Speichers wird bei der Erstellung durch seine Anmeldedaten festgelegt. In einem RAG-Knoten filtert das Dropdown **Database** die Speicher passend zum jeweiligen Backend.

## Dokumente hochladen

- **Dateien hochladen** – Ziehen Sie Dateien per Drag & Drop hinein oder wählen Sie sie aus (PDF, TXT usw.)
- **Duplikatbehandlung** – Wählen Sie, ob doppelte Dateinamen überschrieben oder übersprungen werden sollen
- **Fortschritt** – Der Upload-Fortschritt wird während der Verarbeitung angezeigt

## Inhalte verwalten

- **Elemente anzeigen** – Sehen Sie Quellgruppen und Dokumentanzahlen pro Speicher. Hochgeladene Dateien werden
  unter ihrem Dateinamen gruppiert; Dokumente, die ein [RAG-Knoten](../nodes/rag-node.md) ohne eigene
  `source` gespeichert hat, werden unter **Added workflow: _name_** gruppiert und nennen den Workflow, der
  sie geschrieben hat
- **Quellen löschen** – Entfernen Sie bestimmte Dateien oder Quellgruppen aus einem Speicher, einschließlich
  aller Einträge, die ein einzelner Workflow hinzugefügt hat
- **Speicher bearbeiten** – Ändern Sie Name, Beschreibung oder Anmeldedaten
- **Suche** – `POST /api/vector-stores/{id}/search` mit einer `query` (und einem `limit` von 1 bis 20,
  Standard 5) gibt die Chunks zurück, die eine Suche eines RAG-Knotens liefern würde, beste Treffer zuerst, jeweils mit
  Score und Quelle. Die RAG-Ansicht von Heym Work nutzt dies zum Testen des Retrievals

## Teilen

- Teilen Sie Vektorspeicher per E-Mail mit anderen Benutzern
- Geteilte Speicher werden mit einer Kennzeichnung angezeigt
- Widerrufen Sie die Freigabe über das Menü der Speicherkarte

## Verwendung in Workflows

Wählen Sie in einem [RAG-Knoten](../nodes/rag-node.md) den Vektorspeicher anhand seines Namens aus. Der Knoten ruft relevante Chunks ab und reichert den LLM-Kontext damit an.

## Verwandte Themen

- [Reiter Anmeldedaten](./credentials-tab.md) – Einrichtung der Vektorspeicher-Anmeldedaten (Qdrant, Postgres oder benutzerdefinierte Embeddings)
- [RAG-Knoten](../nodes/rag-node.md) – Knoten-Referenz
- [Reiter Workflows](./workflows-tab.md) – Workflows erstellen, die RAG verwenden
- [Kontextuelle Übersicht](../reference/contextual-showcase.md) – Kompakter Seitenleitfaden für Dashboard-Oberflächen
