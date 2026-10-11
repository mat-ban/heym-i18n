# GitHub

Node **GitHub** menambahkan operasi REST GitHub native ke dalam workflow, serupa dengan node GitHub multi-operasi yang mungkin Anda kenal dari alat seperti n8n.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | GitHub |
| Output | `$nodeLabel.*` |

## Operasi yang Didukung

Node ini saat ini menyediakan 40 aksi:

| Resource | Aksi |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credential

Buat credential **GitHub** di [Tab Credentials](../tabs/credentials-tab.md) dengan:

- Personal access token
- Base URL REST API lengkap opsional untuk GitHub Enterprise Server

Biarkan base URL kosong untuk GitHub.com. PAT dengan cakupan halus (fine-grained) direkomendasikan.

Untuk GitHub Enterprise Server, masukkan endpoint REST API lengkap termasuk `/api/v3`, seperti
`https://github.example.com/api/v3`. Jangan masukkan hanya root web UI
(`https://github.example.com`).

Jika Anda menggunakan GitHub Enterprise Server dan kemudian mengedit credential untuk merotasi token, membiarkan
`base_url` kosong akan mempertahankan endpoint Enterprise yang ada. Masukkan URL baru hanya ketika Anda ingin
mengubah endpoint tersebut.

## Field Umum

Sebagian besar operasi menggunakan:

- **Owner** – Pemilik repositori, nama organisasi, atau username
- **Repository** – Nama repositori

`List Organization Repositories` hanya memerlukan **Owner** (nama organisasi) dan tidak menggunakan field repository.

`List User Repositories` hanya memerlukan **Owner** (username) dan tidak menggunakan field repository.

`Get User Repositories` mencerminkan aksi User → Get Repositories milik n8n. `Get User Issues` mengembalikan
issue yang ditugaskan ke pengguna GitHub yang terautentikasi secara default. Atur **Mentioned Filter** ke nilai
apa pun yang tidak kosong untuk mengembalikan issue yang menyebut pengguna yang terautentikasi sebagai gantinya. Operasi ini juga mendukung filter state, labels, updated-since, sort, direction, dan per-page. `Invite User` memerlukan
organisasi dan alamat email serta tidak menggunakan Owner atau Repository.

## Repository

Operasi Repository mencakup metadata, konten lisensi yang terdeteksi, profil kesehatan komunitas, dan
wawasan lalu lintas. `List Popular Paths for Repository` dan
`List Top Referrers for Repository` mengembalikan entri lalu lintas teratas GitHub selama 14 hari terakhir dan
memerlukan akses push administrasi repositori.

`List Issues` mendukung filter opsional assignee, creator, mentioned user, label yang dipisahkan koma,
timestamp updated-since, sort, dan direction. `List Pull Requests` mendukung kontrol state, sort,
direction, dan per-page.

`Get Repository Issues` dan `Get Repository Pull Requests` mengekspos API yang sama dengan rekan List
mereka dengan nama aksi repositori yang kompatibel dengan n8n secara eksplisit.

### Mendapatkan metadata Repository

`Get Repository` menyimpan respons lengkap GitHub di `$github.repository` dan juga mengekspos
`$github.full_name`, `$github.default_branch`, `$github.private`, dan `$github.url`.

Payload repositori umumnya mencakup:

- Identitas dan kepemilikan: ID, nama, nama lengkap, deskripsi, owner, dan visibilitas
- Status repositori: private, fork, archived, disabled, dan default branch
- URL: halaman GitHub, API, clone, SSH, dan URL Git
- Aktivitas dan ukuran: timestamp pembuatan, pembaruan, dan push, ukuran, stars, watchers, forks, subscribers, dan open issues
- Fitur: issues, projects, wiki, Pages, discussions, topics, bahasa, dan homepage
- Lisensi, pengaturan merge, izin pemanggil, pengaturan keamanan, dan metadata fork parent/source jika tersedia

Beberapa field administratif, izin, merge, dan keamanan bergantung pada izin repositori
credential.

Contoh:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Operasi Issue mendukung field title/body dan field JSON-array opsional untuk labels dan assignees.

`List Issues` hanya mengembalikan issue repositori. Pull request dikecualikan; gunakan `List Pull Requests` untuk hasil PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Semantik field Edit Issue

Untuk `Edit Issue`, hanya field yang Anda tetapkan secara eksplisit yang dikirim ke GitHub:

