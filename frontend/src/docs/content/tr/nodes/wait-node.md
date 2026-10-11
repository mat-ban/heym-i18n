# Bekle

**Wait** düğümü, workflow yürütmesini belirtilen süre boyunca duraklatır. Hız sınırlama, gecikmeli işlemler veya yoklama aralıkları için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | Girişi olduğu gibi iletir |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `duration` | number | Milisaniye cinsinden gecikme (örn. 1000 = 1 saniye). Editör 1 ile 900000 (15 dakika) arasını kabul eder |

## Örnek

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Loop Düğümü](./loop-node.md) – Hız sınırlama için döngüler içinde Wait kullanın
