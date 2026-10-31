# Pencatatan Audit

Heym menulis baris audit untuk setiap tindakan yang relevan dengan keamanan: siapa yang melakukannya, apa yang menjadi sasarannya, dan apakah berhasil. Baris-baris tersebut dikirim ke output standar backend melalui logger `winston.audit`, bersama dengan log akses permintaan, dan dapat dibaca dari tab **Logs** atau dengan `docker logs`.

Audit logging **selalu aktif**. Tidak ada yang perlu diaktifkan dan tidak ada environment variable yang perlu diatur.

## Format Baris

Satu tindakan menghasilkan tepat satu baris mandiri:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

Setiap baris membawa field-field berikut:

| Field | Deskripsi |
|-------|-------------|
| `action` | Apa yang terjadi, dalam format `resource.verb` — lihat tabel di bawah. |
| `outcome` | `success`, `failure`, atau `denied`. |
| `actor_id` | UUID pengguna yang melakukan tindakan. Hanya tidak ada ketika tidak ada yang terautentikasi. |
| `actor_email` | Email pengguna tersebut. Pada login yang gagal, ini adalah alamat yang dicoba, bukan akun yang terkonfirmasi. |
| `target` | Objek yang menjadi sasaran tindakan, dalam format `type:uuid`. |
| `target_name` | Nama objek tersebut yang dapat dibaca manusia, diberi tanda kutip ketika mengandung spasi. |

Field khusus tindakan menyusul — misalnya `credential_type`, `imported`, `grantee_email`, `team_name`. Nilai yang mengandung spasi, tanda kutip, atau `=` akan diberi tanda kutip; nilai yang lebih panjang dari 256 karakter dipotong dengan penanda `...(truncated)`.

## Membaca Log

Audit logger adalah turunan dari request logger, sehingga keduanya mencapai stream yang sama namun tetap dapat dipisahkan:

```bash
# Hanya baris audit, tanpa gangguan access-log
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Semua yang dilakukan satu pengguna
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Login yang gagal dan akses yang ditolak
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Semua yang menyentuh satu credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

Di dalam aplikasi, tab **Logs** membaca output container yang sama. Tab ini dibatasi oleh `DOCKER_LOGS_ENABLED` dan allowlist `DOCKER_LOGS_ALLOWED_EMAILS`.

## Apa yang Dicatat

Setiap perubahan status dicatat. Pembacaan hanya dicatat ketika pembacaan itu sendiri merupakan tindakan sensitif — melihat riwayat eksekusi sebuah workflow, membuka credential, mengunduh file. Pembacaan daftar dan detail biasa tidak diaudit; access log sudah mencatat bahwa sebuah permintaan terjadi, dan mengaudit setiap `GET` akan menenggelamkan baris-baris yang penting. Satu-satunya pengecualian adalah [tampilan halaman](#page-views), yang mencatat ke mana pengguna yang masuk bernavigasi dalam aplikasi.

### Autentikasi

| Action | Catatan |
|--------|-------|
| `auth.register` | `outcome=denied` ketika registrasi dinonaktifkan atau ketika login dengan password dimatikan (`reason=password_login_disabled`), `failure` ketika email sudah digunakan. |
| `auth.login` | `outcome=failure` mencatat alamat yang dicoba dan apakah email tidak dikenal atau password salah. |
| `auth.logout` | Actor diselesaikan dari refresh cookie, sehingga logout tanpa cookie akan dicatat tanpa identitas. |
| `auth.token_refresh` | `outcome=denied` dengan `reason=refresh_token_replayed_or_revoked` — sinyal pencurian token yang layak untuk diwaspadai. |
| `auth.password_change` | `outcome=failure` ketika password saat ini salah. |
| `auth.sso_login` | Single sign-on. `outcome=failure` membawa alasan respons penyedia ditolak; `denied` membawa `email_not_verified`, `domain_not_allowed`, atau `provisioning_disabled`. |
| `sso_settings.update` | Administrator mengubah konfigurasi [SSO](./sso.md). Mencatat `enabled` dan `password_login_disabled`, tidak pernah mencatat client secret. |
| `sso_settings.test` | Administrator menjalankan uji koneksi SSO. |

### Tampilan Halaman

`page.view` ditulis setiap kali pengguna yang masuk membuka halaman di aplikasi web, dengan jalur URL di bidang `path`:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

Jalur tersebut adalah rute dalam aplikasi. Tab dashboard adalah bagian darinya (`/?tab=traces`), begitu juga id yang menamai apa yang terbuka, seperti `/workflows/<id>`. Hanya daftar singkat parameter kueri yang mengidentifikasi halaman yang disimpan (`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`); semua yang lain dalam string kueri dan seluruh fragmen dibuang. Halaman yang tautannya membawa rahasia, seperti `/review/<token>`, dicatat dengan placeholder `:token` alih-alih rahasia tersebut.

Browser melaporkan jalurnya, sehingga baris `page.view` menunjukkan ke mana pengguna menyatakan mereka pergi. Ini tidak membuktikan bahwa server mengembalikan halaman tersebut. Kunjungan ke halaman masuk dan tautan yang dibuka saat keluar tidak dicatat, karena tidak ada pengguna yang terikat dengannya.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run` ditulis saat eksekusi dimulai melalui API: tombol Run di editor, endpoint execute dengan sesi, kunci API, atau webhook, portal chat, dan alat MCP. Ini mencatat siapa yang memulainya, bagaimana, dan bagaimana itu berakhir:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id` menautkan baris ke proses di Riwayat Eksekusi. `outcome` bernilai `failure` saat eksekusi berakhir dengan `error`, `cancelled`, atau `timeout`. Eksekusi yang dijeda untuk tinjauan manusia atau ditahan di antrean konkurensi adalah baris `success` dengan `status=pending` atau `status=queued`. Panggilan tanpa pengguna yang masuk, seperti webhook anonim atau pengunjung portal, tidak memiliki `actor_id` atau `actor_email`. Input dan output tidak pernah ditulis.

Eksekusi yang dimulai oleh jadwal, node trigger, antrean, atau peristiwa bukanlah baris audit. Mereka dieksekusi pada instans mana pun yang mengklaimnya dan dicatat dalam Riwayat Eksekusi dengan sumber trigger dan instans yang menjalankannya.

`workflow.history_view` ditulis saat seseorang membuka riwayat eksekusi workflow. Pencarian kecil yang menampilkan eksekusi terbaru dari workflow di canvas atau dalam daftar tidak diaudit.


`workflow.history_view` mencatat `owned=false` ketika seorang kolaborator membaca riwayat eksekusi milik orang lain. `workflow.delete` mencatat `outcome=denied` dengan `reason=not_owner` ketika seorang kolaborator mencoba menghapus.

### Credentials

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view` diaudit karena membuka credential berarti mendekripsinya. Kegagalan mencatat `outcome=denied`, yang merupakan bentuk dari upaya enumerasi credential-id.
### Sumber Daya Lainnya

