# A2A

Heym menyediakan **Heym Agent** melalui protokol Agent2Agent (A2A 1.0, binding JSON-RPC). Heym Agent adalah mesin di balik [tab Chat](../tabs/chat-tab.md); klien MCP menjangkau agent yang sama sebagai alat `heym_chat` (lihat [tab MCP / A2A](../tabs/mcp-tab.md)). Saat A2A aktif, agent lain dapat mengiriminya Task dalam bahasa alami dan menerima balasannya, dengan kemampuan yang sama seperti Chat.

## Mengaktifkan

1. Buka tab **MCP / A2A**.
2. Aktifkan **Heym Agent** di server default atau di server bernama, lalu pilih kredensial dan modelnya.
3. Centang **Aktifkan A2A**. Kartu akan menampilkan URL **Agent Card** dan **JSON-RPC Endpoint**.

A2A berjalan di atas Heym Agent: menonaktifkan agent juga akan mematikan A2A.

## Endpoints

| | Server default | Server bernama |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card tidak memerlukan kredensial dan tidak menyebutkan pengguna, server, atau Workflow apa pun. Kartu ini hanya ada saat A2A aktif: kartu domain selama setidaknya satu pengguna mengaktifkan A2A untuk server default; kartu server bernama selama A2A server tersebut aktif. Jika tidak, alamat akan merespons dengan 404.

## Autentikasi

Kirim kredensial yang sama seperti untuk MCP, hanya di header:

- `X-MCP-Key: <key>`: kunci server default atau kunci server bernama
- `Authorization: Bearer <token>`: OAuth Token dari server OAuth Heym

Kredensial dalam URL akan ditolak. Agent Card mendeklarasikan kedua skema, sehingga klien A2A dapat membacanya langsung dari kartu.

## Metode

| Metode | Deskripsi |
|---|---|
| `SendMessage` | Memulai Task atau melanjutkan tugas yang sedang menunggu masukan. Menunggu balasan kecuali jika `configuration.returnImmediately` bernilai `true`. |
| `SendStreamingMessage` | Sama seperti di atas, sebagai aliran Server-Sent Events dari progres dan hasil Task. |
| `GetTask` | Status, balasan, dan riwayat Task (`historyLength` membatasi riwayat). |
| `ListTasks` | Tasks Anda di server ini, terbaru lebih dahulu, difilter menurut `contextId` atau `status`, dengan `pageSize` dan `pageToken`. |
| `CancelTask` | Menghentikan Task yang masih bekerja atau menunggu. |
| `SubscribeToTask` | Mengikuti Task yang masih berjalan. |
| `GetExtendedAgentCard` | Kartu dengan nama server dan Workflows yang ditetapkan sebagai keahlian (skills). |

Pemberitahuan push tidak disediakan: kartu menyatakan `pushNotifications: false`, dan metode push merespons dengan `PushNotificationNotSupportedError`. Permintaan menggunakan A2A 1.0; kirim `A2A-Version: 1.0`. Nama metode A2A 0.3 seperti `message/send` merespons dengan `VersionNotSupportedError`.

## Tasks dan percakapan

Setiap Task merupakan percakapan di tab Chat, ditandai dengan ikon jaringan. `contextId` dari tugas tersebut adalah percakapan itu: kirim pesan baru dengan `contextId` yang sama dan tanpa `taskId` untuk melanjutkannya.

| Tindakan agent | Status Task |
|---|---|
| Menjawab | `TASK_STATE_COMPLETED`, dengan balasan sebagai teks dan, jika ada yang disimpan, tautan ke Workflows dan rangkaian evaluasi sebagai data |
| Mengajukan pertanyaan klarifikasi | `TASK_STATE_INPUT_REQUIRED`: jawab dengan `taskId` yang sama |
| Memerlukan kredensial | `TASK_STATE_AUTH_REQUIRED`: pesan status berisi tautan ke halaman kredensial Heym. Pengguna membukanya di browser yang masuk ke Heym; nilainya tidak pernah melewati agent lain. Kemudian kirim pesan pada Task yang sama untuk melanjutkan. |
| Gagal | `TASK_STATE_FAILED`, beserta alasannya |
| Dibatalkan | `TASK_STATE_CANCELED` |

Pesan ke Task yang sudah selesai atau yang masih bekerja akan ditolak dengan `UnsupportedOperationError`. Pesan menerima bagian `text` dan `data`, hingga total 20.000 karakter; bagian berkas ditolak, jadi kirim berkas sebagai tautan.

## Progres

Saat Task sedang berjalan, aliran mengirimkan pembaruan status untuk setiap langkah, dalam kata-kata yang ditampilkan di tab Chat, misalnya `Running workflow "Invoice Parser"` atau `Testing the workflow · attempt 2/5`. Klien MCP menerima langkah yang sama sebagai `notifications/progress` dari `heym_chat`.

## Contoh

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Batasan

- `CancelTask` segera menghentikan putaran yang sedang berjalan pada instans Heym yang menjalankannya, persis seperti tombol Stop di tab Chat. Di tempat lain, tugas ditandai dibatalkan dan hasil putaran yang terlambat tidak dicatat.
- Tidak ada pemberitahuan push, tidak ada binding REST atau gRPC, tidak ada Agent Cards yang ditandatangani.

## Terkait

- [Tab MCP / A2A](../tabs/mcp-tab.md): mengaktifkan Heym Agent dan A2A
- [Tab Chat](../tabs/chat-tab.md): mesin di balik agent
- [Keamanan](./security.md): bagaimana kunci disimpan
