# Memori Persisten Agent

Node Agent dapat menyimpan **knowledge graph per-node** di dalam database: entitas (beserta tipe dan propertinya) dan relasi di antara entitas tersebut. Ketika diaktifkan, Heym **menyisipkan ringkasan graph tersebut ke dalam system prompt** pada setiap eksekusi (jika graph tidak kosong). Setelah eksekusi berhasil, sebuah **job ekstraksi LLM** akan menggabungkan fakta-fakta baru dari percakapan ke dalam graph tersebut di latar belakang.

Sub-agent dan orchestrator masing-masing menggunakan graph yang terikat pada **node canvas miliknya sendiri** secara default. Anda juga dapat **memberikan akses baca atau baca/tulis kepada agent lain** terhadap graph node ini (termasuk agent di **workflow lain** yang Anda miliki)—lihat [Berbagi dengan agent lain](#berbagi-dengan-agent-lain).

## Mengaktifkan

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ketika `true`, memuat graph node ini ke dalam system prompt dan menjadwalkan ekstraksi pasca-eksekusi untuk graph node ini |
| `memoryShares` | array (opsional) | Memberikan akses kepada node agent lain terhadap graph memori **node ini**; lihat [Berbagi](#berbagi-dengan-agent-lain) |

Aktifkan pada properti node Agent (**Persistent memory (graph)**). Ikon **otak** berwarna merah muda pada node akan membuka editor graph ketika memori diaktifkan (atau ketika sebuah model ditampilkan).

## Editor graph

Dialog ini menampilkan entitas sebagai graph teranimasi berbasis gaya (force-directed) — lingkaran berwarna yang ukurannya ditentukan oleh jumlah koneksi dan dikelompokkan berdasarkan tipe entitas — beserta pengeditan dan navigasi (fit view, tidy layout, pintasan keyboard). Anda dapat **menambah, mengedit, atau menghapus** node dan edge secara manual; pemilih relasi Source/Target dapat dicari untuk graph dengan banyak entitas. Memilih sebuah node akan menampilkan koneksi keluar dan masuknya, yang masing-masing dapat diklik untuk melompat ke node tersebut. Perubahan hanya berlaku pada graph agent **ini** (graph untuk node canvas yang otaknya Anda buka).

## Berbagi dengan agent lain

Pada dialog graph memori, **Share memory with other agents** memungkinkan Anda melampirkan **peer** yang dapat mengonsumsi graph ini saat runtime:

1. Pilih sebuah **workflow** (workflow apa pun yang dapat Anda buka di editor).
2. Pilih sebuah node **agent** di workflow tersebut.
3. Tetapkan **Read only** atau **Read & write**.

| Izin | Efek |
|------------|--------|
| Read only | Ketika agent **peer** berjalan, graph ini digabungkan ke dalam system prompt peer (jika memiliki entitas). Tidak ada ekstraksi ke dalam graph ini dari eksekusi peer. |
| Read & write | Perilaku prompt sama seperti read, dan setelah penyelesaian peer yang **berhasil**, ekstraksi memori yang biasa juga dapat **digabungkan ke dalam graph (pemilik) ini** menggunakan credential dari eksekusi peer. |

Peer disimpan per node pemilik sebagai entri `memoryShares` dengan `peerWorkflowId` dan `peerCanvasNodeId` (serta `permission`). Workflow lama mungkin tidak menyertakan `peerWorkflowId` untuk peer di workflow yang **sama**; editor memperlakukannya sebagai workflow saat ini.

**Berbagi lintas workflow** diselesaikan saat runtime dengan memindai workflow **yang Anda miliki**. Eksekusi tanpa konteks pengguna yang terautentikasi hanya menyelesaikan share yang didefinisikan dalam JSON workflow **saat ini** (canvas yang sama).

## Perilaku runtime

### Graph milik sendiri (`persistentMemoryEnabled`)

1. **Sebelum pemanggilan LLM** — Jika graph memiliki entitas, sebuah blok ditambahkan ke system instruction yang menjelaskan bahwa ini adalah fakta dari eksekusi sebelumnya (mungkin tidak lengkap; pesan pengguna saat ini yang berlaku jika terjadi konflik).
2. **Setelah penyelesaian yang berhasil** — Sebuah job latar belakang meminta model (credential yang sama dengan eksekusi agent) untuk JSON terstruktur (entitas + relasi). Payload tersebut digabungkan ke dalam database (deduplikasi dan pembersihan relasi berlaku untuk beberapa tipe, misalnya edge bergaya employment).

### Peer yang menerima graph bersama

Ketika sebuah agent berjalan, sistem mencari node **pemilik** (di workflow mana pun milik Anda, jika memungkinkan) yang `memoryShares`-nya menunjuk ke workflow dan node canvas eksekusi ini. Untuk setiap kecocokan, graph pemilik tersebut ditambahkan sebagai bagian **shared memory** pada system prompt. Peer dengan **Read & write** juga menjadwalkan target ekstraksi untuk workflow/graph **pemilik** ketika eksekusi berhasil.

Ekstraksi **tidak** dijalankan ketika eksekusi mengalami error atau berakhir dalam status HITL pending.

## Workflow JSON (field `data`)

Disimpan pada node agent seperti pengaturan lainnya:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` bernilai `"read"` atau `"write"`. Hilangkan `memoryShares` atau gunakan `[]` ketika tidak ada berbagi.

Lihat [Workflow Structure](./workflow-structure.md) untuk bentuk lengkap objek node.

## Terkait

- [Agent Node](../nodes/agent-node.md) — Konfigurasi agent lengkap
- [Agent Architecture](./agent-architecture.md) — Orchestrator, sub-agent, tools
- [Workflow Structure](./workflow-structure.md) — Format JSON workflow
- [Canvas Features](./canvas-features.md) — Kontrol otak dan dialog graph
- [Traces tab](../tabs/traces-tab.md) — Observabilitas permintaan/respons LLM
