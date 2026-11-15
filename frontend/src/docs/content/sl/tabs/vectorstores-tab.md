# Zavihek Vektorske Shrambe

Zavihek **Vektorske Shrambe** upravlja vektorske shrambe, ki jih uporabljajo [RAG](../nodes/rag-node.md) vozlišča. Ustvarite shrambe, naložite dokumente in jih delite s svojo ekipo.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Oglejte si predstavitev Vektorskih Shranb</a></p>

## Ustvarjanje Vektorske Shrambe

1. Kliknite **Nova Vektorska Shramba**
2. Vnesite ime in neobvezni opis
3. Izberite **poverenje** za vektorsko shrambo – *RAG: Qdrant + OpenAI* (zunanji Qdrant strežnik), *RAG: Psql + OpenAI* (Heymova lastna Postgres baza prek pgvector) ali *RAG: Prilagojeni Vektorski Vektorji* (katerikoli OpenAI-ustrezen vektorski endpoint, ki cilja na katerikoli backend). Poverilnica določa backend shrambe.
4. Po želji nastavite prilagojeno ime zbirke (privzeto se samodejno generira)
5. Shranite

> Backend shrambe je določen s poverilnico ob času ustvarjanja. V RAG vozlišču dropdown **Baza** filtrira shrambe glede na ustrezen backend.

## Nalaganje Dokumentov

- **Naložite datoteke** – Povlecite in spustite ali izberite datoteke (PDF, TXT itd.)
- **Obravnava podvojenih** – Izberite, ali želite prepisati ali preskočiti podvojena imena datotek
- **Napredek** – Napredek nalaganja je prikazan med obdelavo

## Upravljanje Vsebine

- **Ogled predmetov** – Oglejte si skupine virov in število dokumentov na shrambo. Naložene datoteke se skupijo pod svojim imenom; dokumenti, ki jih je [RAG vozlišče](../nodes/rag-node.md) shranilo brez lastnega `source`, se skupijo pod **Dodano delovno pot: _ime_**, pri čemer se imenuje delovni postopek, ki jih je zapisal
- **Izbriši vire** – Odstranite specifične datoteke ali skupine virov iz shrambe, vključno z vsemi, ki jih je dodal en delovni postopek
- **Uredi shrambo** – Spremenite ime, opis ali poverilnico
- **Iskanje** – `POST /api/vector-stores/{id}/search` s parametrom `query` (in `limit` od 1 do 20, privzeto 5) vrne koščke (chunks), ki bi jih vrnilo iskanje vozlišča RAG, najprej najboljše ujemanje, vsakega z njegovo oceno in virom. Zaslon RAG v Heym Work to uporablja za preizkušanje pridobivanja

## Deljenje

- Delite vektorske shrambe z drugimi uporabniki po elektronski pošti
- Deljene shrambe se prikažejo z indikatorjem
- Prekličite deljenje iz menija kartice shrambe

## Uporaba v Workflows

V [RAG vozlišču](../nodes/rag-node.md) izberite vektorsko shrambo po imenu. Vozlišče pridobi ustrezne dele in obogati kontekst LLM z njimi.

## Sorodno

- [Zavihek Poverilnice](./credentials-tab.md) – Nastavitev poverilnic za vektorsko shrambo (Qdrant, Postgres ali prilagojeni vektorski vektorji)
- [RAG Vozlišče](../nodes/rag-node.md) – Referenca vozlišča
- [Zavihek Workflows](./workflows-tab.md) – Ustvarite workflows, ki uporabljajo RAG
- [Kontekstualna Predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po straneh nadzorne plošče


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
