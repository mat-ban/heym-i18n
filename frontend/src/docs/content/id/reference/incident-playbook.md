# Heym Incident Playbook (L0)

Gunakan playbook ini untuk mengonfirmasi insiden Heym, menilai dampak pengguna, memilih tingkat keparahan (severity), dan menjangkau prosedur pemulihan serta pemilik yang tepat.

Prosedur terperinci: [Heym Runbook (L1)](./operations-runbook.md)

Terakhir ditinjau: 2026-11-10. Cakupan: self-hosted Heym, instans tunggal atau cluster, pada Docker Compose atau Kubernetes.

## Serah terima deployment (Deployment handover)

Isi tabel ini untuk setiap lingkungan sebelum menggunakan dokumen ini saat bertugas (on-call). Nama, URL, target kapasitas, dan sasaran pemulihan bersifat spesifik untuk setiap deployment. Contoh repositori bukan merupakan inventaris produksi.

| Item | Nilai deployment |
| --- | --- |
| Lingkungan dan URL publik Heym | `<environment>`, `<public-url>` |
| Penanggung jawab on-call platform dan cadangan | `<rotation-or-contact>`, `<backup-contact>` |
| Saluran insiden dan pelacak insiden | `<channel>`, `<tracker-url>` |
| Penanggung jawab on-call database dan pengenal database | `<contact>`, `<database-id>` |
| Pemilik infrastruktur, jaringan, dan penyimpanan | `<contacts>` |
| Pemilik rilis dan sistem deployment | `<contact>`, `<deployment-url>` |
| Dasbor kesalahan aplikasi, latensi, dan ketersediaan | `<dashboard-url>` |
| Dasbor CPU, memori, disk, dan restart host atau pod | `<dashboard-url>` |
| Dasbor koneksi, kunci, disk, dan replikasi PostgreSQL | `<dashboard-url>` |
| Log dan backend trace OTel opsional | `<logs-url>`, `<trace-url-or-disabled>` |
| Proyek/file Compose atau konteks/namespace Kubernetes | `<exact-target>` |
| Lokasi main, worker, database, dan penyimpanan | `<services-or-deployments>`, `<storage-ids>` |
| Smoke workflow yang disetujui dan hasil yang diharapkan | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Prosedur pencadangan database dan file, uji pemulihan terbaru | `<procedure-url>`, `<test-date>` |
| Target waktu pemulihan dan target titik pemulihan (RTO, RPO) | `<RTO>`, `<RPO>` |

Simpan kontak dan tautan dasbor dalam salinan operasional deployment yang dibatasi aksesnya. Bukti harus berisi ID, stempel waktu, hitungan, dan kesalahan yang disanitasi, bukan kredensial atau payload workflow.

## Inventaris platform

| Komponen | Tanggung Jawab | Implikasi insiden |
| --- | --- | --- |
| Frontend dan main backend | UI, API, MCP, Portal, eksekusi interaktif | Periksa rute publik dan proses main secara terpisah |
| PostgreSQL | Status aplikasi, registri eksekusi, run queue, slot konkurensi, koordinasi, dan notifikasi | Pemadaman database dapat menghentikan penanganan permintaan dan eksekusi latar belakang |
| Instans worker, saat mode cluster diaktifkan | Menjalankan tugas latar belakang yang memenuhi syarat dalam antrean | Worker yang sehat tidak menggantikan endpoint publik milik main |
| Proses leader terpilih | Cron, evaluasi peringatan, koordinasi latar belakang | Worker yang kompatibel dapat menjadi leader; ini tidak mengubah perannya menjadi main |
| Penyimpanan persisten main | File drive, plugin terpasang, dan ruang kerja coding-agent | Pulihkan penyimpanan bersama main; merutekan ingress ke worker tidak memulihkannya |
| Backend sandbox pada setiap instans yang mengeksekusi | Kontainer Docker atau pod Kubernetes untuk eksekusi terisolasi | Backend sandbox yang gagal dapat memengaruhi node tertentu sementara UI tetap berfungsi |
| Dependensi workflow | Penyedia model, server MCP, API eksternal, penyimpanan data, dan layanan pesan | Tentukan apakah satu dependensi atau seluruh platform yang mengalami kegagalan |
| Kolektor OTel opsional | Span alat Agent, node, dan workflow yang diekspor | Hilangnya trace yang diekspor saja tidak membuktikan bahwa eksekusi gagal |

Run queue bawaan Heym menggunakan PostgreSQL. Redis, RabbitMQ, dan penyimpanan vektor dapat menjadi dependensi workflow; mereka bukan layanan wajib untuk antrean bawaan.

`GET /api/health` hanya melaporkan kesehatan dan versi proses. Endpoint ini tidak menguji PostgreSQL, antrean, pemilihan leader, kapasitas sandbox, atau sinkronisasi kredensial. Respons hijau adalah satu pemeriksaan, bukan jaminan kesiapan end-to-end.

## Lima menit pertama

