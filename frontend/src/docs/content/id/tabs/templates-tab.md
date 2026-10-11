# Tab Templates

Tab Templates memungkinkan Anda menyimpan, menelusuri, dan menggunakan kembali Workflow lengkap serta Node individual. Bagikan sesuatu yang pernah Anda buat dan terapkan ke proyek baru hanya dengan satu klik.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Tonton demo Templates</a></p>

## Ikhtisar

Terdapat dua jenis template:

- **Template Workflow** — simpan Workflow lengkap (semua Node dan koneksi) sebagai titik awal yang dapat digunakan kembali.
- **Template Node** — simpan satu Node yang telah dikonfigurasi (misalnya Node LLM yang telah disetel atau Node HTTP kustom) untuk digunakan kembali di berbagai Workflow.

Beralihlah antara keduanya menggunakan tombol **Workflows / Nodes** di bagian atas tab.

Gunakan bilah pencarian untuk memfilter template yang terlihat berdasarkan nama, deskripsi, tag, atau tipe Node.

---

## Membuat Template

### Template Workflow

1. Buka Workflow yang ingin Anda bagikan di editor.
2. Klik **Share as Template** di toolbar atas.
3. Isi nama, deskripsi, dan tag opsional.
4. Pilih visibilitas: **Everyone** (semua pengguna) atau **Specific users** (masukkan nama pengguna dan/atau pilih tim).
5. Klik **Share**. Notifikasi hijau akan mengonfirmasi keberhasilan.

### Template Node

1. Klik kanan Node mana pun di kanvas.
2. Pilih **Share as Template** dari menu konteks.
3. Isi formulir dan klik **Share**.

---

## Menggunakan Template

### Template Workflow

1. Buka tab **Templates** dan pastikan **Workflows** telah dipilih.
2. Klik kartu untuk melihat pratinjau, atau klik **Use** secara langsung.
3. Workflow akan dikloning ke Workflow baru yang terbuka di editor.

### Template Node

1. Buka tab **Templates** dan pilih **Nodes**.
2. Klik **Use** pada kartu template Node.
3. Dialog akan muncul — pilih tempat untuk menambahkan Node:
   - **New workflow** — membuat Workflow baru yang hanya berisi Node ini.
   - **Existing workflow** — pilih dari daftar Workflow Anda; Node akan disisipkan secara otomatis saat editor terbuka.

---

## Pratinjau

Klik kartu template mana pun untuk membuka pratinjau lengkap:

- **Thumbnail kartu** — kartu template menampilkan cuplikan kanvas hanya-baca yang disesuaikan untuk Workflow maupun template Node tunggal.
- **Template Workflow** — kanvas hanya-baca yang sesuai dengan gaya pratinjau riwayat edit, termasuk pan dan zoom.
- **Template Node** — Node yang disimpan terbuka pada kanvas hanya-baca yang sama sebagai pratinjau Node tunggal.
- **Detail Node** — klik Node mana pun di pratinjau untuk memeriksa konfigurasi tersimpannya di panel samping.
- Tag, jumlah penggunaan, dan **owner** ditampilkan untuk semua template.

Tekan **ESC** atau klik di luar untuk menutup pratinjau.

---

## Mengelola Template

- **Edit** – Jika Anda adalah owner template, arahkan kursor ke kartu dan klik ikon pensil untuk memperbarui nama, deskripsi, tag, atau visibilitasnya
- **Delete** – Jika Anda adalah owner template, arahkan kursor ke kartu dan hapus template setelah prompt konfirmasi
- **Tindakan khusus owner** – Kontrol edit dan delete hanya ditampilkan untuk template yang Anda buat

---

## Command Palette (CTRL+K)

Template (baik Workflow maupun Node) dapat dicari dari command palette **CTRL+K**. Pilih template untuk langsung menggunakannya — template Workflow terbuka di editor, template Node akan meminta tujuan penempatan.

---

## Templates di Chat

Anda dapat mengajukan pertanyaan kepada AI tentang template Anda — AI mengetahui semua template di workspace Anda.

---

## Visibilitas

| Pengaturan | Siapa yang dapat melihat |
|---|---|
| Everyone | Semua pengguna di platform |
| Specific users | Pengguna yang Anda daftarkan berdasarkan nama dan/atau tim yang Anda pilih — semua anggota tim memperoleh akses |

Saat berbagi dengan **Specific users**, Anda dapat menambahkan pengguna individual (berdasarkan nama) maupun tim. Anggota tim akan melihat template di tab Templates dan dapat menggunakannya.

---

## Terkait

- [Teams](../reference/teams.md) – Bagikan template dengan tim
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman singkat untuk tab dasbor
