# Codex

Node **Codex** menjalankan OpenAI Codex CLI di dalam workspace Heym yang terisolasi terhadap repositori GitHub. Node ini dirancang untuk tugas-tugas pengkodean seperti memperbaiki pengujian, mengedit berkas, menghasilkan patch, atau membuka draft pull request.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1, ditambah `question` |
| Credential | Codex access token + GitHub |
| Output | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Autentikasi

Credential **OpenAI Codex** mendukung dua mode autentikasi:

| Mode | Deskripsi |
|------|-------------|
| **Sign in with ChatGPT** (disarankan) | Proses sign-in OAuth (PKCE) yang menggunakan langganan ChatGPT Plus/Pro Anda, sehingga eksekusi **tidak** menimbulkan biaya API per-token. Klik **Sign in with ChatGPT** pada dialog credential, otorisasi di peramban Anda, lalu tempelkan URL pengalihan `localhost:1455` kembali ke Heym. Heym menyimpan token bundle yang dihasilkan dan menyegarkannya secara otomatis saat kedaluwarsa. |
| **Access token** | Tempelkan `access_token` ChatGPT/Codex yang hanya digunakan oleh Codex runner lokal. |

API key tidak diterima untuk credential Codex. Node ini tidak mengirimkan tugas Codex ke cloud; node ini mengkloning repositori di dalam runtime Heym, menulis token bundle ChatGPT ke `auth.json` yang terisolasi (atau meneruskan `CODEX_ACCESS_TOKEN`) hanya ke proses Codex, dan menjaga token tetap di luar `$credentials`.

Node ini juga memerlukan credential **GitHub** untuk mengkloning repositori privat, mendorong branch kerja, dan membuat draft pull request.

Pada deployment Docker, Heym menjalankan Codex di dalam container saudara dari image Heym yang sama (bukan image GHCR terpisah). Container tersebut hanya me-mount volume workspace Codex dan membiarkan sandbox bubblewrap milik Codex membuat namespace serta `/proc` yang baru. Runner menambahkan `SYS_ADMIN`, seccomp dan AppArmor tanpa pembatasan (unconfined), serta `systempaths=unconfined` (Docker Engine 25+). Tanpa flag terakhir, setiap perintah gagal sebelum dijalankan dengan pesan `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.

Referensi OpenAI:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Field

| Field | Deskripsi |
|-------|-------------|
| Codex Credential | Credential OpenAI Codex (sign-in ChatGPT atau `access_token`) |
| GitHub Credential | Credential GitHub PAT yang digunakan untuk mengakses repositori |
| Repository URL | URL repositori GitHub HTTPS |
| Base Branch | Branch yang dikloning sebelum Codex dijalankan, default `main` |
| Model | Model Codex opsional (dropdown yang dapat diedit, misalnya `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); kosong menggunakan default Codex |
| Reasoning Effort | Kedalaman penalaran Codex: `low`, `medium`, `high`, `xhigh` (Extra High), `max`, atau `ultra` (default `medium`) |
| Task Prompt | Tugas pengkodean untuk Codex; mendukung ekspresi seperti `$input.text` |
| Publish Mode | Bagaimana perubahan dikirimkan (lihat tabel di bawah) |
| Branch Name | Branch kerja untuk mode PR/commit, default `codex/$executionId` |
| Timeout | Waktu eksekusi Codex maksimum dalam detik |

## Publish Mode

| Mode | Fungsinya |
|------|--------------|
| `diff_only` | Mengedit berkas secara lokal dan mengembalikan patch serta berkas yang diubah. Tidak ada yang didorong. |
| `draft_pr` | Melakukan commit ke branch, mendorongnya, dan membuka draft pull request. |
| `open_pr` | Melakukan commit ke branch, mendorongnya, dan membuka pull request yang siap ditinjau (bukan draft). |
| `commit_push` | Melakukan commit ke branch dan mendorongnya, tanpa membuka pull request. |
| `direct_commit` | Melakukan commit dan mendorong langsung ke base branch (tanpa branch terpisah atau PR). |
| `open_or_update_pr` | Memperbarui PR terbuka milik agen yang sudah ada jika tersedia — meskipun nama branch berbeda, runner menemukannya berdasarkan penulis + base — jika tidak, membuka PR baru. Terbaik untuk eksekusi ulang dan instruksi "perbarui PR yang terbuka". |
| `update_existing_pr` | Menambahkan commit ke branch/PR yang sudah ada; membuka PR baru jika belum ada. |
| `patch_artifact` | Menyimpan diff sebagai berkas yang dapat diunduh dan mengembalikan `patchUrl`. Tidak ada yang didorong. |

## Output

