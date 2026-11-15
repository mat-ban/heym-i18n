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

- **Upload files** – Drag and drop or pick several files. A store takes:
  - **Documents** – PDF, Markdown, text, CSV and JSON
  - **Images** – PNG, JPEG, TIFF, WebP and BMP, read with the same Tesseract OCR as the
    [Converter](../nodes/converter-node.md) node, language detected automatically
  - **Audio** – mp3, wav, ogg, opus (WhatsApp voice notes) and flac, transcribed with the Converter's Whisper model on your
    own instance; each chunk keeps where it starts and ends in the recording
    (`start_seconds`, `end_seconds`)
  - **Any other plain-text file** – a file such as `notes` or `README` is read as text when
    it is valid UTF-8
- **Scanned PDFs** – pages without a text layer are read with OCR, up to 200 such pages per file
- **Background uploads** – audio and PDFs with scanned pages take minutes, so Heym reads them in
  the background. They show at the top of the store's items as *Transcribing* or *Reading scanned
  pages* and turn into a normal source when their chunks are in. A failed one shows why and can
  be dismissed. With **Override existing files**, the old version stays searchable until the new
  one is ready
- **Håndtering af dubletter** – Vælg at overskrive eller springe over filer med samme navn
- **Fremskridt** – Uploadstatus vises under indlæsning

## Håndtering af indhold

- **Vis elementer** – Se kildegrupper og dokumenttællinger pr. lager. Uploadede filer grupperes under deres filnavn; dokumenter, som en [RAG-node](../nodes/rag-node.md) har gemt uden egen `source`, grupperes under **Tilføjet workflow: _navn_**, der navngiver workflowet, der skrev dem
- **Slet kilder** – Fjern specifikke filer eller kildegrupper fra et lager, inklusive alt, hvad et workflow har tilføjet
- **Rediger lager** – Ændr navn, beskrivelse eller legitimationsoplysninger
- **Søg** – `POST /api/vector-stores/{id}/search` med en `query` (og en `limit` fra 1 til 20, standard 5) returnerer de chunks, som en RAG-nodes søgning ville returnere, bedste match først, hver med sin score og kilde. Heym Works RAG-skærm bruger det til at teste hentning

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
