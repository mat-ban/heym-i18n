# Playwright

Node **Playwright** mengotomatiskan interaksi browser dengan langkah-langkah yang dapat dikonfigurasi. Gunakan node ini untuk web scraping, pengisian formulir, dan Workflow berbasis browser.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.results`, `$nodeLabel.screenshot`, dan data network/browser opsional |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `playwrightMode` | string | `"steps"` (default) atau `"code"` (Run Code). Pilih di dropdown Mode pada Properties Panel |
| `playwrightSteps` | array | Langkah-langkah: navigate, click, type, aiStep, dll. Setiap langkah memiliki action dan selector/params. `disabled: true` mempertahankan langkah dalam daftar tetapi melewatinya saat runtime |
| `playwrightCode` | string | Playwright Python kustom yang digunakan saat Mode adalah Run Code. Berjalan di sandbox yang diperketat dan **dinonaktifkan secara default** — lihat catatan keamanan di bawah |
| `playwrightHeadless` | boolean | Jalankan headless (default: true) |
| `playwrightStealth` | boolean | Pengaturan Steps-mode opsional yang mengurangi sinyal otomatisasi Playwright umum (default: false). Label Properties Panel: Reduce automation flags |
| `playwrightTimeout` | number | Timeout dalam ms (default: 30000) |
| `playwrightCaptureNetwork` | boolean | Tangkap respons JSON, header, cookie, dan penyimpanan browser |
| `playwrightAuthEnabled` | boolean | Pulihkan autentikasi browser dari cookie/storageState sebelum menjalankan langkah-langkah |
| `playwrightAuthStateExpression` | string | Ekspresi atau JSON yang menghasilkan Playwright `storageState` atau `cookies[]` mentah |
| `playwrightAuthCheckSelector` | string | Selector yang harus terlihat setelah bootstrap autentikasi |
| `playwrightAuthCheckTimeout` | number | Timeout dalam ms untuk pemeriksaan selector terautentikasi (default: 5000) |
| `playwrightAuthFallbackSteps` | array | Langkah-langkah fallback khusus login yang dijalankan ketika pemulihan cookie tidak mengautentikasi halaman |

## Jenis Langkah

- **navigate** – Buka URL
- **refresh** – Muat ulang halaman saat ini (opsional `timeout` langkah dalam ms untuk navigasi muat ulang)
- **click** – Klik elemen berdasarkan selector
- **type** – Ketik teks ke input (karakter demi karakter)
- **fill** – Isi nilai input
- **wait** – Tunggu timeout (ms)
- **screenshot** – Ambil screenshot (`outputKey` menyimpan base64 di results)
- **getText** – Konten teks suatu elemen (`selector`, opsional `outputKey`)
- **getAttribute** – Nilai atribut (`selector`, `attribute`, opsional `outputKey`)
- **getHTML** – Outer HTML suatu elemen (`selector`, opsional `outputKey`)
- **getVisibleTextOnPage** – Teks halaman penuh yang terlihat sebagai `document.body.innerText` (tanpa selector; gunakan `outputKey`; opsional `timeout` langkah dalam ms untuk menunggu sebelum pengambilan)
- **hover** – Arahkan kursor ke elemen
- **selectOption** – Pilih opsi dalam `<select>`
- **scrollDown** / **scrollUp** – Gulir roda mouse (opsional `amount` dalam piksel)
- **aiStep** – LLM mengembalikan jenis tindakan yang sama seperti langkah manual (lihat di bawah); `aiStep` bersarang tidak didukung

## Menonaktifkan Langkah

Setiap langkah memiliki tombol power di headernya. Langkah yang dinonaktifkan menampilkan judulnya dicoret dan diredupkan, tetap dalam daftar dengan semua field-nya, dan dilewati saat node berjalan — berguna untuk mengisolasi selector yang gagal tanpa menghapus pekerjaan. Langkah yang tersimpan membawa `disabled: true`; langkah tanpa flag tersebut berjalan normal.

Langkah yang dinonaktifkan tidak terlihat oleh bagian lain dari node: langkah tersebut tidak memenuhi aturan "langkah pertama harus `navigate`" pada bootstrap autentikasi, `aiStep` yang dinonaktifkan tidak melakukan panggilan LLM, dan entri yang dinonaktifkan dalam `playwrightAuthFallbackSteps` juga dilewati. Menonaktifkan semua langkah akan menggagalkan proses dengan pesan yang meminta Anda mengaktifkan salah satunya.

## AI Step

Tindakan **aiStep** menggunakan LLM untuk menganalisis HTML halaman (dan opsional screenshot) serta menghasilkan tindakan Playwright dari instruksi bahasa alami. API menerima nama tindakan yang sama seperti langkah manual (termasuk `navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, scroll, dll.). **Auto heal** hanya mengganti langkah berbasis selector yang gagal dengan alternatif untuk click, type, fill, hover, dan selectOption.

