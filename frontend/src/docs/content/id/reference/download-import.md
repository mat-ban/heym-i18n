# Unduh & Impor

Ekspor workflow atau seluruh folder sebagai file, atau impor melalui drag & drop. Gunakan fitur ini untuk pencadangan, berbagi, atau memigrasikan workflow antar instance.

## Unduh Workflow (JSON)

**Lokasi:** Toolbar editor → tombol **Download** (terlihat pada layar besar)

**Yang diekspor:**
- `nodes` – Semua node pada kanvas
- `edges` – Semua koneksi antar node

**Nama file:** `{workflow-name}.json` (diambil dari nama workflow)

**Format:** Lihat [Workflow Structure](./workflow-structure.md) untuk skema JSON.

## Unduh Folder (ZIP)

**Lokasi:** Dashboard → tab Workflows → menu 3-titik folder → **Download as ZIP**

**Yang diekspor:**
- Semua workflow dalam folder dan seluruh sub-folder, secara rekursif
- Hierarki folder dipertahankan sebagai direktori di dalam ZIP

**Struktur ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Setiap file `.json` berisi `{ name, nodes, edges }`.

## Impor

### Dari Dashboard (Tab Workflows)

1. Buka tab [Workflows](../tabs/workflows-tab.md)
2. Seret file **JSON** atau **ZIP** ke area workflow

**File JSON:** Workflow baru akan dibuat. Nama workflow diambil dari field `name` pada JSON, atau dari nama file jika `name` tidak ada.

**File ZIP:** Seluruh struktur folder dibuat ulang pada level root. Setiap file `.json` di dalam ZIP menjadi workflow yang ditempatkan pada folder yang sesuai. Kredensial dan referensi antar-workflow yang tidak ada pada instance saat ini akan dihapus secara otomatis. Jika sebagian workflow gagal diimpor, ringkasan akan menampilkan berapa banyak yang berhasil.

### Dari Kanvas (Editor)

1. Buka workflow di editor
2. Seret file JSON ke kanvas
3. Jika kanvas sudah memiliki node atau edge, dialog konfirmasi akan menanyakan apakah akan mengganti workflow saat ini
4. Node dan edge yang diimpor akan menggantikan atau digabungkan ke dalam workflow saat ini

## Format File

### JSON (workflow tunggal)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Wajib; array objek node
- `edges` – Opsional; array objek edge (default `[]`)
- `name` – Opsional; digunakan saat membuat workflow baru dari impor Dashboard

### ZIP (folder)

Arsip ZIP dengan struktur direktori yang mencerminkan hierarki folder. Setiap file adalah JSON workflow (lihat di atas). Nama folder dan workflow diambil dari nama direktori dan nama file.

Lihat [Workflow Structure](./workflow-structure.md) untuk format node dan edge.

## Kasus Penggunaan

- **Pencadangan** – Unduh workflow atau seluruh folder sebelum perubahan besar
- **Berbagi** – Ekspor dan bagikan file JSON dengan rekan tim
- **Migrasi** – Pindahkan workflow atau struktur folder antar instance Heym
- **Kontrol versi** – Simpan JSON workflow di Git bersama kode

## Terkait

- [Workflow Structure](./workflow-structure.md) – Format JSON untuk node dan edge
- [Workflows Tab](../tabs/workflows-tab.md) – Membuat workflow dan impor melalui drag & drop
- [Workflow Organization](./workflow-organization.md) – Folder dan sub-folder
- [Canvas Features](./canvas-features.md) – Fitur editor termasuk impor kanvas
