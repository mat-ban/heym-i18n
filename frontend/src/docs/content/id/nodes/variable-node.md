# Variabel

Node **Variable** menetapkan atau memperbarui variabel yang dapat diakses dari node mana pun melalui `$vars.variableName` (workflow-local) atau `$global.variableName` (persistent). Gunakan untuk counter, daftar terakumulasi, dan state bersama di seluruh workflow.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.value`, atau akses melalui `$vars.variableName` / `$global.variableName` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengenal node (camelCase) |
| `variableName` | string | Nama variabel (digunakan sebagai `$vars.variableName` atau `$global.variableName`). Hindari [nama yang direservasi](../reference/expression-dsl.md). |
| `variableValue` | expression | Nilai yang akan ditetapkan. Mendukung expression. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Koersi tipe (default: auto) |
| `isGlobal` | boolean | Ketika `true`, simpan di [Global Variable Store](../reference/global-variables.md) (persistent, user-scoped). Ketika `false` atau dihilangkan, workflow-local (in-memory). |

## Variabel Array

Inisialisasi array dengan `$array()` atau `$array("a", "b")` di node Variable sebelum menggunakan `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Kemudian tambahkan item (tanpa `$` di dalam tanda kurung):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Aturan Kritis

**Jangan pernah menggunakan `$` di dalam tanda kurung method:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – merusak expression

## Contoh – Counter

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Terkait

- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Loop Node](./loop-node.md) – Kumpulkan item dengan Variable di body loop
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, nama yang direservasi
- [Global Variables](../reference/global-variables.md) – Variabel persistent dengan `isGlobal`
