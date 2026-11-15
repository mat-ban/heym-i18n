# Heym di Kubernetes

Terapkan Heym di Kubernetes tanpa soket Docker. Jalankan setiap sandbox sebagai pod mandiri, lengkap dengan panduan untuk penyimpanan, jaringan, dan worker.

Contoh manifes untuk menjalankan Heym tanpa soket Docker. Setiap sandbox (alat Python, skills, node Code, analisis file, Playwright, MCP stdio, Codex, OpenCode) berjalan sebagai pod mandiri melalui API Kubernetes.

## Persyaratan

- Kubernetes 1.30 atau lebih baru (stdin sandbox menggunakan protokol lampiran `v5.channel.k8s.io`).
- CNI yang menerapkan NetworkPolicy. Heym memverifikasi hal ini sebelum sandbox offline pertama dan menolak menjalankan sandbox offline jika pod pengujian masih dapat terhubung.
- Nilai `podPidsLimit` pada kubelet. Pod tidak memiliki bidang batas PID per pod; oleh karena itu ini adalah satu-satunya pelindung terhadap fork-bomb selain memori, CPU, dan batas waktu eksekusi. Heym tidak dapat memverifikasinya: `/sys/fs/cgroup/pids.max` kontainer adalah milik cgroup-nya sendiri, bukan milik pod. Talos dikirimkan tanpa batas ini secara default.

## Instalasi

    kubectl apply -k deploy/kubernetes/base
    kubectl -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)

## Helm

