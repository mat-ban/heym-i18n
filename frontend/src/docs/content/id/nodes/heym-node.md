# Heym

Node **Heym** membaca data milik Heym sendiri: workflow yang dapat Anda jangkau, struktur satu workflow, dan riwayat eksekusinya. Inilah cara Anda membangun meta-workflow — inventaris instance, ringkasan eksekusi, dan laporan kesehatan tentang Heym itu sendiri.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Operasi | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credential | Tidak diperlukan |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `heymOperation` | Select | Pembacaan mana yang akan dilakukan |
| `heymWorkflowId` | UUID | Atur ke `all` pada `getExecutionHistory` untuk membaca setiap Workflow yang dapat Anda jangkau. |
| `heymLimit` | String | Jumlah maksimum baris yang dikembalikan. **Biarkan kosong atau masukkan `0` untuk mengembalikan semuanya** — itulah nilai defaultnya. Mendukung ekspresi. |
| `heymStatus` | String | Filter status opsional untuk `getExecutionHistory`. Mendukung ekspresi. |
| `heymSinceDays` | String | Rentang lihat ke belakang opsional dalam satuan hari untuk `getExecutionHistory`. Mendukung ekspresi. |

Pemilih workflow adalah dropdown yang dapat dicari yang menampilkan setiap workflow yang dapat Anda jangkau.

## Cakupan Akses

Hasil dibatasi pada **pemilik workflow tempat node berada** — bukan pada siapa pun yang memulai eksekusi. Kumpulan yang terlihat adalah:

- workflow yang dimiliki oleh pemilik,
- workflow yang dibagikan secara langsung kepada pemilik,
- workflow yang dibagikan kepada tim tempat pemilik menjadi anggotanya.

Pembatasan berdasarkan pemilik inilah yang membuat node berperilaku identik baik ketika eksekusi dimulai secara manual, oleh cron, dari portal, maupun oleh event platform. Pembatasan berdasarkan aktor akan mengembalikan hasil kosong pada setiap eksekusi tanpa pengawasan. Ini adalah aturan yang sama yang sudah digunakan Heym untuk credential dan variabel global.

Workflow yang tidak dapat Anda jangkau dan workflow yang tidak ada akan menghasilkan pesan error yang sama, sehingga node tidak dapat digunakan untuk menyelidiki id workflow.

## Operasi

### List Workflows

Mengembalikan setiap workflow yang dapat dijangkau oleh pemilik, dengan yang paling baru diperbarui di urutan pertama.

| Ekspresi | Deskripsi |
|------------|-------------|
| `$nodeLabel.workflows` | Array berisi ringkasan workflow |
| `$nodeLabel.workflows[0].id` | UUID workflow |
| `$nodeLabel.workflows[0].name` | Nama workflow |
| `$nodeLabel.workflows[0].description` | Deskripsi, atau `null` |
| `$nodeLabel.workflows[0].active` | Apakah workflow aktif |
| `$nodeLabel.workflows[0].folder_id` | UUID folder, atau `null` |
| `$nodeLabel.workflows[0].updated_at` | Timestamp ISO dari penyimpanan terakhir |
| `$nodeLabel.workflows[0].node_count` | Berapa banyak node yang dimuat workflow |
| `$nodeLabel.total` | Jumlah lengkap yang dapat diakses **sebelum** limit diterapkan |

`total` sengaja merupakan jumlah tanpa batas, sehingga `$inventory.total` tetap melaporkan ukuran sebenarnya ketika Anda membatasi baris yang dikembalikan. Mengosongkan **Limit**, atau mengisinya dengan `0`, akan mengembalikan setiap workflow — yang merupakan nilai defaultnya.

### Get Workflow

Mengembalikan identitas dan bentuk satu workflow.

