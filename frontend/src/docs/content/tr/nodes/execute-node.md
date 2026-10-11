# Çalıştır

**Execute** düğümü başka bir workflow'u (alt workflow) çağırır ve ona girdi aktarır. Veri dönüşümü için değil, yeniden kullanılabilir mantık için kullanın—veri dönüşümü için [Set](./set-node.md) kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girdiler | 1 |
| Çıktılar | 1 |
| Çıktı | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `executeWorkflowId` | UUID | Çalıştırılacak workflow'un ID'si |
| `executeInput` | expression | Tek girdi (tek girdi alanı olan workflow'lar için) |
| `executeInputMappings` | array | Birden fazla girdi için `{ key, value }`. `key` = hedef workflow'un girdi alanı adı. |
| `executeDoNotWait` | boolean | `true` olduğunda, alt workflow'u beklemeden arka planda gönderir. Çıktı: `{ "status": "dispatched", "workflow_id": "..." }`. Varsayılan: `false`. |

## Yanıt Formatı

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

## Bekleme Yapma

`executeDoNotWait: true` olduğunda, düğüm alt workflow'u arka plan iş parçacığına gönderir ve hemen döner:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Ana workflow beklemeden bir sonraki düğüme devam eder. Alt workflow'un yürütme kaydı tamamlandığında trace'e asenkron olarak yazılır. Alt workflow sonucu aşağı akışta gerekmediğinde bunu kullanın.

## Tek Girdi

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

## Birden Fazla Girdi

Hedef workflow birden fazla girdi alanına sahip olduğunda, `executeInputMappings` kullanın:
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

`key`, hedef workflow'un [Input](./input-node.md) `inputFields` anahtarlarıyla eşleşmelidir.

## İlgili

- [Canvas Features](../reference/canvas-features.md) – Seçili düğümlerden Execute düğümleri oluşturmak için Alt Workflow'a Çıkar
- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Input Node](./input-node.md) – Hedef workflow'un girdi alanları
- [Set Node](./set-node.md) – Veri dönüşümü (workflow çağrıları değil)
