# Catatan Tempel

Node **Sticky Note** menambahkan catatan markdown yang kaya ke kanvas. Node ini tidak dieksekusi—gunakan untuk dokumentasi, instruksi, gambar referensi, atau catatan workflow.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 0 |
| Output | N/A (tidak dieksekusi) |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `stickyTitle` | string | Judul tampilan yang ditampilkan di bagian atas sticky note. |
| `stickyColor` | string | Warna latar belakang: `yellow`, `sky`, `emerald`, `rose`, `violet`, atau `zinc`. |
| `note` | string | Konten Markdown. Klik dua kali untuk mengedit di kanvas. Mendukung tautan dan markdown gambar seperti `![Alt](https://example.com/image.png)`. |

## Contoh

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Workflow Organization](../reference/workflow-organization.md) – Mengatur workflow
