# DataTable

**DataTable** sekmesi, Heym içinde doğrudan yapılandırılmış veri tabloları oluşturmanıza ve yönetmenize olanak tanır. Tablolar, programatik CRUD işlemleri için [DataTable node](../nodes/datatable-node.md) aracılığıyla workflow'larda kullanılabilir.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ DataTable demosunu izleyin</a></p>

## Tablo Oluşturma

1. Dashboard'dan DataTable sekmesine gidin
2. **Create DataTable** seçeneğine tıklayın
3. Bir ad ve isteğe bağlı açıklama girin
4. Sütun düzenleyici ile sütunlar ekleyin

## Sütunlar

Her sütun şunlara sahiptir:

| Özellik | Açıklama |
|----------|-------------|
| Name | Sütun görünen adı |
| Type | `string`, `number`, `boolean`, `date` veya `json` |
| Required | Yeni satırların bu sütunu içermesi gerekip gerekmediği |
| Unique | Değerlerin satırlar arasında benzersiz olması gerekip gerekmediği |
| Default Value | Bir satır bu sütunu atladığında otomatik doldurulur |

Tablo detay görünümü başlığından sütun ekleyin, düzenleyin veya kaldırın.

## AI ile Sütun Oluşturma

Sütunları elle eklemek yerine, tabloyu düz bir dille tanımlayabilir (veya örnek JSON yapıştırabilir) ve bir LLM'in şemayı önermesini sağlayabilirsiniz. Her iki giriş noktası da aynı iletişim kutusunu açar:

- **Generate with AI** (DataTable liste başlığı) — açıklamanızdan yepyeni bir tablo oluşturur.
- **AI columns** (tablo detay görünümü, sütun kontrollerinin yanında) — açık olan tabloya eklenecek *yeni* sütunlar önerir.

### Nasıl çalışır

