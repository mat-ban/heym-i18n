# Organisasi Workflow

Heym memungkinkan Anda mengatur workflow dalam folder, membuat sub-folder, dan menjadwalkan workflow untuk dihapus. Lihat [Tab Workflows](../tabs/workflows-tab.md) untuk ikhtisar UI.

## Folder dan Sub-folder

Folder membentuk sebuah pohon. Setiap folder memiliki:

- **Name** – Nama tampilan
- **Parent** – `parent_id` terhubung ke folder lain; `null` berarti root
- **Workflows** – Workflow dapat dipindahkan ke dalam folder melalui `folder_id`

### API

| Endpoint | Tujuan |
|----------|---------|
| `GET /folders` | Hanya folder root |
| `GET /folders/tree` | Pohon lengkap (children + workflows) |
| `GET /folders/{id}` | Satu folder beserta isinya |
| `POST /folders` | Membuat folder (`parent_id` opsional) |
| `PUT /folders/{id}` | Memperbarui nama atau `parent_id` |
| `DELETE /folders/{id}` | Menghapus folder (cascade) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Memindahkan workflow ke dalam folder |
| `DELETE /folders/workflows/{workflow_id}/folder` | Menghapus workflow dari folder |
| `GET /folders/{id}/export` | Mengunduh folder + semua subfolder sebagai ZIP |

### Struktur Pohon

Respons pohon menyertakan `children` dan `workflows` per folder. Workflow yang dibagikan dapat muncul dalam sebuah folder melalui `WorkflowShare.folder_id`.

## Berbagi Workflow

Buka **Share** di editor workflow untuk mengundang pengguna melalui email atau berbagi dengan sebuah [tim](./teams.md). Setiap undangan dan setiap pembagian tim membawa sebuah izin:

| Izin | Apa yang dapat dilakukan kolaborator |
|------------|------------------------------|
| **Read** | Membuka workflow, memeriksanya, melihat riwayat eksekusi, dan menjalankannya. Editor terbuka dalam mode hanya-baca: Save dinonaktifkan dan kanvas tidak dapat diubah. |
| **Write** | Semua yang diizinkan oleh Read, ditambah mengedit kanvas, pengaturan, dokumen analisis, dan memori agen. |

Izin ditampilkan di samping setiap entri dalam dialog Share dan dapat diubah kapan saja dari dropdown tersebut, tanpa menghapus dan menambahkan ulang pembagian. Ketika seorang pengguna mencapai workflow melalui beberapa jalur (pembagian langsung dan satu atau lebih tim), izin **tertinggi** yang berlaku. Pembagian yang sudah ada sebelum izin diperkenalkan adalah **Write**, dan klien API yang menghilangkan `permission` juga mendapatkan **Write**.

Tindakan khusus pemilik tidak pernah bergantung pada izin: menghapus workflow, mengembalikan atau membersihkan versi, membersihkan riwayat, mengelola pembagian, dan [pengaturan khusus pemilik](#owner-only-settings) di bawah ini tetap berada pada pemilik bahkan untuk kolaborator **Write**. Kolaborator **Read** yang mengirimkan pengeditan melalui API (`PUT /api/workflows/{id}`, catatan analisis, memori agen, pembersihan cache) atau melalui AI Assistant menerima `403` dengan `You have read-only access to this workflow`.

Berbagi workflow memberikan akses ke kanvas, riwayat eksekusi, dan dokumen analisis. Ini **tidak** secara otomatis membagikan:

- **Credentials** yang direferensikan oleh node dalam workflow
- **Sub-workflow** yang dipanggil oleh node [Execute](../nodes/execute-node.md) atau agen

Penerima memerlukan credentials dan workflow anak tersebut dibagikan kepada mereka secara terpisah (pengguna atau tim yang sama). Bagikan credentials dari [Tab Credentials](../tabs/credentials-tab.md); lihat [Credentials Sharing](./credentials-sharing.md). Bagikan setiap sub-workflow dari dialog share editornya sendiri.

### Pengaturan khusus pemilik

Seluruh konfigurasi **Run with cURL** tetap berada pada pemilik setelah pembagian. Kolaborator tetap dapat membuka dialog dan menyalin perintah yang dihasilkan, tetapi kontrolnya hanya-baca.

Mengubah salah satu dari ini sebagai non-pemilik ditolak dengan `403`:

- **Authentication** (`auth_type`) dan **Header Key** (`auth_header_key`)
- Mode **Request Body** (`webhook_body_mode`) dan **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) dan **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) berperilaku berbeda: ini disembunyikan sepenuhnya dari kolaborator, dan penulisan oleh kolaborator diabaikan alih-alih ditolak. Editor menampilkan bidang tersebut dalam keadaan tersamarkan, sehingga `403` di sana akan merusak penyimpanan biasa alih-alih menandakan serangan.

