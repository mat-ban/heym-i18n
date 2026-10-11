# Birleştirme

**Merge** düğümü, birden fazla paralel girişi bekler ve bunları tek bir çıkışta birleştirir. Devam etmeden önce paralel dallardan gelen sonuçları birleştirmeniz gerektiğinde kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | n (yapılandırılabilir) |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.merged` – her daldan gelen girişleri içeren nesne |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|----------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `inputCount` | number | Beklenecek giriş sayısı (varsayılan: 2) |

## Ne Zaman Kullanılır

- Paralel dallardan gelen sonuçları **birleştirmeniz** veya **bir araya getirmeniz** gerektiğinde kullanın
- Ayrı [Output](./output-node.md) düğümleriyle sonlanan paralel workflow'lar için **kullanmayın**
- Her giriş dalı, birleştirilmiş çıkışa katkıda bulunur

## Örnek

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Birden fazla dalı merge düğümüne bağlayın. Düğüm, çıkış üretmeden önce tüm girişleri bekler.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Parallel Execution](../reference/parallel-execution.md) – Paralel dalların nasıl çalıştığı
- [Workflow Structure](../reference/workflow-structure.md) – Kenarlar ve tutamaçlar