- **State** – Pilih `Don't change`, `Open`, atau `Closed`. Biarkan tidak diatur untuk mempertahankan state saat ini.
- **State Reason** – Secara opsional atur `Completed`, `Not Planned`, `Duplicate`, atau `Reopened`.
- **Title / Body** – Biarkan kosong untuk mempertahankan nilai saat ini.
- **Labels / Assignees** – Biarkan field kosong untuk mempertahankan nilai saat ini. Gunakan `[]` untuk menghapus semua labels atau assignees. Gunakan JSON array seperti `["bug"]` untuk menggantinya.

`Edit Issue` memerlukan setidaknya satu field untuk diubah saat runtime. Jika Anda hanya memberikan nomor issue, eksekusi akan gagal dengan error validasi dari lapisan API GitHub.
## Lock Issue

`Lock Issue` menerima **Lock reason** opsional. Jika diberikan, nilainya harus salah satu dari nilai yang didukung GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Biarkan reason kosong untuk mengunci tanpa alasan tertentu.

## Pull Requests

Create PR memerlukan:

- Title
- Head branch
- Base branch
- Body opsional
- Mode draft opsional

## Pull Request Reviews

Operasi review sesuai dengan API pull request review GitHub:

| Operation | Required fields | Optional fields |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number, event | Body, commit ID |
| `Get Review` | Pull request number, review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number, review ID, body | — |

`Create Review` mendukung `Approve`, `Request Changes`, `Comment`, dan `Pending`.
Body wajib diisi untuk `Request Changes` dan `Comment`. Jika Commit ID kosong, GitHub
me-review commit terbaru dari pull request tersebut.

## Releases

| Operation | Required fields at runtime | Commonly optional |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` dapat secara eksplisit menetapkan `draft` / `prerelease` menjadi `true` atau `false`.

## Workflows

Operasi workflow mendukung:

- Menampilkan daftar workflow repositori
- Mendapatkan workflow berdasarkan ID numerik atau nama file workflow
- Mengaktifkan atau menonaktifkan workflow
- Membaca penggunaan workflow yang dapat ditagih berdasarkan sistem operasi runner
- Menjalankan workflow dengan ref atau branch beserta objek input JSON opsional

GitHub sedang dalam proses menutup endpoint `Get Workflow Usage`. Workflow yang menggunakan
operasi ini mungkin perlu bermigrasi ketika GitHub menghapus endpoint tersebut.

`Dispatch Workflow` menerima kedua bentuk respons GitHub: `204 No Content` lama dan respons
`200` yang lebih baru yang berisi `workflow_run_id`, `run_url`, dan `html_url`.

`Dispatch Workflow and Wait` menjalankan workflow dan melakukan polling terhadap run hingga statusnya
`completed`. Konfigurasikan timeout dan interval polling dalam satuan detik. Heym menggunakan
`workflow_run_id` ketika GitHub mengembalikan respons `200` yang lebih baru. Untuk respons `204 No
Content` tradisional, Heym menemukan run `workflow_dispatch` yang baru dibuat untuk workflow dan ref
yang dipilih, lalu menunggu run tersebut.

## File Contents

`Get File` membaca file repositori melalui API contents GitHub dan mendekode konten teks jika tersedia. File biner dan konten non-UTF-8 mungkin mengembalikan metadata tanpa field `content` yang didekode.

`List Files` mengembalikan entri direktori dari API contents repositori untuk jalur folder tertentu dan ref opsional. Biarkan **Directory Path** kosong untuk menampilkan daftar root repositori.

`Create or Update File` menulis konten teks ke jalur repositori menggunakan:

- File path
- Commit message
- File content
- Branch opsional

`Delete File` menghapus jalur repositori menggunakan commit message dan branch opsional. Jika file tersebut ada, Heym mengambil SHA saat ini secara otomatis sebelum menghapusnya.

Jika file sudah ada, Heym mengambil SHA saat ini secara otomatis sebelum memperbaruinya.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories`, dan `Get User Repositories` mendukung
**Per Page** (1–100). Heym meminta satu halaman hasil; tidak ada field `page` untuk mengambil
halaman tambahan dalam operasi yang sama.

## Output

Bentuk persisnya bergantung pada operasi yang dipilih. Field umum meliputi:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Ganti `github` dengan label node Anda.

## Notes

- Labels dan assignees harus berupa array JSON yang valid jika diberikan.
- Input workflow dispatch harus berupa objek JSON yang valid jika diberikan.
- `Edit Issue` menggunakan `state` hanya ketika Anda menetapkannya secara eksplisit; biarkan tidak diatur untuk mempertahankan state issue saat ini.
- Izin API GitHub bergantung pada scope token atau izin repositori fine-grained yang Anda berikan.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – Menambahkan dan mengelola kredensial GitHub
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial GitHub dan `base_url` Enterprise
- [Agent Node](./agent-node.md) – Menggunakan kredensial GitHub dengan `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Katalog node lengkap
