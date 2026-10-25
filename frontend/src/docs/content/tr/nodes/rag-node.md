# RAG / Vektör Deposu

**RAG / Vector Store** düğümü, Retrieval Augmented Generation (RAG) için bir vector store içine belge ekler, upsert eder, siler ve arar. Bu düğümü, LLM bağlamını ilgili belgelerle zenginleştirmek ve bu bağlamı belgelerin geldiği sistemle uyumlu tutmak için kullanın.

Düğümde, arka ucu seçen bir **Database** açılır menüsü bulunur:

- **Qdrant** – vektörleri harici bir Qdrant sunucusunda saklar (*RAG: Qdrant + OpenAI* credential gerektirir).
- **Postgres (pgvector)** – vektörleri Heym'in kendi Postgres veritabanı içinde saklar, harici servis gerekmez (*RAG: Psql + OpenAI* credential gerektirir).

Geriye dönük uyumluluk için varsayılan **Qdrant**'tır. Database değiştirildiğinde **Vector Store** listesi, o veritabanı tarafından desteklenen store'lara göre filtrelenir. Her iki arka uç da aynı işlemleri, metadata filtrelemeyi, hibrit (vektör + BM25) aramayı ve Cohere reranking'i destekler.

Her iki arka uca da bir *RAG: Custom Embeddings* credential üzerinden erişilebilir; bu credential OpenAI'yi OpenAI uyumlu herhangi bir embedding endpoint'i ile değiştirir ve kendi vector store'unu adlandırır. Böyle bir credential'dan oluşturulan bir store, hedeflediği Database altında görünür. Bkz. [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vector store arka ucu (varsayılan: `"qdrant"`) |
| `vectorStoreId` | UUID | [Vectorstores](../tabs/vectorstores-tab.md) sekmesinden vector store |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | İşlem türü (ayrıca `operation`) |
| `documentContent` | expression | Saklanacak belge metni (insert, upsert) |
| `documentMetadata` | JSON string | Saklanan belgeler için metadata (insert, upsert); değerler expression destekler |
| `documentIdField` | string | Benzersiz id'yi tutan payload alanı (upsert, delete; varsayılan `doc_id`) |
| `documentId` | expression | Benzersiz id'nin değeri (upsert, delete) |
| `queryText` | expression | Arama sorgusu (yalnızca search) |
| `searchLimit` | number | Maksimum sonuç sayısı (varsayılan: 5) |
| `metadataFilters` | JSON string | Arama için metadata filtreleri (değerler expression destekler) |
| `hybridSearch` | boolean | Vektör aramasını BM25 anahtar kelime aramasıyla birleştir (yalnızca search; varsayılan: kapalı) |
| `enableReranker` | boolean | Arama sonuçlarını yeniden sıralamak için Cohere kullan |
| `rerankerCredentialId` | UUID | Yeniden sıralama için Cohere credential |
| `rerankerTopN` | number | Yeniden sıralama sonrası tutulacak en iyi sonuç sayısı |

## İşlemler

### Insert

Vector store'a belge ekler.

| Alan | Zorunlu | Açıklama |
|-------|----------|-------------|
| `documentContent` | evet | Embed edilip saklanacak metin |
| `documentMetadata` | hayır | JSON nesnesi, örn. `{"source": "user", "category": "general"}` |

**Çıkış:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadata expression'ları

Metadata değerleri expression kabul eder; böylece bir belge, çalıştırmadan gelen bağlamla birlikte saklanabilir:

```json
{ "url": "$start.url", "category": "faq" }
```

Expression'lar, JSON içine metin olarak yerleştirilerek değil, JSON ayrıştırıldıktan sonra çözümlenir; bu nedenle tırnak veya satır sonu içeren bir değer nesneyi parçalayamaz. Tek başına bir expression olan bir değer, çözümlenmiş türünü korur — `{"count": "$start.count"}` bir sayı saklar, `"7"` değil — bu önemlidir çünkü arama `metadataFilters` tam tür üzerinde eşleşir. `"page $start.count"` gibi karışık metin bir string'e çözümlenir ve iç içe nesneler ile diziler de dolaşılır.

Aynı durum `upsert` ve arama `metadataFilters` için de geçerlidir: önce ayrıştırılır, ardından değerleri aynı kurallarla çözümlenir. Yani `{"count": "$start.count"}` olarak yazılan bir filtre, `"7"` string'i yerine insert'in sakladığı sayıyla eşleşir.

### Bir belgeyi hangi workflow'un sakladığı

Kendi `source` değeri olmadan saklanan bir belge, onu saklayan workflow ile damgalanır: `source: "workflow:<workflow name>"`. [Vectorstores](../tabs/vectorstores-tab.md) sekmesi bunları **Added workflow: _name_** altında gruplar; böylece bir store'un içeriği her belgenin nereden geldiğini söyler ve bir workflow'un belgeleri grup olarak silinebilir. `documentMetadata` içinde `source` değerini kendiniz ayarlarsanız, bu her zaman damgadan önceliklidir.

### Upsert

Bir belge ekler veya aynı benzersiz id altında zaten saklanan belgeyi değiştirir.

Id, store'un dahili point id'si değil, **payload içindeki** bir alandır; böylece bir belge, kendi sisteminizin zaten kullandığı tanımlayıcıyı korur — bir CRM kayıt id'si, bir SKU, bir sayfa slug'ı. `documentIdField` bu alanı adlandırır ve `documentId` değerini taşır.

| Alan | Zorunlu | Açıklama |
|-------|----------|-------------|
| `documentId` | evet | Belgenin benzersiz id'si (expression destekler) |
| `documentContent` | evet | Embed edilip saklanacak metin |
| `documentIdField` | hayır | Id'nin bulunduğu payload alanı (varsayılan `doc_id`) |
| `documentMetadata` | hayır | JSON nesnesi, örn. `{"source": "crm", "url": "$start.url"}` (değerler expression destekler) |

Id alanı eşleşen her point önce kaldırılır; böylece daha önce birkaç chunk olarak saklanan bir belge, çoğaltılmak yerine bir bütün olarak değiştirilir. Id alanı sizin için payload'a yazılır ve point id, aynı belgenin upsert'leri boyunca sabit kalır.

**Çıkış:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — mevcut bir sürümün değiştirilip değiştirilmediği), `$nodeLabel.replaced_count`
### Silme

