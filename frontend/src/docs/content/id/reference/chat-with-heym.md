# Mengobrol dengan Heym

Chat with Heym adalah asisten yang memahami halaman dokumentasi dan tersedia dari header dokumentasi. Fitur ini terbuka dalam dialog di tengah layar, memungkinkan Anda memilih credential dan model LLM, serta menjawab pertanyaan dengan halaman dokumentasi yang sedang aktif sebagai konteks utamanya.

## Membuka Dialog

1. Buka halaman mana pun di bawah `/docs`
2. Klik **Chat with Heym** di header
3. Pilih [credential](../tabs/credentials-tab.md) dan model
4. Ajukan pertanyaan tentang halaman tersebut atau tentang platform

Pada layar yang lebih kecil, pemicunya hanya berupa ikon; pada layar yang lebih besar, label lengkapnya ditampilkan.

## Konteks yang Digunakan

- Jalur dokumentasi yang sedang terbuka disisipkan ke dalam permintaan sebagai panduan kontekstual
- Backend tetap menggunakan endpoint chat dashboard yang sudah ada dan alat pencarian dokumentasi
- [User Rules](./user-settings.md) tingkat akun Anda tetap berlaku karena backend chat yang sama digunakan kembali
- Langkah-langkah persiapan secara langsung dialirkan ke dalam gelembung asisten sebelum jawaban akhir, serupa dengan chat dashboard
- Pertanyaan klarifikasi muncul sebagai kartu, sama seperti pada [Chat tab](../tabs/chat-tab.md). Ketika permintaan workflow memerlukan credential, Anda dapat memilih salah satu atau membuatnya dari kartu tersebut. Ketika permintaan memerlukan data table, Anda dapat memilih salah satu tabel Anda atau membuat yang baru dengan cara yang sama.

Ketika Anda membuka dialog pada artikel tertentu, sebuah badge kecil menampilkan jalur dokumentasi yang aktif sehingga Anda dapat memastikan halaman mana yang diprioritaskan.

## Perilaku Sesi

- Pilihan credential dan model tetap tersimpan selama dialog tetap terpasang
- Riwayat pesan hanya berlaku selama sesi dan dihapus ketika dialog ditutup
- Klik backdrop, `Escape`, dan tombol tutup semuanya mengatur ulang sesi
- **Stop** membatalkan respons streaming yang sedang berlangsung
- Dialog sengaja dibuat lebar dengan ukuran tetap; tidak tersedia tombol layar penuh

## Kapan Menggunakannya

- Ajukan pertanyaan lanjutan saat membaca halaman node atau referensi
- Perjelas perbedaan fitur tanpa meninggalkan dokumentasi
- Temukan artikel yang tepat sebelum membuka editor

Jika Anda ingin membangun atau memodifikasi workflow secara langsung, gunakan [AI Assistant](./ai-assistant.md) di sisi editor sebagai gantinya.

## Terkait

- [AI Assistant](./ai-assistant.md) – Chat editor untuk membangun workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Tambahkan credential LLM yang digunakan oleh dialog
- [Settings](./user-settings.md) – User Rules global yang diterapkan pada antarmuka AI
- [Quick Start](../getting-started/quick-start.md) – Panduan workflow pertama
