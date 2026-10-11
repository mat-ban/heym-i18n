# Kode

Node **Code** menjalankan Python yang Anda tulis, dengan `requirements.txt`-nya sendiri, dan mengembalikan JSON. Setiap eksekusi mendapatkan container yang benar-benar baru yang dihancurkan saat proses selesai, sehingga satu eksekusi tidak akan pernah dapat melihat atau memengaruhi eksekusi lain.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.result` (apa pun yang dikembalikan `main`), ditambah `$nodeLabel.logs` dan `$nodeLabel.install` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `codeSource` | string | Sumber Python. Harus mendefinisikan `main(params)` dan mengembalikan nilai yang dapat diserialisasi JSON |
| `codeParameters` | expression | Objek JSON yang menghubungkan data workflow ke dalam kode. Ekspresi diselesaikan sebelum kode dijalankan |
| `codeRequirements` | string | Isi `requirements.txt`, satu paket per baris. Kosong akan melewati instalasi |
| `codeAllowNetwork` | boolean | Apakah kode itu sendiri boleh mengakses jaringan (default `false`) |

## Fungsi `main`

Kode Anda harus mendefinisikan `main` tingkat atas yang menerima satu argumen:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Pernyataan tingkat modul tetap dijalankan, tetapi hanya apa yang dikembalikan `main` yang menjadi output node.

Editor menampilkan nomor baris, dan tombol perluas di samping **Format** membuka editor yang lebih besar yang ditutup dengan `Esc` — pengeditan diterapkan saat Anda mengetik, jadi tidak ada yang perlu disimpan. Tombol **Format** memformat ulang kode Anda dengan Ruff, dengan tetap mempertahankan komentar. Tombol ini juga memperbaiki kerusakan indentasi yang biasanya disebabkan oleh penempelan: blok yang terindentasi secara seragam, tab yang bercampur dengan spasi, dan baris yang posisinya menyimpang satu atau dua spasi dari bloknya semuanya diperbaiki alih-alih ditolak. Kesalahan sintaks yang sebenarnya dilaporkan beserta baris dan kolomnya. Pemformatan berjalan di container terisolasi yang sama dengan tempat node berjalan — tanpa jaringan, tanpa lingkungan backend — sehingga memerlukan Docker sama seperti eksekusi.

## Membaca parameter

`params` mendukung notasi titik, termasuk melalui objek dan list bersarang:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` membaca key yang bukan pengenal Python yang valid
- `params.get("maybe")` mengembalikan `None` alih-alih memunculkan error saat key tidak ada
- `params.to_dict()` mengembalikan dictionary biasa
- Membaca key yang tidak pernah disediakan akan memunculkan error yang menyebutkan nama key dan mencantumkan apa yang tersedia

## Output

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — nilai kembalian dari `main`. Node hilir membaca `$nodeLabel.result.message`
- `logs` — semua yang dikirim kode ke `print`, ditangkap secara terpisah sehingga tidak pernah merusak hasil
- `install` — alat mana yang menginstal dependensi (`uv`, `pip`, atau `none`) beserta outputnya

## Dependensi

Cantumkan paket di `requirements.txt` persis seperti yang Anda lakukan secara lokal:

```
requests==2.32.3
feedparser
```

Paket diinstal dengan `uv` ke direktori sementara sebelum kode dijalankan; jika `uv` tidak dapat menangani suatu paket, Heym mencoba lagi dengan `pip`. Tidak ada yang di-cache antar eksekusi, sehingga dependensi yang berat menambah beberapa detik pada setiap eksekusi. Membiarkan `requirements.txt` kosong akan melewati langkah instalasi sepenuhnya dan terasa jauh lebih cepat.

Paket yang tidak menyertakan wheel dan memerlukan kompilator C akan gagal diinstal. Penyebabnya muncul di `install.log`.

## Jaringan

| Fase | Jaringan |
|-------|---------|
| Menginstal dependensi | Selalu aktif — pip dan uv harus menjangkau PyPI |
| Menjalankan kode Anda | Nonaktif secara default. `codeAllowNetwork` mengaktifkannya |

Dengan `codeAllowNetwork` nonaktif, panggilan keluar seperti `requests.get(...)` akan gagal dengan error koneksi. Itulah default yang dimaksudkan: sebagian besar node Code mentransformasi data yang sudah diambil oleh node lain. Sebaiknya ambil data dengan node **HTTP** dan teruskan body-nya melalui `codeParameters`.

## Sandbox dan batasan

Kode Anda berjalan sebagai pengguna non-root di dalam container dengan semua kemampuan Linux dihapus, `no-new-privileges` diaktifkan, dan filesystem root bersifat read-only. Kode tidak menerima Docker socket maupun rahasia atau lingkungan backend.

| Batasan | Nilai |
|-------|-------|
| Memori | 512 MB |
| CPU | 1 |
| Proses | 256 |
| Timeout instalasi dependensi | 120 detik |
| Timeout eksekusi | 60 detik |

Ini adalah properti tetap dari sandbox, bukan konfigurasi.

> **Docker diperlukan.** Berbeda dengan Agent Python tools dan skills, node Code tidak memiliki mode fallback lokal dan tidak ada variabel lingkungan untuk melonggarkannya. Tanpa daemon Docker yang dapat dijangkau, node akan gagal dengan error yang jelas alih-alih menjalankan kode Anda di proses backend. Pada pengembangan `./run.sh` native, jalankan Docker sebelum menggunakan node ini. Lihat [Security → Code node sandbox](../reference/security.md#code-node-sandbox).

## Gunakan node lain saat cocok

| Anda ingin | Gunakan |
|-------------|-----|
| Mengurai atau membangun CSV, TSV, XML, atau melakukan OCR pada file | [Converter](converter-node.md) |
| Memanggil HTTP API | [HTTP](http-node.md) |
| Memetakan atau mengganti nama field | [Set](set-node.md) |
| Menjalankan workflow lain | [Execute](execute-node.md) |

Gunakan **Code** ketika logikanya benar-benar tidak cocok dengan node tersebut — perhitungan matematis khusus, penguraian khusus, atau sebuah algoritma.
## Contoh

Baris skor yang dihasilkan oleh node hulu:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Dengan `codeParameters` diatur ke `{ "rows": "$fetchRows.result" }`, node hilir membaca `$scoreRows.result.total`.
