# Jira

Node **Jira** menghubungkan workflow ke Jira REST API untuk otomatisasi proyek, issue, komentar, lampiran, pengguna, notifikasi, dan transisi. Operasi default adalah **Search Issues**.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | Jira (Cloud email/API token atau Data Center username/password, base URL, mode deployment, versi REST API opsional) |
| Output | `$nodeLabel.*` |

## Credential

Buat credential **Jira** di [Credentials Tab](../tabs/credentials-tab.md). Kunci konfigurasi yang disimpan adalah `email`, `api_token`, `base_url`, `deployment`, dan `api_version` opsional. Untuk Jira Cloud, `email` menyimpan email akun Atlassian dan `api_token` menyimpan token API Atlassian. Untuk Jira Data Center / Server, kunci yang sama menyimpan username dan password Basic auth. Lihat [Third-Party Integrations](../reference/integrations.md#jira) untuk langkah-langkah penyiapan.

| Field | Config key | Deskripsi |
| --- | --- | --- |
| Jira Email / Username | `email` | Email akun Atlassian Jira Cloud, atau username Jira Data Center / Server |
| API Token / Password | `api_token` | Token API Atlassian Jira Cloud, atau password Jira Data Center / Server untuk Basic auth |
| Base URL | `base_url` | URL situs Jira, misalnya `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` untuk Jira Cloud atau `data_center` untuk Jira Data Center / Server |
| REST API Version | `api_version` | Default `3` untuk Jira Cloud. Data Center / Server menggunakan REST API v2 |

Personal access token dan Bearer auth untuk Data Center / Server belum didukung oleh credential Jira.

Gunakan **Test Connection** untuk memverifikasi credential terhadap pengguna Jira saat ini.

## Operasi

| Operasi | Field wajib | Output |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At opsional | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At opsional | `issues`, `count`, `pagination` |
| Get Issue | Issue Key atau ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key atau ID dan minimal satu field yang diubah | `issue`, `key` |
| Delete Issue | Issue Key atau ID | `deleted` |
| Get Issue Changelog | Issue Key atau ID; Limit, Start At opsional | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key atau ID, Subject, Text Body | `notified` |
| List Comments | Issue Key atau ID; Limit, Start At opsional | `comments`, `count`, `pagination` |
| Create Comment | Issue Key atau ID, Comment Body | `comment` |
| Get Comment | Issue Key atau ID, Comment ID | `comment` |
| Update Comment | Issue Key atau ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key atau ID, Comment ID | `deleted` |
| Add Attachment | Issue Key atau ID, Filename, konten Base64 | `attachments`, `count` |
| Get Attachment | Attachment ID; Include Binary opsional | `attachment` |
| List Attachments | Issue Key atau ID; Limit, Start At, Include Binary opsional | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key atau ID | `transitions`, `count` |
| Transition Issue | Issue Key atau ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Field teks yang mendukung expression mendukung [expressions](../reference/expression-dsl.md) seperti `$input.text`. `jiraIncludeBinary` adalah toggle boolean dan tidak mendukung expression, tetapi dapat ditandai sebagai agent-provided ketika node Jira dilampirkan ke handle tool Agent.

## Field issue dan update

- **Project Key** adalah kunci proyek singkat seperti `ENG`. Gunakan List Projects untuk menemukan kunci.
- **Issue Key atau ID** menerima kunci seperti `ENG-123` atau ID issue numerik. Gunakan Search Issues atau List Projects untuk menemukan nilai.
- **Transition ID** berasal dari List Transitions. Setiap objek transition menyertakan field `id`.
- **Comment ID** dan **Attachment ID** berasal dari List Comments, List Attachments, atau respons create/get sebelumnya.
- **Account ID / Username** adalah nilai `accountId` Jira Cloud atau username Jira Data Center / Server. Get Myself atau Get User dapat membantu Anda menemukannya.
- Teks **description** issue dan **body** komentar dikirim sebagai Atlassian Document Format pada REST
  API v3; ketika deployment credential adalah Data Center / Server, keduanya dikirim sebagai teks biasa.
  Pada v3, karakter baris baru menjadi paragraf terpisah.
- **Get Issue Changelog** menggunakan endpoint changelog terpaginasi Jira Cloud. Untuk Data Center / Server, operasi ini membaca data changelog issue yang diperluas dan menerapkan offset/limit yang dikonfigurasi pada riwayat yang dikembalikan.
- Pada **Update Issue**, biarkan field opsional kosong untuk mempertahankan nilai saat ini.
- Setel **Description** atau **Assignee Account ID / Username** ke `null` pada update untuk menghapus field tersebut. Labels tidak dapat dihapus dengan `null`.
- **Recipients JSON** pada Notify Issue default ke `{"assignee":true}` jika dihilangkan. Kunci umum meliputi `assignee`, `reporter`, `watchers`, dan `voters` (misalnya `{"assignee":true,"watchers":true}`).
- **Add Attachment** menerima konten base64 mentah atau data URL dan dibatasi oleh pengaturan ukuran file platform (default 99 MB).
## Pagination

- **Search Issues** menggunakan pagination berbasis kursor melalui `jiraNextPageToken` untuk Jira Cloud. Baca `pagination.nextPageToken` dari eksekusi sebelumnya dan teruskan ke node Search Issues berikutnya.
- **Search Issues** menggunakan pagination berbasis offset melalui `jiraStartAt` untuk Jira Data Center / Server. Baca `pagination.startAt`, `pagination.maxResults`, dan `pagination.total` untuk menghitung halaman berikutnya.
- **List Projects**, **Get Issue Changelog**, **List Comments**, dan **List Attachments** menggunakan pagination berbasis offset dengan `jiraLimit` dan `jiraStartAt`. Hasil yang dipaginasi mengembalikan `pagination.startAt`, `pagination.maxResults`, `pagination.total`, dan `pagination.isLast`.
- **List Attachments** mengambil seluruh attachment dari issue terlebih dahulu, lalu memotong hasilnya di sisi klien. Field pagination tetap menggambarkan halaman yang dikembalikan, tetapi issue berukuran besar dapat menimbulkan biaya pengambilan tambahan.
- **List Transitions** tidak menggunakan pagination.

## Field Utama

| Field | Digunakan oleh | Keterangan |
| --- | --- | --- |
| `credentialId` | Semua operasi | UUID kredensial Jira yang dimiliki |
| `jiraOperation` | Semua operasi | Default ke `searchIssues` |
| `jiraProjectKey` | Create Issue | Project key seperti `ENG` |
| `jiraIssueKey` | Operasi issue, comment, attachment, notification, dan transition | Issue key seperti `ENG-123` atau ID issue numerik |
| `jiraIssueType` | Create Issue | Default ke `Task` |
| `jiraIssueTypeId` | Create Issue | ID issue type opsional; menimpa `jiraIssueType` saat diisi |
| `jiraSummary` | Create/Update Issue | Wajib untuk Create Issue |
| `jiraDescription` | Create/Update Issue | Dikirim sebagai ADF pada REST API v3 atau plain text pada REST API v2; gunakan `null` saat update untuk menghapus deskripsi |
| `jiraJql` | Search Issues | Default ke `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Array JSON opsional atau field issue yang dipisahkan koma; default ke `key`, `summary`, `status`, `assignee`, dan `issuetype` saat kosong |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId Jira Cloud atau username Data Center / Server; gunakan `null` saat update untuk menghapus assignee |
| `jiraLabels` | Create/Update Issue | Array JSON atau teks yang dipisahkan koma |
| `jiraCommentBody` | Create/Update Comment | Dikirim sebagai ADF pada REST API v3 atau plain text pada REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID comment Jira |
| `jiraTransitionId` | Transition Issue | Temukan dengan List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID attachment Jira |
| `jiraAttachmentFilename` | Add Attachment | Nama file yang diunggah |
| `jiraAttachmentBase64` | Add Attachment | Konten base64 mentah atau data URL; tunduk pada batas ukuran file |
| `jiraAttachmentMimeType` | Add Attachment | MIME type opsional; disimpulkan dari nama file saat kosong |
| `jiraIncludeBinary` | Get/List Attachment | Toggle boolean; menambahkan `content_base64` saat diaktifkan |
| `jiraNotifySubject` | Notify Issue | Subjek notifikasi wajib |
| `jiraNotifyTextBody` | Notify Issue | Isi notifikasi plain-text wajib |
| `jiraNotifyHtmlBody` | Notify Issue | Isi HTML opsional |
| `jiraNotifyTo` | Notify Issue | JSON penerima; default ke `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId Jira Cloud atau username Data Center / Server |
| `jiraUserEmail` | Create User | Alamat email pengguna baru |
| `jiraUsername` | Create User | Username Data Center / Server opsional; kembali ke `jiraUserEmail` jika kosong |
| `jiraUserDisplayName` | Create User | Nama tampilan opsional |
| `jiraUserProducts` | Create User | Array JSON atau product key yang dipisahkan koma; hanya Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Default ke `50`; rentang 1–100 |
| `jiraStartAt` | Search Issues pada Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Indeks awal pagination berbasis offset |
| `jiraNextPageToken` | Search Issues pada Jira Cloud | Token kursor dari respons pencarian sebelumnya |

## Contoh

Membuat issue dari input upstream:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Memperbarui issue dan menghapus assignee:

- Operation: `updateIssue`
- Issue Key atau ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Mencari issue dengan custom field dan pagination berbasis kursor:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Mencari issue pada Data Center dengan pagination berbasis offset:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Melakukan transisi issue setelah menampilkan transisi yang tersedia:

- Operation: `listTransitions`
- Issue Key atau ID: `ENG-123`
- Lalu jalankan **Transition Issue** dengan Transition ID: `$listTransitions.transitions[0].id`

Memberi tahu watcher tentang pembaruan issue:

- Operation: `notifyIssue`
- Issue Key atau ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Output

Setiap operasi yang berhasil akan menetapkan:

- `$jira.success`
- `$jira.operation`

**Get Myself** mengekspos `user`.

**Operasi daftar berpaginasi** mengekspos `count`, sebuah field koleksi, dan `pagination`:

| Operasi | Kunci koleksi | Bentuk paginasi |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** mengekspos `transitions` dan `count` tanpa paginasi.

**Mutasi dan pembacaan issue** mengekspos payload issue Jira beserta `key` jika berlaku.

**Comment** get/create/update mengekspos `comment`; delete mengekspos `deleted`.

**Transition Issue** mengekspos `transition` sebagai `{ transitionId }`, beserta `issue` dan `key` yang telah diperbarui.

**Attachment add** mengekspos `attachments` dan `count`. **Get Attachment** mengekspos `attachment`; **List Attachments** mengekspos `attachments`, `count`, dan `pagination`. Ketika **Include Binary** diaktifkan, setiap objek attachment dapat menyertakan `content_base64`. Delete mengekspos `deleted`.

**User** get/create mengekspos `user`; delete mengekspos `deleted`.

**Notify Issue** mengekspos `notified`.

Pola akses umum:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Terkait

- [Tab Credentials](../tabs/credentials-tab.md)
- [Integrasi Pihak Ketiga](../reference/integrations.md#jira)
- [Tipe Node](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
