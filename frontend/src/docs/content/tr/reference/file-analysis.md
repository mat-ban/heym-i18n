# Dosya Analizi

Dosya analizi; Chat, [Agent düğümü](../nodes/agent-node.md) ve [Code düğümünün](../nodes/code-node.md), [Drive](./drive.md) üzerindeki büyük dosyaları yalıtılmış bir Python sandbox'ında açıp analiz etmesini sağlar. PDF'ler, elektronik tablolar, CSV, DOCX ve JSON önce incelenir ve ardından seçilerek okunur; böylece 200 sayfalık bir sözleşmenin veya bir milyon satırlık bir çalışma kitabının asla bir modelin bağlamına sığması gerekmez.

## Nasıl çalışır

Her çağrı, ağ erişimi olmayan yeni bir container içinde çalışır. Gerekli dosyalar salt okunur olarak kopyalanır, kod çalışır ve container kaldırılır. Aynı oturumun çağrıları arasında küçük bir çalışma klasörü korunur, böylece sonraki bir adım önceki adımın kaydettiği sonuçlardan devam edebilir.

| Yol | İçerik |
|------|--------|
| `/input` | Bu oturumun Drive dosyaları, salt okunur |
| `/work` | Oturum boyunca korunan çalışma alanı, örn. `/work/sales.pkl` |
| `/work/out` | Buraya yazılan dosyalar çağrıdan sonra Drive'a kaydedilir ve bağlantı olarak döndürülür |

Sandbox'ta pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx ve langdetect önceden yüklenmiştir; ayrıca [Dönüştürücü düğümünün](../nodes/converter-node.md) kullandığı Tesseract OCR da mevcuttur.

## Araçlar

Model üç araçla çalışır, Chat'te ise dördüncü bir araç bulunur:

| Araç | İşlev |
|------|----------|
| `list_files` | Açabileceğiniz Drive dosyalarını listeler: ad, tür, boyut, tarih |
| `inspect_file` | Kısa bir örnekle bir dosyanın türünü, meta verilerini ve yapısını döndürür |
| `run_python` | Belirtilen dosyalarda Python çalıştırır ve konsol çıktısını döndürür |
| `clear_workspace` | Yalnızca Chat: konuşmanın çalışma klasörünü siler |

`inspect_file` yalnızca bir özet için gerekenleri okur:

| Tür | Özet |
|-----|-----------------|
| PDF | Sayfa sayısı, başlık ve yazar, metnin çıkarılıp çıkarılamayacağı, dil, sayfa boyutları, ilk sayfa metni ve tabloları. Taranan PDF'ler OCR ile okunur (en fazla 5 sayfa) |
| XLSX / XLS | Satır ve sütun sayıları içeren sayfalar, başlık satırları, türler, pandas `read_hint`, adlandırılmış aralıklar, ilk satırlar |
| CSV / TSV | Kodlama, sınırlayıcı, satır sayısı, türleriyle sütunlar, ilk satırlar |
| DOCX | Başlık taslağı, tablolar, kelime ve karakter sayıları, yazar ve tarih |
| JSON | Kök türü, anahtarlar, dizi uzunluğu, iç içe geçme derinliği, örnek kayıtlar |

`run_python` içinde `heym_files` modülünü kullanarak bir dosya açın:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Chat'te

[Chat sekmesinde](../tabs/chat-tab.md), Heym Work Chat'inde veya MCP `heym_chat` aracı aracılığıyla PDF, elektronik tablo, DOCX, CSV veya JSON dosyaları, resimler (PNG, JPG, GIF, WebP) ya da düz metin dosyaları ekleyin. Bir mesaj en fazla 10 dosya taşıyabilir. Her dosya Drive'ınızda saklanır; mesaja yalnızca adı ve ID'si gider. Chat dosyayı inceler, sorunuz için gereken kısmı okur ve tablolar veya alıntılarla yanıt verir.

## Workflow'larda

Bir çalıştırma yalnızca kendi dosyalarını açar: [Dosya Yükleme Trigger'ı](../nodes/file-upload-trigger-node.md) ile yüklenenler, düğümlerinin Drive'a yazdıkları ve bir [Drive düğümünün](../nodes/drive-node.md) aynı çalıştırmada **Get** adımıyla aldığı dosyalar.

- **Agent düğümü**: ajanın girdisi veya mesajı bir dosya içerdiğinde, bu dosyalar için yukarıdaki araçları otomatik olarak alır.
- **Code düğümü**: **Files** ayarını `$Upload.file.id` gibi bir ifadeye ayarlayın. Dosyalar bağlanır ve `params.files` altında listelenir.

## Sınırlar

| Sınır | Değer |
|-----------|------|
| Çağrı başına bellek | 2 GB |
| Çağrı başına süre | 120 saniye |
| Oturum başına çalışma klasörü | 2 GB |
| Çağrı başına çıktı dosyası | 20, her biri 100 MB'a kadar |
| Modele döndürülen yazdırılmış çıktı | 20.000 karakter |
| Çağrı başına dosya | 20 |

## Güvenlik

- Sandbox'ın ağı yoktur, Heym'in ayarlarına veya sırlarına erişimi yoktur ve ayrıcalıksız bir kullanıcı olarak çalışır.
- Dosyalar yalnızca sandbox içinde işlenir.
- Chat'te erişim Drive'ı takip eder: sahip olduğunuz dosyaları ve ekiplerinizle paylaşılan dosyaları açarsınız.
- Chat'te bir dosyanın açılması denetim günlüğüne kaydedilir.
- Dosya içerikleri kesinlikle veri olarak kabul edilir; bir dosya içindeki yönergeler yürütülmez.

## Gereksinimler

Dosya analizi, Heym örneğinde bir sandbox arka ucu gerektirir (Docker veya [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## İlgili

- [Drive](./drive.md)
- [Code düğümü](../nodes/code-node.md)
- [Agent düğümü](../nodes/agent-node.md)
- [Chat sekmesinde](../tabs/chat-tab.md)
