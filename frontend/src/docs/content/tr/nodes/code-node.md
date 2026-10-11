# Kod

**Kod** düğümü, kendi `requirements.txt` dosyasıyla birlikte yazdığınız Python kodunu çalıştırır ve JSON döndürür. Her çalıştırma, çalışma tamamlandığında yok edilen yepyeni bir container alır; böylece bir çalıştırma hiçbir zaman diğerini göremez veya etkileyemez.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.result` (`main` ne döndürdüyse), ayrıca `$nodeLabel.logs` ve `$nodeLabel.install` |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `label` | string | Düğüm tanımlayıcısı (camelCase) |
| `codeSource` | string | Python kaynak kodu. `main(params)` tanımlamalı ve JSON'a serileştirilebilir bir değer döndürmelidir |
| `codeParameters` | expression | Workflow verilerini koda bağlayan bir JSON nesnesi. İfadeler kod çalışmadan önce çözümlenir |
| `codeRequirements` | string | `requirements.txt` içeriği, her satırda bir paket. Boş bırakılırsa kurulum atlanır |
| `codeAllowNetwork` | boolean | Kodun kendisinin ağa erişip erişemeyeceği (varsayılan `false`) |

## `main` fonksiyonu

Kodunuz, tek bir argüman alan üst düzey bir `main` tanımlamalıdır:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Modül düzeyindeki ifadeler çalışır, ancak yalnızca `main`'in döndürdüğü şey düğümün çıktısı olur.

Editör satır numaralarını gösterir ve **Format**'ın yanındaki genişletme düğmesi, `Esc` ile kapanan daha büyük bir editör açar — düzenlemeler siz yazdıkça uygulanır, dolayısıyla kaydedilecek bir şey yoktur. **Format** düğmesi, kodunuzu yorumları koruyarak Ruff ile yeniden biçimlendirir. Ayrıca yapıştırmanın genellikle yol açtığı girinti hasarını da onarır: tekdüze girintilenmiş bir blok, sekmelerle karışık boşluklar ve bloğundan bir iki boşluk sapan bir satır reddedilmek yerine düzeltilir. Gerçek bir sözdizimi hatası ise satır ve sütun bilgisiyle bildirilir. Biçimlendirme, düğümün çalıştığı aynı izole container'da çalışır — ağ yok, backend ortamı yok — dolayısıyla tıpkı çalıştırma gibi Docker'a ihtiyaç duyar.

## Parametreleri okuma

`params`, iç içe nesneler ve listeler dahil olmak üzere nokta gösterimini destekler:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]`, geçerli Python tanımlayıcıları olmayan anahtarları okur
- `params.get("maybe")`, bir anahtar yoksa hata vermek yerine `None` döndürür
- `params.to_dict()` düz sözlüğü döndürür
- Hiç sağlanmamış bir anahtarı okumak, anahtarı adlandıran ve mevcut olanları listeleyen bir hata verir

## Çıktı

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — `main`'in dönüş değeri. Alt düğümler `$nodeLabel.result.message` okur
- `logs` — kodun `print`'e gönderdiği her şey, sonucu asla bozmaması için ayrı olarak yakalanır
- `install` — bağımlılıkları hangi aracın kurduğu (`uv`, `pip` veya `none`) ve çıktısı

## Bağımlılıklar

Paketleri `requirements.txt` dosyasında, yerel ortamınızda yapacağınız gibi tam olarak listeleyin:

```
requests==2.32.3
feedparser
```

Paketler, kod çalışmadan önce `uv` ile geçici bir dizine kurulur; `uv` bir paketi işleyemezse Heym `pip` ile yeniden dener. Çalıştırmalar arasında hiçbir şey önbelleğe alınmaz, dolayısıyla ağır bağımlılıklar her çalıştırmaya birkaç saniye ekler. `requirements.txt` dosyasını boş bırakmak kurulum adımını tamamen atlar ve gözle görülür şekilde daha hızlıdır.

Wheel içermeyen ve C derleyicisine ihtiyaç duyan paketler kurulamaz. Nedeni `install.log` içinde görünür.

## Ağ

| Aşama | Ağ |
|-------|---------|
| Bağımlılıkları kurma | Her zaman açık — pip ve uv'nin PyPI'ye erişmesi gerekir |
| Kodunuzu çalıştırma | Varsayılan olarak kapalı. `codeAllowNetwork` bunu açar |

`codeAllowNetwork` kapalıyken, `requests.get(...)` gibi bir dışa giden çağrı bir bağlantı hatasıyla başarısız olur. Bu amaçlanan varsayılandır: çoğu Kod düğümü, başka bir düğümün zaten getirdiği veriyi dönüştürür. Veriyi bir **HTTP** düğümüyle getirmeyi ve gövdeyi `codeParameters` aracılığıyla aktarmayı tercih edin.

## Sandbox ve sınırlar

Kodunuz, tüm Linux yetenekleri düşürülmüş, `no-new-privileges` ayarlanmış ve salt okunur kök dosya sistemine sahip bir container'da root olmayan bir kullanıcı olarak çalışır. Hiçbir Docker soketi ve backend'in sırlarından veya ortamından hiçbirini almaz.

| Sınır | Değer |
|-------|-------|
| Bellek | 512 MB |
| CPU'lar | 1 |
| Süreçler | 256 |
| Bağımlılık kurulum zaman aşımı | 120 saniye |
| Çalıştırma zaman aşımı | 60 saniye |

Bunlar sandbox'ın yapılandırma değil, sabit özellikleridir.

> **Docker gereklidir.** Agent Python araçları ve yeteneklerinin aksine, Kod düğümünün yerel bir yedek modu ve bunu gevşetecek bir ortam değişkeni yoktur. Erişilebilir bir Docker daemon olmadan düğüm, kodunuzu backend sürecinde çalıştırmak yerine net bir hatayla başarısız olur. Yerel `./run.sh` geliştirmesinde, bu düğümü kullanmadan önce Docker'ı başlatın. Bkz. [Güvenlik → Kod düğümü sandbox](../reference/security.md#code-node-sandbox).

## Uygun olduğunda başka bir düğüm kullanın

| Yapmak istediğiniz | Kullanın |
|-------------|-----|
| CSV, TSV, XML ayrıştırmak veya oluşturmak ya da bir dosyada OCR yapmak | [Dönüştürücü](converter-node.md) |
| Bir HTTP API çağırmak | [HTTP](http-node.md) |
| Alanları eşlemek veya yeniden adlandırmak | [Ayarla](set-node.md) |
| Başka bir workflow çalıştırmak | [Yürüt](execute-node.md) |

Mantık bunlara gerçekten uymadığında — özel matematik, özel ayrıştırma veya bir algoritma — **Kod** düğümüne başvurun.
## Örnek

Bir üst düğüm tarafından üretilen satırları puanlayın:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

`codeParameters` değeri `{ "rows": "$fetchRows.result" }` olarak ayarlandığında, alt düğümler `$scoreRows.result.total` değerini okur.
