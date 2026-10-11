# Düğümü Devre Dışı Bırak

**Düğümü Devre Dışı Bırak** düğümü, workflow içindeki başka bir düğümü kalıcı olarak devre dışı bırakır. Yürütüldüğünde, hedef düğümün `active` değerini `false` olarak ayarlar ve değişikliği kalıcı hale getirir. Bir koşul karşılandıktan sonra bir cron trigger'ını durdurmak gibi tek seferlik işlemler için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `targetNodeLabel` | string | Devre dışı bırakılacak düğümün etiketi (örn. `hourlyCheck`) |

## Kullanım Senaryosu

Bir koşul karşılandıktan sonra bir [Cron](./cron-node.md) trigger'ını devre dışı bırakın, böylece gelecekteki workflow yürütmelerinde artık çalışmaz. Daha sonra [Düğümü Etkinleştir](./enable-node.md) ile tekrar açın.

## Örnek

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Akış: Cron → HTTP kontrolü → Koşul (durum tamamlandı mı?) → doğruysa: Düğümü Devre Dışı Bırak (hedef: cron) → Çıkış.

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Düğümü Etkinleştir](./enable-node.md) – Devre dışı bırakılmış bir düğümü tekrar açın
- [Cron Düğümü](./cron-node.md) – Devre dışı bırakılacak trigger
- [Koşul Düğümü](./condition-node.md) – Devre dışı bırakmadan önce dallandırma
