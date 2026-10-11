# Dönüştürücü

**Dönüştürücü** düğümü, kod yazmadan verileri ve dosyaları formatlar arasında dönüştürür. Teknoloji bağımsızdır, bu nedenle zaman içinde daha fazla format eklenebilir. CSV, JSON ve XML verilerini her iki yönde dönüştürür, görsellerden ve PDF'lerden metin çıkarmak için Tesseract OCR çalıştırır ve depolanan bir dosyayı başka bir formatta yeniden yazar.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.result` (`csvToJson` / `xmlToJson` için ayrıştırılmış veri, `jsonToCsv` / `jsonToXml` için metin, `imageToText` / `pdfToText` için çıkarılan metin, `fileConvert` için yeni dosya meta verileri) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `conversion` | string | `csvToJson` (CSV metni → satır nesneleri dizisi), `jsonToCsv` (nesne/satır dizisi → CSV metni), `xmlToJson` (XML metni → nesne), `jsonToXml` (nesne → XML metni), `imageToText` (bir görselde OCR), `pdfToText` (seçilen her PDF sayfasında OCR) veya `fileConvert` (depolanan bir dosyayı başka bir formatta yeniden yazar) |
| `source` | expression | Dönüştürülecek veri. Düğümün ilk girişini kullanmak için boş bırakın |
| `delimiter` | string | Tek karakterli alan ayırıcı (varsayılan `,`) |
| `hasHeader` | boolean | Yalnızca `csvToJson` — ilk satırı başlık olarak değerlendir (varsayılan `true`) |
| `trimValues` | boolean | Yalnızca `csvToJson` — başlık adları ve hücre değerlerinin çevresindeki boşlukları kaldır (varsayılan `true`) |
| `includeHeader` | boolean | Yalnızca `jsonToCsv` — bir başlık satırı yaz (varsayılan `true`) |
| `converterColumns` | string | Yalnızca `jsonToCsv` — isteğe bağlı virgülle ayrılmış sütun sırası |
| `converterFileId` | expression | Dosya dönüşümleri — okunacak Heym Drive dosyası, örn. `$Upload.file.id` |
| `converterTargetFormat` | string | Yalnızca `fileConvert` — çıkış formatı (`pdf`, `docx`, `html`, `md`, `txt`, `csv`, `epub`, `jpg`, `png`, `bmp`, `webp`) |
| `ocrLanguage` | string | Yalnızca OCR — `auto` (varsayılan), `tur` gibi bir Tesseract kodu veya `custom` |
| `ocrLanguageCustom` | string | Yalnızca OCR — `ocrLanguage` değeri `custom` olduğunda kullanılan dil kodları, örn. `eng+tur` |
| `ocrEncoding` | string | Yalnızca OCR — metnin normalize edildiği karakter kümesi (varsayılan `utf-8`) |
| `ocrNormalizeUnicode` | boolean | Yalnızca OCR — NFC normalizasyonu uygula (varsayılan `true`) |
| `ocrPsm` | string | Yalnızca OCR — Tesseract sayfa bölümleme modu (varsayılan `3`) |
| `ocrDpi` | number | Yalnızca `pdfToText` — sayfa rasterleştirme DPI değeri (varsayılan `300`) |
| `ocrPageRange` | expression | Yalnızca `pdfToText` — `3` veya `2-5`. Boş, her sayfa anlamına gelir |

## Davranış

