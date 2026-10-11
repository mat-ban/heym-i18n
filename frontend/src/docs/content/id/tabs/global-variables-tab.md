# Tab Variables

Tab **Variables** mengelola **Global Variable Store** – data key-value persisten yang dibagikan di seluruh Workflow Anda.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Tonton demo Variables</a></p>

## Ikhtisar

- Membuat, mengedit, dan menghapus variabel global
- Variabel bersifat user-scoped dan tetap ada di seluruh eksekusi Workflow
- Referensikan dalam ekspresi melalui `$global.variableName`

## Membuat Variabel

1. Klik **New Variable**
2. Masukkan **name** (digunakan dalam ekspresi)
3. Tetapkan **value** (string, number, boolean, array, atau object)
4. Pilih **value type** (Auto, String, Number, Boolean, Array, Object)

## Mengedit dan Menghapus

- **Edit** – Klik ikon edit pada baris variabel
- **Delete** – Klik ikon trash; Workflow yang menggunakannya perlu diganti
- **Bulk delete** – Pilih beberapa variabel dan gunakan **Delete selected**

## Menggunakan dalam Workflow

Referensikan variabel dalam ekspresi apa pun:

```
$global.environment
$global.settings.baseUrl
```

Anda juga dapat menetapkan variabel global dari [Node Variable](../nodes/variable-node.md) dengan mengaktifkan **Store in Global Variable Store**.

## Terkait

- [Global Variables](../reference/global-variables.md) – Panduan referensi
- [Node Variable](../nodes/variable-node.md) – Menetapkan variabel dengan `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Sintaks `$global`
- [Tab Chat](./chat-tab.md) – Chat dapat mengakses variabel global
- [Contextual Showcase](../reference/contextual-showcase.md) – Panduan halaman ringkas untuk permukaan dashboard
