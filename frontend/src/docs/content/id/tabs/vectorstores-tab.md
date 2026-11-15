# Tab Vectorstores

Tab **Vectorstores** mengelola vector store yang digunakan oleh Node [RAG](../nodes/rag-node.md). Buat store, unggah dokumen, dan bagikan kepada tim Anda.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Tonton demo Vectorstores</a></p>

## Membuat Vector Store

1. Klik **New Vector Store**
2. Masukkan nama dan deskripsi opsional
3. Pilih **credential** vector store – *RAG: Qdrant + OpenAI* (server Qdrant eksternal), *RAG: Psql + OpenAI* (database Postgres milik Heym melalui pgvector), atau *RAG: Custom Embeddings* (endpoint embedding apa pun yang kompatibel dengan OpenAI, menargetkan salah satu backend). Credential menentukan backend store.
4. Secara opsional tetapkan nama collection kustom (default-nya dibuat otomatis)
5. Simpan

> Backend sebuah store ditetapkan oleh credential-nya pada saat pembuatan. Dalam Node RAG, dropdown **Database** memfilter store ke backend yang sesuai.

## Mengunggah Dokumen

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
- **Duplicate handling** – Pilih untuk menimpa atau melewati nama file duplikat
- **Progress** – Progres unggahan ditampilkan selama proses ingestion

## Mengelola Konten

- **View items** – Lihat grup sumber dan jumlah dokumen per store. File yang diunggah dikelompokkan
  berdasarkan nama filenya; dokumen yang disimpan oleh [Node RAG](../nodes/rag-node.md) tanpa
  `source` miliknya sendiri dikelompokkan di bawah **Added workflow: _name_**, menamai workflow yang
  menuliskannya
- **Delete sources** – Hapus file tertentu atau grup sumber dari store, termasuk
  semua yang ditambahkan oleh satu workflow
- **Edit store** – Ubah nama, deskripsi, atau credential
- **Search** – `POST /api/vector-stores/{id}/search` dengan `query` (dan `limit` dari 1 hingga 20,
  default 5) mengembalikan chunk yang akan dikembalikan oleh pencarian node RAG, kecocokan terbaik lebih dulu, masing-masing dengan
  skor dan sumbernya. Layar RAG di Heym Work menggunakannya untuk menguji pengambilan data

## Berbagi

- Bagikan vector store kepada pengguna lain melalui email
- Store yang dibagikan muncul dengan indikator
- Cabut berbagi dari menu kartu store

## Menggunakan dalam Workflow

Dalam [Node RAG](../nodes/rag-node.md), pilih vector store berdasarkan nama. Node mengambil chunk yang relevan dan melengkapi konteks LLM dengannya.

## Terkait

- [Tab Credentials](./credentials-tab.md) – Penyiapan credential vector store (Qdrant, Postgres, atau custom embeddings)
- [Node RAG](../nodes/rag-node.md) – Referensi Node
- [Tab Workflows](./workflows-tab.md) – Membuat workflow yang menggunakan RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk tampilan dashboard
