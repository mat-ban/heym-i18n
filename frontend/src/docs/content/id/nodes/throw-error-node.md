# Buang Kesalahan

Node **Throw Error** menghentikan eksekusi workflow segera dan mengembalikan respons error dengan kode status HTTP kustom. Gunakan node ini untuk kegagalan validasi, akses tidak sah, atau kondisi error lainnya.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 0 |
| Output | Workflow berhenti; respons error dikembalikan ke pemanggil |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `errorMessage` | expression | Pesan error (mendukung expression) |
| `httpStatusCode` | number | Kode status HTTP (mis. 400, 401, 403, 404, 429, 500) |

## Kode Status Umum

| Kode | Kasus penggunaan |
|------|------------------|
| 400 | Bad Request (input tidak valid) |
| 401 | Unauthorized (memerlukan autentikasi) |
| 403 | Forbidden (akses ditolak) |
| 404 | Not Found (sumber daya tidak ditemukan) |
| 422 | Unprocessable Entity (error validasi) |
| 429 | Too Many Requests (batas laju) |
| 500 | Internal Server Error |

## Contoh

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Gunakan bersama [Condition](./condition-node.md) untuk memvalidasi input dan hanya memunculkan error saat tidak valid:
- Condition bernilai true → lanjutkan ke Output
- Condition bernilai false → Throw Error

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Condition Node](./condition-node.md) – Validasi sebelum memunculkan error
- [Error Handler](./error-handler-node.md) – Menangkap error dari node lain
