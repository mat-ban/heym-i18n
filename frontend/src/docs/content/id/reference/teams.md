# Tim

Teams memungkinkan Anda membagikan workflow, kredensial, variabel global, vector store, dan file Drive kepada sekelompok pengguna sekaligus.

## Ikhtisar

- **Team** – Grup bernama dengan seorang pembuat dan anggota
- **Creator** – Selalu menjadi anggota; dapat mengedit team, menghapus team, menambahkan anggota
- **Member** – Dapat menambahkan dan menghapus anggota lain (kecuali creator); memiliki akses ke sumber daya yang dibagikan dengan team

## Membuat dan Mengelola Teams

Buat team dari [Teams tab](../tabs/teams-tab.md). Tambahkan anggota melalui email; mereka harus memiliki akun. Creator tidak dapat dihapus. Menghapus team akan menghapus semua team share.

## Model Berbagi

Sumber daya dapat dibagikan kepada:

1. **Pengguna individual** – Melalui email (user-to-user share)
2. **Teams** – Dengan memilih team (team share)

Kedua model bersifat aditif. Seorang pengguna memperoleh akses jika mereka:

- Dibagikan secara langsung (user share), atau
- Menjadi anggota team yang memiliki team share

## Apa Saja yang Dapat Dibagikan dengan Teams

| Sumber Daya | Lokasi Berbagi |
|----------|----------------|
| Workflow | Dialog share di workflow editor |
| Workflow Template | Dialog share saat membuat/mengedit workflow template |
| Node Template | Dialog share saat membuat/mengedit node template |
| Kredensial | Dialog share di Credentials tab |
| Variabel Global | Dialog share di Variables tab |
| Vector Store | Dialog share di Vectors tab |
| File Drive | Dialog share di Drive tab atau operasi `shareWithMyTeams` / `unshareWithMyTeams` pada Drive node |

Untuk template, ketika visibilitas diatur ke **Specific users**, Anda juga dapat memilih team. Semua anggota team yang dipilih memperoleh akses ke template tersebut.
Team share pada file Drive bersifat read-only bagi anggota team; pemilik file tetap memegang izin pengelolaan.

## Endpoint API

- `GET /api/teams` – Menampilkan daftar team tempat pengguna menjadi anggota
- `GET /api/teams/{id}` – Mendapatkan detail team beserta anggotanya
- `GET /api/teams/{id}/shared-entities` – Mengembalikan entitas yang dibagikan dengan team (workflow, kredensial, variabel global, vector store, file, workflow template, node template)
- `POST /api/teams` – Membuat team
- `PATCH /api/teams/{id}` – Memperbarui team
- `DELETE /api/teams/{id}` – Menghapus team (hanya creator)
- `POST /api/teams/{id}/members` – Menambahkan anggota (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Menghapus anggota

Team share per sumber daya:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – body POST menerima `permission` (`read` atau `write`, default `write`); mengirimkan team yang sudah ada kembali akan memperbarui izinnya
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Terkait

- [Teams Tab](../tabs/teams-tab.md) – Membuat dan mengelola team
- [Templates Tab](../tabs/templates-tab.md) – Membagikan workflow dan node template dengan team
- [Credentials Sharing](./credentials-sharing.md) – Membagikan kredensial dengan pengguna dan team
- [Workflow Organization](./workflow-organization.md) – Folder dan berbagi workflow