[heym-helm](https://github.com/amasolov/heym-helm) adalah chart komunitas yang dikelola oleh Alexey Masolov dan dipublikasikan di [Artifact Hub](https://artifacthub.io/packages/helm/heym/heym), dengan preset platform untuk OpenShift, EKS, AKS, dan GKE:

    helm install heym oci://ghcr.io/amasolov/charts/heym -n heym --create-namespace -f values.yaml

## Penyimpanan (Storage)

`heym-data` menyimpan file Drive, plugin, dan ruang kerja Codex/OpenCode. Pod sandbox memasang satu `subPath` dari volume ini per eksekusi. Dengan `ReadWriteMany`, pod dapat berjalan di node mana saja. Dengan `ReadWriteOnce`, pod terikat pada node backend. `ReadWriteOncePod` tidak didukung.

## Paket CA Kustom

Pasang paket CA Anda ke dalam pod backend dan arahkan `SSL_CERT_FILE` (atau `REQUESTS_CA_BUNDLE`, `NODE_EXTRA_CA_CERTS`) ke sana. Heym menyalin file tersebut ke `codex-workspaces/_ca/` pada klaim volume dan memasang salinan tersebut secara read-only pada jalur yang sama di setiap sandbox yang menerima variabel tersebut. Dengan klaim `ReadWriteOnce`, sandbox tersebut berjalan di node backend.

CA tidak membuka akses jaringan. Lalu lintas egress sandbox hanya menjangkau alamat publik; oleh karena itu, mirror paket internal, proksi, atau API internal memerlukan aturannya sendiri, misalnya:

    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    metadata:
      name: heym-sandbox-egress-internal-mirror
    spec:
      podSelector:
        matchLabels:
          app.kubernetes.io/managed-by: heym
          heym.run/network: egress
      policyTypes: [Egress]
      egress:
        - to:
            - ipBlock: {cidr: 10.20.30.40/32}
          ports:
            - {protocol: TCP, port: 443}

## Namespace Khusus untuk Sandbox

Tetapkan `HEYM_SANDBOX_K8S_NAMESPACE` untuk menjalankan sandbox di tempat lain, beri label pada namespace tersebut dengan `pod-security.kubernetes.io/enforce: restricted`, pindahkan Role ke sana, dan pertahankan Role di namespace Heym yang memberikan izin `get` untuk `pods`. Sandbox ruang kerja kemudian memerlukan klaim bernama `heym-data` di namespace sandbox yang terikat pada berbagi RWX yang sama (PersistentVolume kedua yang disediakan secara statis).

## Credentials dari Kubernetes Secrets

Secret yang diberi label `heym.run/credential: "true"` menjadi credential read-only. Nilai-nilai tetap berada dalam memori setiap proses dan tidak pernah masuk ke database atau cadangannya; mengubah Secret akan merotasi credential tanpa perlu restart. Semua alat yang menulis Secret didukung: External Secrets Operator, SealedSecrets, SOPS melalui Flux atau Argo CD, atau `kubectl`.

Tambahkan komponen ke overlay Anda. Ini memberikan ServiceAccount izin `get`, `list`, dan `watch` pada Secrets dan menyetel `HEYM_K8S_CREDENTIALS=true` pada setiap Deployment:

    components:
      - ../../components/kubernetes-credentials

RBAC Secrets tidak dapat dipersempit berdasarkan label; Heym dapat membaca setiap Secret di namespace yang dipantau. Jalankan Heym di namespace-nya sendiri, atau tetapkan `HEYM_K8S_CREDENTIALS_NAMESPACE` ke namespace yang hanya berisi credential Heym. Startup ditolak jika salah satu dari variabel `HEYM_PYTHON_TOOL_SANDBOX`, `HEYM_PLAYWRIGHT_SANDBOX`, atau `HEYM_MCP_STDIO_SANDBOX` disetel ke `subprocess`, karena kode pengguna akan dieksekusi di samping token ServiceAccount.

    apiVersion: v1
    kind: Secret
    metadata:
      name: heym-cred-llm-gateway
      labels:
        heym.run/credential: "true"
      annotations:
        heym.run/name: llm-gateway              # Nama credential yang ditampilkan di Heym
        heym.run/type: custom                   # Jenis credential
        heym.run/owner: admin@example.com       # Pengguna yang ada
        heym.run/share-users: alice@example.com # Email opsional yang dipisahkan koma
        heym.run/share-teams: automation        # Nama tim opsional yang dipisahkan koma
    stringData:
      base_url: http://llm-gateway.internal/v1
      api_key: sk-...

Setiap kunci data merupakan bidang konfigurasi. Untuk jenis dengan bidang bersarang atau non-string, masukkan seluruh konfigurasi sebagai JSON di bawah satu kunci `config.json`. Jenis yang menyimpan token OAuth yang diperbarui (Codex, Google, BigQuery, serta Linear atau Notion dalam mode OAuth) tidak dapat berupa read-only dan akan ditolak.

Dengan External Secrets Operator, letakkan label dan anotasi pada template target:

    apiVersion: external-secrets.io/v1
    kind: ExternalSecret
    metadata:
      name: heym-cred-llm-gateway
    spec:
      secretStoreRef: {kind: ClusterSecretStore, name: parameter-store}
      target:
        template:
          metadata:
            labels: {heym.run/credential: "true"}
            annotations:
              heym.run/name: llm-gateway
              heym.run/type: custom
              heym.run/owner: admin@example.com
          data:
            base_url: http://llm-gateway.internal/v1
            api_key: "{{ .key }}"
      data:
        - secretKey: key
          remoteRef: {key: /heym/llm-gateway-key}

Hal yang perlu diperhatikan:

- **Pod dapat berstatus Ready sebelum selesai disinkronkan.** Startup tidak menunggu server API, sehingga antarmuka pengguna tetap dapat diakses. Hingga proses disinkronkan, proses tidak akan memproses eksekusi dalam antrean; eksekusi yang menggunakan salah satu credential ini gagal dengan `not synced from Kubernetes yet` sebelum node mana pun berjalan. Pengaturan → Kubernetes (tab admin yang hanya muncul saat `HEYM_K8S_CREDENTIALS` aktif) dan Pengaturan → Instans menampilkan status sinkronisasi; oleh karena itu, jangan membangun pemeriksaan kesehatan (health check) yang mengasumsikan bahwa Ready berarti sudah sinkron.
- **Secret yang dihapus membuat credential-nya tidak tersedia**, dengan tetap mempertahankan ID dan pembagiannya; membuat ulang Secret (pembersihan GitOps dan penerapan ulang) memulihkannya untuk setiap workflow. Baris tidak pernah dihapus secara otomatis; administrator menghapusnya dari Pengaturan → Kubernetes.
- **Untuk pemilik yang belum masuk**, percobaan ulang dilakukan setiap lima menit.
- **Credential pengguna dengan nama dan pemilik yang sama** tidak pernah ditimpa; sebaliknya, Secret dilaporkan sebagai konflik.

## OpenShift

    kubectl apply -k deploy/kubernetes/overlays/openshift

OVN-Kubernetes mengevaluasi kebijakan egress setelah DNS Service diterjemahkan ke pod DNS, dan pod DNS OpenShift mendengarkan pada port 5353, bukan 53. Dengan kebijakan dasar, sandbox yang terhubung ke jaringan mencapai internet melalui IP tetapi setiap pencarian nama mengalami batas waktu (timeout). Overlay hanya mengubah aturan tersebut:

- Mengizinkan UDP dan TCP pada port 5353 (port pod DNS), bukan port 53 milik Service.
- Memilih namespace DNS melalui `kubernetes.io/metadata.name: openshift-dns`. `network.openshift.io/policy-group: dns` tidak disetel di semua klaster.
- Aturan publik `ipBlock` tetap mengecualikan rentang privat, link-local, dan CGNAT.

## Cilium dengan Penggantian kube-proxy

Konfigurasi dasar tidak memberikan kebijakan egress ke pod backend. Jika Anda menambahkannya, `ipBlock` biasa tidak dapat mengizinkan server API: alamat Service ditulis ulang ke port `:6443` node sebelum kebijakan diterapkan, dan alamat tersebut membawa identitas `kube-apiserver` Cilium. Izinkan dengan `CiliumNetworkPolicy`. Ini juga memilih worker, yang juga memulai pod sandbox (lihat Distribusi Beban):

    apiVersion: cilium.io/v2
    kind: CiliumNetworkPolicy
    metadata:
      name: heym-kube-apiserver
    spec:
      endpointSelector:
        matchExpressions:
          - key: app.kubernetes.io/name
            operator: In
            values: [heym, heym-worker]
      egress:
        - toEntities: [kube-apiserver]
          toPorts:
            - ports: [{port: "6443", protocol: TCP}]

## Penjadwalan (Scheduling)

`HEYM_SANDBOX_K8S_POD_OVERRIDES` menerima JSON dengan `nodeSelector`, `tolerations`, `runtimeClassName` (misalnya gVisor), `imagePullSecrets`, dan `priorityClassName`. Bidang lain tidak diterima.

## Distribusi Beban

Worker adalah Deployments tambahan dari image yang sama dengan `HEYM_INSTANCE_ROLE=worker`, nilai `SECRET_KEY` dan `ENCRYPTION_KEY` yang sama, serta akun `heym-backend` ServiceAccount, sehingga mereka juga dapat memulai pod sandbox. Worker menjalankan node Code, sehingga memerlukan klaim pada direktori ruang kerja untuk dependensi node Code: klaim `ReadWriteOnce` miliknya sendiri sudah cukup, karena direktori tersebut hanya ada selama satu eksekusi. `overlays/orbstack-cluster` menambahkan satu worker; `scripts/k8s-cluster-smoke.sh` memeriksa bahwa eksekusi dalam antrean masuk ke worker tersebut dan pod sandbox-nya adalah milik worker tersebut.

Mulai worker langsung dengan uvicorn, seperti yang dilakukan `overlays/orbstack-cluster/worker.yaml`. Titik masuk image menjalankan migrasi database, dan itu menjadi tanggung jawab instans utama (main). Berikan setiap worker `HEYM_INSTANCE_ID` yang unik dan stabil; nama pod StatefulSet berfungsi dengan baik. Eksekusi dalam antrean untuk worker yang berhenti akan dipindahkan ke instans lain oleh pemimpin (leader).

## Pengujian Lokal di OrbStack

    docker compose build backend
    kubectl --context orbstack apply -k deploy/kubernetes/overlays/orbstack
    kubectl --context orbstack -n heym create secret generic heym-secrets \
      --from-literal=DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/heym \
      --from-literal=SECRET_KEY=$(openssl rand -hex 32) \
      --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 32)
    ./scripts/k8s-sandbox-smoke.sh

Untuk instans main ditambah satu worker, terapkan `overlays/orbstack-cluster` dan jalankan `./scripts/k8s-cluster-smoke.sh`.

## Topik Terkait

- [Contoh manifes dan README sumber](https://github.com/heymrun/heym/tree/main/deploy/kubernetes)
- [Pengoperasian dan Penerapan](./running-and-deployment.md)
- [Distribusi Beban](../reference/cluster.md)
