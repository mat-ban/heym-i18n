# İfade Değerlendirme İletişim Kutusu

İfade Değerlendirme Diyaloğu, ifade yeteneğine sahip alanlar için genişletilmiş düzenleyicidir. Bir ifade girişinin yanındaki genişlet düğmesinden açılır ve size tek bir yerde daha geniş bir çalışma alanı, otomatik tamamlama, canlı arka uç önizlemesi ve çıktı tarama olanağı sunar.

## Diyaloğu Açma

- Özellikler panelindeki bir ifade alanının yanındaki genişlet düğmesine tıklayın.
- Çok satırlı alanlar düğmeyi girişin içinde gösterir.
- Tek satırlı alanlar düğmeyi girişin sağında gösterir.

## Diyalog Düzeni

- Diyalog, yaklaşık **80vw × 80vh** boyutunda ortalanmış bir modal olarak açılır.
- Alan etiketi bilindiğinde başlık **Değerlendir — {alan adı}** şeklinde görünür.
- Düzenleyici otomatik tamamlamayı, alandan alana gezinmeyi ve olağan **Uygula** / **İptal** eylemlerini korur.
- Önizleme, yazmayı bıraktıktan yaklaşık **300 ms** sonra otomatik olarak yenilenir.
- Geçerli metni alana geri uygulamak ve diyaloğu kapatmak için `Ctrl` / `Cmd` + `Enter` tuşlarına basın (**Uygula** ile aynıdır).

## Çıktı Bölümü

Çıktı alanı, düzenleyicide yazmayı duraklattıktan sonra otomatik olarak yenilenir.

### Değerlendirme

| İfade türü | Sonuç |
|---|---|
| Tek `$expr` (tüm alan) | Yerel değer korunur |
| Tek çıplak nokta yolu (tüm alan, `$` yok, gömülü yeni satır yok) | `$` + o yol ile aynıdır (arka uç değerlendirme için normalleştirir) |
| Gömülü `$refs` içeren metin | Nihai sonuç her zaman bir dizedir |
| Düz metin (`$` yok, tek nokta yolu değil) | Olduğu gibi döndürülür |

**Örnekler**

| Giriş | Sonuç |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (tüm değer bu yol olduğunda `$input.items` ile aynıdır) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Değerlendirme bağlamı şu sırayla oluşturulur:

- Yukarı akış düğümlerindeki **Sabitlenmiş veriler**
- Tuvalden alınan **Son çalıştırma çıktıları**
- Yukarı akış verisi mevcut olmadığında `null`

Geçerli düğümün yukarı akış bağımlılıkları varsa ancak hiçbirinde sabitlenmiş veri veya son çalıştırma sonucu yoksa, diyalog önce bağlam oluşturmak için bir test çalıştırması gerçekleştirir ve ardından geçerli metni değerlendirir.

### Çıktı Yolu Seçici

Arka uç sonucu bir nesne veya dizi olduğunda, Çıktı alanı ham JSON yerine etkileşimli bir yol seçici gösterebilir.

- O yolu geçerli `$node.path` referansına eklemek için bir satıra çift tıklayın.
- Dalları açmak veya kapatmak için genişletilebilir satırlara tek tıklayın.
- Anahtarları, değerleri ve yol dizelerini aramak için yerleşik sorgu kutusunu kullanın.

## Otomatik Tamamlama

- Yukarı akış düğümleri, yerleşikler ve yöntemler için önerileri açmak üzere `$` yazın.
- Seçili öneriyi eklemek için `Tab` veya `Enter` tuşlarına basın.
- Öneri listesinde gezinmek için `↑` / `↓` tuşlarını kullanın.

### Örnek Yanıtlar

Bir `$…` referansını nokta ile sürdürdüğünüzde, her öneri satırı o önerinin üreteceği yanıtı satırın sağında kalın olarak gösterir.