| Sumber Daya | Aksi |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Operasi bulk dicatat satu kali per permintaan dengan jumlahnya, bukan satu kali per baris. Impor CSV sebanyak 5.000 baris menghasilkan satu baris `data_table.import_csv` yang membawa `imported`, `rejected`, dan `total`.

## Rahasia Tidak Pernah Dicatat

Baris audit mencatat pengenal, nama, dan jumlah. Baris tersebut tidak pernah mencatat isi kredensial, nilai variabel, kata sandi, atau token.

Dua hal yang menegakkan hal ini. Situs pemanggilan ditulis untuk hanya meneruskan field yang aman, dan helper audit melakukan redaksi sebagai pengaman terakhir: setiap field yang namanya mengandung `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie`, atau sejenisnya akan diganti dengan `***` sebelum baris tersebut dibuat. Redaksi berlebih adalah hal yang disengaja — baris yang tidak informatif lebih baik daripada kredensial yang bocor.

Ketika sebuah rahasia benar-benar relevan dengan catatan, hanya bentuknya yang dicatat. Berbagi file mencatat `password_protected=true`, tidak pernah kata sandinya.

## Heym Work

Saat Anda menjalankan Heym Work bersama Heym, Work memancarkan baris audit ke stdout wadahnya sendiri dalam format Winston yang sama:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work mencatat tindakan pengguna pada halaman, papan, dan rekaman:

| Tindakan | Arti |
|---|---|
| `page.create`, `page.update`, `page.delete` | Perubahan pada halaman dan tata letak dashboard |
| `board.column_create`, `board.column_move`, `board.column_delete` | Perubahan tata letak kolom Kanban |
| `card.create`, `card.move`, `card.archive`, `card.delete` | Peristiwa siklus hidup kartu |
| `record.create`, `record.update`, `record.delete` | Mutasi rekaman tabel data melalui Work |
| `chat.message` | Prompt pengguna yang dikirim ke asisten Work |
| `export.csv`, `export.json` | Ekspor data |

Setiap baris membawa bidang `actor_id`, `actor_email`, `timestamp`, dan `outcome` yang sama dengan baris audit Heym, sehingga pengumpul log dapat mengurai keduanya dengan satu pipeline tunggal.

## Retensi

**Baris audit hanya bertahan selama output log container bertahan.** Baris tersebut tidak ditulis ke database. Membuat ulang container backend akan membuang log-nya.

Jika Anda memerlukan riwayat audit yang bertahan setelah redeploy, kirimkan stdout container ke tempat yang tahan lama — log driver, sidecar collector, atau agregasi log platform Anda — sama seperti yang Anda lakukan untuk log container lainnya.

## Untuk Kontributor

Memancarkan baris audit memerlukan satu pemanggilan:

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

Helper ini bersifat sinkron, tidak menyentuh database, dan menelan error-nya sendiri, sehingga pemanggilan audit tidak dapat menggagalkan atau memperlambat permintaan.

Tiga aturan saat menambahkannya:

1. **Beri nama aksi dengan format `resource.verb` dalam snake_case.** `backend/tests/test_audit_log.py` menelusuri setiap pemanggilan `audit()` di bawah `app/api/` dan menggagalkan build pada nama yang tidak cocok, dan pada sumber daya yang tercakup yang telah kehilangan semua situs pemanggilannya.

2. **Hanya baca atribut yang pasti ada.** `try/except` milik helper melindungi badannya sendiri, bukan ekspresi yang Anda berikan padanya — sebuah `AttributeError` pada `target_name=workflow.name` akan dimunculkan di situs pemanggilan, sebelum `audit()` berjalan, dan akan merusak permintaan. Baca kolom ORM dan variabel lokal, bukan atribut opsional atau yang dimuat secara lazy.

3. **Catat penghapusan sebelum melakukan delete.** Setelah `db.delete(row)`, nama dan id yang ingin Anda catat mungkin sudah hilang. Tempatkan pemanggilan di atasnya.
