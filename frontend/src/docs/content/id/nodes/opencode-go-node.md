# OpenCode Go

Node **OpenCode Go** menjalankan CLI [OpenCode](https://opencode.ai) (Go) di dalam container Heym yang terisolasi dan diperkuat terhadap repositori GitHub. Seperti node Codex, node ini dirancang untuk tugas-tugas pengkodean seperti memperbaiki pengujian, mengedit file, menghasilkan patch, atau membuka pull request — tetapi menggunakan gateway model **OpenCode Go** yang agnostik terhadap penyedia, bukan OpenAI Codex.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Kredensial | OpenCode Go API key + GitHub |
| Output | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentikasi

Kredensial **OpenCode Go** menyimpan **API key** gateway OpenCode Go (dari [opencode.ai/go](https://opencode.ai/go)) dan **Gateway Base URL** opsional (default ke `https://opencode.ai/zen/go/v1`; timpa hanya untuk gateway yang di-host sendiri atau melalui proxy).

Node ini juga memerlukan kredensial **GitHub** untuk mengkloning repositori privat, mendorong branch kerja, dan membuat pull request. Token GitHub **tidak pernah ditempatkan di dalam container sandbox** — Heym melakukan semua operasi git dan GitHub di host, sehingga kode yang dihasilkan tidak dapat mengeksfiltrasi kredensial push.

## Isolasi dan keamanan

Isolasi eksekusi dipilih oleh `HEYM_OPENCODE_CLI_COMMAND`, persis seperti node Codex:

- **Pengembangan lokal (`run.sh`)** membiarkannya pada default `opencode`, sehingga OpenCode berjalan sebagai subproses host terhadap workspace yang dikloning — tidak memerlukan Docker, tanpa flag tambahan.
- **Deployment Docker (`deploy.sh` dan image GHCR tunggal)** mengaturnya ke `/usr/local/bin/heym-opencode-docker`, sebuah wrapper yang menjalankan `opencode run` di dalam **container saudara sekali pakai yang diperkuat** yang berbagi named volume workspace OpenCode.

Container runner yang diperkuat menghapus semua kapabilitas Linux, menetapkan `no-new-privileges`, menggunakan root read-only dengan tmpfs `/tmp`, dan menerapkan batas pid/memori/CPU. Egress jaringan diizinkan (OpenCode harus menjangkau gateway model). **Token GitHub tidak pernah ditempatkan di dalam container** — semua operasi git dan GitHub berjalan di sisi host, sehingga hanya API key OpenCode dan file repositori yang berada di dalamnya.

OpenCode hanya mengedit file di disk; Heym memiliki setiap tindakan git/GitHub.

## Model

Daftar model OpenCode Go sering berubah, sehingga kolom **Model** diisi secara langsung dari daftar model gateway (`GET https://opencode.ai/zen/go/v1/models`) dan ditampilkan sebagai dropdown yang dapat dicari. Jika daftar langsung tidak tersedia, daftar fallback bawaan akan digunakan. Id model menggunakan bentuk `opencode-go/<model>` (misalnya `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` adalah id penyedia CLI OpenCode untuk gateway Go. Biarkan kolom kosong untuk menggunakan default runner (`opencode-go/kimi-k3`). Id model yang disimpan dalam bentuk `opencode/<model>` yang lebih lama akan ditulis ulang secara otomatis saat dijalankan.

## Kolom

| Kolom | Deskripsi |
|-------|-------------|
| OpenCode Go Credential | Kredensial OpenCode Go (API key gateway) |
| GitHub Credential | Kredensial GitHub PAT yang digunakan untuk akses repositori |
| Repository URL | URL repositori GitHub HTTPS; mendukung ekspresi |
| Base Branch | Branch yang dikloning sebelum OpenCode dijalankan, default `main` |
| Model | Model OpenCode Go (dropdown pencarian langsung, `opencode-go/<model>`); kosong menggunakan default runner |
| Reasoning Variant | Opsional; memetakan ke `opencode run --variant` untuk model yang mendukung reasoning effort |
| Task Prompt | Tugas pengkodean untuk OpenCode; mendukung ekspresi seperti `$input.text` |
| Publish Mode | Bagaimana perubahan dikirimkan (lihat tabel di bawah) |
| Branch Name | Branch kerja untuk mode PR/commit, default `opencode/$executionId` |
| Timeout | Waktu eksekusi OpenCode maksimum dalam detik |

## Mode Publish

| Mode | Apa yang dilakukannya |
|------|--------------|
| `diff_only` | Mengedit file secara lokal dan mengembalikan patch serta file yang diubah. Tidak ada yang didorong. |
| `draft_pr` | Melakukan commit ke branch, mendorongnya, dan membuka pull request draft. |
| `open_pr` | Melakukan commit ke branch, mendorongnya, dan membuka pull request siap review (non-draft). |
| `commit_push` | Melakukan commit ke branch dan mendorongnya, tanpa membuka pull request. |
| `direct_commit` | Melakukan commit dan mendorong langsung ke base branch (tanpa branch terpisah atau PR). |
| `open_or_update_pr` | Memperbarui PR terbuka agen yang ada ketika sudah ada — bahkan jika nama branch berbeda, runner menemukannya berdasarkan author + base — jika tidak, membuka yang baru. Terbaik untuk eksekusi ulang dan instruksi "perbarui PR terbuka". |
| `update_existing_pr` | Menambahkan commit ke branch/PR yang ada; membuka satu jika belum ada. |
| `patch_artifact` | Menyimpan diff sebagai file yang dapat diunduh dan mengembalikan `patchUrl`. Tidak ada yang didorong. |

## Output

| Key | Deskripsi |
|-----|-------------|
| `status` | Selalu `completed` (node OpenCode Go tidak berhenti untuk input) |
| `summary` | Pesan akhir OpenCode |
| `validation` | Catatan validasi saat dilaporkan |
| `diff` | Patch git saat file berubah |
| `changedFiles` | Jalur file yang diubah |
| `branchName` | Nama branch kerja |
| `pullRequestUrl` | URL PR dalam mode `draft_pr`, `open_pr`, `open_or_update_pr`, dan `update_existing_pr` |
| `pushedBranch` | Branch yang didorong dalam mode commit/PR |
| `patchUrl` | Tautan unduhan untuk diff dalam mode `patch_artifact` |
## Tangkapan layar UI pada pull request

Untuk tugas UI/frontend, OpenCode harus menyimpan tangkapan layar PNG di bawah jalur yang diabaikan git seperti `frontend/.e2e-artifacts/` (bukan di dalam source). Jika dependensi frontend tidak ada, prompt runner mengizinkan pemasangan paket secara terarah (misalnya `bun install`) ditambah pratinjau berdurasi singkat/`bun run dev` semata-mata untuk menangkap UI. Heym mengunggah gambar-gambar tersebut ke satu **prerelease** GitHub bersama (`opencode-pr-assets`) sebagai aset dengan nama `<branch>-…`, lalu menyematkannya ke dalam deskripsi PR **sebelum pull request dibuka**, sehingga PR baru dibuat sudah berisi tangkapan layarnya (PR yang sudah ada diperbarui di tempat).

OpenCode juga diinstruksikan untuk mengakhiri dengan baris `PR_TITLE: …` agar Heym dapat membuka pull request dengan subjek yang bermakna alih-alih placeholder seperti `Done.`

OpenCode terkadang mengakhiri satu giliran di tengah tugas ("…Now let me take a screenshot"), yang akan menyelesaikan run sebelum tangkapan layar diambil. Untuk mencegah hal itu, prompt runner mewajibkan pengambilan tangkapan layar **sebelum** pesan akhir, dan jika run tetap berakhir tanpa ringkasan yang dapat dipublikasikan atau dengan perubahan UI tetapi tanpa tangkapan layar, Heym menjalankan satu pass OpenCode lagi di workspace yang sama untuk menyelesaikannya. Jika perubahan UI masih belum memiliki tangkapan layar setelahnya, catatan yang terlihat ditambahkan ke badan PR agar celah tersebut tidak pernah dibiarkan tanpa pemberitahuan.

## Apa yang dipublikasikan ke GitHub

**Task Prompt** Anda adalah input privat, bukan konten PR. Hanya dua hal yang dipublikasikan: `## Change Summary` yang menjelaskan apa yang dilakukan perubahan kode, dan bagian `## Screenshots` ketika tangkapan layar berhasil diambil. Judul PR diturunkan hanya dari ringkasan perubahan.

Prompt runner menyatakan kebijakan ini, dan Heym juga menegakkannya setelah run: sebelum apa pun di-commit atau dibuka sebagai pull request, ia menghapus bagian gema prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) dan paragraf apa pun yang disalin persis dari task prompt keluar dari ringkasan, badan PR, dan pesan commit.

Heym membaca bagian `## Change Summary` dari pesan-pesan agen alih-alih mengambil apa pun yang dikatakannya terakhir, karena OpenCode memancarkan satu pesan per langkah dan pesan terakhirnya sering kali berupa komentar di tengah run. Narasi langkah (`Both pass. Let me do a final review:`) juga ditolak sebagai judul PR atau subjek commit. Jika run tidak menghasilkan ringkasan perubahan yang dapat digunakan, pull request akan beralih ke daftar file yang diubah alih-alih mempublikasikan komentar.

## Sebagai alat agen

Node OpenCode Go dapat dilampirkan ke handle alat **AI Agent** node sehingga agen dapat mendelegasikan tugas pengkodean. Konfigurasikan credential, credential GitHub, dan repositori pada node, lalu tandai **Task Prompt** (dan opsional **Repository URL**) dengan toggle yang disediakan agen agar agen menyuplainya pada waktu pemanggilan.

## Contoh

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Terkait

- [Node Codex](./codex-node.md)
- [Node GitHub](./github-node.md)
- [Node Agent](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