| Opsi | Deskripsi |
|------|-----------|
| `instructions` | Apa yang harus dilakukan AI (mis. "Klik tombol Login") |
| `credentialId` | Kredensial LLM (OpenAI, Google, atau Custom) |
| `model` | Daftar model yang dapat dicari dari kredensial LLM yang dipilih |
| `saveStepsForFuture` | Cache langkah-langkah yang dihasilkan untuk proses berikutnya (menghindari panggilan LLM) |
| `sendScreenshot` | Kirim screenshot ke LLM untuk elemen visual |
| `aiStepTimeout` | Timeout untuk panggilan LLM dalam ms (default 30000) |

### AI Auto Heal

**AI Auto Heal** membuat Workflow tangguh terhadap perubahan DOM. Ketika selector gagal dua kali (mis. setelah situs didesain ulang), Heym memanggil LLM untuk menemukan locator alternatif—biasanya `role=button[name='Submit']` atau `text=Exact text` alih-alih selector CSS.

Aktifkan **Auto heal mode** di properti AI step. Jika langkah yang tersimpan gagal:

1. Heym menangkap HTML dan screenshot saat ini
2. Mengirim langkah yang gagal + konteks halaman ke LLM
3. LLM mengembalikan alternatif yang tangguh (locator berbasis role, locator teks, atau CSS fallback)
4. Mencoba ulang dengan selector baru

Ini mengurangi ketidakstabilan ketika situs memperbarui markup atau nama class mereka.
## Mengurangi automation flags

Aktifkan **Reduce automation flags** (`playwrightStealth: true`) ketika sebuah situs memperlakukan Chromium bawaan Playwright sebagai bot karena sinyal otomatisasi standar (`HeadlessChrome` pada user agent, `navigator.webdriver`, tidak adanya `window.chrome`).

Opsi ini hanya berlaku pada mode **Steps**. Opsi ini:

- Menghapus flag `--enable-automation` milik Chromium dan menetapkan `--disable-blink-features=AutomationControlled`
- Mengirim user agent Chrome standar (tanpa `HeadlessChrome`)
- Memulihkan permukaan browser umum yang dibiarkan kosong oleh Playwright (`window.chrome`, plugins)
- Membiarkan renderer GPU host tidak berubah ketika GPU tersedia (macOS/Windows lokal). Linux/Docker tidak memiliki GPU; string renderer perangkat lunak Chromium dilaporkan sebagai GPU Mali (ARM) atau Mesa (x86) yang umum alih-alih SwiftShader.

Opsi ini tidak menyembunyikan bahwa sesi dijalankan melalui Chrome DevTools Protocol, dan bukan merupakan cara untuk melewati keamanan situs, CAPTCHA, atau kontrol akses. Gunakan opsi ini untuk workflow yang Anda berwenang menjalankannya — alat internal, situs Anda sendiri, dan otomatisasi browser yang diizinkan.

Mode Run Code tidak berubah — skrip kustom meluncurkan Chromium sendiri.

## Network Capture

Aktifkan `playwrightCaptureNetwork` untuk mengumpulkan data debugging tambahan selama proses berjalan:

- `networkRequests` – Respons JSON/API yang tertangkap
- `cookies` – Cookie browser pada akhir proses berjalan
- `localStorage` – Pasangan key-value `localStorage` browser
- `sessionStorage` – Pasangan key-value `sessionStorage` browser

Ini berguna ketika Anda perlu memeriksa panggilan API tersembunyi, status autentikasi, atau data sisi browser setelah alur otomatis.

## Cookie Bootstrap Dan Login Fallback

Aktifkan `playwrightAuthEnabled` ketika Anda ingin Playwright membuka halaman yang sudah dalam keadaan login.

### Sumber Auth State

Tetapkan `playwrightAuthStateExpression` ke sebuah ekspresi seperti `$global.authState`. Nilainya dapat berupa:

- Objek `storageState` Playwright: `{"cookies": [...], "origins": [...]}`
- Array `cookies[]` mentah
- String JSON yang berisi salah satu bentuk tersebut

Pola yang direkomendasikan:

1. Jalankan node Playwright dengan network capture atau auth bootstrap diaktifkan
2. Simpan `$playwrightNode.cookies` atau objek auth state lengkap dalam [Global Variable](../reference/global-variables.md)
3. Gunakan kembali variabel tersebut pada node Playwright berikutnya melalui `$global.authState`

### Auth Check

