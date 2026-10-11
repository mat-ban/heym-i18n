# Single Sign-On

Heym dapat mengautentikasi pengguna terhadap penyedia **OpenID Connect** eksternal mana pun. Administrator memasukkan URL issuer di bawah **Settings → SSO**, dan Heym membaca setiap endpoint lainnya dari dokumen discovery penyedia tersebut.

Tidak ada penyedia yang di-hardcode. Keycloak, Okta, Entra ID, Auth0, Google, dan penyedia OIDC lainnya terhubung melalui kolom yang sama, karena satu-satunya informasi yang diberikan kepada Heym adalah issuer.

Sign-in dengan kata sandi dan SSO bekerja secara berdampingan. Sign-in dengan kata sandi dapat dinonaktifkan setelah SSO terverifikasi.

## Sebelum Anda Memulai

Pengaturan SSO berlaku untuk seluruh instance, sehingga hanya administrator instance yang boleh mengubahnya. Administrator ditentukan melalui variabel environment, bukan disimpan di database:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Nilai kosong tidak memberikan akses kepada siapa pun. Restart backend setelah mengubahnya. Akun dalam daftar ini juga dapat melihat tab **SSO** di Settings, dan tetap memiliki akses kata sandi meskipun sign-in dengan kata sandi dinonaktifkan — lihat [Menonaktifkan Sign-In dengan Kata Sandi](#menonaktifkan-sign-in-dengan-kata-sandi).

## Mendaftarkan Heym pada Penyedia Anda

Di penyedia identitas Anda, buat **confidential client** (juga disebut app registration) dengan:

| Pengaturan | Nilai |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | Aktif — Heym menggunakan client secret |
| Redirect URI | Nilai persis yang ditampilkan di tab SSO Heym |
| Scopes | `openid email profile` |

Heym menghitung redirect URI dari `FRONTEND_URL` dan menampilkannya sebagai read-only di formulir pengaturan dengan tombol salin. Nilainya selalu berakhiran `/api/auth/sso/callback`. Salin nilainya daripada mengetiknya — redirect URI yang tidak cocok adalah penyebab kegagalan setup yang paling umum, dan penyedia akan menolaknya tanpa penjelasan.

Penyedia Anda harus mengembalikan alamat email yang terverifikasi. Lihat [Pemetaan Akun](#pemetaan-akun).

## Mengonfigurasi Heym

Buka **Settings → SSO**. Tab ini hanya muncul untuk akun yang terdaftar di `HEYM_ADMIN_EMAILS`.

| Kolom | Fungsinya |
|-------|--------------|
| **Enable single sign-on** | Menampilkan tombol sign-in di layar login. |
| **Issuer URL** | URL dasar penyedia, misalnya `https://idp.example.com/realms/your-realm`. Heym menambahkan `/.well-known/openid-configuration` dan membaca sisanya dari sana. |
| **Client ID** | Pengenal klien dari penyedia Anda. |
| **Client secret** | Disimpan dalam bentuk terenkripsi. Biarkan kolom kosong untuk mempertahankan nilai yang tersimpan — Heym tidak pernah mengembalikan secret yang dimilikinya. |
| **Redirect URI** | Read-only. Salin nilai ini ke allowlist penyedia Anda. |
| **Scopes** | Secara default `openid email profile`. |
| **Sign-in button label** | Teks pada tombol di layar login, misalnya "Sign in with Okta". |
| **Create an account on first sign-in** | Menentukan apakah pengguna yang tidak dikenal otomatis mendapatkan akun Heym. |
| **Allowed email domains** | Dipisahkan dengan koma. Kosong berarti mengizinkan domain apa pun yang diautentikasi oleh penyedia. |
| **Disable password sign-in** | Menonaktifkan autentikasi kata sandi untuk seluruh instance. |

### Uji koneksi terlebih dahulu

**Test connection** mengambil dokumen discovery dan signing key penyedia, lalu melaporkan token endpoint yang ditemukan. Anda dapat menjalankannya pada issuer yang baru Anda ketik tetapi belum disimpan, sehingga URL yang salah hanya memerlukan satu klik, bukan satu penyimpanan.

Sebuah pengujian hanya *mencatat* hasil yang lulus ketika issuer yang diuji adalah issuer yang sudah tersimpan. Pengujian draf memberi tahu Anda apakah URL dapat di-resolve; pengujian tersebut tidak melegitimasi konfigurasi yang belum disimpan. Mengubah issuer, client ID, scopes, atau secret akan menghapus hasil yang tercatat karena alasan yang sama.

## Cara Kerja Sign-In

1. Seseorang mengklik tombol sign-in di layar login.
2. Heym mengalihkannya ke penyedia dengan `state`, `nonce`, dan PKCE challenge.
3. Pengguna melakukan autentikasi dengan penyedia.
4. Penyedia mengalihkan kembali ke callback Heym dengan authorization code.
5. Heym menukar code tersebut dengan token dan memverifikasi ID token terhadap key yang dipublikasikan penyedia, dengan memeriksa signature, audience, issuer, expiry, dan nonce.
6. Heym menyelesaikan akun dan menerbitkan sesinya sendiri, persis seperti yang dilakukan sign-in dengan kata sandi.

Semua yang terjadi setelah langkah 6 tidak berubah: cookie sesi yang sama, masa berlaku token yang sama, izin yang sama.

## Pemetaan Akun

Heym menyelesaikan akun dengan urutan berikut:

1. **`(issuer, subject)`** — identitas yang dinyatakan penyedia pada sign-in sebelumnya. Ini bersifat otoritatif dan tetap berlaku meskipun email berubah di penyedia.
2. **Email terverifikasi** — akun Heym yang sudah ada dengan alamat tersebut akan diklaim, dan subject dari penyedia dicatat padanya sejak saat itu.
3. **Akun baru** — dibuat jika **Create an account on first sign-in** aktif dan domainnya diizinkan.

Sebuah email dianggap terverifikasi hanya ketika ID token membawa `email_verified: true`. Jika klaim tersebut bernilai `false` atau tidak ada, sign-in akan ditolak. Mengklaim akun yang sudah ada — atau membuat akun baru — berdasarkan alamat yang tidak dijamin oleh penyedia merupakan jalur account-takeover, sehingga Heym tidak melakukannya. Penyedia yang tidak pernah mengirimkan `email_verified` perlu dikonfigurasi agar mengirimkannya.

Akun yang dibuat dengan cara ini tidak memiliki kata sandi. Akun tersebut hanya dapat sign-in melalui penyedia.
## Menonaktifkan Sign-In dengan Password

Switch **Disable password sign-in** tetap tidak tersedia hingga tiga hal berikut terpenuhi:

1. SSO diaktifkan.
2. Uji koneksi telah berhasil, sehingga issuer yang salah tidak dapat mengunci pintu dari dalam.
3. Setidaknya satu akun dalam `HEYM_ADMIN_EMAILS` benar-benar memiliki password.

Saat switch ini aktif, autentikasi password ditolak pada ketiga permukaan yang membuat atau menerima password: formulir login, **registrasi**, dan halaman persetujuan MCP OAuth. Registrasi dihitung karena ia menerbitkan password; membiarkannya terbuka akan membuat pengaturan ini dapat dilewati oleh siapa pun yang dapat mengakses `/register`.

Akun yang terdaftar dalam `HEYM_ADMIN_EMAILS` dikecualikan dari ketiganya. Siapa pun yang dapat mengedit file environment sudah dapat memulihkan instance, sehingga jaminan ini berada di dalam kode alih-alih mengandalkan ingatan operator.

### Mengapa kondisi ketiga ada

Administrator yang akun Heym-nya dibuat *melalui* SSO tidak memiliki password sama sekali. Pengecualian akan membiarkan mereka melewati gerbang, tetapi tidak ada yang dapat mereka gunakan untuk sign in — sehingga instance tidak akan memiliki cara untuk kembali jika provider mengalami gangguan. Heym menolak masuk ke keadaan tersebut dan menyatakannya.

Jika Anda menemui pesan tersebut, sign in melalui SSO dan daftarkan akun password pada salah satu alamat admin Anda (registrasi masih terbuka untuk alamat admin justru karena alasan ini), atau tambahkan alamat yang sudah memiliki password ke `HEYM_ADMIN_EMAILS`.

### Memulihkan saat provider mengalami gangguan

Dalam urutan preferensi:

1. **Sign in dengan password admin break-glass.** Layar login menyembunyikan formulir password saat password sign-in dinonaktifkan, jadi klik **Sign in with a password instead** di bawah tombol SSO untuk menampilkannya. Formulir ini bukan bypass: setiap alamat di luar `HEYM_ADMIN_EMAILS` tetap ditolak, dan diberi tahu alasannya.
2. **Tambahkan diri Anda ke `HEYM_ADMIN_EMAILS`** di file environment dan restart backend. Akun yang sudah memiliki password kemudian dapat sign in.
3. **Buka kembali password sign-in langsung di database**, jika tidak ada admin yang memiliki password sama sekali:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Tidak perlu restart; pengaturan dibaca per request.

Pengguna akhir Portal tidak terpengaruh. Mereka melakukan autentikasi terhadap direktori terpisah — lihat [Portal](./portal.md).

## Kesalahan Sign-In

Sign-in yang gagal akan kembali ke layar login dengan pesan yang dapat dibaca. Heym tidak pernah menampilkan teks kesalahan mentah dari provider.

| Pesan | Penyebab |
|---------|-------|
| That sign-in attempt expired | Upaya tersebut memakan waktu lebih dari sepuluh menit, atau browser menghilangkan cookie transaksi. Coba lagi. |
| Could not reach the identity provider | Discovery atau token exchange gagal. Periksa URL issuer dan pastikan provider dapat dijangkau dari backend. |
| The provider's response could not be verified | ID token gagal validasi signature, audience, issuer, expiry, atau nonce. Biasanya karena ketidakcocokan client ID. |
| The provider did not return an email address | Scope `email` tidak ada, atau provider tidak merilis claim tersebut. |
| Your email address is not verified | Provider mengirim `email_verified: false`, atau menghilangkan claim tersebut. |
| Your email domain is not allowed | Alamat berada di luar **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** dinonaktifkan dan tidak ada akun yang cocok. Administrator harus membuatnya. |
| Single sign-on is not configured | SSO dinonaktifkan, atau issuer, client ID, atau secret tidak ada. |

## Catatan Keamanan

- **Client secret dienkripsi saat disimpan** dan tidak pernah dikembalikan oleh endpoint mana pun. Formulir pengaturan hanya melaporkan apakah ada secret yang tersimpan.
- **PKCE verifier tidak pernah meninggalkan Heym.** Verifier disimpan dalam cookie `HttpOnly` berumur pendek alih-alih dalam parameter `state`, yang melakukan round-trip melalui provider secara terbuka.
- **Hanya signature asimetris yang diterima.** Algoritma `none` dan simetris ditolak terlepas dari apa yang diiklankan provider.
- **Tujuan post-login divalidasi** sebagai jalur same-origin, sehingga callback tidak dapat digunakan sebagai open redirect.
- **Setiap sign-in diaudit.** Keberhasilan, kegagalan, dan penolakan muncul sebagai baris `auth.sso_login`, dan perubahan konfigurasi sebagai `sso_settings.update` — lihat [Audit Logging](./audit.md).

## Yang Tidak Didukung

- **SAML.** OIDC adalah satu-satunya protokol.
- **Beberapa provider secara bersamaan.** Satu instance terhubung ke satu provider.
- **Pemetaan grup atau role** dari claim provider.
- **Single logout.** Sign out dari Heym tidak membuat Anda sign out dari provider.
