# Pembuatan Plugin

Plugin Heym adalah paket zip tepercaya yang diinstal oleh operator. Sebuah paket dapat
menambahkan satu atau lebih node action atau trigger kustom tanpa mengubah aplikasi inti.

## Tata Letak Paket

Zip plugin harus berisi `plugin.json` di root paket dan file entri Python
yang dinamai oleh `entry` (default ke `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` bersifat opsional dan disajikan sebagai halaman dokumentasi plugin. Letakkan
`icon.svg` di root paket untuk ikon node default, atau atur jalur `icon`
khusus node di `plugin.json`.

## Manifest

Gunakan `plugin.json` multi-node ketika satu paket mengekspos beberapa node:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Manifest single-node legacy juga diterima: hilangkan `nodes` dan sediakan
`kind`, `fields`, `dslHint`, dan `docSlug` di tingkat atas.

## Field Manifest

| Field | Catatan |
|-------|-------|
| `id` | Id paket huruf kecil menggunakan huruf, angka, dan tanda hubung. |
| `name` | Nama paket yang dapat dibaca manusia. |
| `version` | Versi paket yang digunakan untuk tampilan dan caching handler. |
| `description` | Deskripsi singkat yang ditampilkan di UI dan konteks asisten. |
| `entry` | Jalur file handler Python di dalam zip; default ke `handler.py`. |
| `dependencies` | Persyaratan pip opsional yang diinstal dengan `uv pip install`. |
| `nodes` | Node kustom yang diekspos oleh paket ini. |

Setiap node memerlukan `key` yang unik, `name`, dan `kind` berupa `action` atau
`trigger`. Jika `function` dihilangkan, action memanggil `run` dan trigger memanggil
`trigger`.

Tipe field yang didukung adalah `string`, `number`, `boolean`, dan `select`. Field
select menggunakan array `options` dari objek `{ "label": "...", "value": "..." }`.
Atur `required` untuk field yang wajib dan `secret` untuk input yang disamarkan. Manifest
juga menerima metadata `default`, `dynamic`, dan `expression` untuk field; ini
disimpan bersama manifest, tetapi node plugin saat ini membaca konfigurasi node yang tersimpan
saat runtime alih-alih mengisi otomatis konfigurasi yang hilang dari default.

Field string non-secret dirender dengan UI input ekspresi. Saat runtime,
setiap nilai konfigurasi string yang tersimpan yang dimulai dengan `$` diselesaikan sebelum handler
dipanggil.

## Fungsi Handler

Handler action menerima input workflow, konfigurasi yang diselesaikan, dan konteks kecil:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handler trigger menerima konfigurasi yang diselesaikan dan konteks:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Kembalikan dictionary untuk mengekspos field output bernama. Jika handler mengembalikan tipe
lain, Heym membungkusnya sebagai `{ "value": result }`.

## Instalasi Dan Runtime

Plugin dinonaktifkan secara default. Operator mengaktifkannya dengan
`HEYM_PLUGINS_ENABLED=true` dan membatasi manajemen ke
`HEYM_PLUGIN_ADMIN_EMAILS`. File plugin yang diinstal berada di bawah
`HEYM_PLUGINS_DIR` dan harus di-mount secara persisten dalam deployment container.

Kode plugin adalah Python tepercaya yang diinstal operator yang berjalan in-process dengan
backend. Kode ini dapat mengakses jaringan dan pustaka yang diinstal, jadi hanya instal
paket yang bersedia Anda jalankan dengan tingkat kepercayaan yang sama seperti Heym itu sendiri.