Authentication adalah alasan blok ini khusus pemilik: `Anonymous` memungkinkan pemanggil yang tidak terautentikasi menjalankan workflow, dan eksekusi tanpa pemanggil yang masuk akan menyelesaikan credentials dan variabel global sebagai **pemilik**, bukan pemanggil. Sisa blok ini adalah kontrak permintaan yang dipublikasikan dan kontrol biaya pemilik, sehingga ikut berpindah bersamanya.

**On error, run workflow** (`error_workflow_id`) di panel **Properties** tingkat workflow bersifat khusus pemilik untuk alasan yang sama: [error workflow](./features.md#error-workflow) berjalan dengan credentials dan variabel global dari eksekusi yang gagal, yang merupakan milik pemilik untuk eksekusi yang dipicu dan anonim. Kolaborator melihat pengaturan ini hanya-baca, dan menambahkan, mengganti, atau membersihkannya sebagai non-pemilik ditolak dengan `403`.

Mengedit kanvas, nama, dan deskripsi tidak terpengaruh.

### Execution token

Seorang kolaborator dapat membuat execution token untuk workflow yang dibagikan kepada mereka. Eksekusi tersebut diatribusikan kepada **siapa pun yang membuat token**, sehingga menggunakan credentials dan variabel global pengguna tersebut, bukan milik pemilik. Hanya panggilan yang benar-benar anonim — `auth_type: anonymous` tanpa pemanggil — yang berjalan dalam konteks pemilik.

## Dijadwalkan untuk Dihapus

Workflow dapat dijadwalkan untuk dihapus alih-alih dihapus segera.

- **Field**: `scheduled_for_deletion` (datetime yang dapat bernilai null)
- **Perilaku**: Ketika diatur, workflow berpindah ke `folder_id = null` dan muncul di bagian "Scheduled for Deletion".
### API

| Endpoint | Tujuan |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Menetapkan `scheduled_for_deletion`, menghapus `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Menghapus `scheduled_for_deletion` (memulihkan) |

### UI

- **Seret ke tempat sampah** – Jatuhkan workflow ke area "Scheduled for Deletion" untuk menjadwalkannya
- **Pulihkan** – Hapus dari jadwal
- **Hapus segera** – Ikon tempat sampah untuk penghapusan permanen

### Logika Pembersihan

Sebuah cron job berjalan setiap hari pada pukul **23:59** (zona waktu yang dikonfigurasi). Sebuah workflow hanya dihapus ketika:

- **Semua start node** (node tanpa edge masuk, tidak termasuk sticky/errorHandler) memiliki `active === false`

Jika ada start node yang masih aktif, workflow akan tetap ada hingga proses berikutnya.

## UI Dashboard

- **Baris folder** – New Folder, pohon folder rekursif dengan perluasan/penyusutan. Setiap folder membawa
  deskripsi opsional di bawah namanya dan lencana yang menghitung workflow yang dikandungnya, termasuk
  sub-folder.
- **Aksi folder** – New Subfolder, Rename, Change icon, Download as ZIP, dan Delete berada sebaris
  pada setiap baris folder; menu konteks klik kanan menawarkan kumpulan yang sama, dan ponsel menampilkan satu
  tombol menu.
- **Area utama** – Workflow root (tanpa folder, tidak dijadwalkan) dan Scheduled for Deletion
- **Pratinjau pelepasan folder** – Menyeret workflow akan menyorot folder atau sub-folder yang tepat dan
  menampilkan jalur lengkapnya dalam pratinjau seukuran kartu. Folder yang menyusut akan mengembang setelah hover singkat.
- **Umpan balik seret yang stabil** – Kartu sumber menggunakan drag ghost, dan target pelepasan yang aktif tetap
  terpilih saat menggulir atau melintasi kontrol di dalam folder yang sama.
- **Pemeriksaan tujuan** – Folder saat ini ditampilkan sebagai **Already in Folder** dan tidak menerima
  pemindahan yang berlebihan.
- **Zona pelepasan lainnya** – Root dan "Scheduled for Deletion" akan tersorot ketika dapat menerima
  workflow yang diseret.
- **Pelepasan ZIP** – Jatuhkan file ZIP ke area workflow untuk mengimpor struktur folder pada tingkat root

## Terkait

- [Tab Workflows](../tabs/workflows-tab.md) – Membuat dan mengelola workflow
- [Berbagi Credentials](./credentials-sharing.md) – Bagikan credentials dengan kolaborator workflow
- [Teams](./teams.md) – Bagikan workflow dan credentials dengan tim
- [Konsep Inti](../getting-started/core-concepts.md) – Workflow, node, dan eksekusi
- [Struktur Workflow](./workflow-structure.md) – Format JSON untuk workflow
- [Trigger](./triggers.md) – Start node dan titik masuk
