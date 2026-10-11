# Analisis Workflow

**Analisis Workflow** adalah panel sisi kiri yang menyimpan satu dokumen Markdown yang dapat diedit dan dibagikan per workflow. Gunakan panel ini untuk menjelaskan fungsi suatu workflow dan mencatat ide-ide perbaikan — serta biarkan AI membuat draf pertamanya untuk Anda.

Dokumen ini bersifat bersama: setiap orang yang dapat mengakses workflow dapat membaca dan mengeditnya. Dokumen disimpan bersama workflow dan dihapus secara otomatis saat workflow dihapus.

## Membuka Panel

1. Buka workflow di editor.
2. Klik **Analyze** (ikon Sparkles) di toolbar editor.
3. Panel akan terbuka di sisi kiri. Palet node (panel kiri) akan menciut saat panel ini terbuka; membuka kembali palet node akan menutup panel analisis.

Panel ini hanya tersedia untuk workflow yang sudah disimpan. Pada workflow baru yang belum disimpan, simpan terlebih dahulu.

## Dokumen

Panel menampilkan satu dokumen Markdown dengan dua tampilan, yang dapat diganti melalui tombol **Edit** (ikon pensil) dan **Preview** (ikon mata):

| Tampilan | Fungsi |
|------|---------|
| **Edit** | Editor Markdown biasa (textarea). |
| **Preview** | Markdown yang telah dirender. |

Header menampilkan **siapa yang terakhir mengedit** dokumen dan kapan.

### Menyimpan

Klik **Save** untuk menyimpan perubahan Anda. Tombol Save hanya aktif ketika ada perubahan yang belum disimpan.

Karena dokumen bersifat bersama, proses penyimpanan menggunakan optimistic concurrency:

- Jika orang lain telah menyimpan versi yang lebih baru sejak Anda membuka panel, penyimpanan Anda akan ditolak dan muncul peringatan yang menyebutkan nama editor lain tersebut.
- Anda kemudian dapat memilih **Reload (discard mine)** untuk mengambil versi server, atau **Overwrite** untuk memaksa menyimpan versi Anda menimpa versi mereka.

## Analisis AI

Pilih **Credential** dan **Model** LLM di bagian atas panel (daftar model dimuat dari credential yang dipilih — lihat [Credentials](../tabs/credentials-tab.md)). Kemudian jalankan analisis:

- **Analyze my workflow** — ditampilkan saat dokumen kosong. Fitur ini melakukan streaming laporan Markdown yang dihasilkan AI langsung ke editor sebagai draf yang belum disimpan. Tinjau dan edit, lalu **Save**.
- **Reanalyze** — ditampilkan saat dokumen sudah memiliki konten. Fitur ini melakukan streaming laporan baru ke **preview** terpisah, tanpa mengubah dokumen Anda saat ini. Pilih **Accept** untuk mengganti konten editor dengan analisis baru, atau **Discard** untuk mempertahankan yang sudah ada.

Kedua tindakan tersebut terlebih dahulu **menjalankan workflow** (ketika workflow valid dan dapat dijalankan) dan menyertakan hasil eksekusi dalam prompt analisis, sehingga laporan mencerminkan perilaku workflow yang sebenarnya. Jika workflow tidak dapat dijalankan, analisis akan dilanjutkan berdasarkan struktur statisnya.

Laporan yang dihasilkan mencakup tiga bagian, secara berurutan: **Improvement areas** (saran konkret, termasuk sudut pandang **security** setiap kali workflow menyentuh credential, input pengguna, permintaan eksternal, atau paparan data), **Purpose** workflow, dan **What it does** (penelusuran langkah demi langkah melalui node-node).

Bagian **Improvement areas** selalu menjalankan empat pemeriksaan eksplisit:

1. **Error coverage** — jika canvas tidak memiliki node [Error Handler](../nodes/error-handler-node.md) dan tidak ada error workflow yang dikonfigurasi, laporan akan menyoroti hal ini dan merekomendasikan penambahan penanganan error.
2. **Time saved** — jika estimasi waktu yang dihemat per eksekusi belum ditetapkan, laporan merekomendasikan untuk mengonfigurasinya agar metrik **Time Saved** pada [Analytics](../tabs/analytics-tab.md) dapat terisi.
3. **Network nodes** — untuk node yang melakukan panggilan jaringan (seperti [HTTP](../nodes/http-node.md) dan node integrasi), laporan merekomendasikan penanganan error khusus node (retry dan/atau continue-on-error) pada node tersebut.
4. **Alerts** — ketika tidak ada [alerts](../tabs/alerts-tab.md) yang dikonfigurasi untuk workflow, laporan merekomendasikan penyiapan alerts sebelum masuk ke produksi.

### Menjalankan Analyzer dari Properties

Ketika suatu workflow memiliki node di canvas tetapi belum memiliki dokumen analisis, tombol **Run Analyzer** akan muncul di panel [Properties](./canvas-features.md) tingkat workflow (ditampilkan saat tidak ada node yang dipilih). Tombol ini membuka panel Analisis Workflow ini sehingga Anda dapat memilih credential dan model serta menghasilkan laporan.

Setiap eksekusi analisis dicatat di [Traces](../tabs/traces-tab.md) di bawah sumber **Workflow Analysis**.

Jika tidak ada credential LLM yang dikonfigurasi, tombol Analyze akan dinonaktifkan — tambahkan satu di [Credentials Tab](../tabs/credentials-tab.md).

## Terkait

- [AI Assistant](./ai-assistant.md) — menghasilkan atau memodifikasi node workflow dari bahasa alami.
- [Sticky Note](../nodes/sticky-note-node.md) — untuk catatan singkat yang disematkan langsung di canvas.
