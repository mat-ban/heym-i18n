# Board

Tab **Board** adalah papan kanban agentic. Pekerjaan bergerak melalui kolom, dan setiap
kolom dapat menjalankan Workflow Heym. Sebuah kartu bukan sekadar tugas — ia adalah
pekerjaan agentic persisten yang membawa konteks, riwayat percakapan, status eksekusi, output,
dan workflow run.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Board dan kolom

- Anda dapat membuat board sebanyak yang diperlukan. Board baru dimulai dengan kolom
  bawaan **Backlog → Planning → Development → Done**.
- Setiap board memerlukan **Agentic Kanban Model** (sebuah credential beserta model). Ini
  bersifat wajib — dialog New board tidak akan membuat board tanpa model tersebut, dan board
  yang tidak memilikinya akan menonaktifkan seluruh aksinya — karena model inilah yang memetakan setiap
  kartu ke dalam input workflow yang dijalankannya dan mengubah outputnya kembali menjadi
  teks yang dapat dibaca.
- Ikon gear di header board membuka pengaturan board: nama, deskripsi
  (ditampilkan di bawah header) dan Agentic Kanban Model.
- Kolom sepenuhnya dapat diedit: tambah, ganti nama, ubah warna, ubah urutan, atau hapus dari
  pengaturan kolom (sebuah kolom harus kosong sebelum dapat dihapus).
- Kartu diurutkan secara vertikal berdasarkan prioritas — seret untuk mengubah urutan.
- Anda juga dapat membuat kartu dari [Chat tab](./chat-tab.md) dengan permintaan
  bahasa alami. Chat akan meminta Anda memilih board bila diperlukan dan selalu menambahkan kartu ke
  kolom pertama board tersebut.

## Berbagi board

Pengaturan board juga dapat membagikan board kepada **pengguna** (melalui email) dan kepada **tim**, dengan
izin `read` atau `write`:

- **read** — board dan kartunya terlihat, tetapi tidak ada yang dapat diubah: tidak ada kartu
  baru, tidak ada pemindahan, tidak ada komentar, tidak ada run.
- **write** — penggunaan penuh atas board: kartu, pemindahan, komentar dan run.
- Hanya **owner** yang melihat tombol gear dan hapus, dan hanya owner yang dapat mengubah
  pengaturan board, Agentic Kanban Model, atau pembagiannya.

Chain pada board yang dibagikan selalu berjalan dengan credential dan Agentic Kanban
Model milik **owner**, sehingga kolaborator tidak perlu memilikinya sendiri.

## Lampiran kartu

Buka sebuah kartu dan gunakan **Attach file** untuk menambahkan file ke dalamnya — jatuhkan file ke kotak atau pilih
dengan tombol, dan hapus dari daftar yang sama. Lampiran disimpan di
[Drive](./drive-tab.md).

Setiap run **menyelesaikan lampiran sebelum workflow dimulai**, berdasarkan jenisnya:

- **Dokumen** (pdf, markdown, csv, json, text) diekstrak menjadi teks, dibatasi 20.000
  karakter per file, pada field `text` lampiran tersebut.
- **Gambar** diserahkan sebagai `url` yang dimuat langsung oleh jalur vision (input gambar
  Node LLM menerimanya apa adanya).
- **Jenis lainnya** diteruskan sebagai referensi biasa (`name`, `url`, `mime_type`).

Workflow membacanya pada `$input.card.attachments` (dan selalu pada `$input.board.attachments`,
apa pun yang dipetakan oleh mapper). Agentic Kanban Model juga melihat teks yang diekstrak dan URL
gambar, sehingga dapat memetakan lampiran langsung ke field yang diharapkan workflow.

## Chain workflow kolom

Setiap kolom dapat dikonfigurasi dengan **daftar workflow terurut** (chain).
Ketika sebuah kartu berpindah ke kolom yang memiliki chain:

1. Chain dimulai secara otomatis di latar belakang — pemindahan itu sendiri tidak pernah menunggu.
2. Workflow berjalan **secara berurutan**. Output setiap workflow ditambahkan ke konteks
   kartu sebelum workflow berikutnya dimulai.
3. Jika sebuah workflow gagal, chain berhenti: tautan yang tersisa dilewati dan
   kartu berubah menjadi **merah**.
