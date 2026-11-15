# Karta Vektorové úložiská

Karta **Vektorové úložiská** spravuje vektorové úložiská používané uzlami [RAG](../nodes/rag-node.md). Vytvárajte úložiská, nahrávajte dokumenty a zdieľajte ich so svojím tímom.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Pozrite si ukážku Vektorových úložísk</a></p>

## Vytvorenie vektorového úložiska

1. Kliknite na **Nové vektorové úložisko**
2. Zadajte názov a voliteľný popis
3. Vyberte **prihlasovacie údaje** vektorového úložiska – *RAG: Qdrant + OpenAI* (externý server Qdrant), *RAG: Psql + OpenAI* (vlastná databáza Postgres v Hey m cez pgvector) alebo *RAG: Custom Embeddings* (akýkoľvek embedding endpoint kompatibilný s OpenAI, cielený na jeden z backendov). Prihlasovacie údaje určujú backend úložiska.
4. Voliteľne nastavte vlastný názov kolekcie (predvolene sa generuje automaticky)
5. Uložte

> Backend úložiska je pevne daný jeho prihlasovacími údajmi v čase vytvorenia. V uzle RAG rozbaľovací zoznam **Database** filtruje úložiská podľa zodpovedajúceho backendu.

## Nahrávanie dokumentov

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
- **Spracovanie duplikátov** – Zvoľte prepísanie alebo preskočenie duplicitných názvov súborov
- **Priebeh** – Priebeh nahrávania sa zobrazuje počas ingestácie

## Správa obsahu

- **Zobrazenie položiek** – Zobrazte skupiny zdrojov a počty dokumentov pre jednotlivé úložiská. Nahrané súbory sa zoskupujú
  pod názvom súboru; dokumenty, ktoré uložil [uzol RAG](../nodes/rag-node.md) bez
  vlastného `source`, sa zoskupujú pod **Added workflow: _name_**, pričom sa uvádza názov workflowu, ktorý
  ich zapísal
- **Odstránenie zdrojov** – Odstráňte konkrétne súbory alebo skupiny zdrojov z úložiska vrátane
  všetkého, čo pridal jeden workflow
- **Úprava úložiska** – Zmeňte názov, popis alebo prihlasovacie údaje
- **Vyhľadávanie** – `POST /api/vector-stores/{id}/search` s parametrom `query` (a `limit` od 1 do 20,
  predvolene 5) vráti časti (chunks), ktoré by vrátilo vyhľadávanie uzla RAG, od najlepšej zhody, každú s jej
  skóre a zdrojom. Obrazovka RAG v Heym Work to používa na testovanie získavania dát

## Zdieľanie

- Zdieľajte vektorové úložiská s ostatnými používateľmi prostredníctvom e-mailu
- Zdieľané úložiská sa zobrazujú s indikátorom
- Zrušte zdieľanie v ponuke karty úložiska

## Použitie vo workflowoch

V [uzle RAG](../nodes/rag-node.md) vyberte vektorové úložisko podľa názvu. Uzol načíta relevantné časti a obohatí o ne kontext LLM.

## Súvisiace

- [Karta Prihlasovacie údaje](./credentials-tab.md) – Nastavenie prihlasovacích údajov vektorového úložiska (Qdrant, Postgres alebo vlastné embeddingy)
- [Uzol RAG](../nodes/rag-node.md) – Referencia uzla
- [Karta Workflowy](./workflows-tab.md) – Vytvárajte workflowy, ktoré používajú RAG
- [Kontextová ukážka](../reference/contextual-showcase.md) – Kompaktný sprievodca stránkami pre povrchy dashboardu
