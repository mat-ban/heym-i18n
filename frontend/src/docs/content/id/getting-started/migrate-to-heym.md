# Migrasi ke Heym

Sudah memiliki Workflow di alat lain? **AI Convert** mengubahnya menjadi Workflow Heym untuk Anda. Tempelkan Workflow dari n8n, Flowise, Dify, Langflow, sim.ai, atau Activepieces — atau cukup jelaskan apa yang Anda inginkan — dan Heym akan membangun Workflow yang setara pada kanvas langsung yang dapat Anda unduh dan impor.

Buka di **[heym.run/convert](https://heym.run/convert)**, atau gunakan tombol **✨ AI Convert** di header situs.

## Cara kerjanya

1. **Pilih alat sumber Anda** (opsional) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, atau biarkan pada *Auto*.
2. **Berikan Workflow Anda** — tempelkan JSON hasil ekspor dari alat Anda saat ini, atau tuliskan deskripsi dalam bahasa sehari-hari mengenai otomatisasi yang Anda inginkan.
3. **Generate** — Heym akan men-streaming hasilnya ke kanvas, menggambar Node dan koneksi saat diproduksi.
4. **Unduh atau salin** Workflow yang dihasilkan sebagai JSON.
5. **Impor ke Heym** — gunakan alur [Download & Import](../reference/download-import.md) untuk menempelkan JSON ke kanvas Anda, lalu jalankan.

Konversi ini juga menambahkan *Sticky Note* kecil pada kanvas yang menandai Workflow sebagai hasil generate Heym — hapus kapan pun Anda mau.

## Yang Anda dapatkan

Konverter memetakan konsep sumber ke Node Heym native — Trigger, langkah [LLM](../nodes/llm-node.md), panggilan [HTTP](../nodes/http-node.md), aksi [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loop](../nodes/loop-node.md), [Condition](../nodes/condition-node.md), dan [Output](../nodes/output-node.md). Tinjau hasilnya pada kanvas, hubungkan [Credentials](../reference/credentials.md) Anda, dan sesuaikan apa pun yang diekspresikan secara berbeda oleh alat sumber.

> AI Convert adalah titik awal, bukan port 1:1 yang terjamin. Selalu tinjau Workflow yang dihasilkan sebelum menjalankannya di produksi.

## Perlu diketahui

- **Berbasis AI:** konversi dihasilkan oleh large language model, sehingga hasilnya dapat bervariasi antar proses. Generate ulang jika hasil pertama kurang tepat.
- **Ukuran input:** input yang Anda tempelkan atau ketikkan dibatasi sekitar **25.000 token**. Pangkas ekspor yang sangat besar sebelum melakukan konversi.
- **Batas laju:** untuk menjaga ketersediaan alat ini bagi semua orang, permintaan dibatasi hingga **1 per menit, 5 per jam, dan 10 per hari** per pengunjung.
- **Keamanan:** permintaan disaring, dan hanya permintaan pembuatan Workflow yang diproses.

## Langkah selanjutnya

- Baru mengenal kanvas? Mulailah dengan [Quick Start](./quick-start.md).
- Pelajari cara impor di [Download & Import](../reference/download-import.md).
- Self-hosting Heym? Lihat [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) untuk referensi konfigurasi lengkap.
- Bangun dari awal dengan [AI Assistant](../reference/ai-assistant.md) di dalam aplikasi.
