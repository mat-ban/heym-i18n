# Fliken Vectorstores

Fliken **Vectorstores** hanterar vector stores som används av [RAG](../nodes/rag-node.md)-noder. Skapa stores, ladda upp dokument och dela dem med teamet.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>

## Skapa en Vector Store

1. Klicka på **New Vector Store**
2. Ange ett namn och en valfri beskrivning
3. Välj en **credential** för vector store – *RAG: Qdrant + OpenAI* (extern Qdrant-server), *RAG: Psql + OpenAI* (Heyms egen Postgres-databas via pgvector) eller *RAG: Custom Embeddings* (valfri OpenAI-kompatibel embedding-endpoint, mot endera backend). Credentialen avgör storens backend.
4. Ange vid behov ett anpassat collection-namn (standard är automatiskt genererat)
5. Spara

> En stores backend fastställs av dess credential vid skapandet. I en RAG-nod filtrerar listrutan **Database** stores till matchande backend.

## Ladda upp dokument

- **Upload files** – Dra och släpp eller välj filer (PDF, TXT, etc.)
- **Duplicate handling** – Välj att skriva över eller hoppa över dubbletter av filnamn
- **Progress** – Uppladdningsförloppet visas under inläsningen

## Hantera innehåll

- **View items** – Se källgrupper och antal dokument per store. Uppladdade filer grupperas
  under sitt filnamn; dokument som en [RAG-nod](../nodes/rag-node.md) lagrade utan en
  egen `source` grupperas under **Added workflow: _name_**, med namnet på workflowet som
  skrev dem
- **Delete sources** – Ta bort specifika filer eller källgrupper från en store, inklusive
  allt som ett workflow lade till
- **Edit store** – Ändra namn, beskrivning eller credential

## Delning

- Dela vector stores med andra användare via e-post
- Delade stores visas med en indikator
- Återkalla delning från store-kortets meny

## Användning i workflows

I en [RAG-nod](../nodes/rag-node.md) väljs vector storen via namn. Noden hämtar relevanta chunks och utökar LLM-kontexten med dem.

## Relaterat

- [Fliken Credentials](./credentials-tab.md) – Konfiguration av vector store-credential (Qdrant, Postgres eller anpassade embeddings)
- [RAG-nod](../nodes/rag-node.md) – Nodreferens
- [Fliken Workflows](./workflows-tab.md) – Skapa workflows som använder RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor
