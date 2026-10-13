# Expression DSL

Heym menggunakan bahasa ekspresi sederhana untuk mereferensikan data dari Node upstream. Gunakan ekspresi dalam konfigurasi Node seperti LLM `userMessage`, Condition `condition`, Output `message`, pemetaan Set, dan nilai Variable. Gunakan [Dialog Evaluasi Ekspresi](./expression-evaluation-dialog.md) untuk editor yang lebih besar, pratinjau langsung berbasis backend, dan pemilihan output path.

## Referensi Dasar

### Node Input vs Node Bernama

- **`$input`** – Gunakan hanya ketika terdapat satu Node [Input](../nodes/input-node.md) upstream dan Anda ingin mereferensikan output-nya. Contoh: `$input.text`. Ini adalah singkatan untuk "data dari input yang terhubung."
- **`$nodeLabel.field`** – Gunakan untuk mereferensikan Node upstream mana pun berdasarkan **label**-nya (nilai `label` pada data Node tersebut). Utamakan cara ini ketika Anda memiliki beberapa Node atau ketika AI Assistant / workflow DSL mengharapkan label eksplisit. Contoh: `$userInput.body.text`, `$myLLM.text`.

**Kapan menggunakan yang mana:**

| Konteks | Utamakan | Contoh |
|--------|--------|---------|
| Satu Node input, alur sederhana | `$input.text` | Output message dari satu Input |
| Beberapa Node atau referensi bernama | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Selalu `$nodeLabel.field` | Workflow builder mengharapkan label, bukan `$input` |

### Node Input

Gunakan `$input` untuk mereferensikan data Node Input ketika terdapat satu input upstream:

```
$input.text
```

### Node Bernama

Referensikan Node upstream mana pun berdasarkan label-nya. Ketika sebuah Node memiliki [pinned data](./canvas-features.md#data-pin), penyelesaian ekspresi menggunakan data tersebut alih-alih output eksekusi.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Gunakan `$credentials.CredentialName` untuk mereferensikan nilai credential (misalnya API key, bearer token, atau Notion integration token) berdasarkan nama. Lihat [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nama yang bukan identifier biasa (mengandung `-`, diawali angka, atau merupakan reserved word) menggunakan bentuk bracket: `$credentials["my-api-key"]`.

### Global Variables

Gunakan `$global.variableName` untuk mereferensikan [Global Variables](./global-variables.md) – data key-value persisten dengan cakupan pengguna yang dikelola di [tab Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Field Bersarang

Gunakan notasi titik untuk objek bersarang:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literal

- **String**: `"hello"` atau `'hello'`
- **Angka**: `42`, `3.14`
- **Boolean**: `true`, `false`
- **Null**: `null`

## Preservasi Tipe

Ketika **seluruh** nilai merupakan satu `$expr` tunggal, backend mempertahankan tipe aslinya:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Ketika ekspresi merupakan bagian dari string yang lebih besar, hasil akhirnya selalu berupa string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Node [Sticky Note](../nodes/sticky-note-node.md) adalah dokumentasi kanvas, bukan field ekspresi yang dapat dieksekusi. Konten `note`-nya dirender sebagai markdown, jadi gunakan tautan dan gambar markdown biasa alih-alih ekspresi `$...`.

Sticky note mendukung judul tampilan kustom dan enam warna latar belakang yang tersimpan:

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

Nilai `stickyColor` yang diizinkan adalah `yellow`, `sky`, `emerald`, `rose`, `violet`, dan `zinc`.

## Aritmetika

Operator yang didukung: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Perbandingan

Gunakan pada Node [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Konteks Loop

Di dalam Node [Loop](../nodes/loop-node.md), gunakan `item` untuk mereferensikan elemen array saat ini:

```
item.name
item.value
```

## Variabel Khusus
- `$now` - Datetime saat ini dengan metode pemformatan
- `$Date()` - Membuat/mengurai tanggal (misalnya `$Date("2024-01-15")`)
- `$UUID` - Menghasilkan identifier unik 32 karakter (TANPA tanda kurung; gunakan `$UUID` bukan `$UUID()`)
- `$workflowName` - Nama workflow saat ini
- `$workflowDescription` - Deskripsi workflow saat ini
- `$workflowPath` - Path relatif workflow, misalnya `/workflows/<id>`
- `$workflowUrl` - URL absolut workflow, misalnya `https://<host>/workflows/<id>`
- `$executionId` - Id eksekusi saat ini (sama dengan id entri [Execution History](./execution-history.md), sehingga `/workflows/<id>/<executionId>` membuka eksekusi ini di kanvas). **Hanya saat runtime**: kosong pada dialog pratinjau ekspresi; terisi hanya ketika workflow sedang dieksekusi.
- `$vars` - Variabel lokal workflow (akses melalui `$vars.variableName`; diperbarui melalui Node `variable`)
- `$global` - Penyimpanan variabel global persisten (akses melalui `$global.variableName`)
- `$page.record` - Khusus workflow widget dasbor: rekaman halaman detail tempat widget berada, dari parameter `?record=` dasbor. Bernilai `null` pada dasbor yang dibuka tanpa parameter tersebut dan di dialog pratinjau ekspresi. Node berlabel `page` memiliki prioritas lebih tinggi. Lihat [Halaman detail](../tabs/dashboard-tab.md#detail-pages).

### Penggunaan $vars
- `$vars.counter` - Mengakses variabel bernama `counter`
- `$vars.myArray.add("item")` - Menambahkan item ke variabel array

### Penggunaan $global
- `$global.environment` - Mengakses variabel global bernama `environment`
- `$global.settings.baseUrl` - Mengakses field bersarang pada variabel global bertipe objek
## Request Context (Eksekusi API)
Saat sebuah Workflow dieksekusi melalui HTTP API, Node input menerima metadata permintaan tambahan:
- `$textInputLabel.body` - Objek body permintaan HTTP (Payload JSON mentah)
- `$textInputLabel.headers` - Objek header permintaan HTTP (semua kunci header menggunakan huruf kecil)
- `$textInputLabel.query` - Objek parameter query URL

Akses data permintaan seperti:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Fungsi Konversi Tipe
- `str(value)` - Konversi ke string
- `int(value)` - Konversi ke integer
- `float(value)` - Konversi ke float
- `bool(value)` - Konversi ke boolean
- `list(value)` - Konversi ke list
- `dict(key=value, ...)` - Membuat dictionary dengan argumen keyword (misalnya `$dict(name="Ali", age=30)`)

## Fungsi Matematika
- `len(value)` - Mendapatkan panjang
- `abs(value)` - Nilai absolut
- `min(a, b)` - Nilai minimum
- `max(a, b)` - Nilai maksimum
- `round(value)` - Membulatkan angka
- `sum(list)` - Jumlah dari list
- `sorted(list)` - Mengurutkan list
- `randomInt(min, max)` - Integer acak

## Fungsi Array
- `$array(a, b, c)` - Membuat array dari argumen (misalnya `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Membuat rentang integer dari `a` hingga `b` dengan `b` dikecualikan (misalnya `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Gagal ketika `a > b`
- `notNull(list)` - Menghapus nilai null dari array

## Fungsi Pembuatan String (untuk ekspresi map/filter)
- `concat(a, b, c, ...)` - Menggabungkan N argumen
  - Gunakan di dalam `.map()` sebagai string ekspresi (tanpa `$` di dalam string)
  - Gunakan tanda kutip tunggal di dalam string concat:
    - Benar: `concat('prefix', 'item.field', 'suffix')`

## Object Literals / Dictionary
Membuat objek/dictionary menggunakan sintaks kurung kurawal dengan kunci string apa pun:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Kunci Dinamis
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Aturan Object Literal
- Kunci dapat berupa string apa pun (termasuk spasi/karakter khusus)
- Kunci HARUS diapit dengan tanda kutip ganda (misalnya `"key"`)
- Nilai dapat berupa string/angka/boolean/ekspresi/objek bersarang

## Fungsi String
- `upper(text)` - Huruf besar
- `lower(text)` - Huruf kecil
- `strip(text)` - Menghapus spasi di awal dan akhir
- `capitalize(text)` - Mengapitalkan huruf pertama
- `title(text)` - Huruf kapital di setiap kata
- `split(text, separator)` - Memisahkan string
- `join(separator, list)` - Menggabungkan list
- `replace(text, old, new)` - Mengganti teks
- `regexReplace(text, pattern, replacement)` - Mengganti dengan pola regex
- `base64Encode(text)` - Mengenkode teks UTF-8 sebagai Base64 standar
- `base64Decode(text)` - Mendekode Base64 standar menjadi teks UTF-8
- `toJson(text)` - Mengurai string JSON menjadi objek, array, atau nilai

## Metode String (pada nilai string)
- `.orEmpty()` - Mengembalikan nilai string, atau `""` ketika nilai null/tidak ada
- `.upper()` / `.lower()` - Konversi huruf besar/kecil
- `.strip()` - Menghapus spasi di awal dan akhir
- `.capitalize()` / `.title()` - Mengapitalkan
- `.length` - Panjang string
- `.toString()` - Konversi ke string
- `.substring(start, end)` - Mengekstrak substring
- `.contains(text)` - Memeriksa apakah mengandung substring
- `.startswith(prefix)` / `.endswith(suffix)` - Memeriksa prefix/suffix
- `.indexOf(text)` - Menemukan posisi (mengembalikan -1 jika tidak ditemukan)
- `.replace(old, new)` - Mengganti kemunculan pertama
- `.replaceAll(old, new)` - Mengganti semua kemunculan
- `.regexReplace(pattern, replacement)` - Mengganti dengan pola regex
- `.hash()` - Hash MD5 dari string
- `.base64Encode()` - Mengenkode teks UTF-8 sebagai Base64 standar
- `.base64Decode()` - Mendekode Base64 standar menjadi teks UTF-8
- `.urlEncode()` - Mengenkode string URL
- `.urlDecode()` - Mendekode string URL
- `.escape()` - String escape JSON (mengonversi karakter khusus ke format JSON)
- `.unescape()` - String unescape JSON (mengonversi format JSON ke string asli)
- `.toJson()` - Mengurai string JSON menjadi objek, array, atau nilai

### Contoh Metode String
- `$profile.nickname.orEmpty()` - Mengonversi teks nullable/tidak ada menjadi string kosong
- `$text.upper()` - Konversi ke huruf besar
- `$text.lower()` - Konversi ke huruf kecil
- `$text.strip()` - Menghapus spasi
- `$text.replace("old", "new")` - Mengganti teks
- `$text.replaceAll("a", "b")` - Mengganti semua kemunculan
- `$text.length` - Mendapatkan panjang string
- `$text.escape()` - Meng-escape karakter JSON khusus (misalnya, tanda kutip, baris baru)
- `$escapedText.unescape()` - Meng-unescape string berformat JSON kembali ke aslinya
- `$text.toJson()` - Mengurai string objek/array JSON (kemudian `$text.toJson().repoUrl`)
- `$toJson($text)` - Penguraian yang sama sebagai fungsi
- `$base64Encode("Héym 🌍")` - Mengembalikan `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Mendekode Base64 menjadi teks UTF-8
- `$text.urlEncode()` - Mengenkode URL untuk parameter API
- `$encodedText.urlDecode()` - Mendekode teks yang dienkode URL
## Metode Array (pada array)
- `.first()` - Mengambil elemen pertama
- `.last()` - Mengambil elemen terakhir
- `.random()` - Mengambil elemen acak
- `.reverse()` - Membalik urutan array
- `.flat()` - Meratakan array bertingkat menjadi satu array tunggal
- `.flat(depth)` - Meratakan dengan batas kedalaman
- `.distinct()` - Menghapus duplikat
- `.distinctBy(expr)` - Menghapus duplikat berdasarkan ekspresi (misalnya `$array.distinctBy("item.id")`)
- `.notNull()` - Menghapus nilai null
- `.add(item)` - Menambahkan item (mengembalikan array baru)
- `.contains(item)` - Memeriksa apakah array berisi item (mengembalikan boolean)
- `.join(separator)` - Menggabungkan elemen array menjadi string
- `.filter(expr)` - Memfilter array menggunakan variabel `item` (misalnya `$array.filter("item > 5")`)
- `.map(expr)` - Mentransformasi setiap elemen menggunakan variabel `item` (misalnya `$array.map("item.name")`)
- `.sort(expr, order)` - Mengurutkan berdasarkan ekspresi, order adalah `"asc"` (default) atau `"desc"`
- `.take(n)` - Mengambil N elemen pertama (positif) atau N elemen terakhir (negatif)
- `.length` - Panjang array
- `.toString()` - Mengonversi ke string JSON

### Contoh Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Metode Object/Dictionary (pada object)
- `.get(key)` - Mengambil nilai berdasarkan key (mengembalikan null jika tidak ditemukan)
- `.get(key, default)` - Mengambil nilai berdasarkan key dengan fallback default
- `.keys()` - Mengembalikan daftar semua key
- `.values()` - Mengembalikan daftar semua value
- `.entries()` - Mengembalikan daftar objek `{key, value}` (satu per properti)
- `.filter(expr)` - Mengiterasi entri `{key, value}` dan mengembalikan entri yang cocok sebagai list (gunakan `item.key` / `item.value` di dalam `expr`)
- `.map(expr)` - Mengiterasi entri `{key, value}` dan mengembalikan list nilai yang ditransformasi (gunakan `item.key` / `item.value` di dalam `expr`)
- `.toString()` - Mengonversi ke string JSON

### Contoh Iterasi Object
Saat mengiterasi object dengan `.map()` atau `.filter()`, setiap `item` adalah pasangan `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → daftar nama properti yang tidak null

## Tanggal/Waktu
- `$now` - Datetime saat ini
- `$now.format("YYYY-MM-DD")` - Memformat tanggal/waktu
- `$now.toISO()` / `.toDate()` / `.toTime()` - Mengonversi format
- `$now.addDays(n)` / `.addHours(n)` - Operasi aritmetika tanggal
- `$Date("2024-01-15")` - Mengurai string tanggal

## Operasi Numerik
- Matematika dasar: `+`, `-`, `*`, `/`, `%`
- Perbandingan: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operator boolean: `and`, `or`, `not`

## Kondisi Boolean
Untuk boolean, tulis ekspresi secara langsung (jangan memaksakan `== true`):
- Salah: `$nodeName.isValid == true`
- Benar: `$nodeName.isValid`
- Negasi: `not $nodeName.isValid`

## Aturan & Whitelist (Kritis)
### Aturan Penempatan `$`
- Ekspresi mandiri biasanya diawali dengan `$` di depan.
- Template string dapat berisi beberapa `$refs`.
- Parameter metode juga dapat berisi `$refs` bertingkat saat Anda ingin meneruskan hasil ekspresi lain (key dinamis atau resolusi bertingkat).
  - Valid: `$node.method(other.field)` — `other` diresolusi dari konteks seperti label tingkat atas (tanpa `$` di dalam argumen).
  - Valid: `$node.method($other.field)` — `$` bertingkat didukung dalam pratinjau dialog evaluate dan evaluasi kondisi.
  - Valid: `$array($a.x, $b.y)`
  - Autocomplete di dalam `.get(` menyisipkan jalur `label.field` **tanpa** `$` di depan, sama seperti di dalam `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Jika seluruh nilai yang dikirimkan adalah satu dot path **tanpa** `$` di depan (misalnya teks yang dipilih di editor, seperti `execute.outputs.output.result.today`), backend memperlakukannya sama seperti `$execute.outputs.output.result.today`. Nilai yang berisi newline atau carriage return setelah trimming tidak ditulis ulang (menghindari payload multi-baris yang ambigu). Utamakan menulis `$` di field Workflow yang disimpan; penulisan ulang terutama untuk inspeksi dan tooling.
- Hasil `Run` pada dialog Evaluate adalah sumber kebenaran untuk bagaimana ekspresi konkret diresolusi.

### Pengutipan String pada Array
Saat membuat array dengan nilai string, SELALU gunakan tanda kutip ganda:
- Benar: `$array("hello", "world")`
- Salah: `$array('hello', 'world')`

### HANYA GUNAKAN FUNGSI-FUNGSI INI (Whitelist)
Gunakan HANYA:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- metode string/array/object yang terdokumentasi

Jika suatu fungsi tidak tercantum di atas, maka fungsi tersebut tidak ada.

### Batasan Metode Array / Dict
- Array HANYA dapat menggunakan: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Object/Dict HANYA dapat menggunakan: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Nama Label Node yang Dicadangkan
Jangan gunakan nama-nama ini sebagai label node: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Contoh

**Condition**: `$input.text.length > 0`

**LLM user message**: `$input.text`

**Output message**: `$llm.text`

**Variable value**: `$input.count + 1`

### Contoh DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Terkait

- [Dialog Evaluasi Ekspresi](./expression-evaluation-dialog.md) – Editor yang dapat diperluas dengan pratinjau langsung backend dan pelengkapan otomatis
- [Fitur Canvas](./canvas-features.md) – Data pin untuk menguji ekspresi tanpa menjalankan ulang node
- [Tipe Node](./node-types.md) – Node yang menggunakan ekspresi ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), dll.)
- [Sticky Note](../nodes/sticky-note-node.md) – Catatan markdown Canvas dengan judul yang dapat diedit, warna, dan tampilan gambar
- [Node Agent](../nodes/agent-node.md) – Menggunakan ekspresi dalam prompt agent
- [Memori Persisten Agent](./agent-persistent-memory.md) – `persistentMemoryEnabled` dan `memoryShares` dalam `data` agent (bukan field ekspresi)
- [Struktur Workflow](./workflow-structure.md) – Field `data` Node yang menerima ekspresi
- [Tab Credentials](../tabs/credentials-tab.md) – Credentials yang direferensikan oleh node
- [Berbagi Credentials](./credentials-sharing.md) – Bagikan credentials dan gunakan `$credentials` dalam ekspresi
- [Variabel Global](./global-variables.md) – Variabel persisten dengan `$global`
