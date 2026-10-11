# Eksekusi

Node **Execute** memanggil workflow lain (sub-workflow) dan meneruskan input kepadanya. Gunakan node ini untuk logika yang dapat digunakan kembali, bukan untuk transformasi data—gunakan [Set](./set-node.md) untuk keperluan tersebut.

## Ikhtisar

| Properti | Nilai |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parameter

| Parameter | Tipe | Deskripsi |
|-----------|------|-------------|
| `label` | string | Pengidentifikasi node (camelCase) |
| `executeWorkflowId` | UUID | ID workflow yang akan dieksekusi |
| `executeInput` | expression | Input tunggal (untuk workflow dengan satu field input) |
| `executeInputMappings` | array | `{ key, value }` untuk beberapa input. `key` = nama field input workflow target. |
| `executeDoNotWait` | boolean | Ketika `true`, mengirimkan sub-workflow di latar belakang tanpa menunggu. Output: `{ "status": "dispatched", "workflow_id": "..." }`. Default: `false`. |

## Format Respons

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Do Not Wait

Ketika `executeDoNotWait: true`, node mengirimkan sub-workflow ke thread latar belakang dan segera mengembalikan:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Workflow induk melanjutkan ke node berikutnya tanpa menunggu. Catatan eksekusi sub-workflow ditulis ke trace secara asinkron saat selesai. Gunakan ini ketika hasil sub-workflow tidak diperlukan di hilir.

## Input Tunggal

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Beberapa Input

Ketika workflow target memiliki beberapa field input, gunakan `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

`key` harus cocok dengan key `inputFields` pada [Input](./input-node.md) workflow target.

## Terkait

- [Canvas Features](../reference/canvas-features.md) – Extract to Sub-Workflow untuk membuat node Execute dari node yang dipilih
- [Node Types](../reference/node-types.md) – Ikhtisar semua tipe node
- [Input Node](./input-node.md) – Field input workflow target
- [Set Node](./set-node.md) – Transformasi data (bukan pemanggilan workflow)
