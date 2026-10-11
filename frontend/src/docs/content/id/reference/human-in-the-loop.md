# Human-in-the-Loop

Human-in-the-loop (HITL) memungkinkan [Node Agent](../nodes/agent-node.md) untuk meminta persetujuan pada momen-momen tertentu, menunggu keputusan manusia, lalu melanjutkan Workflow dari snapshot eksekusi yang sama.

## Fungsinya

- Menambahkan checkpoint persetujuan eksplisit ke agen tanpa membangun Workflow persetujuan terpisah
- Membuat URL review publik sekali pakai di `/review/{token}`
- Memungkinkan reviewer untuk `Accept`, `Edit & Continue`, atau `Refuse`
- Menandai eksekusi sebagai `pending` hingga keputusan diterima
- Melanjutkan eksekusi yang dijeda dan memungkinkan agen melanjutkan setelah persetujuan
- Mendukung beberapa checkpoint HITL berurutan dalam satu eksekusi agen

## Konfigurasi Agen

Aktifkan HITL pada panel properti agen.

| Pengaturan | Deskripsi |
|---------|-------------|
| `hitlEnabled` | Mengaktifkan review manusia untuk agen ini |
| `hitlSummary` | Panduan persetujuan untuk menentukan kapan agen harus meminta review manusia |

HITL menambahkan tool `request_human_review` ke agen. Gunakan system prompt dan panduan `hitlSummary`
untuk memberi tahu agen tindakan mana yang memerlukan persetujuan. Ketika agen memutuskan bahwa suatu checkpoint
perlu direview, agen mengirimkan satu teks review Markdown kepada manusia. Ringkasan yang ditampilkan kepada
reviewer dihasilkan dari permintaan agen pada saat runtime; jika agen tidak menyertakannya, Heym akan menurunkannya dari
badan Markdown. Pada v1, HITL hanya mendukung output agen dalam mode teks, sehingga tidak dapat dikombinasikan dengan
`jsonOutputEnabled`.

Untuk tool MCP, Heym meminta model untuk menginterpretasikan instruksi HITL tertulis ke dalam salah satu dari tiga
cakupan persetujuan:

- `always` untuk frasa seperti "always", "on each", atau "for each"
- `once` untuk frasa seperti "once" atau "only one time"
- `never` untuk frasa seperti "never", "do not ask", atau "already approved"

Interpretasi tersebut mengontrol apakah panggilan MCP berulang akan dijeda kembali, tetap disetujui sekali, atau melewati
review manusia sepenuhnya.

Ketika HITL diaktifkan, agen juga mengekspos handle output kanvas kedua yang diberi label `review`. Gunakan cabang tersebut untuk mengirim URL review yang tertunda dan ringkasannya ke Slack, email, logging, atau alur notifikasi lainnya selama eksekusi utama menunggu seseorang.

## Alur Review

1. Agen mencapai langkah yang memerlukan persetujuan dan memanggil `request_human_review`
2. Heym membuat permintaan review publik dan mengembalikan URL review
3. Node apa pun yang terhubung ke handle `review` agen akan berjalan segera dengan payload HITL yang tertunda
4. Eksekusi Workflow berpindah ke status `pending`
5. Reviewer membuka `/review/{token}` tanpa perlu login
6. Reviewer memilih salah satu tindakan:
   - `Accept` melanjutkan dengan Markdown asli
   - `Edit & Continue` melanjutkan dengan Markdown yang telah diedit
   - `Refuse` melanjutkan dengan `decision: "refused"` dan melewati tindakan agen selanjutnya
7. Heym melanjutkan Workflow dari snapshot yang tersimpan dan memungkinkan agen melanjutkan dengan konteks Markdown yang disetujui
8. Jika langkah berikutnya juga memerlukan persetujuan, agen dapat memanggil HITL lagi dan membuat checkpoint tertunda lainnya

Tautan review kedaluwarsa setelah 168 jam jika tidak ada yang merespons.

## Halaman Review Publik

Halaman review publik menampilkan:

- Nama Workflow dan label agen
- Ringkasan reviewer yang dihasilkan otomatis dari permintaan review agen
- Teks review Markdown terlebih dahulu, sebagai konten utama
- Kotak edit yang hanya terbuka setelah reviewer mengklik `Edit`
- Pratinjau Markdown langsung saat mengedit
- Tombol tindakan untuk `Accept`, `Edit & Continue`, dan `Refuse`

Setelah keputusan dikirimkan, token akan terkunci dan tidak dapat digunakan kembali.

## Output dan Status Eksekusi

Selama menunggu review, output agen berisi payload tertunda:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Setelah reviewer merespons dan Workflow dilanjutkan, output akhir agen menyertakan metadata keputusan:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Gunakan `$agentLabel.decision` pada Node hilir untuk melakukan percabangan berdasarkan hasil accepted, edited, atau refused.

## Cabang Review pada Kanvas

Handle output `review` hanya tersedia ketika `hitlEnabled` diaktifkan untuk agen.

- Cabang ini berjalan sebelum keputusan manusia diterima
- Cabang ini menerima payload HITL yang tertunda, termasuk `summary`, `draftText`, `reviewUrl`, `shareText`, dan `shareMarkdown`
- Cabang ini ditujukan untuk langkah notifikasi atau serah terima seperti Slack, email, atau audit logging
- Cabang ini berjalan sekali untuk setiap checkpoint HITL
- Cabang ini tidak berjalan lagi setelah reviewer merespons; hanya jalur output agen normal yang dilanjutkan saat resume
## Di Mana Ini Muncul

- [Execution History](./execution-history.md) menampilkan proses `pending` secara langsung dan menyimpan URL review di hasil Node
- Respons chat [Portal](./portal.md) menampilkan tautan human review alih-alih jawaban kosong
- Panel Debug dan dialog riwayat menampilkan keputusan HITL akhir dan teks yang telah di-review
- Output handle review dapat memberi notifikasi ke kanal eksternal bahkan ketika Workflow dipicu oleh cron, curl, atau lalu lintas portal
- Beberapa checkpoint HITL menggunakan kembali entri execution history yang sama sekaligus membuat tautan review sekali pakai yang baru untuk setiap jeda

## Batasan Saat Ini

- HITL hanya tersedia pada Node Agent
- HITL menggunakan output teks agen dan tidak mendukung output JSON pada v1
- Eksekusi yang dijeda dilanjutkan dari snapshot Workflow yang tersimpan, bukan dari versi Workflow terbaru yang telah diedit
- Sub-workflow bersarang tidak dapat memasuki status HITL pending pada v1; ajukan review dari agen induk sebelum memanggilnya

## Terkait

- [Agent Node](../nodes/agent-node.md) - Konfigurasikan HITL pada agen
- [Agent Architecture](./agent-architecture.md) - Bagaimana agen, tools, sub-agen, dan HITL saling terhubung
- [Execution History](./execution-history.md) - Periksa proses yang pending dan yang dilanjutkan
- [Board](../tabs/board-tab.md) - Proses rantai Board menjeda kartu dalam status pending (amber) saat HITL
- [Portal](./portal.md) - Alur chat publik dan tautan review HITL
