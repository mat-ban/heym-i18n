# Linear

Node **Linear** menghubungkan workflow ke Linear GraphQL API untuk otomatisasi issue dan workspace.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credential | Linear personal API key atau OAuth2 |
| Output | `$nodeLabel.*` |

## Credential

Buat credential **Linear** di [Credentials Tab](../tabs/credentials-tab.md). Pilih salah satu mode
autentikasi:

**Personal API key**

1. Di Linear, buka **Settings → Security & Access → Personal API keys**.
2. Buat key dengan akses ke workspace yang ingin Anda otomatiskan.
3. Tempelkan key tersebut ke credential Linear baru di Heym dan gunakan **Test Connection** untuk memverifikasinya.

**OAuth2**

1. Buat aplikasi Linear OAuth.
2. Daftarkan `{FRONTEND_URL}/api/credentials/linear/oauth/callback` sebagai redirect URI.
3. Di Heym, pilih **OAuth2**, masukkan Client ID dan Client Secret, lalu klik **Connect**.

Personal API key dan OAuth token bertindak sebagai pengguna yang membuat atau mengotorisasinya.

## Operasi

| Operasi | Field yang diperlukan | Output |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; opsional After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; opsional After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; opsional Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; opsional After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID atau identifier seperti `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID atau identifier dan setidaknya satu field yang diubah | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID atau identifier | `deleted` |
| Add Issue Link | Issue ID atau identifier, Link URL | `link` |
| Create Comment | Issue ID atau identifier, Comment Body | `comment` |
| List Comments | Issue ID atau identifier, Limit; opsional After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Semua field teks mendukung [expressions](../reference/expression-dsl.md).

## Field issue

- **Team ID** dan **Project ID** adalah UUID Linear. Gunakan List Teams atau List Projects untuk menemukannya.
- **State ID** adalah UUID workflow-state yang digunakan saat membuat atau memperbarui issue. Gunakan List Workflow States untuk menemukannya.
- **Assignee ID** adalah UUID pengguna Linear. Gunakan List Team Members untuk menemukannya.
- **Priority** menerima nilai `0` hingga `4`: no priority, urgent, high, normal, dan low.
- Biarkan field update opsional kosong untuk mempertahankan nilai saat ini.
- Setel field update ke `null` untuk menghapus description, project, assignee, atau state.
- **Link URL** menambahkan tautan lampiran eksternal ke issue.
- **Comment ID** adalah UUID Linear untuk komentar yang sudah ada. Gunakan List Comments untuk menemukannya.
- **Parent Comment ID** membalas komentar Linear yang sudah ada saat membuat komentar.

## Pagination

Operasi list dapat mengembalikan satu halaman atau secara otomatis mengambil setiap halaman:

- Biarkan **Return All** nonaktif untuk menggunakan `Limit` dan `After Cursor` secara manual.
- Aktifkan **Return All** untuk mengikuti cursor Linear di sisi server, hingga 10.000 hasil.

Hasil yang dipaginasi mengembalikan `pageInfo.hasNextPage` dan `pageInfo.endCursor`. Teruskan cursor ke
**After Cursor** pada eksekusi node berikutnya untuk mengambil halaman berikutnya saat **Return All** nonaktif.

## Contoh

Membuat issue dari input upstream:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Menambahkan komentar ke issue yang dibuat:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opsional, saat membalas komentar lain

Menyelesaikan thread komentar:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Menambahkan tautan eksternal ke issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Melakukan paginasi melalui anggota tim:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` pada eksekusi berikutnya saat `hasNextPage` bernilai true

Menemukan workflow state ID sebelum memperbarui issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Lalu gunakan `$listStates.states[0].id` sebagai **State ID** di **Update Issue**

## Output

Setiap operasi yang berhasil menetapkan:

- `$linear.success`
- `$linear.operation`

Operasi list juga mengekspos `count` dan, jika berlaku, `pageInfo`. Operasi issue mengekspos
payload issue Linear lengkap dan field kemudahan seperti `identifier` dan `url`.
Mutasi komentar mengekspos payload `comment` lengkap, kecuali Delete Comment, yang mengekspos
`deleted` dan `entityId`.

## Terkait

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
