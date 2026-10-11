# Plugin Trigger

Node **Plugin Trigger** adalah padanan bergaya trigger dari
[node Plugin](./plugin-node.md). Node ini disediakan oleh plugin yang terpasang yang
`kind`-nya adalah `trigger`, dan menghasilkan data awal yang menjadi titik mula sebuah workflow.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.<keys returned by the plugin>` |

Plugin trigger dapat merepresentasikan sumber apa pun — aplikasi lain, layanan
pihak ketiga, atau teknologi lain — selama handler plugin mengembalikan data
yang seharusnya menjadi titik mula workflow.

## Kapan Digunakan

Gunakan node Plugin Trigger ketika plugin yang terpasang mendefinisikan trigger yang memulai
workflow Anda. Untuk plugin yang menjalankan aksi di tengah workflow, gunakan
[node Plugin](./plugin-node.md) sebagai gantinya.

## Konfigurasi

Seperti node Plugin, formulir konfigurasi dihasilkan dari field
manifest plugin. Field string non-rahasia menggunakan input ekspresi, dan field
rahasia disamarkan.

## Cara Plugin Berjalan

Kode plugin bersifat tepercaya (dikirim oleh Heym, dipasang oleh operator) dan berjalan secara in-process.
Instalasi dibatasi untuk `HEYM_PLUGIN_ADMIN_EMAILS` dan subsistem ini
dikendalikan oleh `HEYM_PLUGINS_ENABLED`. Lihat
[Running & Deployment](../getting-started/running-and-deployment.md).

## Menulis Plugin

Untuk membuat paket plugin trigger, lihat
[Plugin Authoring](../reference/plugin-authoring.md) untuk tata letak zip,
field manifest, signature handler, ikon, dependensi, dan model kepercayaan runtime.
