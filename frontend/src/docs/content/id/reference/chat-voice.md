# Suara Obrolan (TTS & STT)

Tab Chat dapat membacakan pesan dengan lantang dan menjalankan mode suara interaktif tanpa genggam, yang didukung oleh [ElevenLabs](https://elevenlabs.io). Kedua arah menggunakan satu kredensial ElevenLabs: **text-to-speech** untuk pemutaran dan **Scribe speech-to-text** untuk mikrofon.

## Penyiapan

1. Buka **Settings** (avatar Anda, kanan atas) → tab **Voice**.
2. Pilih **ElevenLabs credential**, atau klik **Add credential** untuk membuatnya. API key memerlukan izin **Text to Speech**, **Speech to Text**, dan **Voices** yang diaktifkan di akun ElevenLabs Anda.
3. Pilih **Voice** dari akun ElevenLabs Anda.
4. Klik **Save Voice Settings**.

Jika Anda menekan tombol suara sebelum menyiapkannya, tab Voice akan terbuka secara otomatis agar Anda dapat menyelesaikan konfigurasi.

API key ElevenLabs disimpan secara terenkripsi dan tidak pernah mencapai browser — semua panggilan diproksikan melalui backend Heym. Lihat [Credentials](./credentials.md) dan [Settings](./user-settings.md).

## Membacakan pesan dengan lantang

Setiap gelembung pesan (milik Anda dan asisten) memiliki tombol speaker di sebelah **Copy**. Klik untuk memutar pesan; klik lagi — atau putar pesan lain — untuk berhenti. Pemutaran menggunakan model multibahasa ElevenLabs, sehingga bahasa teks dideteksi secara otomatis.

## Mode suara interaktif

Tombol waveform di input chat membuka mode suara layar penuh tanpa genggam (mendukung mode terang/gelap dan seluler):

1. Mode ini mendengarkan melalui mikrofon Anda dan mendeteksi ketika Anda berhenti berbicara.
2. Ucapan Anda ditranskripsikan dengan **Scribe** (bahasa dideteksi otomatis — tanpa tombol TR/EN manual).
3. Transkrip dikirim sebagai pesan chat biasa dalam **percakapan yang sama**.
4. Balasan asisten dibacakan dengan lantang, lalu mode ini melanjutkan pendengaran.

Gunakan tombol **mute** untuk menjeda pendengaran dan **✕** untuk keluar (yang akan melepaskan mikrofon). Perekaman berfungsi di semua browser modern, termasuk Firefox.

## Catatan

- Pemilihan suara dan kredensial merupakan preferensi per pengguna; percakapan aktif, model, dan kredensial untuk LLM tidak berubah.
- Penggunaan ElevenLabs (baik TTS maupun STT) ditagih ke akun ElevenLabs Anda sendiri.

## Terkait

- [Chat Tab](../tabs/chat-tab.md) – Chat Dashboard tempat fitur suara berada
- [Credentials](./credentials.md) – Bagaimana API key disimpan dan direferensikan
- [Settings](./user-settings.md) – Tempat tab Voice berada
