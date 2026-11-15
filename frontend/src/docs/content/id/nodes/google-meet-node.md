# Google Meet

Temukan slot waktu yang tersedia di Google Calendar dan buat, perbarui, atau hapus undangan rapat dengan tautan Google Meet, email peserta, dan waktu yang dipilih. Akun Google yang terhubung adalah pemilik acara; peserta menerima undangan melalui email.

## Menghubungkan akun Anda

1. Di [Google Cloud Console](https://console.cloud.google.com), aktifkan **Google Calendar API**.
2. Konfigurasikan layar persetujuan OAuth dan buat klien OAuth untuk **Aplikasi Web**. Tambahkan akun Google Anda sebagai pengguna uji jika aplikasi dalam mode pengujian.
3. Daftarkan `https://your-heym-domain/api/credentials/google-meet/oauth/callback` sebagai URI pengalihan resmi. Untuk pengembangan lokal, gunakan asal Heym browser Anda dengan jalur yang sama.
4. Buka **Dashboard → Credentials → Baru → Google Meet (OAuth2)**, masukkan nama, Client ID, dan Client Secret, lalu klik **Hubungkan** dan masuk dengan Google.
5. Berikan kedua izin: Acara kalender (`calendar.events`) dan ketersediaan kalender (`calendar.events.freebusy`). Pilih kredensial ini pada node.

Token dienkripsi dalam penyimpanan dan diperbarui secara otomatis. Ini adalah kredensial terpisah dari Google AI, Sheets, atau Drive. Kalender harus mendukung konferensi Google Meet agar pembuatan berhasil.

## Operasi

| Operasi | Perilaku | Bidang yang diperlukan |
| --- | --- | --- |
| `read` | Mengembalikan interval waktu luang dan sibuk untuk kalender | Kredensial |
| `create` | Membuat acara terjadwal dengan konferensi Meet baru dan undangan email | Judul, waktu mulai, waktu selesai |
| `update` | Memperbarui bidang acara yang diberikan dan memberi tahu tamu | ID acara dan setidaknya satu bidang yang diubah |
| `delete` | Menghapus acara dan memberi tahu tamu tentang pembatalan | ID acara |

## Konfigurasi

Bidang teks di bawah ini menerima ekspresi. Semua bidang, termasuk opsi detail boolean, dapat disediakan oleh Agent saat node ini dilampirkan sebagai alat.

| Bidang | Default | Tujuan |
| --- | --- | --- |
| `gmCalendarId` | `primary` | Kalender utama akun yang terhubung, atau ID/email kalender yang dapat diakses |
| `gmTimeZone` | `UTC` | Zona IANA, seperti `Asia/Jakarta`, digunakan untuk tanggal lokal dan waktu respons |
| `gmStartDate` | Waktu saat ini | Awal rentang baca sebagai tanggal ISO atau datetime |
| `gmEndDate` | Hari pertama bulan berikutnya pada tengah malam | Akhir eksklusif rentang baca; rentang maksimum adalah 60 hari kalender |
| `gmIncludeBusyDetails` | `false` | Hanya baca: sertakan judul acara dan peserta dalam `busy_slots`; boolean |
| `gmEventId` | Kosong | ID acara kalender untuk update/delete; gunakan `event_id` yang dikembalikan, bukan URL Meet |
| `gmTitle` | Kosong | Judul undangan; diperlukan saat `create` |
| `gmDescription` | Kosong | Deskripsi undangan |
| `gmStartTime` | Kosong | Mulai rapat, misal `2026-11-10T14:00:00+07:00` |
| `gmEndTime` | Kosong | Selesai rapat; harus setelah mulai |
| `gmAttendees` | Kosong | Email yang dipisahkan koma/titik koma/baris baru atau array string email JSON |
| `gmLocation` | Kosong | Lokasi rapat opsional di samping konferensi Meet |

### Slot waktu yang tersedia

Pembacaan default mencakup periode dari waktu saat ini hingga **tanggal 1 bulan berikutnya pukul 00:00** di zona waktu yang dipilih. Teruskan `gmEndDate` untuk menentukan jendela yang berbeda. Rentang lebih dari 60 hari atau tanggal yang tidak valid akan ditolak sebelum memanggil Google.

Hasilnya didasarkan pada API **free/busy** Google. Interval sibuk digabungkan dan dikurangkan dari jendela yang diminta. `available_slots` berisi celah kontinu dengan stempel waktu `start` dan `end`.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Availability",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "read",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmStartDate": "2026-11-06",
    "gmEndDate": "2026-11-13"
  }
}
```

### Menyertakan detail acara sibuk

Di bawah **Baca Slot Waktu yang Tersedia**, aktifkan **Sertakan Detail Acara Sibuk** (`gmIncludeBusyDetails: true`) untuk menambahkan judul dan peserta ke setiap slot sibuk. Opsi ini dinonaktifkan secara default.

```json
{
  "start": "2026-11-06T21:15:00+01:00",
  "end": "2026-11-06T21:30:00+01:00",
  "title": "Daily check-in",
  "attendees": [
    "colleague@example.com"
  ]
}
```

### Memesan pertemuan

1. Jalankan node `read` menggunakan kredensial pemilik workflow.
2. Tampilkan `available_slots` di antarmuka pemesanan Anda.
3. Teruskan `email`, `startTime`, dan `endTime` sebagai input workflow.
4. Jalankan `create` dengan kredensial yang sama. Pengunjung tidak memerlukan akun Google; email mereka dicatat sebagai peserta.

```json
{
  "type": "googleMeet",
  "data": {
    "label": "Booking",
    "credentialId": "YOUR_GOOGLE_MEET_CREDENTIAL_ID",
    "gmOperation": "create",
    "gmCalendarId": "primary",
    "gmTimeZone": "Europe/Berlin",
    "gmTitle": "Meet with me",
    "gmDescription": "A meeting booked through Heym",
    "gmAttendees": "$input.email",
    "gmStartTime": "$input.startTime",
    "gmEndTime": "$input.endTime"
  }
}
```

## Output

| Operasi | Bidang output |
| --- | --- |
| `read` | `available_slots`, `busy_slots`, `count`, `calendar_id`, `time_zone`, `start`, `end` |
| `create`, `update` | `event_id`, `meet_url`, `conference_status`, `event`, `calendar_id` |
| `delete` | `event_id`, `calendar_id`, `deleted: true` |

Gunakan `$Availability.available_slots` atau `$Booking.meet_url` di node hilir. Setiap operasi juga mengembalikan `status: "success"` dan `operation` terkait.

## Terkait

- [Credentials](../reference/credentials.md)
- [Integrasi Pihak Ketiga](../reference/integrations.md)
- [Berbagi Kredensial](../reference/credentials-sharing.md)
- [Input](input-node.md)
- [Output](output-node.md)
