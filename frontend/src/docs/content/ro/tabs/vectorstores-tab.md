# Filă Vectorstores

Fila **Vectorstores** gestionează vector store-urile utilizate de nodurile [RAG](../nodes/rag-node.md). Creați store-uri, încărcați documente și partajați-le cu echipa dumneavoastră.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Urmăriți demonstrația Vectorstores</a></p>

## Crearea unui Vector Store

1. Faceți clic pe **New Vector Store**
2. Introduceți un nume și o descriere opțională
3. Selectați o **credential** pentru vector store – *RAG: Qdrant + OpenAI* (server Qdrant extern), *RAG: Psql + OpenAI* (baza de date Postgres proprie Heym prin pgvector) sau *RAG: Custom Embeddings* (orice endpoint de embedding compatibil OpenAI, vizând oricare backend). Credential-ul determină backend-ul store-ului.
4. Opțional, setați un nume de colecție personalizat (implicit generat automat)
5. Salvați

> Backend-ul unui store este fixat de credential-ul său la momentul creării. Într-un nod RAG, meniul derulant **Database** filtrează store-urile după backend-ul corespunzător.

## Încărcarea documentelor

- **Upload files** – Trageți și plasați sau selectați fișiere (PDF, TXT etc.)
- **Duplicate handling** – Alegeți să suprascrieți sau să omiteți numele de fișiere duplicate
- **Progress** – Progresul încărcării este afișat în timpul ingestiei

## Gestionarea conținutului

- **View items** – Vizualizați grupurile sursă și numărul de documente per store. Fișierele încărcate
  sunt grupate sub numele lor de fișier; documentele pe care un [nod RAG](../nodes/rag-node.md) le-a stocat fără
  un `source` propriu sunt grupate sub **Added workflow: _name_**, indicând workflow-ul care
  le-a scris
- **Delete sources** – Eliminați fișiere specifice sau grupuri sursă dintr-un store, inclusiv
  tot ce a adăugat un workflow
- **Edit store** – Modificați numele, descrierea sau credential-ul
- **Căutare** – `POST /api/vector-stores/{id}/search` cu un `query` (și o `limit` de la 1 la 20,
  implicit 5) returnează fragmentele pe care le-ar returna căutarea unui nod RAG, începând cu cea mai bună potrivire, fiecare cu
  scorul și sursa sa. Ecranul RAG din Heym Work îl folosește pentru a testa regăsirea

## Partajarea

- Partajați vector store-urile cu alți utilizatori prin email
- Store-urile partajate apar cu un indicator
- Revocați partajarea din meniul cardului store-ului

## Utilizarea în Workflow-uri

Într-un [nod RAG](../nodes/rag-node.md), selectați vector store-ul după nume. Nodul extrage chunk-urile relevante și augmentează contextul LLM cu acestea.

## Resurse conexe

- [Credentials Tab](./credentials-tab.md) – Configurarea credential-elor pentru vector store (Qdrant, Postgres sau embedding-uri personalizate)
- [RAG Node](../nodes/rag-node.md) – Referință nod
- [Workflows Tab](./workflows-tab.md) – Creați workflow-uri care utilizează RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Ghid compact de pagină pentru suprafețele dashboard-ului
