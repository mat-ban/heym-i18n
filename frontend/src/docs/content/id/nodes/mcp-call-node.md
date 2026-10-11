# Node Pemanggilan MCP

Node **MCP Call** memanggil tool [Model Context Protocol (MCP)](https://modelcontextprotocol.io) tertentu secara langsung, tanpa LLM yang menentukan tool mana yang harus dipanggil. Gunakan node ini ketika Anda mengetahui dengan pasti tool mana yang akan dipanggil dan menginginkan eksekusi satu langkah yang deterministik.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.result` |

## Kapan Digunakan

Gunakan node MCP Call ketika:
- Anda mengetahui dengan pasti tool MCP mana yang akan dipanggil pada saat perancangan
- Anda tidak memerlukan LLM untuk memilih di antara tool
- Anda menginginkan alternatif yang ringan dan deterministik dibandingkan node agent untuk satu pemanggilan tool

Gunakan [Node Agent](./agent-node.md) sebagai gantinya ketika LLM harus menentukan tool mana yang akan dipanggil atau ketika Anda memerlukan penalaran multi-langkah.

> Node MCP Call **tidak dapat** dihubungkan ke node agent sebagai tool.

## Konfigurasi Koneksi

Node terhubung ke satu MCP server. Pilih transport dan isi kolom yang sesuai.

### SSE / Streamable HTTP

| Kolom | Deskripsi |
|-------|-------------|
| `transport` | `sse` atau `streamable_http` |
| `url` | URL lengkap MCP server (misalnya `https://mcp.example.com/sse`). Mendukung ekspresi DSL. |
| `headers` | Objek JSON berisi HTTP header (misalnya `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Timeout per koneksi dalam detik (default: 30) |

### stdio

| Kolom | Deskripsi |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Executable yang akan dijalankan (misalnya `npx`) |
| `args` | Array JSON berisi argumen (misalnya `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Objek JSON berisi environment variable (misalnya `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Timeout per koneksi dalam detik (default: 30) |

## Pemilihan Tool

1. Isi kolom koneksi.
2. Klik **Fetch Tools** — node akan terhubung ke MCP server dan menampilkan daftar tool yang tersedia.
3. Pilih tool dari dropdown.

**Pemilihan tool bersifat wajib.** Node tidak akan dieksekusi tanpa tool yang dipilih.

## Argumen

Setelah memilih tool, node akan menampilkan satu kolom input untuk setiap argumen yang didefinisikan dalam input schema tool tersebut. Setiap kolom menerima:
- Nilai statis: `10`
- Ekspresi DSL: `$userInput.body.text`

Argumen wajib ditandai dengan `*`.

## Output

| Kolom | Deskripsi |
|-------|-------------|
| `$nodeLabel.result` | Hasil tool. Jika respons berupa JSON yang valid, ini adalah objek yang telah di-parse. Jika tidak, ini adalah string. |

## Contoh

Memanggil tool `search` pada MCP server SSE, dengan meneruskan query pengguna:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Akses hasil di tahap berikutnya:

```
$searchCall.result.items   ← jika result adalah objek JSON
$searchCall.result         ← jika result adalah string biasa
```

## Catatan

- Node menyelesaikan ekspresi DSL pada `url`, `headers`, `env`, dan semua nilai `toolArguments` sebelum memanggil tool.
- `timeoutSeconds` pada tingkat node berlaku untuk keseluruhan eksekusi; `connection.timeoutSeconds` berlaku untuk sesi MCP itu sendiri.
- Jika MCP server tidak tersedia atau mengembalikan error, node akan gagal dan pesan error tersedia di workflow trace.