| Key | Deskripsi |
|-----|-------------|
| `status` | `completed` atau `needs_input` |
| `summary` | Ringkasan dari Codex |
| `validation` | Catatan validasi, pengujian, atau pemeriksaan yang dilaporkan oleh Codex |
| `diff` | Patch Git ketika berkas berubah |
| `changedFiles` | Jalur berkas yang diubah |
| `threadId` | Id thread/sesi Codex jika tersedia |
| `branchName` | Nama branch kerja |
| `pullRequestUrl` | URL PR pada mode `draft_pr`, `open_pr`, `open_or_update_pr`, dan `update_existing_pr` |
| `pushedBranch` | Branch yang didorong pada mode commit/PR |
| `patchUrl` | Tautan unduhan untuk diff pada mode `patch_artifact` |
| `usage` | Metadata penggunaan yang dilaporkan oleh Codex CLI jika tersedia |
## Tangkapan Layar UI pada pull request

Untuk tugas UI/frontend, Codex harus menyimpan tangkapan layar PNG di bawah jalur yang diabaikan git seperti `frontend/.e2e-artifacts/` (bukan di dalam source). Jika dependensi frontend tidak ada, Codex dapat menjalankan `bun install` (atau npm/pnpm install) dan memulai preview/`bun run dev` berdurasi singkat semata-mata untuk menangkap UI. Heym mengunggah gambar-gambar tersebut ke satu **prerelease** GitHub bersama (`codex-pr-assets`) sebagai aset dengan nama `<branch>-…`, lalu menyematkannya ke dalam deskripsi PR **sebelum pull request dibuka**, sehingga PR baru dibuat sudah berisi tangkapan layarnya (PR yang sudah ada diperbarui di tempat). Codex juga harus menetapkan `pull_request_title` yang bermakna (jangan pernah menggunakan placeholder seperti `Done.`).

Codex terkadang mengakhiri giliran di tengah tugas ("…Now let me take a screenshot"), yang akan menyelesaikan eksekusi sebelum tangkapan layar diambil. Untuk mencegah hal itu, prompt runner mewajibkan pengambilan tangkapan layar **sebelum** hasil akhir, dan jika eksekusi tetap selesai tanpa ringkasan yang dapat dipublikasikan atau dengan perubahan UI tetapi tanpa tangkapan layar, Heym menjalankan satu pass Codex lagi di workspace yang sama untuk menyelesaikannya. Jika perubahan UI masih belum memiliki tangkapan layar setelahnya, catatan yang terlihat ditambahkan ke badan PR agar celah tersebut tidak pernah senyap.

## Apa yang dipublikasikan ke GitHub

**Task Prompt** Anda adalah input privat, bukan konten PR. Hanya dua hal yang dipublikasikan: `## Change Summary` yang menjelaskan apa yang dilakukan oleh perubahan kode, dan bagian `## Screenshots` ketika tangkapan layar berhasil diambil. Judul PR diturunkan hanya dari ringkasan perubahan.

Prompt runner menyatakan kebijakan ini, dan Heym juga menegakkannya setelah eksekusi: sebelum apa pun di-commit atau dibuka sebagai pull request, ia menghapus bagian gema prompt (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) dan paragraf apa pun yang disalin verbatim dari task prompt keluar dari ringkasan, badan PR, dan pesan commit. Narasi langkah seperti `Both pass. Let me do a final review:` juga ditolak sebagai judul PR atau subjek commit.

## Pertanyaan Tindak Lanjut

Jika Codex membutuhkan persyaratan yang belum ada atau keputusan produk, ia mengembalikan `needs_input`. Heym menjeda eksekusi dan mengekspos handle output `question`. Hubungkan handle tersebut ke cabang notifikasi, misalnya Slack atau Send Email, untuk mengirimkan tautan tindak lanjut publik kepada reviewer.

Ketika reviewer menjawab, Heym melanjutkan snapshot eksekusi dan thread Codex yang sama dari metadata workspace yang tersimpan.

## Sebagai alat agen

Node Codex dapat dilampirkan ke handle alat node **AI Agent** sehingga agen dapat mendelegasikan tugas pengkodean. Konfigurasikan credential, credential GitHub, dan repositori pada node, lalu tandai **Task Prompt** (dan secara opsional **Repository URL**) dengan toggle yang disediakan agen sehingga agen menyuplainya pada waktu pemanggilan. Ketika Codex berjalan sebagai alat, hasil `needs_input` dikembalikan secara inline kepada agen alih-alih menjeda workflow, sehingga agen dapat menyempurnakan permintaan dan memanggil Codex lagi.

## Contoh

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Terkait

- [GitHub Node](./github-node.md)
- [Agent Node](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Node Types](../reference/node-types.md)
