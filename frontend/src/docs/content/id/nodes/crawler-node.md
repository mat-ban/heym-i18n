# Crawler

Node **Crawler** melakukan scraping halaman web menggunakan FlareSolverr dengan ekstraksi HTML opsional melalui CSS selector. Gunakan node ini untuk web scraping dan ekstraksi konten.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.body` (HTML atau konten yang diekstraksi) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `credentialId` | UUID | Kredensial FlareSolverr dari [Credentials](../tabs/credentials-tab.md) |
| `crawlerUrl` | expression | URL yang akan di-scrape (mendukung expression) |
| `crawlerWaitSeconds` | number | Jumlah detik untuk menunggu sebelum scraping (default: 0) |
| `crawlerMaxTimeout` | number | Timeout maksimum dalam ms (default: 60000) |
| `crawlerMode` | string | `"basic"` atau mode lainnya |
| `crawlerSelectors` | array | CSS selector untuk ekstraksi. Setiap item: `{ selector, attribute? }` |

## Contoh

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Keamanan Egress

- URL FlareSolverr yang tersimpan dalam kredensial harus menggunakan `http://` atau `https://` dan tidak boleh mengarah ke alamat link-local atau cloud-metadata. Kumpulan alamat yang ditolak adalah `169.254.0.0/16`, `fe80::/10`, alamat metadata IPv6 Alibaba Cloud dan AWS, serta bentuk transisi IPv6 yang dapat membawa salah satunya. Ini adalah daftar endpoint yang diketahui, bukan jaminan untuk setiap penyedia.
- Alamat loopback dan privat diizinkan secara sengaja, sehingga konfigurasi `http://localhost:8191` yang didokumentasikan dan nama layanan compose seperti `http://flaresolverr:8191` tetap berfungsi. Konsekuensinya, field ini juga dapat diarahkan ke layanan lain apa pun yang dapat dijangkau backend pada alamat tersebut, dan responsnya dikembalikan dalam output node. Berbagi kredensial tidak mengatasi hal ini: setiap pengguna yang telah masuk dapat membuat kredensial FlareSolverr miliknya sendiri, sehingga menahan kredensial yang ada tidak mengubah apa pun. Kontrol yang benar-benar berlaku adalah memercayai orang-orang yang dapat membuat workflow, dan aturan jaringan yang membatasi apa yang dapat dijangkau backend.
- Heym menyematkan alamat yang telah di-resolve sebelum terhubung, sehingga jawaban DNS tidak dapat memindahkan permintaan ke alamat metadata setelah pemeriksaan. Proxy lingkungan dinonaktifkan selama guard aktif, dan redirect tidak diikuti.
- Halaman yang kemudian diambil FlareSolverr untuk Anda adalah hop terpisah yang di-resolve sendiri oleh FlareSolverr. Heym tidak memeriksanya, sehingga pembatasan ke mana container FlareSolverr boleh terhubung merupakan tanggung jawab kebijakan jaringan Anda.
- Deployment self-hosted yang tepercaya dapat menonaktifkan aturan metadata dengan `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Biarkan default tetap aktif pada deployment hosted atau multi-tenant.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Playwright Node](./playwright-node.md) – Alternatif otomatisasi browser
- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan kredensial FlareSolverr