- `$set.listItems.first().toString().u` yazmak `upper`, `urlEncode`, `urlDecode` ve `unescape` öğelerini listeler; her biri değerlendirilmiş sonucuyla birlikte — böylece ada göre değil sonuca göre seçim yapabilirsiniz.
- `$node.text.toJson()` yazmak bir JSON dizesini nesne veya diziye ayrıştırır. `.toJson()` sonrasında, son çalıştırma veya sabitlenmiş çıktı mevcut olduğunda otomatik tamamlama ayrıştırılmış anahtarları (örneğin `repoUrl`) sunabilir.
- Sonuçlar, diyalog önizlemesinin kullandığı aynı sabitlenmiş verilere ve son çalıştırma çıktılarına karşı arka uçta değerlendirilir; böylece alanın üreteceği sonuçla eşleşirler.
- Yalnızca kendi başına duran öneriler değerlendirilir: sıfır argümanlı yöntemler (`upper()`, `first()`, `keys()`, `toJson()`) ve düz özellikler (`length`, `year`). Önce argüman gerektiren öneriler — `map`, `filter`, `sort`, `replace` — boş bırakılır.
- Aday bir yanıt üretmediğinde satır boş kalır: bir hata, bir `null` veya o değere uygulanmayan bir yöntem.
- Yanıtlar tek satıra kısaltılır. Kısaltılmış bir yanıtın daha fazlasını görmek için üzerine gelin.

## AI ile Oluştur

**AI ile Oluştur** düğmesi, bir workflow yüklendiğinde değerlendirme diyaloğunun sağ üst köşesinde görünür. İstediğiniz ifadeyi düz metinle tanımlayabileceğiniz ve bir LLM'in bunu sizin için oluşturmasını sağlayabileceğiniz iç içe bir modal açar.

### Nasıl çalışır

1. Değerlendirme diyaloğu araç çubuğunda **AI ile Oluştur** seçeneğine tıklayın.
2. Açılır menülerden bir LLM kimlik bilgisi ve model seçin.
3. İstediğinizin düz metin açıklamasını yazın — örneğin, *"API yanıtından müşteri adını al"*.
4. **Oluştur** seçeneğine tıklayın. Modal, [İfade DSL](./expression-dsl.md) sistem promptunu ve son workflow çalıştırma çıktılarınızı bağlam olarak kullanan arka ucu çağırır ve tek bir ifade dizesi döndürür.
5. Oluşturulan ifade, uygulamadan önce sonucu görebilmeniz için aynı tuval verilerine karşı hemen değerlendirilir.
6. Düzenleyici içeriğini oluşturulan ifadeyle değiştirmek için **Uygula** veya yeniden denemek için **Yeniden Oluştur** seçeneğine tıklayın.

### Kullanılan bağlam

Oluşturucu, tuvaldeki son test çalıştırmasından düğüm çıktılarını alır. Workflow henüz çalıştırılmadıysa, LLM düğüm etiketlerine ve DSL kurallarına dayalı olarak en iyi çaba ifadesini oluşturur.

### Gereksinimler

- [Kimlik Bilgileri](./credentials.md) sekmesinde bir LLM kimlik bilgisi (OpenAI, Google veya Özel) yapılandırılmış olmalıdır.
- Workflow düzenleyicide açık olmalıdır.

## Klavye Kısayolları

| Kısayol | Eylem |
|---|---|
| Yazma duraklaması (~300 ms) | Arka uç önizlemesini yenile |
| `Ctrl` / `Cmd` + `Enter` | Uygula ve diyaloğu kapat |
| `Escape` | Önce otomatik tamamlamayı kapat, aksi takdirde diyaloğu kapat |
## Metot Argümanlarında İç İçe `$` Kullanımı

Dialog / backend değerlendirmesi için, dinamik bir anahtara ihtiyaç duyduğunuzda `.get($other.field)` gibi çağrıların içine iç içe `$` barındıran başka bir referans geçirebilirsiniz. Ayrıca `.get(...)` içinde çıplak bir yol da kullanabilirsiniz (örneğin `other.field`); backend bunu aynı şekilde çözer. Kaydedilen workflow alanları yine de [Expression DSL](./expression-dsl.md) kurallarına uymalıdır; evaluate API'si kolaylık sağlamak amacıyla tam satır çıplak nokta yolunu da kabul eder (yukarıdaki tabloya bakın).

## Gezinme

Set ve Execute eşleme editörleri, dialog'u kapatmadan alanlar arasında geçiş yapabilmeniz için **Prev** / **Next** düğmelerini gösterebilir.

## İlgili

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — Build with AI özelliği için gereklidir
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
