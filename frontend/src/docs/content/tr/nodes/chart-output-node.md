# Grafik Çıkışı

**Chart Output** düğümü, bir [dashboard widget](../tabs/dashboard-tab.md) workflow'unun terminal düğümüdür. Yukarı akış düğümleri tarafından üretilen satırları alır ve dashboard'un oluşturduğu standartlaştırılmış bir chart payload'ına dönüştürür.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 0 (terminal) |
| Çıkış | Standartlaştırılmış chart payload |

Bu düğümü bir dashboard-widget workflow'unda **en sona** yerleştirin. Kendisinden önceki düğüm, bir satır nesneleri dizisi üretmelidir, örneğin:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Yalnızca örnek/numune veriniz olduğunda (gerçek bir kaynak olmadan), bu satırları bir **Set** düğümü ile `$array(dict(...), dict(...))` kullanarak üretin — örneğin `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. `${...}` veya çıplak `{...}` nesne değişmezlerini **kullanmayın**; Heym nesneleri yalnızca `dict(key=value)` ile oluşturur.

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` veya `hitl` |
| `orientation` | string | `vertical` veya `horizontal` (yalnızca bar chart'lar için) |
| `dataPath` | string | Yukarı akış çıktısı içindeki satırlar dizisine giden nokta yolu (örn. `data` veya `result.items`). Otomatik algılama için boş bırakın. |
| `labelField` | string | Kategori etiketi olarak kullanılan satır anahtarı (pie/bar/line) |
| `valueField` | string | Sayısal değer olarak kullanılan satır anahtarı (pie/bar/line/numeric/gauge) |
| `series` | array | Bar/line için isteğe bağlı çoklu seri tanımı `[{ "name": "Sent", "field": "sent" }]` (`valueField`'i geçersiz kılar) |
| `columns` | array | `table` için isteğe bağlı sütun listesi (varsayılan olarak ilk satırın anahtarları) |
| `statusColumn` | string | Renkli [durum çipleri](#status-chips) olarak oluşturulan isteğe bağlı `table` sütunu. Gösterilen sütunlardan biri olmalıdır. |, `linkColumn` ile birlikte bağlantı sütununu ve düğme metnini de taşır.
| `statusTones` | object | Varsayılanların kapsamadığı değerler için bir durum değerinden bir tona (`success`, `attention`, `failure`, `waiting`, `neutral`) isteğe bağlı eşleme |
| `linkColumn` | string | Hücreleri bir URL içeren ve yeni sekmede açan bir [bağlantı düğmesi](#link-buttons) olarak gösterilen isteğe bağlı `table` sütunu. Gösterilen sütunlardan biri olmalıdır. |
| `linkLabel` | string | Bağlantı düğmesinin isteğe bağlı metni. Boş bırakılırsa düğme yalnızca bir bağlantı simgesi gösterir. |
| `xField` / `yField` | string | X ve Y sayısal eksenleri için satır anahtarları (scatter) |
| `min` / `max` | number | `gauge` için sayısal aralık (varsayılan `0` / `100`) |
| `unit` | string | Bir `numeric` veya `gauge` değerinin yanında gösterilen isteğe bağlı birim |
| `text` | string | `text` chart türü için Markdown mesajı. Statik bir mesaj için boş bırakın ve yukarı akış verisinden çekilen dinamik bir mesaj oluşturmak için `valueField` ayarlayın. |
| `title` | string | İsteğe bağlı chart başlığı |
| `hitlWorkflowId` | string | Yalnızca `hitl`. Yalnızca bu Workflow'un incelemelerini gösterir. Boş bırakılırsa widget tüm incelemeleri gösterir. |
| `hitlNodeId` | string | Yalnızca `hitl`. `hitlWorkflowId` değerini tek bir adıma daraltır: insan incelemeli bir Agent veya bir Slack onay, düğme ya da form adımı. |

## Chart türleri

- **bar / line / area / pie** — `labelField` + `valueField` (veya çoklu seri bar/line/area için `series`) tarafından yönlendirilen kategorik chart'lar. `area` doldurulmuş bir trend chart'ıdır.
- **table** — `columns` kullanılarak kaydırılabilir bir tablo olarak oluşturulan ham satırlar. Bir sütun [durum çipleri](#status-chips) olarak oluşturulabilir ve satırlar bir [ayrıntı sayfası](../tabs/dashboard-tab.md#detail-pages) açabilir.
- **numeric** — ilk satırdan isteğe bağlı bir `unit` ile tek bir KPI değeri.
- **gauge** — bir `min`–`max` aralığına karşı gösterilen tek bir değer (örn. bir yüzde). `valueField` kullanır.
- **scatter** — korelasyon grafikleri için `xField` ve `yField`'den X/Y noktaları.
- **proportion** — yüzde açıklamalı paylara bölünmüş tek bir yatay bar (örn. bir dil dağılımı). `labelField` + `valueField` kullanır.
- **barGauge** — kırmızıdan yeşile gradyanlı ve bir değerli, her satır için bir yatay gauge (örn. boş disk alanı). `labelField` + `valueField`, isteğe bağlı `unit` ve `max` kullanır (varsayılan olarak en büyük satır değeri).
- **text** — bir markdown mesajı (örn. "Last execution at 19:47" gibi bir durum notu). Statik bir mesaj için markdown'ı `text` içine koyun veya `text`'i boş bırakın ve yukarı akışta üretilen bir string oluşturmak için `valueField` ayarlayın. Başlıkları, kalın/italik yazıyı, [listeleri](../nodes/chart-output-node.md#interactive-task-lists), bağlantıları ve satır içi kodu destekler.
- **hitl** — bekleyen insan incelemelerinizin bir carousel'i. Başlık `1/n pending` gösterir; sol ok ilk kartta, sağ ok ise son kartta devre dışıdır. Workflow adı, o çalıştırmayı canvas üzerinde açar. **Approve**, **Request changes** ve **Reject** bunu çözer ve widget başlığının yanındaki geçmiş simgesi, o çalıştırmayı aynı sayfadaki geçmiş iletişim kutusunda açar. Bu chart türü yukarı akış satırlarını yok sayar, bu nedenle widget workflow'u yalnızca Chart Output düğümüdür. Oturum açmış her kişi, sahip olduğu workflow'lardaki incelemeleri görür. Düğümün özelliklerinde veya widget'ın ayarlarında bir **Workflow** (birden fazla inceleme adımı varsa **Select agent**) seçerek, bunun yerine o Workflow'un incelemelerini onu açabilen herkese gösterebilirsiniz; bkz. [HITL widget'ları](../tabs/dashboard-tab.md#hitl-widgets).

### Etkileşimli görev listeleri

Statik `text` alanında GitHub tarzı markdown görev listesi sözdizimini kullanın:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

[Dashboard](../tabs/dashboard-tab.md) üzerinde onay kutuları tıklanabilir kontroller olarak oluşturulur (koyu ve açık moda uygun). Bir onay kutusunu değiştirmek, widget workflow'unun `text` alanını günceller ve yenilemeler arasında kalıcı olur.

**Satır içi düzenleme:** bir görev öğesinin etiketini yerinde düzenlemek için çift tıklayın. Kaydetmek için Enter'a basın veya dışına tıklayın; iptal etmek için Escape'e basın. Bu öğeyi listeden kaldırmak için etiketi tamamen temizleyin.

**Görev öğelerindeki bağlantılar:** bir etiket bir markdown bağlantısı (`[title](url)`) içerdiğinde, bağlantıya tıklamak onay kutusunu değiştirmeden URL'yi açar. Değiştirmek için satırın başka bir yerine tıklayın.

**Yalnızca statik metin:** etkileşim, GFM görev listesi sözdizimi (`- [ ]` / `- [x]`) gerektirir. Görev öğeleri olmayan düz dinamik durum mesajları salt okunur kalır. Markdown `valueField`'den geldiğinde, ilk değiştirme onu statik `text` alanına kopyalar, böylece değişiklikler kalıcı olur.
### Numaralandırılmış listeler

Metin widget'ları markdown'ı **açık satır numaraları korunarak** işler. Gösterilmesini istediğiniz numarayı her satırın başına ekleyin (örn. `9.`, `8.`, `7.`). Heym satırları sizin için yeniden numaralandırmaz.

**Neden açık numaralar?** Standart markdown sıralı listeleri (`1.`, `2.`, `3.`) HTML `<ol>` listelerine dönüşür ve bunlar yalnızca ilk numaradan itibaren **yukarı** doğru sayar. `9.` / `8.` / `7.` şeklinde yazılan bir liste, normal bir markdown işleyicisinde `9`, `10`, `11` olarak görüntülenir. Her satırın başına amaçlanan numarayı eklemek bunu önler.

**Azalan listeler (örn. en yeniden en eskiye):** markdown'ı bir workflow döngüsünde oluşturun ve her öğe için görüntüleme numarasını hesaplayın:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Tipik desen:

1. Bir öğe dizisi getirin veya oluşturun (örn. HTTP → `body.videos`).
2. Dizi üzerinde [Loop](./loop-node.md) kullanın; gövde içinde, her yineleme için numaralandırılmış bir satır eklemek üzere `.add()` ile bir [Variable](./variable-node.md) kullanın.
3. Döngünün **done** dalından sonra, biriken dizi üzerinde `join("\n")` (veya eşdeğerini) tek bir markdown dizesine [Set](./set-node.md) edin.
4. **Chart Output** `valueField` değerini bu dizeye yönlendirin (veya statik `text` ayarlayın).

Döngü içindeki örnek satır ifadesi (`processVideos` etiketi, `title` ve `id` alanlarına sahip öğeler):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Ortaya çıkan markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

1'den başlayan basit artan bir liste için, ya her satırın başına numara ekleyin (`1.`, `2.`, `3.`) ya da `$loop.index + 1` ile bir döngü kullanın. Numaralara ihtiyaç duymadığınızda [madde işaretli listeler](#interactive-task-lists) (`- item`) kullanın.

## Durum çipleri

Bir `table`, bir sütunu renkli çipler olarak gösterebilir. Düğümün özelliklerinde **Status column** alanını (veya DSL'de `statusColumn`) bir sütun adına ayarlayın. Her değer beş tondan birini alır ve yaygın kelimeler yapılandırma gerektirmeden otomatik olarak bir ton alır:

| Ton | Varsayılan kelimeler |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | diğer her şey |

Eşleştirme büyük/küçük harf, `_` ve `-` farkını yok sayar; dolayısıyla `IN_PROGRESS` ve `in-progress` değerlerinin ikisi de `waiting` olur. Diğer değerler için **Status tones** ekleyin; bir kayıt o değer için varsayılanı geçersiz kılar:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

Sunucu her değeri kendi tonuna çözümler; böylece Heym ve Heym Work aynı renkleri gösterir.

## Ayrıntı sayfaları: `$page.record`

`?record=<value>` ile açılan bir pano, her widget Workflow'unu bu değer `$page.record` olacak şekilde çalıştırır. Bir tablo satırı bağlantısı böyle bir sayfayı açar; bkz. [Ayrıntı sayfaları](../tabs/dashboard-tab.md#detail-pages). Kayıt olmadan açılan panoda ve ifade iletişim kutusunda `$page.record` değeri `null` olur. `page` etiketli bir düğüm bunun önüne geçer.

Sayfanın ilgili olduğu tek kaydı getirmek için bunu kullanın; örneğin bir [HTTP](./http-node.md) düğümünde:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record`, alanları olan bir nesne değil, tıklanan satırın `V-1002` gibi kendi değeridir. Bu kaydı bir [DataTable](./datatable-node.md) içinde bulmak için kayıt sütununu değere göre filtreleyin: `{"vendor_id": "$page.record"}` filtresiyle `find` işlemi. `$page.record.id` gibi bir yol hiçbir şeye çözümlenmez; bu nedenle yapay zekanın oluşturduğu veya ince ayar yaptığı bir widget bu alanları atar ve bunun yerine `$page.record` değerini okur.