1. Bir **LLM credential** ve **model** seçin (varsayılan olarak ilk LLM credential'ınız ve en son modeli).
2. Bir açıklama yazın — örneğin *"Başlık, yazar, sayfa sayısı ve okuyup okumadığım bilgilerini içeren bir kitap tablosu"* — veya bir JSON örneği/şeması yapıştırın.
3. **Generate** seçeneğine tıklayın. Model önerilen bir şema döndürür.
4. Oluşturulan sütunları düzenlenebilir bir formda inceleyin: her biri için **name**, **type**, **default**, **unique** ve **notEmpty** (required) değerlerini değiştirin, istenmeyen sütunları silin veya elle **Add column** yapın. Yeni bir tablo için AI tarafından önerilen **name** ve **description** değerlerini de düzenleyebilirsiniz.
5. Kaydetmek için **Create Table** (yeni tablo) veya **Add Columns** (mevcut tablo) seçeneğine tıklayın. İletişim kutusunu istediğiniz zaman kapatmak için **Esc** tuşuna basın.

### Mevcut tablolar için yalnızca ekleme

Mevcut bir tablo için sütun oluştururken, model mevcut sütunlarınızı bağlam olarak görür ve **yalnızca yeni** sütunlar önerir. Mevcut sütunlar ve verileri hiçbir zaman değiştirilmez veya kaldırılmaz — oluşturulan sütunlar sona eklenir. Yinelenen adlar (büyük/küçük harf duyarsız) otomatik olarak çıkarılır.

> Bir LLM credential (OpenAI, Google veya Custom) gereklidir. Hiç yoksa, önce Settings'ten bir tane ekleyin.

## Satırları Yönetme

- **Add row**: Yeni bir satır oluşturmak için ekle düğmesine tıklayın
- **Inline edit**: Herhangi bir hücreyi düzenlemek için çift tıklayın. Kaydetmek için Enter'a basın veya dışına tıklayın, iptal etmek için Escape'e basın
- **Delete row**: Bir satırı kaldırmak için satır eylem menüsünü kullanın
- **Pagination**: Satırlar sayfa başına 25 adet olarak sayfa gezinmeyle görüntülenir

## CSV İçe/Dışa Aktarma

### İçe Aktarma
1. Tablo detay görünümünde **Import CSV** seçeneğine tıklayın
2. Yüklemek için bir CSV dosyası seçin
3. İlk 5 satırı ve sütun eşlemesini önizleyin
4. Yeşil sütunlar mevcut tablo sütunlarıyla eşleşir; sarı olanlar eşleşmez
5. Satırları toplu eklemek için Import'a tıklayın

### Dışa Aktarma
Tüm satırları CSV dosyası olarak indirmek için **Export CSV** seçeneğine tıklayın.

## Paylaşma

Tabloları diğer kullanıcılarla veya takımlarla paylaşın:

1. Tablo detay görünümünden paylaşma iletişim kutusunu açın
2. **read** veya **write** izniyle e-posta ile kullanıcı ekleyin
3. **read** veya **write** izniyle takım ekleyin
4. Yalnızca okuma izinli kullanıcılar verileri görüntüleyebilir; yazma izinli kullanıcılar satırları ve sütunları değiştirebilir. Tabloyu yeniden adlandırma, açıklamasını değiştirme ve paylaşımları yönetme işlemleri yalnızca sahibe özel kalır.

## AI Assistant'tan Tablo Oluşturma

Canvas'taki [AI Asistanı](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) ve [MCP sekmesindeki](./mcp-tab.md) `heym_chat` aracı, oluşturdukları bir workflow için tablolarınızdan birini seçebilir veya yeni bir tane oluşturabilir. Bir ad ve sütunlar önerirler ve soru kartını gönderdiğinizde tabloyu oluştururlar. Canvas asistanı, workflow düğümlerini tablo meta verilerinden yapılandırır. Chat ve `heym_chat` ayrıca satırları inceleyebilir, sütun ekleyip kaldırabilir ve doğrudan satır ekleyebilir, güncelleyebilir veya silebilir. Onlara bir tablo adı veya bu sekmenin bağlantısını verin. Yazma işlemleri sahiplik veya doğrudan/ekip **yazma** erişimi gerektirir. Sütun ekleme mevcut verileri korur; sütunları kaldırma değerlerini her satırdan siler. Sütunların kaldırılması ve tüm satırların temizlenmesi, bu sekmeyle eşleşen şekilde onay ister.

## Workflow'larda Kullanma

[DataTable node](../nodes/datatable-node.md) tabloları workflow'lara bağlar. İşlemler arasında find, getAll, getById, insert, update, remove ve upsert bulunur. Hiçbir credential gerekmez.

## LLM Cost Table (sistem tablosu)

Kullanıcı tarafından oluşturulan tablolarınızın üzerinde, tek bir girdi içeren sabitlenmiş bir **System tables** bölümü görünür: **LLM Cost Table**. Bu, [Traces](./traces-tab.md) maliyet grafikleri tarafından kullanılan model başına fiyatlandırmanın sabit şemalı, kullanıcı başına düzenlenebilir görünümüdür.

### Veriler nereden gelir

Heym, Helicone'un genel fiyatlandırma endpoint'inden (`https://www.helicone.ai/api/llm-costs`) beslenen model başına fiyatlandırmaya ait global bir tablo tutar. Senkronizasyon, tabloyu veya Traces'i ilk açtığınızda arka planda çalışır ve 24 saatte bir getirme ile sınırlandırılır. Hemen yeniden senkronize etmek için **Refresh** seçeneğine basın. Helicone'un üst kaynak listesinden kaldırdığı kayıtlar yerel olarak silinmez, böylece geçmiş maliyet aramaları kararlı kalır.

### Şema (salt okunur sütunlar)

| Sütun | Anlam |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (bilgilendirici, Helicone tarafından kullanılır) |
| Model | `trace.model` ile eşleştirilen model tanımlayıcısı |
| Op | Eşleştirme operatörü: `equals`, `startsWith` veya `includes` |
| Input $/1M | 1 milyon prompt token başına USD |
| Output $/1M | 1 milyon completion token başına USD |
| Source | `helicone`, `seed` veya `user` |

### Fiyatlandırmayı özelleştirme

- **Bir satırı düzenleyin** ve fiyatlarını geçersiz kılın. Geçersiz kılmanız kullanıcı bazlıdır ve `Customized` rozetiyle işaretlenir; gelecekteki Helicone senkronizasyonları bu satıra dokunmaz.
- **Varsayılana sıfırla** seçeneği geçersiz kılmayı kaldırır ve o satır için genel değeri geri yükler.
- **Add Custom Model** seçeneği, yalnızca kullanıcıya özel bir satır oluşturmak için bir iletişim kutusu açar (örneğin, Helicone'un listelemediği özel bir fine-tuned model). Özel satırlar `User added` olarak işaretlenir ve silindiğinde tamamen kaldırılır.

### Trace'lerle eşleştirme

Traces dashboard'u maliyeti hesaplarken her `trace.model` değerini şu sırayla eşleştirir:

1. Önce sizin geçersiz kılmalarınız (model adı üzerinde tam eşleşme)
2. Aksi halde genel tablo — `equals` tam eşleşmesi `startsWith`/`includes` seçeneklerine göre önceliklidir; aynı operatör içindeki eşitlikler, en uzun eşleşen model öneki/alt dizesiyle çözülür

Hiçbir satır eşleşmezse, model Traces sayfasındaki **Unpriced models** bildirimi altında listelenir; özel bir satır ekleyene veya bir satırı geçersiz kılana kadar maliyet katkısı sıfırdır.

## İlgili

- [DataTable Node](../nodes/datatable-node.md) - Workflow node referansı
- [Traces Tab](./traces-tab.md) - Maliyet donut'u ve KPI kartları için LLM Cost Table'ı kullanır
- [Grist Node](../nodes/grist-node.md) - Harici elektronik tablo alternatifi
- [Variables Tab](./global-variables-tab.md) - Anahtar-değer depolama alternatifi