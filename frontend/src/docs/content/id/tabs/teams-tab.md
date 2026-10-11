# Tab Teams

Tab **Teams** memungkinkan Anda membuat dan mengelola tim untuk berbagi workflow, kredensial, variabel, vector store, dan file Drive dengan sekelompok pengguna.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Tonton demo Teams</a></p>

## Membuat Tim

1. Klik **New Team**
2. Masukkan nama dan deskripsi opsional
3. Klik **Create**

Anda secara otomatis menjadi pembuat tim dan anggota pertama.

## Mengelola Anggota

- **Add member** – Masukkan email pengguna pada dialog detail tim dan klik **Add**
- **Remove member** – Klik X di samping anggota (pembuat tidak dapat dihapus)
- **Edit team** – Pembuat dapat mengubah nama dan deskripsi
- **Delete team** – Pembuat dapat menghapus tim; semua berbagi tim akan dihapus
- **Shared resources** – Dialog detail tim menampilkan workflow, kredensial, variabel, vector store, file Drive, template workflow, dan template node yang dibagikan dengan tim. Klik workflow untuk membukanya di editor; beralih ke tab yang relevan untuk sumber daya lainnya.

## Berbagi dengan Tim

Bagikan sumber daya dengan tim dari:

- **Workflows** – Dialog berbagi di editor workflow
- **Workflow Templates** – Dialog berbagi saat membuat/mengedit template workflow (visibilitas: Specific users)
- **Node Templates** – Dialog berbagi saat membuat/mengedit template node (visibilitas: Specific users)
- **Credentials** – Dialog berbagi di tab Credentials
- **Variables** – Dialog berbagi di tab Variables
- **Vector Stores** – Dialog berbagi di tab Vectors
- **Dashboards** – Pengaturan Dashboard di tab Dashboard (read atau write)
- **Drive Files** – Dialog berbagi di tab Drive atau operasi Node Drive `shareWithMyTeams` / `unshareWithMyTeams`

Saat Anda berbagi dengan tim, semua anggota tim memperoleh akses. Lihat [Teams](../reference/teams.md) untuk detailnya.

Saat Anda berbagi workflow dengan tim, bagikan juga kredensial dan sub-workflow yang menjadi dependensi workflow tersebut dengan tim yang sama. Akses workflow saja tidak memberikan akses kredensial atau workflow anak.

## Integrasi Chat

Asisten AI pada [tab Chat](./chat-tab.md) dapat menampilkan daftar tim Anda. Tanyakan "my teams" untuk melihat tim yang Anda ikuti.

## Terkait

- [Teams](../reference/teams.md) – Referensi Teams dan model berbagi
- [Credentials Sharing](../reference/credentials-sharing.md) – Berbagi kredensial dengan pengguna dan tim
- [Workflow Organization](../reference/workflow-organization.md) – Folder dan berbagi
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk permukaan dashboard