Değer, herkesin düzenleyebileceği bir URL'den gelir. Pano yalnızca kendi kayıt biçimindeki değerleri (varsayılan olarak harfler, rakamlar, `-`, `_` ve `.`) kabul eder, ancak yine de bunu güvenilmeyen girdi olarak ele alın: düğümün değerleri escape ettiği HTTP sorgu parametresi veya [DataTable](./datatable-node.md) ya da ClickHouse filtre değeri gibi yerlerde iletin ve asla dizeleri birleştirerek sorgu metni oluşturmayın. Sayfayı kim açarsa açsın widget'lar pano sahibi olarak çalışmaya devam eder.

## Veriler nasıl çözümlenir

1. `dataPath` ayarlanmışsa, düğüm bu nokta yolunu izleyerek upstream çıktısına girer.
2. Aksi takdirde bir dizi arar: üst düzey bir liste, bir `data` dizisi veya liste değerli ilk alan.
3. Doğrudan bir [Data Table](./datatable-node.md) düğümünden (`{id, data, created_at}`) gelen satırlar, sütunları `id` yanında en üst düzeyde olacak şekilde okunur; böylece `labelField`, `valueField` ve `columns` tablonun kendi sütunlarını adlandırır.
4. `table` için, her satır `columns` (veya ilk satırın anahtarları) kullanılarak bir tablo satırına dönüşür. `statusColumn` kullanıldığında Payload, o sütundaki her değerin tonunu da taşır.
5. `numeric` ve `gauge` için değer, ilk satırdaki `valueField` alanından (veya ilk sayısal alandan) gelir.
6. `scatter` için, her satır bir `[xField, yField]` noktasına dönüşür.
7. `text` için, mesaj ayarlandığında ilk satırdaki `valueField` alanından, aksi takdirde statik `text` yapılandırmasından (yine değilse ilk satırın ilk dize alanından) alınır.

