# Karta Vectorstores

Karta **Vectorstores** spravuje vektorové úložiště používaná uzly [RAG](../nodes/rag-node.md). Vytvářejte úložiště, nahrávejte dokumenty a sdílejte je se svým týmem.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>

## Vytvoření vektorového úložiště

1. Klikněte na **New Vector Store**
2. Zadejte název a volitelný popis
3. Vyberte **credential** vektorového úložiště – *RAG: Qdrant + OpenAI* (externí server Qdrant), *RAG: Psql + OpenAI* (vlastní databáze Postgres systému Heym prostřednictvím pgvector) nebo *RAG: Custom Embeddings* (libovolný embedding endpoint kompatibilní s OpenAI, cílící na jeden z backendů). Credential určuje backend úložiště.
4. Volitelně nastavte vlastní název kolekce (výchozí je automaticky generovaný)
5. Uložte

> Backend úložiště je pevně dán jeho credential při vytvoření. V uzlu RAG filtruje rozbalovací nabídka **Database** úložiště podle odpovídajícího backendu.

## Nahrávání dokumentů

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
- **Duplicate handling** – Zvolte, zda přepsat nebo přeskočit duplicitní názvy souborů
- **Progress** – Průběh nahrávání se zobrazuje během ingestace

## Správa obsahu

- **View items** – Zobrazte skupiny zdrojů a počty dokumentů pro jednotlivá úložiště. Nahrané soubory se seskupují
  pod svým názvem souboru; dokumenty, které [uzel RAG](../nodes/rag-node.md) uložil bez
  vlastního `source`, se seskupují pod **Added workflow: _name_**, kde je uveden název workflow,
  který je zapsal
- **Delete sources** – Odstraňte konkrétní soubory nebo skupiny zdrojů z úložiště, včetně
  všeho, co přidal jeden workflow
- **Edit store** – Změňte název, popis nebo credential
- **Vyhledávání** – `POST /api/vector-stores/{id}/search` s parametrem `query` (a `limit` od 1 do 20,
  výchozí 5) vrací úseky (chunks), které by vrátilo vyhledávání uzlu RAG, od nejlepší shody, každý s jeho
  skóre a zdrojem. Obrazovka RAG v Heym Work to používá k testování vyhledávání

## Sdílení

- Sdílejte vektorová úložiště s ostatními uživateli prostřednictvím e-mailu
- Sdílená úložiště se zobrazují s indikátorem
- Zrušte sdílení z nabídky karty úložiště

## Použití ve workflow

V [uzlu RAG](../nodes/rag-node.md) vyberte vektorové úložiště podle názvu. Uzel načte relevantní části a obohatí o ně kontext LLM.

## Související

- [Credentials Tab](./credentials-tab.md) – Nastavení credential vektorového úložiště (Qdrant, Postgres nebo vlastní embeddings)
- [RAG Node](../nodes/rag-node.md) – Reference uzlu
- [Workflows Tab](./workflows-tab.md) – Vytvářejte workflow, která používají RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktní průvodce stránkami pro dashboard
