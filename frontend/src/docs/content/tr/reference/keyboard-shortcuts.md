# Klavye Kısayolları

Heym, yaygın işlemleri hızlandırmak için workflow düzenleyicisi ve canvas genelinde klavye kısayolları sunar.

## Genel Düzenleyici Kısayolları

Bu kısayollar workflow düzenleyicisinin herhangi bir yerinde etkindir.

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Komut Paletini aç |
| `Ctrl + I` / `Cmd + I` | [AI Assistant](./ai-assistant.md) panelini aç/kapat (yazarken çalışır) |
| `Ctrl + Enter` / `Cmd + Enter` | Geçerli workflow'u çalıştır |
| `Ctrl + S` / `Cmd + S` | Workflow'u kaydet |
| `Ctrl + Z` / `Cmd + Z` | Geri al |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | Yinele |
| `Ctrl + Y` / `Cmd + Y` | Yinele (alternatif) |
| `Escape` | Açık overlay'leri, diyalogları ve panelleri kapat |

## Canvas Kısayolları

Bu kısayollar canvas odaklandığında (etkin bir metin girişi yokken) geçerlidir.

### Seçim ve Gezinme

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | Tüm düğümleri seç |
| `Shift` (basılı tut) | Birden fazla düğüm seçmek için sürükle |
| `Ctrl` / `Cmd` (basılı tut) | Seçime tek tek düğüm eklemek için tıkla |
| `Escape` | Tüm düğümlerin seçimini kaldır; satır içi düğüm aramasını kapat |

### Düğümleri Düzenleme

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | Seçili düğüm(ler)i kopyala |
| `Ctrl + X` / `Cmd + X` | Seçili düğüm(ler)i kes |
| `Ctrl + V` / `Cmd + V` | Düğüm(ler)i yapıştır |
| `Delete` veya `Backspace` | Seçili düğüm(ler)i ve/veya kenar(lar)ı sil |
| `D` | Seçili düğüm(ler)in etkin / devre dışı durumunu değiştir |
| `P` | Seçili düğümdeki sabitlenmiş veriyi aç/kapat |

### Satır İçi Düğüm Arama

Canvas üzerinde herhangi bir yazdırılabilir karakter yazıldığında (hiçbir metin girişi odaklanmamışken) satır içi düğüm arama açılır penceresi açılır. Yazılan karakter, arama sorgusunun ilk karakteri olur.

| Kısayol | İşlem |
|----------|--------|
| Herhangi bir yazdırılabilir karakter | Satır içi düğüm aramasını aç ve yazmaya başla |
| `Backspace` | Arama sorgusundan son karakteri kaldır |
| `Escape` | Satır içi düğüm aramasını kapat |

## Komut Paleti (`Ctrl + K`)

Komut Paleti; düzenleyici, dashboard, docs ve evals görünümlerinden kullanılabilir. Klavyeden ayrılmadan workflow'lara, sekmelere ve dokümantasyon sayfalarına hızlıca gitmenizi sağlar.

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Komut Paletini aç |
| `↑` / `↓` | Sonuç listesinde gezin |
| `Tab` / `Shift + Tab` | Sonuç listesinde gezin |
| `Enter` | Seçili öğeyi aç |
| `Escape` | Paleti kapat |

## Dashboard Kısayolları

Bu kısayollar, başka bir metin girişi etkin değilken Workflows sekmesinde etkindir.

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Workflow aramasına odaklan |
| `Escape` | Metin içerdiğinde workflow aramasını temizle |

## Özellikler Paneli Kısayolları

Bu kısayollar, bir düğüm seçiliyken ve özellikler paneli açıkken etkindir.

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | Bağlantılı alt workflow'u yeni sekmede aç (yalnızca Execute düğümü) |

## Evaluate Diyaloğu Kısayolları

Bu kısayollar, Evaluate diyaloğu açıkken etkindir.

| Kısayol | İşlem |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | İfadeyi uygula ve diyaloğu kapat |
| `Ctrl + Z` / `Cmd + Z` | İfade düzenleyicisindeki değişiklikleri geri al |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | İfade düzenleyicisindeki değişiklikleri yinele |
| `Ctrl + Y` / `Cmd + Y` | İfade düzenleyicisindeki değişiklikleri yinele (alternatif) |

## Geçmiş ve İzler Kısayolları

Bu kısayollar, Execution History diyaloğunda ve Traces panelinde kullanılabilir.

| Kısayol | İşlem |
|----------|--------|
| `S` | Girdileri filtrelemek için arama girişini aç/kapat |

## İlgili

- [Canvas Özellikleri](./canvas-features.md) – Data pin, etkinleştirme/devre dışı bırakma, alt workflow'a çıkarma
- [Workflow Yapısı](./workflow-structure.md) – Düğüm ve kenar formatı
- [Execute Düğümü](../nodes/execute-node.md) – Alt workflow'ları çağırır (`Ctrl + Shift + O`)
- [Hızlı Başlangıç](../getting-started/quick-start.md) – İlk workflow'unuzu oluşturun