## Örnek

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (tek değer ile bir aralık karşılaştırması):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (X/Y noktaları):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (payına göre bölünmüş tek bir çubuk + yüzde göstergesi):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (dolgulu çok serili trend):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (değerlerle birlikte satır başına gradyan göstergesi):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (statik bir markdown mesajı — upstream satırları gerekmez):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dinamik — mesaj dizesi upstream tarafından üretilir ve `valueField` aracılığıyla alınır):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## Örnek AI prompt'ları

**AI** ile bir widget oluştururken, aşağıdaki gibi prompt'lar her türle temiz bir şekilde eşleşir:

- **Bar** — "Son 6 aylık aylık geliri örnek verilerle dikey çubuk grafik olarak göster."
- **Line** — "Son 14 gündeki günlük aktif kullanıcıları çizgi grafik olarak çiz."
- **Area** — "Son 24 saatteki bellek ve CPU kullanımını iki serili alan grafiği olarak göster. Örnek veriler kullan."
- **Pie** — "Yürütme durumunu (başarılı, hata, iptal edildi) pasta grafik olarak dağıt."
- **Table** — "Yürütme sayısına göre en iyi 10 workflow'u ad ve çalıştırma sütunlarıyla kaydırılabilir tablo olarak göster. Örnek veriler kullan."
- **Numeric** — "Bugünkü toplam workflow yürütmelerini 'runs' birimiyle tek bir KPI olarak göster. Örnek veriler kullan."
- **Gauge** — "Mevcut CPU kullanımını 0 ile 100 yüzde arasında bir gauge olarak göster."
- **Scatter** — "İstek gecikmesini payload boyutuna karşı örnek verilerle dağılım grafiği olarak çiz."
- **Proportion** — "En çok kullandığım dilleri oran çubuğu olarak göster: Kotlin %49,64, JavaScript %23,73, TypeScript %11,64, Java %8,92, Python %6,06. Örnek veriler kullan."
- **Bar gauge** — "Her birim için boş disk alanını (sda1'den sda7'ye) GB cinsinden bar gauge olarak göster. Örnek veriler kullan."
- **Text** — "Bir markdown kontrol listesi içeren bir metin widget'ı ekleyin (bir işaretli öğe, iki işaretsiz), veya en yeni 5 eğitim videosunu azalan sırada (5.'den 1.'e) YouTube bağlantılarıyla listeleyin — her satırın başına açık bir sayı ekleyin (`5. Başlık`, `4. Başlık`, …)."

