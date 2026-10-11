# Tabblad Vectoropslag

Het tabblad **Vectoropslag** beheert vectoropslag die wordt gebruikt door [RAG](../nodes/rag-node.md)-knooppunten. Maak opslag aan, upload documenten en deel deze met uw team.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Bekijk de Vectoropslag-demo</a></p>

## Een Vectoropslag aanmaken

1. Klik op **Nieuwe Vectoropslag**
2. Voer een naam en optionele beschrijving in
3. Selecteer een **referentie** voor de vectoropslag – *RAG: Qdrant + OpenAI* (externe Qdrant-server), *RAG: Psql + OpenAI* (Heym's eigen Postgres-database via pgvector), of *RAG: Custom Embeddings* (elk OpenAI-compatibel embedding-endpoint, gericht op beide backends). De referentie bepaalt de backend van de opslag.
4. Stel optioneel een aangepaste collectienaam in (standaard automatisch gegenereerd)
5. Opslaan

> De backend van een opslag wordt bij het aanmaken vastgelegd door de referentie. In een RAG-knooppunt filtert de vervolgkeuzelijst **Database** de opslag op de overeenkomende backend.

## Documenten uploaden

- **Bestanden uploaden** – Sleep bestanden of selecteer ze (PDF, TXT, enz.)
- **Omgaan met duplicaten** – Kies ervoor om dubbele bestandsnamen te overschrijven of over te slaan
- **Voortgang** – De uploadvoortgang wordt weergegeven tijdens de ingestie

## Content beheren

- **Items bekijken** – Bekijk bron-groepen en documentaantallen per opslag. Geüploade bestanden worden gegroepeerd
  onder hun bestandsnaam; documenten die een [RAG-knooppunt](../nodes/rag-node.md) heeft opgeslagen zonder een
  eigen `source` worden gegroepeerd onder **Added workflow: _naam_**, waarbij de workflow wordt genoemd die
  ze heeft geschreven
- **Bronnen verwijderen** – Verwijder specifieke bestanden of bron-groepen uit een opslag, inclusief
  alles wat één workflow heeft toegevoegd
- **Opslag bewerken** – Wijzig naam, beschrijving of referentie

## Delen

- Deel vectoropslag met andere gebruikers via e-mail
- Gedeelde opslag wordt weergegeven met een indicator
- Trek het delen in via het menu van de opslagkaart

## Gebruiken in Workflows

Selecteer in een [RAG-knooppunt](../nodes/rag-node.md) de vectoropslag op naam. Het knooppunt haalt relevante chunks op en vult de LLM-context ermee aan.

## Gerelateerd

- [Tabblad Referenties](./credentials-tab.md) – Referentie-instelling voor vectoropslag (Qdrant, Postgres of aangepaste embeddings)
- [RAG-knooppunt](../nodes/rag-node.md) – Knooppuntreferentie
- [Tabblad Workflows](./workflows-tab.md) – Workflows maken die RAG gebruiken
- [Contextuele Showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboard-oppervlakken