4. Ketika setiap tautan berhasil, kartu berubah menjadi **hijau**. Selama chain berjalan
   kartu berdenyut **kuning**; run yang dijeda untuk peninjauan manusia menampilkan status kuning
   statis.

Run dicatat dalam [Execution History](../reference/execution-history.md) dengan sumber trigger
`board`, dan setiap kartu menyimpan daftar run-nya sendiri dengan output dan error
per-workflow. Buka sebuah kartu saat workflow sedang berjalan dan pilih **Open live** di samping
run untuk melampirkan editor ke eksekusi tersebut secara persis. Animasi kanvas yang sama, log Debug
inkremental, dan hasil akhir akan muncul tanpa memulai run kedua.
## Data yang diterima oleh Workflow

Rantai tersebut meneruskan payload standar sebagai input Workflow. Bacalah dengan
[ekspresi](../reference/expression-dsl.md) normal seperti `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — setiap komentar pada card, dari yang paling lama.
- `history` — linimasa aktivitas lengkap (komentar, perpindahan, output), dibatasi pada
  200 entri terbaru.
- `previous_outputs` — output dari eksekusi yang telah selesai sebelumnya (kolom sebelumnya dan
  putaran tindak lanjut).
- `chain.previous_workflow_outputs` — output dari tautan sebelumnya dalam rantai
  *saat ini*.
- Pada putaran tindak lanjut, `move` bernilai `null` dan `rerun` bernilai `true`.

## Loop perencanaan (putaran tindak lanjut)

Pola umum adalah menempatkan Workflow perencanaan pada **kolom kedua** (secara default
bernama Planning — namanya tidak penting; slot-nya yang penting). Workflow tersebut memperkaya
card dan mengajukan pertanyaan tindak lanjut:

1. Pindahkan card ke kolom kedua — Workflow menulis rencana yang diperkaya beserta
   pertanyaannya kembali ke card sebagai output.
2. Jawab pada thread komentar card. Jawaban tersebut melepaskan card: card berpindah ke
   kolom berikutnya, yang mengambilnya dengan jawaban dalam konteks. Rantai pada kolom kedua
   tidak dijalankan kembali.
3. Untuk menyempurnakan rencana di tempat sebagai gantinya, tekan **Run follow-up round**. Rantai
   yang sama dijalankan kembali dengan seluruh konteks yang terakumulasi, lalu card menunggu di kolom tersebut
   hingga Anda menambahkan komentar untuk melepaskannya.

Gerbang perencanaan bersifat posisional, bukan berbasis nama: kolom paling kiri dan kolom
tepat di sebelah kanannya tidak pernah berpindah dengan sendirinya — keduanya menjalankan
rantainya dan menunggu di sana untuk Anda (sebuah komentar melepaskan kolom kedua). Dari kolom ketiga
dan seterusnya, rantai yang berhasil memajukan card ke kanan dengan sendirinya, hingga ke kolom
terakhir. Mengganti nama atau menghapus label "Planning" bawaan tidak mengubah slot mana
yang menjadi gerbang. Sebuah card hanya dapat memiliki satu eksekusi aktif pada satu waktu.

## Human-in-the-loop dan pertanyaan Codex

Jika Workflow dalam rantai berhenti sementara — pada Node
[Human-in-the-Loop](../reference/human-in-the-loop.md), pada tool HITL milik agen, atau karena Node
[Codex](../nodes/codex-node.md) memerlukan informasi lebih lanjut — eksekusi tersebut dipersistenkan sebagai pending dan card menampilkan
status pending berwarna kuning. Setiap jeda mempertahankan permukaan jawabannya sendiri: tautan tinjauan HITL untuk HITL, layar
tindak lanjut Codex untuk Codex.

Setelah Anda menjawab, rantai dilanjutkan dengan sendirinya: Workflow yang dijeda selesai, output-nya
mendarat pada card, sisa rantai pada kolom tersebut dijalankan, dan card maju seperti biasa.
Jika eksekusi yang dilanjutkan gagal, card berubah menjadi merah dan tautan yang tersisa dilewati.

## Terkait

- [Workflow](./workflows-tab.md)
- [Riwayat Eksekusi](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
