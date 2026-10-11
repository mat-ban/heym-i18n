# Amazon S3

Node Amazon S3 membaca dan menulis objek di [Amazon S3](https://aws.amazon.com/s3/).

## Operasi yang didukung

- `Create Bucket`: Membuat bucket di region kredensial.
- `Delete Bucket`: Menghapus bucket yang kosong.
- `List Buckets`: Menampilkan daftar bucket yang terlihat oleh kredensial.
- `Create Folder`: Membuat penanda folder kosong (key berukuran nol byte yang diakhiri dengan `/`).
- `Delete Folder`: Menghapus semua objek di bawah prefix folder (termasuk key bersarang).
- `Get All in Folder`: Menampilkan daftar semua metadata objek di bawah prefix folder (paginasi sisi server).
- `Upload Object`: Menulis payload teks ke bucket/key.
- `Get Object`: Mengunduh objek dan mengembalikan teks yang telah didekode atau konten base64.
- `Copy Object`: Menyalin objek ke key atau bucket lain.
- `List Objects`: Menampilkan daftar metadata objek di bawah prefix (satu halaman, hingga 1000 key; mendukung continuation token).
- `Delete Object`: Menghapus satu objek berdasarkan key.

## Penyiapan kredensial

Buat kredensial `Amazon S3` di tab Credentials dengan:

- Access Key ID
- Secret Access Key
- Region
- Session Token opsional (untuk kredensial AWS STS sementara)

## Field umum

- `Bucket`: Nama bucket target (bucket tujuan untuk operasi copy).
- `Object Key`: Key objek seperti jalur, misalnya `reports/daily.json`.
- `Folder Path`: Prefix untuk operasi folder (contohnya `docs/archive`).
- `Source Bucket`: Bucket sumber opsional untuk copy; default ke bucket tujuan.
- `Source Object Key`: Key sumber untuk operasi copy.
- `Prefix`: Digunakan oleh operasi list untuk membatasi cakupan hasil.
- `Continuation Token`: Token opsional dari respons list sebelumnya untuk mengambil halaman berikutnya.
- `Max Keys`: Ukuran halaman untuk List Objects (1–1000).
- `Include Binary`: Jika diaktifkan pada Get Object, mengembalikan `body_base64` alih-alih `body_text`.
- `Body`: Konten teks yang akan diunggah.
- `Content Type`: Tipe MIME opsional untuk objek yang diunggah.

## Contoh output

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Catatan

- `Upload Object` saat ini mengunggah konten teks UTF-8.
- `Get Object` dapat mengembalikan base64 untuk file biner dengan mengaktifkan opsi binary.
- `Create Bucket` menggunakan region kredensial dan memerlukan `s3:CreateBucket`.
- `Delete Bucket` mengharuskan bucket dalam keadaan kosong dan memerlukan `s3:DeleteBucket`.
- `List Buckets` memerlukan `s3:ListAllMyBuckets`.
- `Create Folder` mengunggah objek penanda berukuran nol byte; S3 tidak memiliki tipe direktori native.
- `Delete Folder` menghapus setiap objek yang key-nya diawali dengan prefix folder; gunakan dengan hati-hati.
- `Get All in Folder` melakukan paginasi otomatis melalui prefix hingga semua objek dikembalikan.
- `List Objects` mengembalikan satu halaman (hingga 1000 key). Ketika `truncated` bernilai true, masukkan `next_continuation_token` ke field Continuation Token pada pemanggilan berikutnya.
- `Copy Object` memerlukan `s3:GetObject` pada sumber dan `s3:PutObject` pada tujuan.

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Credentials](../reference/credentials.md) – Tipe kredensial dan penggunaannya
- [Third-Party Integrations](../reference/integrations.md) – Penyiapan kredensial Amazon S3
