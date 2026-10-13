# Scheda Archivi vettoriali

La scheda **Archivi vettoriali** gestisce gli archivi vettoriali utilizzati dai nodi [RAG](../nodes/rag-node.md). Consente di creare archivi, caricare documenti e condividerli con il proprio team.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Guarda la demo degli Archivi vettoriali</a></p>

## Creazione di un archivio vettoriale

1. Fare clic su **Nuovo archivio vettoriale**
2. Inserire un nome e una descrizione opzionale
3. Selezionare una **credenziale** per l'archivio vettoriale – *RAG: Qdrant + OpenAI* (server Qdrant esterno), *RAG: Psql + OpenAI* (database Postgres di Heym tramite pgvector) oppure *RAG: Custom Embeddings* (qualsiasi endpoint di embedding compatibile con OpenAI, indirizzato verso uno dei due backend). La credenziale determina il backend dell'archivio.
4. Impostare facoltativamente un nome di collezione personalizzato (per impostazione predefinita viene generato automaticamente)
5. Salvare

> Il backend di un archivio è fissato dalla sua credenziale al momento della creazione. In un nodo RAG, il menu a tendina **Database** filtra gli archivi in base al backend corrispondente.

## Caricamento dei documenti

- **Caricamento file** – Trascinare e rilasciare oppure selezionare i file (PDF, TXT, ecc.)
- **Gestione dei duplicati** – Scegliere se sovrascrivere o ignorare i nomi di file duplicati
- **Avanzamento** – L'avanzamento del caricamento viene mostrato durante l'ingestion

## Gestione dei contenuti

- **Visualizzazione degli elementi** – Consente di vedere i gruppi di origine e il numero di documenti per ciascun archivio. I file caricati vengono raggruppati
  sotto il rispettivo nome file; i documenti memorizzati da un [nodo RAG](../nodes/rag-node.md) senza una
  `source` propria vengono raggruppati sotto **Added workflow: _nome_**, indicando il workflow che
  li ha scritti
- **Eliminazione delle origini** – Consente di rimuovere file specifici o gruppi di origine da un archivio, inclusi
  tutti gli elementi aggiunti da un singolo workflow
- **Modifica dell'archivio** – Consente di modificare nome, descrizione o credenziale
- **Ricerca** – `POST /api/vector-stores/{id}/search` con una `query` (e un `limit` da 1 a 20,
  predefinito 5) restituisce i chunk che restituirebbe la ricerca di un nodo RAG, a partire dalla migliore corrispondenza, ciascuno con il proprio
  punteggio e la propria fonte. La schermata RAG di Heym Work lo utilizza per testare il recupero

## Condivisione

- Condividere gli archivi vettoriali con altri utenti tramite email
- Gli archivi condivisi vengono visualizzati con un indicatore
- Revocare la condivisione dal menu della scheda dell'archivio

## Utilizzo nei workflow

In un [nodo RAG](../nodes/rag-node.md), selezionare l'archivio vettoriale per nome. Il nodo recupera i chunk rilevanti e arricchisce il contesto del LLM con essi.

## Correlati

- [Scheda Credenziali](./credentials-tab.md) – Configurazione delle credenziali per gli archivi vettoriali (Qdrant, Postgres o embedding personalizzati)
- [Nodo RAG](../nodes/rag-node.md) – Riferimento del nodo
- [Scheda Workflows](./workflows-tab.md) – Creazione di workflow che utilizzano RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta alle pagine per le superfici della dashboard
