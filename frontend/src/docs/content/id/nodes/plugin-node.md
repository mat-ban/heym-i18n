# Plugin

Node **Plugin** menjalankan aksi kustom yang disediakan oleh plugin yang terpasang. Plugin memperluas Heym dengan tipe node baru — aksi, integrasi pihak ketiga, atau apa pun yang dapat diekspresikan dalam Python — tanpa memodifikasi aplikasi inti.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.<keys returned by the plugin>` |

Sebuah **paket** plugin (satu zip) dapat menyertakan **beberapa node** — kombinasi apa pun dari aksi dan trigger. Setiap node muncul di palet di bawah **Plugins** dengan nama dan deskripsinya sendiri. Menarik salah satunya ke kanvas akan membuat node Plugin yang terikat pada paket tersebut (`pluginId`) dan node (`pluginNodeKey`).

## Kapan Digunakan

Gunakan node Plugin ketika operator telah memasang plugin yang menjalankan aksi yang Anda butuhkan — misalnya memanggil API privat, berkomunikasi dengan sistem internal, atau menjalankan logika khusus yang ditulis untuk deployment Anda.

Untuk plugin bergaya trigger yang memulai workflow, lihat [Node Plugin Trigger](./plugin-trigger-node.md).

## Konfigurasi

Formulir konfigurasi node dihasilkan dari manifest plugin. Setiap field yang dideklarasikan oleh plugin (`string`, `number`, `boolean`, atau `select`) dirender secara otomatis. Field string non-rahasia menggunakan input ekspresi, dan nilai konfigurasi string tersimpan yang dimulai dengan `$` akan diresolusikan sebelum handler plugin dijalankan.

Field rahasia (seperti API key) disamarkan di UI dan tidak pernah ditulis ke log.

## Cara Plugin Berjalan

Plugin dikirim oleh Heym dan dipasang oleh operator, sehingga kode plugin bersifat **terpercaya** dan berjalan in-process seperti node bawaan, dengan akses jaringan dan library penuh. Sebuah plugin dapat mendeklarasikan `dependencies` pip yang dipasang ke instance pada waktu instalasi.

Memasang dan menghapus plugin dibatasi hanya untuk operator yang emailnya tercantum dalam `HEYM_PLUGIN_ADMIN_EMAILS`, dan seluruh subsistem dibatasi oleh `HEYM_PLUGINS_ENABLED` (dinonaktifkan secara default). Lihat [Running & Deployment](../getting-started/running-and-deployment.md) untuk variabel environment.

## Ikon Kustom

Sebuah plugin dapat menyertakan logo SVG kustom. Letakkan `icon.svg` di root paket untuk menetapkan default bagi setiap node, dan/atau berikan node `"icon": "<file>.svg"` tersendiri di manifest. Ikon ditampilkan pada kartu palet dan node kanvas; node tanpa ikon akan kembali ke glyph puzzle-piece default.

## AI Builder

Plugin yang terpasang ditampilkan ke asisten AI dan chat canvas, sehingga Anda dapat meminta Heym untuk "gunakan plugin Acme CRM untuk membuat record" dan Heym akan menghasilkan node Plugin dengan `pluginId` dan `config` yang tepat.

## Menulis Plugin

Untuk membuat paket plugin, lihat [Plugin Authoring](../reference/plugin-authoring.md) untuk tata letak zip, field manifest, signature handler, ikon, dependencies, dan model kepercayaan runtime.
