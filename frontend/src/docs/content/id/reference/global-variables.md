# Variabel Global

**Global Variable Store** menyimpan data key-value persisten yang bersifat user-scoped dan tetap bertahan di seluruh eksekusi workflow. Gunakan untuk konfigurasi, feature flag, counter, atau state bersama yang dibutuhkan oleh beberapa workflow.

> **Jangan menyimpan secret di sini.** Variabel global bukanlah vault untuk secret: nilai disimpan tanpa enkripsi, dikembalikan secara penuh kepada siapa pun yang Anda bagikan, dan kolaborator dapat mengeditnya. API key, password, dan token sebaiknya disimpan di [Credentials](./credentials.md), yang mengenkripsinya saat disimpan dan tidak pernah mengembalikan secret ke klien.

## Lokal vs Global

| Store | Sintaks | Cakupan | Persistensi |
|-------|--------|-------|-------------|
| **Workflow-local** | `$vars.variableName` | Hanya eksekusi saat ini | In-memory, hilang saat eksekusi berakhir |
| **Global** | `$global.variableName` | Semua workflow milik pengguna | Tersimpan di database |

## Membuat Variabel Global

1. **Dari tab Variables** – [Variables Tab](../tabs/global-variables-tab.md): Buat, edit, dan hapus variabel secara langsung.
2. **Dari node Variable** – Aktifkan **Store in Global Variable Store** (`isGlobal: true`) pada properti node. Variabel akan ditulis ke store saat workflow dijalankan.

## Penggunaan dalam Ekspresi

Akses variabel global dengan `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Gunakan metode yang sama seperti variabel workflow-local (misalnya `.upper()`, `.length`, `.add()` untuk array).

## Tipe Nilai

Tipe yang didukung: `string`, `number`, `boolean`, `array`, `object`. Pilih tipe saat membuat atau mengedit variabel.

## Berbagi Variabel Global

Anda dapat membagikan variabel global kepada pengguna lain atau [Teams](./teams.md) agar mereka dapat menggunakannya dalam workflow mereka sendiri.

- **Bagikan ke pengguna** – Klik ikon share di samping variabel yang Anda miliki, masukkan email penerima, lalu klik **Share**. Penerima akan melihat variabel tersebut di daftar Global Variables mereka dengan badge **Shared** dan label "Shared by &lt;email Anda&gt;".
- **Bagikan ke team** – Pada dialog share, pilih sebuah team lalu klik **Add**. Semua anggota team akan mendapatkan akses.
- **Akses yang dapat diedit** – Penerima dapat melihat, mengedit, dan mereferensikan variabel yang dibagikan melalui `$global.variableName` di workflow mereka. Hanya pemilik yang dapat membagikan, membatalkan pembagian, atau menghapus variabel.
- **Konflik nama** – Jika penerima sudah memiliki variabel dengan nama yang sama, variabel miliknya sendiri yang akan diprioritaskan dibandingkan variabel yang dibagikan.
- **Batalkan pembagian** – Buka dialog share untuk variabel tersebut dan klik tombol **×** di samping pengguna yang ingin Anda cabut aksesnya.

## Integrasi Chat

Variabel global tersedia untuk asisten [Chat](../tabs/chat-tab.md). LLM dapat mereferensikannya saat menjawab pertanyaan atau menghasilkan konten.

## Terkait

- [Variables Tab](../tabs/global-variables-tab.md) – Mengelola variabel global di UI
- [Variable Node](../nodes/variable-node.md) – Menetapkan variabel dengan `isGlobal`
- [Expression DSL](./expression-dsl.md) – Sintaks `$global`
