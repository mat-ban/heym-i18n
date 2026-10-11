# Düğümü Etkinleştir

**Enable Node** düğümü, başka bir düğümü yeniden etkinleştirir. Yürütüldüğünde, hedef düğümün `active` değerini `true` olarak ayarlar ve değişikliği kalıcı hale getirir. [Disable Node](./disable-node.md) düğümünün karşılığıdır: bir [Cron](./cron-node.md) trigger'ını veya kapatılmış herhangi bir düğümü yeniden devreye almak için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `targetNodeLabel` | string | Etkinleştirilecek düğümün etiketi (örn. `hourlyCheck`) |

## Davranış

- Hedef, etkin olarak kaydedilir; böylece sonraki çalıştırmalar ve trigger'lar bunu görür. Yeniden etkinleştirilen bir Cron trigger'ı, bir sonraki planlanan zamanında tekrar tetiklenir.
- Hedef, Enable Node'un alt akışında yer alıyorsa ve henüz çalışmamışsa, mevcut yürütmede de çalışır.
- Zaten etkin olan bir düğümü etkinleştirmek hiçbir şeyi değiştirmez; çıkış yine de `enabled: true` bildirir.
- `targetNodeLabel` boş olduğunda veya bu etikete sahip bir düğüm bulunmadığında düğüm bir hatayla başarısız olur.

## Kullanım Senaryosu

Bir [Cron](./cron-node.md) trigger'ını talep üzerine başlatın. Cron düğümünü kapalı olarak kaydedin ve workflow'e [Input](./input-node.md) trigger'ı gibi ikinci bir giriş noktası ekleyin. Bu giriş noktasına yapılan bir istek, Enable Node'u çalıştırır ve Cron tetiklenmeye başlar.

Kapalı bir trigger kendi başına asla bir çalıştırma başlatmaz; bu nedenle Enable Node, çalışabilen bir giriş noktasının arkasında yer almalıdır.

## Örnek

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Akış: Input → Enable Node (hedef: cron) → Output. Cron düğümü `hourlyCheck`, aynı workflow içinde devre dışı olarak kaydedilir ve etkinleştirildiğinde kendi HTTP kontrol dalını çalıştırır.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Disable Node](./disable-node.md) – Bir düğümü workflow içinden kapatma
- [Cron Node](./cron-node.md) – Etkinleştirilecek trigger
- [Condition Node](./condition-node.md) – Etkinleştirmeden önce dallanma
- [Canvas Features](../reference/canvas-features.md) – Bir düğümü elle etkinleştirme veya devre dışı bırakma
