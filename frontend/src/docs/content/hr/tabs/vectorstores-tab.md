# Zavičajna spremišta

Tablica **Zavičajna spremišta** upravlja vektorskim spremištima koja koriste [RAG](../nodes/rag-node.md) čvorovi. Kreirajte spremišta, učitajte dokumente i dijelite ih sa svojim timom.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Pogledajte demo Zavičajnih spremišta</a></p>

## Kreiranje vektorskog spremišta

1. Kliknite **Novo vektorsko spremište**
2. Unesite naziv i opcionalni opis
3. Odaberite **vjerodajnicu** vektorskog spremišta – *RAG: Qdrant + OpenAI* (vanjski Qdrant poslužitelj), *RAG: Psql + OpenAI* (Heymova vlastita Postgres baza putem pgvector), ili *RAG: Prilagođene ugradnje* (bilo koji OpenAI-kompatibilni endpoint za ugradnje, usmjeren na bilo koji backend). Vjerodajnica određuje backend spremišta.
4. Opcionalno postavite prilagođeni naziv kolekcije (zadano se generira automatski)
5. Spremite

> Backend spremišta je fiksiran njegovom vjerodajnicom u trenutku kreiranja. U RAG čvoru, **Baza podataka** padajući izbornik filtrira spremišta prema odgovarajućem backendu.

## Učitavanje dokumenata

- **Učitajte datoteke** – Povucite i ispustite ili odaberite datoteke (PDF, TXT, itd.)
- **Rukovanje dupliciranim datotekama** – Odaberite hoćete li zamijeniti ili preskočiti duplicirane nazive datoteka
- **Napredak** – Napredak učitavanja prikazan je tijekom unosa

## Upravljanje sadržajem

- **Pogledajte stavke** – Vidite izvorne grupe i broj dokumenata po spremištu. Učitane datoteke grupiraju se prema svom nazivu; dokumenti koje je [RAG čvor](../nodes/rag-node.md) pohranio bez vlastitog `source` grupiraju se pod **Dodani workflow: _naziv_**, nazivajući workflow koji ih je napisao
- **Izbrišite izvore** – Uklonite specifične datoteke ili izvorne grupe iz spremišta, uključujući sve što je jedan workflow dodao
- **Uredite spremište** – Promijenite naziv, opis ili vjerodajnicu
- **Pretraživanje** – `POST /api/vector-stores/{id}/search` s parametrom `query` (i `limit` od 1 do 20, zadano 5) vraća dijelove (chunks) koje bi vratilo pretraživanje RAG čvora, počevši od najboljeg podudaranja, svaki sa svojim rezultatom i izvorom. RAG zaslon u Heym Worku koristi ga za testiranje dohvaćanja

## Dijeljenje

- Dijelite vektorska spremišta s drugim korisnicima putem e-pošte
- Dijeljena spremišta pojavljuju se s indikatorom
- Oduzmite dijeljenje iz izbornika kartice spremišta

## Korištenje u Workflows

U [RAG čvoru](../nodes/rag-node.md), odaberite vektorsko spremište po nazivu. Čvor preuzima relevantne dijelove i obogaćuje LLM kontekst njima.

## Povezano

- [Tablica Vjerodajnica](./credentials-tab.md) – Postavke vjerodajnica vektorskog spremišta (Qdrant, Postgres ili prilagođene ugradnje)
- [RAG Čvor](../nodes/rag-node.md) – Referenca na čvor
- [Tablica Workflows](./workflows-tab.md) – Kreirajte workflows koji koriste RAG
- [Kontekstualna izložba](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče


## Uploading Documents

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
