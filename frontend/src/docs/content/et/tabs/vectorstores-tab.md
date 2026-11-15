# Vektorhoidlate vahekaart

**Vektorhoidlate** vahekaart haldab vektorhoidlaid, mida kasutavad [RAG](../nodes/rag-node.md) sõlmed. Looge hoidlaid, laadige üles dokumente ja jagage neid oma meeskonnaga.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Vaadake vektorhoidlate demo</a></p>

## Vektorhoidla loomine

1. Klõpsake **Uus vektorhoidla**
2. Sisestage nimi ja valikuline kirjeldus
3. Valige vektorhoidla **mandaat** – *RAG: Qdrant + OpenAI* (väline Qdrant server), *RAG: Psql + OpenAI* (Heymi enda Postgres andmebaas pgvectori kaudu) või *RAG: Custom Embeddings* (ükskõik milline OpenAI-ga ühilduv embedding endpoint, mis on suunatud kummale tahes taustsüsteemile). Mandaat määrab hoidla taustsüsteemi.
4. Soovi korral määrake kohandatud kogu nimi (vaikimisi automaatselt genereeritud)
5. Salvestage

> Hoidla taustsüsteem määratakse selle mandaadiga loomise hetkel. RAG sõlmes filtreerib **Database** rippmenüü hoidlad vastava taustsüsteemi järgi.

## Dokumentide üleslaadimine

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
- **Duplikaatide käsitlemine** – Valige, kas duplikaatfailinimed kirjutatakse üle või jäetakse vahele
- **Edenemine** – Üleslaadimise edenemist kuvatakse ingestimise ajal

## Sisu haldamine

- **Üksuste vaatamine** – Vaadake allikarühmi ja dokumentide arvu hoidla kohta. Üleslaaditud failid
  rühmitatakse nende failinime järgi; dokumendid, mille [RAG sõlm](../nodes/rag-node.md) salvestas ilma
  oma `source`-ita, rühmitatakse **Lisatud workflow: _nimi_** alla, nimetades workflow'd, mis
  need kirjutas
- **Allikate kustutamine** – Eemaldage hoidlast konkreetseid faile või allikarühmi, sealhulgas
  kõik, mille üks workflow lisas
- **Hoidla muutmine** – Muutke nime, kirjeldust või mandaati
- **Otsing** – `POST /api/vector-stores/{id}/search` koos parameetriga `query` (ja `limit` vahemikus 1 kuni 20,
  vaikimisi 5) tagastab tükid (chunks), mille tagastaks RAG-sõlme otsing, parim vaste esimesena, igaüks koos oma
  skoori ja allikaga. Heym Worki RAG-ekraan kasutab seda päringute testimiseks

## Jagamine

- Jagage vektorhoidlaid teiste kasutajatega e-posti teel
- Jagatud hoidlad kuvatakse indikaatoriga
- Tühistage jagamine hoidla kaardi menüüst

## Kasutamine workflow'des

Valige [RAG sõlmes](../nodes/rag-node.md) vektorhoidla nime järgi. Sõlm otsib välja asjakohased tükid ja täiendab nendega LLM-i konteksti.

## Seotud

- [Mandaatide vahekaart](./credentials-tab.md) – Vektorhoidla mandaadi seadistamine (Qdrant, Postgres või kohandatud embeddingud)
- [RAG sõlm](../nodes/rag-node.md) – Sõlme viide
- [Workflow'de vahekaart](./workflows-tab.md) – Looge workflow'sid, mis kasutavad RAG-i
- [Kontekstuaalne showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadete jaoks
