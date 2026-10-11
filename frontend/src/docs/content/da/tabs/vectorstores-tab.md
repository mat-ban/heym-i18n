# Vektorlagre-faneblad

**Vektorlagre**-fanebladet håndterer vektorlagre, der bruges af [RAG](../nodes/rag-node.md)-noder. Opret lagre, upload dokumenter, og del dem med holdet.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Se Vektorlagre-demo</a></p>

## Oprettelse af et vektorlager

1. Klik på **Nyt vektorlager**
2. Indtast et navn og valgfri beskrivelse
3. Vælg en vektorlager-**legitimationsoplysning** – *RAG: Qdrant + OpenAI* (ekstern Qdrant-server), *RAG: Psql + OpenAI* (Heyms egen Postgres-database via pgvector) eller *RAG: Custom Embeddings* (enhver OpenAI-kompatibel embedding-endpoint, der målretter begge backends). Legitimationsoplysningen bestemmer lagrets backend.
4. Valgfrit: Angiv et brugerdefineret kollektionsnavn (standard er automatisk genereret)
5. Gem

> En lagers backend fastlægges af dens legitimationsoplysning ved oprettelse. I en RAG-node filtrerer **Database**-dropdownmenuen lagre til den matchende backend.

## Upload af dokumenter

- **Upload filer** – Træk og slip eller vælg filer (PDF, TXT osv.)
- **Håndtering af dubletter** – Vælg at overskrive eller springe over filer med samme navn
- **Fremskridt** – Uploadstatus vises under indlæsning

## Håndtering af indhold

- **Vis elementer** – Se kildegrupper og dokumenttællinger pr. lager. Uploadede filer grupperes under deres filnavn; dokumenter, som en [RAG-node](../nodes/rag-node.md) har gemt uden egen `source`, grupperes under **Tilføjet workflow: _navn_**, der navngiver workflowet, der skrev dem
- **Slet kilder** – Fjern specifikke filer eller kildegrupper fra et lager, inklusive alt, hvad et workflow har tilføjet
- **Rediger lager** – Ændr navn, beskrivelse eller legitimationsoplysninger

## Deling

- Del vektorlagre med andre brugere via e-mail
- Delte lagre vises med en indikator
- Tilbagekald deling fra lagrets kortmenu

## Brug i workflows

I en [RAG-node](../nodes/rag-node.md) vælges vektorlageret efter navn. Noden henter relevante chunks og forbedrer LLM-konteksten med dem.

## Relateret

- [Legitimationsoplysninger-faneblad](./credentials-tab.md) – Opsætning af legitimationsoplysninger til vektorlagre (Qdrant, Postgres eller brugerdefinerede embeddings)
- [RAG-node](../nodes/rag-node.md) – Nodereference
- [Workflows-faneblad](./workflows-tab.md) – Opret workflows, der bruger RAG
- [Kontekstuel showcase](../reference/contextual-showcase.md) – Kompakt sidevejledning til dashboard-overflader