| Ekspresi | Deskripsi |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identitas workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadata workflow |
| `$nodeLabel.node_count` | Jumlah node |
| `$nodeLabel.nodes` | Array berisi `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array berisi `{ id, source, target, sourceHandle, targetHandle }` |

`data` adalah **konfigurasi node secara lengkap** — setiap field sebagaimana disimpan. Inilah yang memungkinkan audit: Anda tidak dapat memindai workflow untuk mencari API key yang ditempelkan seseorang ke dalam sebuah field jika node menolak menampilkan field tersebut.

Ini tidak memberikan jangkauan yang belum dimiliki pemanggil. Node dibatasi pada workflow yang memang dapat dibuka oleh pemilik di editor, dan secret credential yang tersimpan tetap tidak ada di sini: data node hanya memuat **id** credential, sedangkan secret-nya sendiri tersimpan terenkripsi di tabel credentials.

### Memindai secret yang di-hardcode

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Berikan `$detail.nodes` kepada agent dan minta agent menandai setiap nilai `data` yang tampak seperti key atau token yang masih aktif. Field yang perlu diperhatikan adalah field teks bebas — `curl` pada node HTTP, `userMessage` dan `systemInstruction` pada node LLM dan Agent, serta isi tool Python — karena id credential adalah UUID yang tidak berbahaya, tetapi `sk-…` yang ditempelkan tidaklah demikian.
### Dapatkan Riwayat Eksekusi

Mengembalikan entri riwayat eksekusi untuk satu workflow, yang terbaru lebih dahulu.

| Expression | Description |
|------------|-------------|
| `$nodeLabel.executions` | Array entri riwayat |
| `$nodeLabel.executions[0].id` | UUID eksekusi |
| `$nodeLabel.executions[0].status` | `success`, `error`, dan sebagainya |
| `$nodeLabel.executions[0].started_at` | Timestamp ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Durasi wall-clock |
| `$nodeLabel.executions[0].trigger_source` | Apa yang memulai eksekusi, misalnya `cron` atau `heym_event` |
| `$nodeLabel.executions[0].recovered` | Apakah eksekusi dipulihkan setelah crash |
| `$nodeLabel.executions[0].inputs` | Apa yang diterima eksekusi - payload trigger atau input dari pemanggil |
| `$nodeLabel.executions[0].outputs` | Output workflow untuk eksekusi tersebut |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow tempat riwayat ini berada, atau `null` dengan **{AW}** |
null` dengan **{AW}** |
| `$nodeLabel.total` | Total eksekusi yang cocok **sebelum** limit |
| `$nodeLabel.by_stat| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Dengan **{AW}**, Workflow tempat setiap run berada |
us` | Jumlah yang dikelompokkan berdasarkan status, misalnya `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Awal jendela waktu, atau `null` untuk seluruh riwayat |

Entri membawa `inputs` dan `outputs` - apa yang diterima eksekusi dan apa yang dijawabnya - tetapi tidak pernah `node_results`: jejak per-node adalah kolom terbesar dalam tabel dan akan membuat semua data di hilirnya tampak kecil. Ambil satu eksekusi melalui API ketika Anda memerlukan jejak lengkap.

`total` dan `by_status` selalu menggambarkan **seluruh** riwayat yang cocok, bahkan ketika **Limit** membatasi entri yang dikembalikan — sehingga Anda dapat mengambil lima eksekusi terbaru dan tetap melaporkan jumlah kegagalan yang akurat.

Biarkan **Since (days)** kosong untuk mencakup semuanya, **Status filter** kosong untuk menyertakan setiap status, dan **Limit** kosong atau `0` untuk mengembalikan setiap entri.

## Contoh Workflow

**Digest instance harian**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` berlabel `inventory`
- **Loop** atas `$inventory.workflows`
- **Heym** `getExecutionHistory` dengan `heymWorkflowId` diatur ke `id` item loop, `heymSinceDays` bernilai `1`, dan `heymLimit` bernilai `5`
- **LLM** mengubah eksekusi yang terkumpul dan jumlah status menjadi ringkasan yang mudah dibaca

## Catatan

- Tidak diperlukan credential; node membaca database yang sama dengan yang digunakan Heym.
- **Limit** adalah field yang sama untuk kedua operasi list, dan artinya sama pada keduanya: kosong atau `0` mengembalikan semuanya.
- Node menerima input normal dan dapat dilampirkan ke node Agent sebagai tool, sehingga agent dapat menjawab pertanyaan tentang instance Heym Anda — atau mengauditnya.
- Payload `getWorkflow` bertambah besar seiring workflow: prompt panjang dan isi tool Python semuanya ikut dalam `data`.
- Pasangkan dengan [Heym Trigger](./heym-trigger-node.md) untuk bereaksi terhadap perubahan workflow saat terjadi alih-alih melakukan polling sesuai jadwal.

## Terkait

- [Heym Trigger](./heym-trigger-node.md) – Memulai workflow dari event platform
- [Execute](./execute-node.md) – Menjalankan workflow lain alih-alih mendeskripsikannya
- [Loop](./loop-node.md) – Melakukan iterasi atas daftar workflow yang dikembalikan
