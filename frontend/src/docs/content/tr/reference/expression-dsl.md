# Expression DSL

Heym, upstream node'lardan gelen verilere başvurmak için basit bir expression dili kullanır. Expression'ları LLM `userMessage`, Condition `condition`, Output `message`, Set eşlemeleri ve Variable değerleri gibi node yapılandırmalarında kullanın. Daha büyük bir editör, backend destekli canlı önizleme ve output path seçimi için [Expression Evaluation Dialog](./expression-evaluation-dialog.md) penceresini kullanın.

## Temel Başvurular

### Input Node vs Adlandırılmış Node'lar

- **`$input`** – Yalnızca tek bir upstream [Input](../nodes/input-node.md) node'u olduğunda ve onun output'una başvurmak istediğinizde kullanın. Örnek: `$input.text`. Bu, "bağlı input'tan gelen veri" için kısa bir gösterimdir.
- **`$nodeLabel.field`** – Herhangi bir upstream node'a **label**'ı (node'un data'sındaki `label`) ile başvurmak için kullanın. Birden fazla node'unuz olduğunda veya AI Assistant / workflow DSL açık label'lar beklediğinde bunu tercih edin. Örnek: `$userInput.body.text`, `$myLLM.text`.

**Hangisi ne zaman kullanılır:**

| Bağlam | Tercih edilen | Örnek |
|--------|--------|---------|
| Tek input node, basit akış | `$input.text` | Tek Input'tan gelen Output message |
| Birden fazla node veya adlandırılmış başvurular | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Her zaman `$nodeLabel.field` | Workflow builder label'lar bekler, `$input` değil |

### Input Node

Tek bir upstream input olduğunda Input node'unun data'sına başvurmak için `$input` kullanın:

```
$input.text
```

### Adlandırılmış Node'lar

Herhangi bir upstream node'a label'ı ile başvurun. Bir node'da [pinned data](./canvas-features.md#data-pin) olduğunda, expression tamamlama execution output'u yerine onu kullanır.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Credential değerlerine (ör. API key'leri, bearer token'lar veya Notion integration token'ları) adlarıyla başvurmak için `$credentials.CredentialName` kullanın. Bkz. [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Düz identifier olmayan adlar (`-` içeren, rakamla başlayan veya rezerve edilmiş kelimeler) köşeli parantez biçimini kullanır: `$credentials["my-api-key"]`.

### Global Variables

[Global Variables](./global-variables.md) öğelerine başvurmak için `$global.variableName` kullanın – [Variables tab](../tabs/global-variables-tab.md) içinde yönetilen, kalıcı, kullanıcı kapsamlı key-value verileri.

```
$global.environment
$global.settings.baseUrl
```

### İç İçe Alanlar

İç içe nesneler için nokta gösterimini kullanın:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literaller

- **String'ler**: `"hello"` veya `'hello'`
- **Sayılar**: `42`, `3.14`
- **Boolean'lar**: `true`, `false`
- **Null**: `null`

## Tip Koruma

**Tüm** değer tek bir `$expr` olduğunda, backend yerel tipi korur:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Bir expression daha büyük bir string'in parçası olduğunda, nihai sonuç her zaman bir string'dir:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md) node'ları canvas dokümantasyonudur, çalıştırılabilir expression alanları değildir. `note` içerikleri markdown olarak render edilir, bu nedenle `$...` expression'ları yerine normal markdown link'leri ve görselleri kullanın.

Sticky note'lar özel bir görüntüleme başlığını ve altı kayıtlı arka plan rengini destekler:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

İzin verilen `stickyColor` değerleri `yellow`, `sky`, `emerald`, `rose`, `violet` ve `zinc`'dir.

## Aritmetik

Desteklenen operatörler: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Karşılaştırmalar

[Condition](../nodes/condition-node.md) node'larında kullanın: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop Context

Bir [Loop](../nodes/loop-node.md) node'u içinde, geçerli dizi elemanına başvurmak için `item` kullanın:

```
item.name
item.value
```

