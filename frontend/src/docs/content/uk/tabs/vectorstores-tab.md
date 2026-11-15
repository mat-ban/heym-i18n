# Вкладка Vectorstores

Вкладка **Vectorstores** керує векторними сховищами, які використовуються вузлами [RAG](../nodes/rag-node.md). Створюйте сховища, завантажуйте документи та діліться ними зі своєю командою.

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Переглянути демонстрацію Vectorstores</a></p>

## Створення векторного сховища

1. Натисніть **New Vector Store**
2. Введіть назву та необов'язковий опис
3. Виберіть **credential** векторного сховища – *RAG: Qdrant + OpenAI* (зовнішній сервер Qdrant), *RAG: Psql + OpenAI* (власна база даних Postgres від Heym через pgvector) або *RAG: Custom Embeddings* (будь-який endpoint вбудовування, сумісний з OpenAI, що працює з будь-яким бекендом). Credential визначає бекенд сховища.
4. За бажанням задайте власну назву колекції (за замовчуванням генерується автоматично)
5. Збережіть

> Бекенд сховища фіксується його credential під час створення. У вузлі RAG випадаючий список **Database** фільтрує сховища за відповідним бекендом.

## Завантаження документів

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
- **Duplicate handling** – Виберіть, перезаписувати чи пропускати файли з однаковими назвами
- **Progress** – Під час ingestion відображається прогрес завантаження

## Керування вмістом

- **View items** – Перегляньте групи джерел і кількість документів у кожному сховищі. Завантажені файли групуються
  за назвою файлу; документи, які [вузол RAG](../nodes/rag-node.md) зберіг без власного
  `source`, групуються під **Added workflow: _name_**, де вказано назву workflow, що
  їх записав
- **Delete sources** – Видаліть окремі файли або групи джерел зі сховища, включно
  з усім, що додав один workflow
- **Edit store** – Змініть назву, опис або credential
- **Search** – `POST /api/vector-stores/{id}/search` із параметром `query` (та `limit` від 1 до 20,
  за замовчуванням 5) повертає фрагменти (chunks), які повернув би пошук вузла RAG, починаючи з найкращого збігу, кожен із його
  оцінкою та джерелом. Екран RAG у Heym Work використовує це для тестування вибірки

## Спільний доступ

- Діліться векторними сховищами з іншими користувачами за електронною поштою
- Сховища зі спільним доступом позначаються індикатором
- Скасуйте спільний доступ через меню картки сховища

## Використання у Workflow

У [вузлі RAG](../nodes/rag-node.md) виберіть векторне сховище за назвою. Вузол отримує відповідні фрагменти та доповнює ними контекст LLM.

## Пов'язане

- [Вкладка Credentials](./credentials-tab.md) – Налаштування credential векторного сховища (Qdrant, Postgres або власні вбудовування)
- [Вузол RAG](../nodes/rag-node.md) – Довідка про вузол
- [Вкладка Workflows](./workflows-tab.md) – Створення workflow, що використовують RAG
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактний посібник зі сторінок дашборду