## İlgili

- [Dashboard sekmesi](../tabs/dashboard-tab.md) — widget'ları oluşturun ve düzenleyin
- [Output düğümü](output-node.md) — normal workflow'lar için terminal düğümü


## Bağlantı düğmeleri

Bir `table`, bir sütunu bağlantı açan düğmelere dönüştürebilir. Düğümün özelliklerinde **Link column** değerini (veya DSL'de `linkColumn` değerini) hücreleri bir URL içeren bir sütuna ayarlayın ve isteğe bağlı olarak **Link button text** (`linkLabel`) belirleyin. Her hücre, URL'sini yeni sekmede açan bir düğme olur. Düğme metni yoksa düğme yalnızca bir bağlantı simgesi gösterir:

| Hücre değeri | Açtığı yer |
| ------------ | ---------- |
| `https://jira.example.com/browse/T-1` | Başka bir site, yeni sekmede |
| `/dashboards` | Heym içindeki bir sayfa, yeni sekmede |

Yalnızca `http://` ve `https://` adresleri ile tek bir `/` ile başlayan yollar düğme olur. `javascript:` veya `//host` gibi diğer tüm değerler düz metin olarak kalır ve boş bir hücre hiçbir şey göstermez.

Düğme, bir [satır bağlantısı](../tabs/dashboard-tab.md#detail-pages) ile birlikte çalışır: düğmeye tıklamak bağlantısını yeni sekmede açar, satırın başka herhangi bir yerine tıklamak ise yine ayrıntı sayfasını açar.