## Özel Değişkenler
- `$now` - Biçimlendirme metotlarına sahip geçerli datetime
- `$Date()` - Tarih oluştur/parse et (ör. `$Date("2024-01-15")`)
- `$UUID` - 32 karakterlik benzersiz tanımlayıcı oluştur (parantez YOK; `$UUID()` değil `$UUID` kullanın)
- `$workflowName` - Geçerli workflow'un adı
- `$workflowDescription` - Geçerli workflow'un açıklaması
- `$workflowPath` - Workflow'un göreli yolu, ör. `/workflows/<id>`
- `$workflowUrl` - Workflow'un mutlak URL'si, ör. `https://<host>/workflows/<id>`
- `$executionId` - Geçerli execution'ın id'si ([Execution History](./execution-history.md) girdi id'sine eşittir, böylece `/workflows/<id>/<executionId>` bu çalıştırmayı canvas'ta açar). **Yalnızca runtime**: expression önizleme dialog'unda boştur; yalnızca bir workflow çalışırken doldurulur.
- `$vars` - Workflow'a özel değişkenler (`$vars.variableName` ile erişin; `variable` node ile güncellenir)
- `$global` - Kalıcı global değişken deposu (`$global.variableName` ile erişin)
- `$page.record` - Yalnızca pano widget workflow'ları için: panonun `?record=` parametresinden alınan, widget'ın bulunduğu ayrıntı sayfasının kaydı. Parametre olmadan açılan bir panoda ve ifade önizleme iletişim kutusunda `null` değerindedir. `page` etiketli bir düğüm önceliklidir. Bkz. [Ayrıntı sayfaları](../tabs/dashboard-tab.md#detail-pages).

### $vars Kullanımı
- `$vars.counter` - `counter` adlı bir değişkene erişin
- `$vars.myArray.add("item")` - Bir dizi değişkenine öğe ekleyin

### $global Kullanımı
- `$global.environment` - `environment` adlı bir global değişkene erişin
- `$global.settings.baseUrl` - Object tipi bir global değişkende iç içe alanlara erişin

## Request Context (API Execution)
Bir workflow HTTP API aracılığıyla çalıştırıldığında, input node'ları ek request metadata alır:
- `$textInputLabel.body` - HTTP request body nesnesi (raw JSON payload)
- `$textInputLabel.headers` - HTTP request headers nesnesi (tüm header anahtarları küçük harftir)
- `$textInputLabel.query` - URL query parametreleri nesnesi

Request verilerine şu şekilde erişin:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Type Conversion Functions
- `str(value)` - String'e dönüştürür
- `int(value)` - Integer'a dönüştürür
- `float(value)` - Float'a dönüştürür
- `bool(value)` - Boolean'a dönüştürür
- `list(value)` - List'e dönüştürür
- `dict(key=value, ...)` - Keyword argümanlarıyla dictionary oluşturur (örn. `$dict(name="Ali", age=30)`)

## Math Functions
- `len(value)` - Uzunluğu alır
- `abs(value)` - Mutlak değer
- `min(a, b)` - Minimum değer
- `max(a, b)` - Maksimum değer
- `round(value)` - Sayıyı yuvarlar
- `sum(list)` - List'in toplamı
- `sorted(list)` - List'i sıralar
- `randomInt(min, max)` - Rastgele integer

## Array Functions
- `$array(a, b, c)` - Argümanlardan array oluşturur (örn. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - `a`'dan `b`'ye kadar (b hariç) integer aralığı oluşturur (örn. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - `a > b` olduğunda başarısız olur
- `notNull(list)` - Array'den null değerleri kaldırır

## String Building Function (for map/filter expressions)
- `concat(a, b, c, ...)` - N argümanı birleştirir
  - `.map()` içinde expression string olarak kullanın (string içinde `$` olmadan)
  - concat string'i içinde tek tırnak kullanın:
    - Doğru: `concat('prefix', 'item.field', 'suffix')`

## Object Literals / Dictionaries
Herhangi bir string anahtarla süslü parantez sözdizimini kullanarak object/dictionary oluşturun:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamic Keys
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Object Literal Rules
- Anahtarlar herhangi bir string olabilir (boşluk/özel karakterler dahil)
- Anahtarlar çift tırnakla tırnak içine alınmalıdır (örn. `"key"`)
- Değerler string/number/boolean/expression/iç içe object olabilir

## String Functions
- `upper(text)` - Büyük harfe çevirir
- `lower(text)` - Küçük harfe çevirir
- `strip(text)` - Boşlukları kırpar
- `capitalize(text)` - İlk harfi büyütür
- `title(text)` - Başlık durumuna çevirir
- `split(text, separator)` - String'i böler
- `join(separator, list)` - List'i birleştirir
- `replace(text, old, new)` - Metni değiştirir
- `regexReplace(text, pattern, replacement)` - Regex pattern ile değiştirir
- `base64Encode(text)` - UTF-8 metni standart Base64 olarak kodlar
- `base64Decode(text)` - Standart Base64'ü UTF-8 metne çözer
- `toJson(text)` - Bir JSON string'ini object, array veya değere parse eder

## String Methods (on string values)
- `.orEmpty()` - String değeri döndürür veya değer null/eksik olduğunda `""` döndürür
- `.upper()` / `.lower()` - Harf dönüşümü
- `.strip()` - Boşlukları kırpar
- `.capitalize()` / `.title()` - İlk harfi büyütür
- `.length` - String uzunluğu
- `.toString()` - String'e dönüştürür
- `.substring(start, end)` - Alt string çıkarır
- `.contains(text)` - Alt string içerip içermediğini kontrol eder
- `.startswith(prefix)` / `.endswith(suffix)` - Prefix/suffix kontrol eder
- `.indexOf(text)` - Konumu bulur (bulunamazsa -1 döndürür)
- `.replace(old, new)` - İlk eşleşmeyi değiştirir
- `.replaceAll(old, new)` - Tüm eşleşmeleri değiştirir
- `.regexReplace(pattern, replacement)` - Regex pattern ile değiştirir
- `.hash()` - String'in MD5 hash'i
- `.base64Encode()` - UTF-8 metni standart Base64 olarak kodlar
- `.base64Decode()` - Standart Base64'ü UTF-8 metne çözer
- `.urlEncode()` - String'i URL encode eder
- `.urlDecode()` - String'i URL decode eder
- `.escape()` - JSON escape string (özel karakterleri JSON formatına dönüştürür)
- `.unescape()` - JSON unescape string (JSON formatını orijinal string'e dönüştürür)
- `.toJson()` - Bir JSON string'ini object, array veya değere parse eder

### String Method Examples
- `$profile.nickname.orEmpty()` - Nullable/eksik metni boş string'e dönüştürür
- `$text.upper()` - Büyük harfe çevirir
- `$text.lower()` - Küçük harfe çevirir
- `$text.strip()` - Boşlukları kaldırır
- `$text.replace("old", "new")` - Metni değiştirir
- `$text.replaceAll("a", "b")` - Tüm eşleşmeleri değiştirir
- `$text.length` - String uzunluğunu alır
- `$text.escape()` - Özel JSON karakterlerini escape eder (örn. tırnaklar, yeni satırlar)
- `$escapedText.unescape()` - JSON formatlı string'i orijinaline unescape eder
- `$text.toJson()` - Bir JSON object/array string'ini parse eder (ardından `$text.toJson().repoUrl`)
- `$toJson($text)` - Fonksiyon olarak aynı parse işlemi
- `$base64Encode("Héym 🌍")` - `SMOpeW0g8J+MjQ==` döndürür
- `$encodedText.base64Decode()` - Base64'ü UTF-8 metne çözer
- `$text.urlEncode()` - API parametreleri için URL encode eder
- `$encodedText.urlDecode()` - URL encode edilmiş metni decode eder

## Array Metotları (array'ler üzerinde)
- `.first()` - İlk elemanı alır
- `.last()` - Son elemanı alır
- `.random()` - Rastgele eleman alır
- `.reverse()` - Array'i tersine çevirir
- `.flat()` - İç içe array'leri tek bir array'e düzleştirir
- `.flat(depth)` - Derinlik sınırıyla düzleştirir
- `.distinct()` - Yinelenenleri kaldırır
- `.distinctBy(expr)` - İfadeye göre yinelenenleri kaldırır (örn. `$array.distinctBy("item.id")`)
- `.notNull()` - Null değerleri kaldırır
- `.add(item)` - Eleman ekler (yeni array döndürür)
- `.contains(item)` - Array'in elemanı içerip içermediğini kontrol eder (boolean döndürür)
- `.join(separator)` - Array elemanlarını bir string'e birleştirir
- `.filter(expr)` - `item` değişkenini kullanarak array'i filtreler (örn. `$array.filter("item > 5")`)
- `.map(expr)` - `item` değişkenini kullanarak her elemanı dönüştürür (örn. `$array.map("item.name")`)
- `.sort(expr, order)` - İfadeye göre sıralar, order `"asc"` (varsayılan) veya `"desc"` olur
- `.take(n)` - İlk N (pozitif) veya son N (negatif) elemanı alır
- `.length` - Array uzunluğu
- `.toString()` - JSON string'e dönüştürür

### Filter / Map / Sort Örnekleri
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Object/Dictionary Metotları (object'ler üzerinde)
- `.get(key)` - Key'e göre değer alır (bulunamazsa null döndürür)
- `.get(key, default)` - Key'e göre varsayılan değerle birlikte değer alır
- `.keys()` - Tüm key'lerin listesini döndürür
- `.values()` - Tüm değerlerin listesini döndürür
- `.entries()` - `{key, value}` object'lerinin listesini döndürür (her özellik için bir tane)
- `.filter(expr)` - `{key, value}` girdilerini yineler ve eşleşen girdileri liste olarak döndürür (`expr` içinde `item.key` / `item.value` kullanın)
- `.map(expr)` - `{key, value}` girdilerini yineler ve dönüştürülmüş değerlerin listesini döndürür (`expr` içinde `item.key` / `item.value` kullanın)
- `.toString()` - JSON string'e dönüştürür

### Object Yineleme Örnekleri
Bir object'i `.map()` veya `.filter()` ile yinelerken, her `item` bir `{key, value}` çiftidir:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → null olmayan özellik adlarının listesi

## Tarih/Saat
- `$now` - Geçerli tarih/saat
- `$now.format("YYYY-MM-DD")` - Tarih/saat biçimlendirir
- `$now.toISO()` / `.toDate()` / `.toTime()` - Biçimleri dönüştürür
- `$now.addDays(n)` / `.addHours(n)` - Tarih matematiği
- `$Date("2024-01-15")` - Tarih string'ini ayrıştırır

## Sayısal İşlemler
- Temel matematik: `+`, `-`, `*`, `/`, `%`
- Karşılaştırmalar: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Boolean operatörleri: `and`, `or`, `not`

## Boolean Koşullar
Boolean'lar için ifadeyi doğrudan yazın (`== true` yazmaya zorlamayın):
- Yanlış: `$nodeName.isValid == true`
- Doğru: `$nodeName.isValid`
- Olumsuzlama: `not $nodeName.isValid`

## Kurallar ve Whitelist (Kritik)
### $ Yerleştirme Kuralları
- Bağımsız bir ifade genellikle baştaki `$` ile başlar.
- Template string'ler birden fazla `$ref` içerebilir.
- Metot parametreleri, başka bir ifade sonucunu (dinamik key veya iç içe çözümleme) geçirmek istediğinizde iç içe `$ref`'ler de içerebilir.
  - Geçerli: `$node.method(other.field)` — `other`, argüman içinde `$` olmadan üst düzey bir label gibi bağlamdan çözümlenir.
  - Geçerli: `$node.method($other.field)` — iç içe `$`, evaluate dialog önizlemesinde ve koşul değerlendirmesinde desteklenir.
  - Geçerli: `$array($a.x, $b.y)`
  - `.get(` içindeki otomatik tamamlama, `$array(...)` / `$notNull(...)` içinde olduğu gibi **çıplak** `label.field` yollarını (başta `$` olmadan) ekler.
- **Evaluate API (Run):** Gönderilen değerin tamamı başta `$` olmadan tek bir nokta yoluysa (örneğin editörde seçilen `execute.outputs.output.result.today` gibi metin), backend bunu `$execute.outputs.output.result.today` ile aynı şekilde ele alır. Trim sonrası satır sonu veya satır başı karakteri içeren değerler yeniden yazılmaz (belirsiz çok satırlı payload'lardan kaçınmak için). Kaydedilen workflow alanlarında `$` yazmayı tercih edin; yeniden yazma esas olarak inceleme ve araçlar içindir.
- Evaluate dialog `Run` sonucu, somut bir ifadenin nasıl çözümlendiğinin doğruluk kaynağıdır.

### Array String Tırnaklama
String değerlerle array oluştururken HER ZAMAN çift tırnak kullanın:
- Doğru: `$array("hello", "world")`
- Yanlış: `$array('hello', 'world')`

### SADECE BU FONKSİYONLARI KULLANIN (Whitelist)
Sadece şunları kullanın:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- belgelenmiş string/array/object metotları

Yukarıda listelenmeyen bir fonksiyon mevcut değildir.

### Array / Dict Metot Sınırları
- Array'ler SADECE şunları kullanabilir: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Object/Dict'ler SADECE şunları kullanabilir: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Ayrılmış Node Etiket Adları
Bu adları node etiketi olarak kullanmayın: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Örnekler

**Condition**: `$input.text.length > 0`

**LLM kullanıcı mesajı**: `$input.text`

**Çıktı mesajı**: `$llm.text`

**Değişken değeri**: `$input.count + 1`

### DSL Örneği

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## İlgili

- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Backend canlı önizleme ve otomatik tamamlama içeren genişletilebilir düzenleyici
- [Canvas Features](./canvas-features.md) – Node'ları yeniden çalıştırmadan ifadeleri test etmek için veri pin'i
- [Node Types](./node-types.md) – İfadeleri kullanan node'lar ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) vb.)
- [Sticky Note](../nodes/sticky-note-node.md) – Düzenlenebilir başlık, renk ve görsel gösterimi olan canvas markdown notları
- [Agent Node](../nodes/agent-node.md) – Agent prompt'larında ifadeleri kullanma
- [Agent Persistent Memory](./agent-persistent-memory.md) – Agent `data` içinde `persistentMemoryEnabled` ve `memoryShares` (ifade alanları değil)
- [Workflow Structure](./workflow-structure.md) – İfadeleri kabul eden node `data` alanları
- [Credentials Tab](../tabs/credentials-tab.md) – Node'lar tarafından referans verilen kimlik bilgileri
- [Credentials Sharing](./credentials-sharing.md) – Kimlik bilgilerini paylaşın ve ifadelerde `$credentials` kullanın
- [Global Variables](./global-variables.md) – `$global` ile kalıcı değişkenler