Langkah utama Playwright pertama harus berupa `navigate`. Setelah langkah tersebut dimuat, Heym memeriksa `playwrightAuthCheckSelector`.

- Jika selector terlihat, langkah-langkah utama selanjutnya berlanjut secara normal
- Jika selector tidak ditemukan, Heym menjalankan `playwrightAuthFallbackSteps`
- Setelah langkah fallback selesai, Heym memeriksa selector yang sama sekali lagi
- Jika selector masih tidak ditemukan, node gagal dengan error auth bootstrap

Langkah fallback bertanggung jawab atas navigasi setelah kegagalan autentikasi. Langkah-langkah tersebut harus meninggalkan browser pada halaman terautentikasi yang diharapkan oleh sisa alur utama.

## Output Fields

- `$playwrightNode.status` – `"ok"` jika berhasil
- `$playwrightNode.results` – Output langkah (getText, getHTML, getVisibleTextOnPage, getAttribute, key screenshot, dll.)
- `$playwrightNode.screenshot` – Screenshot Base64 ketika sebuah langkah menyimpannya
- `$playwrightNode.cookies` – Cookie browser akhir ketika auth bootstrap atau network capture diaktifkan
- `$playwrightNode.networkRequests` – Respons jaringan yang tertangkap (ketika diaktifkan)
- `$playwrightNode.localStorage` – Local storage browser (ketika diaktifkan)
- `$playwrightNode.sessionStorage` – Session storage browser (ketika diaktifkan)

## Contoh

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Mode Run Code

Pada Properties Panel, tetapkan **Mode** ke **Run Code** untuk mengedit `playwrightCode` alih-alih langkah visual. Auth bootstrap hanya berlaku pada mode Steps.

Contoh (sandbox / Docker — Chromium memerlukan `--no-sandbox`):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Wrapper menyediakan `inputs`, `headless`, `timeout_ms`, dan `capture_network`. Anda dapat menyematkan ekspresi `$nodeLabel.field` dalam kode; cetak JSON dengan `status` dan `results`.
## Keamanan kode kustom

Bidang `playwrightCode` menjalankan Python arbitrer. Karena hal tersebut setara dengan eksekusi kode, bidang ini **dinonaktifkan secara default** dan, ketika diaktifkan, dijalankan dalam sandbox:

- **Dinonaktifkan secara default.** Mengeksekusi node yang memiliki `playwrightCode` akan gagal dengan pesan kesalahan yang jelas kecuali operator menetapkan `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`. Pemeriksaan ini dijalankan pada waktu eksekusi, sehingga juga mencakup workflow yang telah disimpan sebelumnya serta eksekusi terjadwal / sub-workflow.
- **Terisolasi ketika diaktifkan.** Kode kustom tidak dijalankan di dalam proses backend. Kode tersebut dijalankan di dalam container saudara yang diperkeras dan bersifat sementara, tanpa Docker socket, tanpa bind mount backend, tanpa secret backend di lingkungannya, dengan capability yang dihapus, `no-new-privileges`, serta batasan CPU / memori / PID. Jika Docker tidak tersedia, eksekusi akan gagal secara aman (fail closed). `HEYM_PLAYWRIGHT_SANDBOX=subprocess` mengembalikan ke jalur in-process hanya untuk penggunaan tepercaya atau pengembangan lokal (bukan sebagai batas keamanan). `./run.sh` native secara default menggunakan `subprocess` ketika `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` tidak ditetapkan. `./deploy.sh` (Compose) dan image tunggal GHCR menyelesaikan sibling runner melalui `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` (dengan fallback ke `HEYM_CODEX_DOCKER_IMAGE`) dan menggunakan jalur venv yang sesuai (`/app/.venv` vs `/app/backend/.venv`).
- **Catatan Chromium.** Container sandbox berjalan sebagai root secara default, dan Chromium menolak berjalan sebagai root tanpa `--no-sandbox`. Kode kustom yang menjalankan Chromium harus menyertakan flag tersebut, misalnya `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Peluncuran berbasis langkah (dan stealth) juga menyertakan `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` agar skrip fingerprint tidak dapat membuka STUN UDP ke `stun.l.google.com:19302`. Pemanggilan `chromium.launch` kustom juga harus menyertakan flag tersebut.

Node Playwright berbasis langkah (`playwrightSteps`) sepenuhnya dihasilkan oleh Heym (tanpa kode arbitrer), tidak terpengaruh oleh semua hal di atas, dan selalu tersedia — utamakan penggunaan node tersebut.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Crawler Node](./crawler-node.md) – Web scraping yang lebih sederhana dengan FlareSolverr
- [Credentials Sharing](../reference/credentials-sharing.md) – Kredensial LLM untuk langkah AI