| Langkah | Tindakan | Keputusan atau bukti |
| --- | --- | --- |
| 1 | Konfirmasikan peringatan dan verifikasi lingkungan, layanan, dan waktu mulai | Catat stempel waktu UTC dan perubahan rilis/konfigurasi terbaru |
| 2 | Periksa UI publik dan `/api/health`, lalu backend main langsung | Kegagalan publik dengan backend langsung yang sehat menunjukkan masalah perutean atau frontend |
| 3 | Periksa konektivitas PostgreSQL dan tekanan koneksi | Rute kegagalan database ke L1 sebelum me-restart layanan aplikasi |
| 4 | Periksa status kontainer/pod, CPU, memori, penyimpanan, dan kesalahan terbaru | Pisahkan kegagalan infrastruktur, beban tinggi, dan kegagalan khusus workflow |
| 5 | Dalam mode cluster, periksa **Pengaturan > Instans**, status antrean, dan bukti leader | Identifikasi hilangnya main, worker offline/tidak cocok, atau pekerjaan khusus main |
| 6 | Tetapkan tingkat keparahan dan mulai satu mitigasi dari tabel perutean | Untuk P1/P2, buka insiden dan libatkan pemilik terkait segera |
| 7 | Verifikasi eksekusi smoke workflow mode produksi yang aman dan amati pemulihan | Konfirmasikan usia antrean, kesalahan, dan sumber daya membaik; tetapkan waktu pembaruan berikutnya |

