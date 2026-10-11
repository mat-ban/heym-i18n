# Cron

**Cron** düğümü, bir cron ifadesi kullanarak bir workflow'u zamanlanmış şekilde tetikler. Kullanıcı girdisi gerekmez—workflow belirtilen zamanlarda otomatik olarak çalışır.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girdiler | 0 |
| Çıktılar | 1 |
| Çıktı | Trigger olayı (payload yok) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `cronExpression` | string | Cron ifadesi (örn. saatlik için `0 * * * *`) |

## Cron İfadesi Formatı

Standart 5 alanlı cron: `dakika saat ayın-günü ay haftanın-günü`

| Alan | Değerler | Örnek |
|-------|--------|---------|
| Dakika | 0–59 | `0` = 0. dakikada |
| Saat | 0–23 | `*` = her saat |
| Ayın günü | 1–31 | `*` = her gün |
| Ay | 1–12 | `*` = her ay |
| Haftanın günü | 0–7 (0 ve 7 = Pazar) | `*` = her gün |

**Yaygın örnekler:**

- `0 * * * *` – her saat
- `0 0 * * *` – her gün gece yarısı
- `*/15 * * * *` – her 15 dakikada bir
- `0 9 * * 1-5` – hafta içi günler saat 9:00'da

## Örnek

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Trigger'lar](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Düğümü Devre Dışı Bırak](./disable-node.md) – Bir koşuldan sonra cron trigger'ını durdurun
- [Düğümü Etkinleştir](./enable-node.md) – Devre dışı bırakılmış bir cron trigger'ını yeniden başlatın