- **`csvToJson`** kaynak CSV metnini ayrıştırır. `hasHeader: true` ile her satır, başlık değerleriyle anahtarlanan bir nesneye dönüşür; `hasHeader: false` ile her satır bir hücre değerleri dizisine dönüşür. Tırnak içine alınmış alanlar, gömülü ayırıcılar ve gömülü yeni satırlar RFC 4180'e göre işlenir. Baştaki UTF-8 BOM (Excel dışa aktarımlarında yaygın) kaldırılır ve yinelenen başlık adları, gerçek bir sütunun üzerine yazılmadan benzersiz hale getirilir (`a, a, a_2` → `a`, `a_3`, `a_2`). Sekmeyle ayrılmış değerleri ayrıştırmak için `delimiter` değerini `\t` olarak ayarlayın.
- **`trimValues`** (varsayılan `true`) başlık adları ve hücre değerlerinin çevresindeki boşlukları **tırnak içine alınmış alanlar dahil** kaldırır (`" padded "` → `padded`). RFC 4180, tırnak içine alınmış boşluğu veri olarak değerlendirir, bu nedenle tam olarak korumak için `trimValues: false` ayarlayın.
- **`jsonToCsv`** bir nesne (veya dizi) dizisinden CSV metni oluşturur. Sütun sırası, sağlandığında `converterColumns` değerinden alınır, aksi takdirde ilk nesnenin anahtarlarından çıkarılır. Ayırıcı, tırnak veya yeni satır içeren değerler otomatik olarak tırnak içine alınır.
- **`xmlToJson`** XML'i bir nesneye ayrıştırır. Nitelikler `@` öneklerini kullanır ve niteliklerle karışık metin `#text` kullanır; yinelenen kardeş öğeler dizilere dönüşür. XML varlık genişletmesi devre dışıdır.
- **`jsonToXml`** bir nesneyi bir XML belgesine serileştirir. Nesnenin tam olarak bir üst düzey anahtarı olmalıdır; bu anahtar XML kök öğesi olur. Alt öğelerin yanı sıra nitelikler ve metin üretmek için `xmlToJson` ile aynı `@attribute` ve `#text` kuralını kullanın.
- **`imageToText`** tek bir görsel (PNG, JPEG, TIFF, WebP, BMP) üzerinde Tesseract çalıştırır.
- **`pdfToText`** seçilen her sayfayı `ocrDpi` değerinde rasterleştirir ve tanır. Her sayfa OCR'dan geçer, bu nedenle mükemmel bir metin katmanına sahip dijital bir PDF bile piksellerden yeniden okunur. Bu, taranmış ve dijital belgelerin aynı şekilde davranmasını sağlar, ancak hız pahasına; bu nedenle uzun dosyalarda `ocrPageRange` değerini daraltın.
- **`fileConvert`** kaynak dosyayı başka bir formatta yeniden yazar ve sonucu **yeni** bir Drive dosyası olarak depolar. Orijinal asla değiştirilmez. Belgeler pandoc'tan, görseller Pillow'dan ve JSON'dan CSV'ye dönüşüm Python csv yazıcısından geçer. Bir görsel belgeye dönüşemez ve bir belge görsele dönüşemez; bir görselden metin okumak için `imageToText` kullanın.

## Dosyayı içeri alma

Dosya dönüşümleri bir yoldan veya URL'den değil, Heym Drive'dan okur, bu nedenle dosyanın önce depolanması gerekir. Üç yaygın zincir:

- **[Dosya yükleme trigger'ı](./file-upload-trigger-node.md) → Dönüştürücü** — `converterFileId` değerini `$Upload.file.id` olarak işaret edin.
- **[Drive](./drive-node.md) (`downloadUrl`) → Dönüştürücü** — uzak bir dosyayı Drive'a getirin, ardından `$Download.id` değerini geçirin.
- **[Agent](./agent-node.md) → Dönüştürücü** — bir dosya yazan bir skill, onu `$reportAgent._generated_files[0].id` olarak sunar.

`converterFileId` ayrıca tam bir dosya nesnesini (`$Upload.file`) veya bir Heym indirme URL'sini kabul eder; dosya id'si her ikisinden de çıkarılır. Dosya, size ait olan veya bir ekip arkadaşınızın sizinle paylaştığı bir dosya olmalıdır.
## Diller

`auto` (varsayılan) önce Tesseract'ın yönelim ve yazı sistemi algılamasını çalıştırır, ardından algılanan yazı sistemi için yüklü en iyi modeli seçer. `Latin` veya `Cyrillic` gibi yazı sistemi modelleri, o yazı sisteminde yazılan her dili okur; bu nedenle auto, hangisinin hangisi olduğu belirtilmeden bir Türkçe faturayı ve bir İngilizce faturayı işleyebilir.

Dili bildiğinizde adını belirtmek yine de daha doğrudur. Tek bir kod (`tur`) kullanın veya karışık belgeler için birkaçını `+` ile birleştirin (`eng+tur`) — daha fazla dil daha yavaş ve biraz daha gürültülü tanıma anlamına gelir, bu nedenle listeyi kısa tutun. Kodlar yalnızca eşleşen dil verisi backend'de yüklü olduğunda çalışır; eksik bir dil seçtiğinizde düğüm mevcut olanları listeler.

Her Heym image'ı `osd`, İngilizce, Türkçe, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Hollandaca, Rusça, Arapça, Basitleştirilmiş Çince, Japonca, Korece ve Latin, Cyrillic, Arabic, HanS, Japanese ve Hangul yazı sistemi modellerini içerir.

## Kodlama

Tanınan metin UTF-8'dir ve Tesseract'ın ürettiği her karakteri korur. `ocrNormalizeUnicode` (varsayılan olarak açık) NFC normalizasyonu uygular, böylece `s` artı bir birleştirici çengel olarak yazılan bir harf tek bir `ş` haline gelir — açık bırakmaya değer, çünkü iki biçim karşılaştırmalarda veya veritabanı aramalarında eşit değildir.

`ocrEncoding` yalnızca alt sistemlerden biri tam Unicode aralığını saklayamadığında önemlidir. `cp1254` veya `iso-8859-9` seçmek Türkçe metni bozulmadan korurken sonucun o karakter setine sığmasını garanti eder; `latin-1` ve `ascii` daha dardır ve temsil edemediklerini `?` ile değiştirir. Hedef sistem sizi zorlamadıkça `utf-8` olarak bırakın.

## Çıktı

`csvToJson`, `jsonToCsv`, `xmlToJson` ve `jsonToXml` `$label.result` ve `$label.conversion` döndürür. OCR dönüşümleri şunları ekler:

| Alan | Açıklama |
|-------|-------------|
| `$label.result` | Boş bir satırla birleştirilmiş sayfalarla tam çıkarılan metin |
| `$label.language` | Gerçekte çalışan model (`auto`'nun ne seçtiğini görmek için kullanışlıdır) |
| `$label.encoding` | Metnin normalize edildiği karakter seti |
| `$label.page_count` | Tanınan sayfa sayısı |
| `$label.pages` | Sayfa başına işleme için `{ page, text }` dizisi |
| `$label.file` | Kaynak dosyanın `{ id, filename, mime_type, size_bytes }` bilgisi |

`fileConvert` bunun yerine yeni dosyayı döndürür:

| Alan | Açıklama |
|-------|-------------|
| `$label.id` | Yeni saklanan dosyanın UUID'si |
| `$label.filename` | Dönüştürülmüş dosya adı, temel ad korunur ve uzantı değiştirilir |
| `$label.mime_type` | Yeni dosyanın MIME türü |
| `$label.size_bytes` | Yeni dosyanın boyutu |
| `$label.download_url` | Yeni dosya için Drive indirme URL'si |
| `$label.source_file` | Dönüştürülen dosyanın meta verileri |

## Örnek

```json
{
  "type": "converter",
  "data": {
    "label": "toRows",
    "conversion": "csvToJson",
    "source": "$userInput.body.text",
    "delimiter": ",",
    "hasHeader": true
  }
}
```

`name,age\nAda,36` girdisi için, alt düğümler ayrıştırılmış satırlara `$toRows.result` aracılığıyla erişir (`[{ "name": "Ada", "age": "36" }]`).

XML'i JSON'a dönüştürme:

```json
{
  "type": "converter",
  "data": {
    "label": "xmlToObject",
    "conversion": "xmlToJson",
    "source": "$webhook.body"
  }
}
```

`<person id="1"><name>Ada</name></person>` için, `$xmlToObject.result` şudur: `{ "person": { "@id": "1", "name": "Ada" } }`. XML oluşturmak için, bu nesneyi `conversion: "jsonToXml"` ile ikinci bir Converter düğümüne geçirin.

Bir dosya yükleme trigger'ı aracılığıyla yüklenen taranmış bir faturayı okuma:

```json
{
  "type": "converter",
  "data": {
    "label": "readInvoice",
    "conversion": "pdfToText",
    "converterFileId": "$Upload.file.id",
    "ocrLanguage": "tur",
    "ocrEncoding": "utf-8",
    "ocrDpi": 300,
    "ocrPageRange": "1-3"
  }
}
```

Alt taraftaki bir [Agent](./agent-node.md) veya [LLM](./llm-node.md) düğümü daha sonra `$readInvoice.result` içinden yapılandırılmış alanları çıkarabilir.

Bir agent'ın markdown raporunu PDF'e dönüştürme:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Alt düğümler PDF'i paylaşmak için `$convertDoc.download_url` okur veya [Drive](./drive-node.md) içinde onunla çalışmaya devam etmek için `$convertDoc.id` okur.

## Gereksinimler

OCR, `tesseract` ve poppler'in `pdftoppm`'ine shell üzerinden çağrı yapar ve belge dönüştürme pandoc kullanır. Üçü de `run.sh`, docker-compose ve tek sürüm image'ı dahil olmak üzere Heym'i çalıştırmanın her yolu ile birlikte gelir, bu nedenle yapılandırılacak bir şey yoktur. Sayfa sınırları, zaman aşımları ve maksimum DPI, ayar değil sabit platform değerleridir.

## İlgili

- [Set](./set-node.md) – Tek tek alanları dönüştürün ve eşleyin
- [JSON output mapper](./json-output-mapper-node.md) – Bir JSON yanıt nesnesi oluşturun
- [File upload trigger](./file-upload-trigger-node.md) – Heym Drive'a bir dosya kabul edin
- [Drive](./drive-node.md) – Dosyaları saklayın, getirin ve paylaşın
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Expression DSL](../reference/expression-dsl.md) – Fonksiyonlar ve sözdizimi
