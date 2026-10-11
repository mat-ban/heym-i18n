# Yapışkan Not

**Yapışkan Not** düğümü, tuvale zengin markdown notları ekler. Yürütülmez—dokümantasyon, talimatlar, referans görselleri veya iş akışı notları için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 0 |
| Çıktı | Yok (yürütülmez) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `stickyTitle` | string | Yapışkan notun üst kısmında gösterilen başlık. |
| `stickyColor` | string | Arka plan rengi: `yellow`, `sky`, `emerald`, `rose`, `violet` veya `zinc`. |
| `note` | string | Markdown içeriği. Tuval üzerinde düzenlemek için çift tıklayın. Bağlantıları ve `![Alt](https://example.com/image.png)` gibi görsel markdown'ını destekler. |

## Örnek

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [İş Akışı Organizasyonu](../reference/workflow-organization.md) – İş akışlarını düzenleyin