Jika rilis bertepatan dengan kegagalan, periksa [Deployment buruk atau regresi konfigurasi](./operations-runbook.md#bad-deployment-or-configuration-regression). Periksa kompatibilitas skema sebelum rollback.

## Tingkat keparahan dan respons

Ini adalah target respons awal. Terapkan kebijakan insiden deployment dan dampak bisnis jika lebih ketat.

| Tingkat Keparahan | Contoh | Respons |
| --- | --- | --- |
| P1 | Main tidak tersedia untuk semua pengguna; database tidak tersedia atau penulisan gagal; kegagalan eksekusi meluas; intake kritis tidak tersedia di seluruh workflow | Mitigasi segera, catatan insiden, tim on-call platform dan dependensi |
| P2 | Antrean menumpuk; kehilangan kapasitas worker; kehabisan koneksi mendekat; satu workflow menurunkan kapasitas bersama; OOM berulang | Mulai mitigasi segera, targetkan pembendungan dalam 15 menit, catatan insiden |
| P3 | Kegagalan workflow/penyedia terisolasi; dampak terbatas dengan kapasitas platform yang sehat | Pemilik workflow atau dependensi, tindak lanjut terlacak, dan catatan on-call |
| P4 | Sinyal informasi, tren kapasitas yang diharapkan, positif palsu terverifikasi | Konfirmasikan, dokumentasikan, dan sesuaikan pemantauan jika diperlukan |

## Perutean sinyal ke L1

Gunakan tautan jangkar relatif ini saat mengonfigurasi tautan peringatan. Jika layanan pemantauan memerlukan URL absolut, tambahkan prefiks lokasi salinan operasional Anda yang dihosting.

| Sinyal | Mulai dari sini |
| --- | --- |
| UI/API tidak tersedia, 5xx publik, kegagalan kesehatan proses | [UI atau API tidak berfungsi](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL tidak terjangkau, koneksi ditolak, kegagalan penulisan | [Database tidak berfungsi](./operations-runbook.md#postgresql-down-or-not-writable) |
| Terlalu banyak klien, batas waktu pool, tunggu kunci, lonjakan koneksi aktif | [Koneksi database dan kunci](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Diperlukan restart backend/worker terkontrol | [Restart layanan](./operations-runbook.md#controlled-service-restart) |
| Lonjakan jumlah eksekusi, total durasi, token, CPU, atau memori | [Workflow yang paling banyak mengonsumsi sumber daya](./operations-runbook.md#most-resource-consuming-workflows) |
| Antrean bertambah, eksekusi menunggu atau tampaknya macet | [Antrean menumpuk](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instans Offline/Tidak Cocok, worker menganggur, masalah penjadwal atau distribusi | [Pemeriksaan cluster](./operations-runbook.md#cluster-mode-checks) |
| Main hilang saat worker tetap sehat | [Instans main tidak tersedia](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Kesalahan webhook, kegagalan MCP/Portal, pemutusan SSE | [Endpoint ingress dan eksekusi](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disk penuh, kegagalan persistent volume | [Masalah kontainer, pod, atau penyimpanan](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Peningkatan kesalahan setelah perubahan image, lingkungan, atau skema | [Deployment buruk](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Kesalahan penyedia Agent/LLM/MCP, 429, kegagalan kredensial | [Kegagalan model atau integrasi](./operations-runbook.md#model-credential-or-integration-failure) |
| Kegagalan sandbox Code/Playwright/skill/coding-agent | [Kegagalan sandbox](./operations-runbook.md#sandbox-failure) |
| Pemulihan tidak dapat memenuhi target; database atau file hilang | [Pemulihan dan respons bencana](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalasi

| Temuan | Libatkan | Sediakan |
| --- | --- | --- |
| Banyak area atau workflow terpengaruh | Tim on-call platform dan pimpinan insiden | Lingkungan, cakupan, waktu mulai, mitigasi, pembaruan berikutnya |
| Database tidak tersedia, jenuh, terkunci, atau kehabisan disk | Tim on-call database | ID database, jumlah koneksi, PID pemblokir, kesalahan tersanitasi, status penyimpanan |
| Kegagalan pod/node, pemasangan penyimpanan, kapasitas sandbox | Pemilik infrastruktur/penyimpanan | Konteks, namespace, beban kerja, event pod, tekanan sumber daya |
| Rute publik gagal saat backend langsung berfungsi | Pemilik jaringan/ingress | Rute terdampak, kode status, latensi, perbandingan backend |
| Satu workflow mendominasi beban atau gagal sendiri | Pemilik workflow | ID workflow/eksekusi, sumber trigger, rasio, jendela waktu, batas sementara |
| Perubahan deployment/konfigurasi yang berkorelasi | Pemilik rilis | Digest image yang berjalan, waktu rollout, revisi skema, rilis baik terakhir yang diketahui |
| Kuota/autentikasi/ketersediaan penyedia | Pemilik kredensial atau integrasi | Penyedia, model/layanan, kode status, ID permintaan jika aman; tanpa nilai rahasia |

Jika dampak P1/P2 berlanjut setelah mitigasi pertama, segera eskalasikan dengan bukti yang telah dikumpulkan. Jangan menunggu analisis akar penyebab lengkap.

## Ekspektasi kegagalan

| Kegagalan | Apa yang mungkin berlanjut | Tindakan pertama |
| --- | --- | --- |
| PostgreSQL tidak tersedia | Frontend statis mungkin masih dapat dimuat | Pulihkan jalur database; jangan me-restart setiap instans aplikasi |
| Main tidak tersedia, worker sehat | Pekerjaan latar belakang dan penjadwalan yang memenuhi syarat dapat berlanjut jika worker yang kompatibel memimpin | Pulihkan main beserta penyimpanan persistennya; UI/API/MCP/Portal publik tetap tidak tersedia |
| Worker tidak tersedia | Instans lain yang memenuhi syarat mengambil pekerjaan antrean saat dialihkan | Periksa penempatan, kapasitas cadangan, dan pemulihan sebelum menambah lalu lintas |
| Eksekusi terputus | Eksekusi yang dapat dipulihkan dapat dimulai ulang dari awal, sekali saja | Periksa pemulihan otomatis dan efek samping eksternal sebelum memutar ulang secara manual |
| Beban berlebih khusus main | Worker mungkin tetap menganggur | Kurangi intake yang bermasalah atau tingkatkan kapasitas main; perubahan bobot tidak dapat memindahkan pekerjaan yang dipatok |
| Peringatan internal tidak tersedia | Pemantauan uptime/DB/infrastruktur eksternal mungkin masih berfungsi | Gunakan pemantauan di luar Heym; peringatan Heym bergantung pada DB dan penjadwal yang sama |
| Sandbox atau penyedia tidak tersedia | Workflow tanpa dependensi tersebut mungkin berfungsi | Bendung workflow yang terpengaruh dan perbaiki dependensi tersebut |

## Pemulihan dan penutupan insiden

1. Verifikasi akses publik, akses database, kepatutan instans yang diinginkan, dan smoke workflow mode produksi yang aman. Pengujian editor tidak membuktikan pengiriman ke worker.
2. Amati setidaknya 10 menit kesalahan yang stabil, latensi terkendali, penggunaan sumber daya, dan penurunan usia antrean. Amati juga jadwal kritis berikutnya yang diharapkan atau pemeriksaan smoke yang disepakati.
3. Rekonsiliasi eksekusi yang gagal, dipulihkan, dilewati, kedaluwarsa, dan tertunda dengan pemilik workflow. Periksa efek samping eksternal sebelum memutar ulang apa pun.
4. Pulihkan jeda trigger sementara, batas, dan bobot worker secara bertahap. Berikan pemilik dan waktu kedaluwarsa untuk setiap pembatasan yang tersisa.
5. Perbarui insiden dengan dampak, garis waktu UTC, tindakan, bukti, dan risiko yang belum terselesaikan. Tetapkan tinjauan akar penyebab untuk P1/P2 dan perbarui kedua dokumen jika ada prosedur yang terlewat.

## Referensi operasional terkait

- [Penyiapan perintah dan pemeriksaan L1](./operations-runbook.md#command-setup)
- [Menjalankan dan deployment](../getting-started/running-and-deployment.md)
- [Distribusi beban](./cluster.md)
- [Deployment Kubernetes](../getting-started/kubernetes.md)
- [Keamanan dan rotasi kunci](./security.md)
