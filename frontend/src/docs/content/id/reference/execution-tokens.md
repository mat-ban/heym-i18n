# Token Eksekusi

Execution token adalah JWT dengan cakupan tertentu yang memberikan akses ke endpoint execute dan stream dari satu workflow. Token ini memungkinkan Anda memanggil workflow dari sistem eksternal tanpa mengekspos token sesi pengguna Anda yang berumur panjang.

## Mengapa Menggunakan Execution Token

Ketika autentikasi sebuah workflow diatur ke **JWT**, endpoint biasanya memerlukan sesi pengguna yang valid. Execution token memungkinkan Anda untuk:

- Membagikan token yang dapat dipanggil ke skrip eksternal, pipeline CI, atau integrasi tanpa membagikan kredensial akun Anda.
- Membatasi eksposur — token hanya valid untuk satu workflow tertentu.
- Mencabut akses secara instan tanpa mengubah kata sandi atau merotasi token sesi.
- Memilih antara token berumur pendek (menit atau jam) dan token berumur panjang (hingga 10 tahun).

## Membuat Token

Buka dialog **Run with cURL** di editor (toolbar kanan atas). Ketika autentikasi workflow diatur ke **JWT Token**, dialog akan menampilkan pengelola token:

1. Pilih **Short-lived** atau **Long-lived (10yr)**.
2. Untuk token berumur pendek, masukkan durasi dalam detik (minimum 60).
3. Klik **+ New Token**.

Token akan dibuat segera, ditambahkan ke daftar, dan dipilih secara otomatis sehingga perintah cURL diperbarui untuk menyertakannya.

## Daftar Token

Setiap baris token menampilkan:

| Kolom | Deskripsi |
|--------|-------------|
| Created | Timestamp pembuatan |
| Status | **Expires:** tanggal, **Expired**, atau **Revoked** |
| Ikon mata | Mengalihkan visibilitas nilai token |
| Tombol Revoke | Menandai token sebagai dicabut (tidak dapat dibatalkan) |

Klik baris mana pun yang aktif (belum kedaluwarsa, belum dicabut) untuk memilihnya. Token yang dipilih akan disematkan dalam pratinjau perintah cURL.

Token yang kedaluwarsa dan dicabut tetap terlihat dalam daftar tetapi tidak dapat dipilih.

## Menggunakan Token

Salin nilai token dari daftar (klik ikon mata untuk menampilkannya) dan sertakan sebagai token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Ketika Anda menggunakan **Copy cURL** di dialog dengan token yang dipilih, token sudah disematkan dalam perintah — tidak perlu substitusi manual.

## Cakupan Token

Setiap token membawa klaim JWT berikut:

| Klaim | Nilai |
|-------|-------|
| `sub` | ID Pengguna dari pembuat token |
| `wid` | UUID Workflow — token akan ditolak untuk workflow lain |
| `scope` | `workflow:execute` — membedakannya dari token sesi pengguna |
| `jti` | ID token unik yang digunakan untuk pencarian pencabutan |
| `exp` | Timestamp kedaluwarsa |

Backend memeriksa semua ini pada setiap permintaan: validitas tanda tangan, kedaluwarsa, kecocokan `wid`, dan bahwa `jti` belum dicabut.

## Pencabutan

Klik tombol revoke (lingkaran dengan garis miring) di samping token untuk mencabutnya. Pencabutan berlaku segera — permintaan berikutnya yang menggunakan token tersebut akan mengembalikan `401`. Baris token tetap terlihat dalam daftar dengan label **Revoked**.

Tidak ada pembatalan pencabutan. Buat token baru jika Anda perlu memulihkan akses.

## API

Endpoint pengelolaan token diautentikasi dengan sesi reguler Anda.

| Metode | Path | Deskripsi |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Membuat token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Menampilkan daftar token Anda untuk workflow ini |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Mencabut token |

**Body permintaan Create:**

```json
{ "ttl_seconds": 900 }
```

**Respons Create:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Field `token` hanya dikembalikan sekali saat pembuatan. Simpan segera; permintaan `GET` berikutnya mengembalikan baris yang sama tetapi Anda juga dapat menampilkannya di dialog cURL kapan saja.

## Cakupan Visibilitas

Setiap pengguna hanya melihat token yang mereka buat. Anggota tim yang memiliki akses ke workflow bersama tidak dapat melihat token satu sama lain.

## Terkait

- [Webhook](./webhooks.md) — Endpoint Trigger HTTP dan dialog cURL
- [Keamanan](./security.md) — Ringkasan manajemen sesi dan autentikasi
- [SSE Streaming](./sse-streaming.md) — Menggunakan execution token dengan endpoint streaming