Aynı benzersiz id ile bir belgeyi kaldırın.

| Alan | Zorunlu | Açıklama |
|-------|----------|-------------|
| `documentId` | evet | Belgenin benzersiz id'si (ifadeleri destekler) |
| `documentIdField` | hayır | Id'nin bulunduğu Payload alanı (varsayılan `doc_id`) |

**Çıktı:** `$nodeLabel.deleted` – en az bir nokta eşleştiğinde `true`, id depoda
bulunmadığında `false`. `$nodeLabel.deleted_count` kaç noktanın kaldırıldığını taşır.

Mevcut olmayan bir id'yi silmek hata değildir: düğüm `deleted: false` ile başarılı olur, böylece
bir temizleme dalının önüne koruma koymaya gerek yoktur.

### Arama

Benzer belgeler için semantik arama.

| Alan | Zorunlu | Açıklama |
|-------|----------|-------------|
| `queryText` | evet | Arama sorgusu |
| `searchLimit` | hayır | Maksimum sonuç (varsayılan: 5) |
| `metadataFilters` | hayır | Metadata'ya göre filtrele (tam eşleşme JSON nesnesi, değerler ifadeleri destekler) |
| `hybridSearch` | hayır | Vektör benzerliğini BM25 anahtar kelime eşleşmesiyle birleştir (bkz. [Hibrit arama](#hibrit-arama)) |
| `enableReranker` | hayır | Daha iyi alaka için Cohere yeniden sıralamayı etkinleştir |
| `rerankerCredentialId` | yeniden sıralama yapılırken | Cohere kimlik bilgisi |
| `rerankerTopN` | hayır | Yeniden sıralamadan sonra nihai sonuç sayısı |

**Çıktı:** `$nodeLabel.results` – `{ id, text, score, metadata }` dizisi

Yeniden sıralama etkinleştirildiğinde:

- `$nodeLabel.reranked` `true` olur
- Her sonuç ayrıca `relevance_score` içerir
- `score` orijinal vektör benzerlik puanı olarak kalır
- `relevance_score` Cohere yeniden sıralayıcı puanıdır


#### Hibrit arama

Vektör araması, sorguyla aynı anlama sahip metinleri bulur. Yalnızca tam sözcükleri içeren metinler daha alt sıralarda yer alabilir: ürün kodu, bilet numarası, kişi adı veya `ERR-4021` gibi bir hata kodu. **Hibrit arama**'yı açtığınızda düğüm, vektör aramasının yanında bir anahtar kelime araması çalıştırır ve iki listeyi birleştirir, böylece tek bir sorgu her iki eşleşme türünü de bulur.

1. Vektör araması, hibrit arama olmadan yaptığı gibi en iyi eşleşmelerini döndürür.
2. Anahtar kelime araması, depolanan metni sorgunun sözcüklerine göre **BM25** ile puanlar; bu algoritma nadir sözcükleri, tekrarlanan sözcükleri ve daha kısa belgeleri ödüllendirir.
3. Sıralanan iki liste **reciprocal rank fusion** ile birleştirilir. Her iki listenin de üst sıralarında yer alan bir belge birinci sıraya yerleşir ve yalnızca tek bir listenin bulduğu belge de listede yer almaya devam eder.

Metadata filtreleri her iki arama için de geçerlidir ve Cohere reranker etkinleştirildiğinde birleştirilmiş liste üzerinde çalışır.

Her sonuç her iki aramanın puanını taşır:

| Alan | Anlamı |
|------|--------|
| `score` | 0 ile 1 arasında birleştirilmiş puan. `1`, belgenin her iki aramada da birinci sırada yer aldığını gösterir. |
| `vector_score` | Vektör benzerliği (0 ile 1 arasında). Yalnızca anahtar kelime araması belgeyi bulduğunda `null`. |
| `keyword_score` | BM25 puanı. Sorgu sözcüklerinin hiçbiri belgede yer almadığında `null`. |

`$nodeLabel.hybrid`, hibrit arama çalıştırıldığında `true` olur.

Bilmenizde fayda var:

- Birleştirilmiş `score`, sonuçları birbirine göre sıralar. Bu bir vektör benzerliği değildir, dolayısıyla basit arama için ayarlanmış bir eşik doğrudan aktarılamaz.
- Sorgu sözcükleri küçük harfe dönüştürülür ve boşluklar ile noktalama işaretlerinden ayrılır; böylece `ERR-4021`, `err` ve `4021` olarak aranır. Anahtar kelime araması sorgunun ilk 16 benzersiz sözcüğüne kadarını kullanır.
- Qdrant: bir koleksiyondaki ilk hibrit arama, `text` payload alanında tam metin indeksi oluşturur; bu işlem yazma erişimine sahip bir Qdrant anahtarı gerektirir. Büyük koleksiyonlarda bu işlem yalnızca bir defalık bir an sürer; sonraki aramalar indeksi yeniden kullanır.
- Postgres (pgvector): `142_vsi_text_search_index` veritabanı geçişi tam metin indeksini ekler. Güncellemeden sonra `alembic upgrade head` komutunu çalıştırın. Hibrit arama indeks olmadan da çalışır, ancak büyük store'larda daha yavaştır.
- Her sorgu için anahtar kelime araması, en yüksek ağırlığı taşıdıkları için en nadir sorgu sözcüklerinden başlayarak en fazla 200 eşleşen belgeyi okur.
## Sonuçlara Erişim

- `$ragNode.results.first().text` – en iyi sonuç içeriği
- `$ragNode.results.first().score` – benzerlik puanı (0–1), veya hibrit arama ile birleştirilmiş puan
- `$ragNode.results.first().keyword_score` – BM25 puanı (hibrit arama)
- `$ragNode.results.first().vector_score` – vektör benzerliği (hibrit arama)
- `$ragNode.results.first().metadata.source` – en iyi sonuç metadata'sı
- `$ragNode.results.map("item.text").join("\n\n")` – LLM bağlamı için birleştir
- `$ragNode.reranked` – yeniden sıralamanın uygulanıp uygulanmadığı
- `$ragNode.hybrid` – hibrit aramanın uygulanıp uygulanmadığı
- `$ragNode.count` – döndürülen sonuç sayısı
- `$ragNode.replaced` – bir upsert'ün mevcut bir belgeyi değiştirip değiştirmediği
- `$ragNode.deleted` – bir silmenin herhangi bir şeyi kaldırıp kaldırmadığı

## Örnek – Arama

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Örnek – Hibrit arama

```json
{
  "type": "rag",
  "data": {
    "label": "findTicket",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "hybridSearch": true
  }
}
```

## Örnek – Ekleme

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Örnek – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Örnek – Silme

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## İlgili

- [Neden Heym](../getting-started/why-heym.md) – Agent çalışma zamanının bir parçası olarak yerleşik RAG
- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Vectorstores Sekmesi](../tabs/vectorstores-tab.md) – Vektör depoları oluşturun ve yönetin
- [Üçüncü Taraf Entegrasyonları](../reference/integrations.md#qdrant) – Qdrant ve Postgres (pgvector) kimlik bilgisi kurulumu
- [Agent Düğümü](./agent-node.md) – RAG sonuçlarını agent bağlamı olarak kullanın
- [LLM Düğümü](./llm-node.md) – RAG sonuçlarını LLM sistem prompt'una besleyin
