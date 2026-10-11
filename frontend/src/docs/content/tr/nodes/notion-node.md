# Notion

**Notion** düğümü, Notion API aracılığıyla veritabanlarını, veri kaynaklarını, sayfaları ve blokları yönetir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Kimlik Bilgisi | Dahili entegrasyon token'ı veya Notion OAuth |
| API sürümü | `2026-03-11` |

Notion veritabanı tarzı koleksiyonlar, güncel API sürümlerinde **veri kaynağı ID'lerini** kullanır. Düğümü çalıştırmadan önce workflow'un ihtiyaç duyduğu her sayfayı veya veri kaynağını entegrasyonla paylaşın.
Kaynak alanları ham bir Notion ID'sini veya tam bir Notion URL'sini kabul eder. URL'ler, API isteğinden önce gömülü kaynak ID'lerine normalleştirilir.

## İşlemler

| İşlem | Gerekli alanlar | Ana çıktı |
|-----------|-----------------|-------------|
| Search | İsteğe bağlı query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Sayfa ID | `.page` |
| Create Page | Veri Kaynağı ID'si veya Üst Sayfa ID'si, Properties | `.page`, `.id`, `.url` |
| Update Page | Sayfa ID, Properties/Icon/Cover'dan biri | `.page` |
| Move Page to Trash | Sayfa ID | `.page` |
| Restore Page | Sayfa ID | `.page` |
| Create Database | `parent` içeren veritabanı isteği | `.database`, `.id`, `.url` |
| Retrieve Database | Veritabanı ID | `.database` |
| Update Database | Veritabanı ID, boş olmayan veritabanı isteği | `.database`, `.id`, `.url` |
| Create Data Source | `parent` ve boş olmayan `properties` içeren veri kaynağı isteği | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Veri Kaynağı | `.data_source` |
| Update Data Source | Veri Kaynağı ID, boş olmayan veri kaynağı isteği | `.data_source`, `.id`, `.url` |
| Query Data Source | Veri Kaynağı ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Blok veya Sayfa ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Blok ID, blok güncelleme nesnesi | `.block` |
| Delete Block | Blok ID | `.block` |
| Append Blocks | Blok veya Sayfa ID, Children | `.results`, `.count` |

Tüm işlemler ayrıca `.success` ve `.operation` döndürür.

## JSON alanları

Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon ve Cover alanları
Notion API JSON'unu kabul eder. JSON dizeleri içindeki ifadeler istekten önce çözümlenir. Bir alan ayrıca
`$input.database`, `$input.properties` veya `$input.children` gibi gerekli nesneye veya diziye doğrudan çözümlenen
tek bir bağımsız ifade olabilir.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Sayfa veya blok içeriği için Children, Notion blok nesnelerinden oluşan bir dizidir:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Veritabanları ve veri kaynakları

Güncel Notion API'sinde bir **veritabanı** bir kapsayıcıdır ve bir **veri kaynağı** özellik
şemasını ve sorgulanabilir satırları barındırır. Retrieve Database, veritabanının `data_sources` listesini döndürür; bu ID'lerden birini
Retrieve Data Source veya Query Data Source ile kullanın.

Create Database, Notion'un Create a database endpoint'inden gelen tam istek nesnesini kabul eder. İçinde
`parent` bulunmalıdır ve `title`, `description`, `is_inline`,
`initial_data_source`, `icon` ve `cover` içerebilir. Örneğin:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database, güncelleme endpoint'inin istek nesnesini kabul eder; buna `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` ve `is_locked` dahildir. Veritabanı ID alanları
ham bir ID, tam Notion URL'si veya ifade kabul eder.

Create Page properties nesnesini oluşturmadan önce veri kaynağının `properties` şemasını almak için
**Retrieve Data Source** kullanın. **Create Data Source** bir üst veritabanı nesnesi ve
boş olmayan bir `properties` şeması gerektirir. **Update Data Source**, ilgili Notion endpoint'i tarafından desteklenen
boş olmayan bir istek nesnesini kabul eder.

Örneğin, mevcut bir veritabanı içinde bir veri kaynağı oluşturun:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Data Source ve Parent Page seçicileri, kısa bir debounce ve imleç tabanlı **Load more** sayfalandırması ile
sunucu tarafı aramayı destekler. Notion'da yeni bir kaynağı paylaştıktan sonra **Refresh** kullanın.
Bir ifade, ham ID veya URL girmek için **Use expression** seçeneğine geçin.

`{"property":"object","value":"database"}` kullanan eski eğitimlerdeki Search filtreleri
güncel `data_source` değerine dönüştürülür.
Yeni workflow'lar doğrudan `data_source` veya `page` kullanmalıdır.

Append Blocks, **Start**, **End** ve **After Block** konumlarını destekler. Create Page ve Append
Blocks, Notion'un istek başına sınırını karşılamak için 100'den fazla üst düzey children'ı otomatik olarak sıralı isteklere böler.

Hız sınırına takılan istekler (`429` veya `529`) üç defaya kadar yeniden denenir. Heym, Notion'un
`Retry-After` başlığına uyar, her bekleme süresini 10 saniye ile sınırlar ve rastgele jitter ekler. Notion istekleri
sayfalar ve workflow düğümleri arasında süreç genelinde bir HTTP bağlantı havuzunu paylaşır.
## Notion API sınırları

- Tek bir rich-text `text.content` değeri en fazla 2.000 karakter içerebilir. Daha uzun metinleri
  birden fazla rich-text nesnesine bölün.
- Notion, istek başına üst düzey block children sayısını 100 ile sınırlar. Heym daha büyük Children
  dizilerini toplu işler, ancak her bir blok yine de Notion'un payload sınırlarını karşılamalıdır.
- API, tek bir istekte en fazla iki iç içe block children seviyesini kabul eder. Daha derin
  yapıları sonraki Append Blocks işlemleriyle oluşturun.
- İstek payload'ları 1.000 blok öğesi ve toplam 500 KB ile sınırlıdır.

## Sayfalama

Search, Query Data Source ve Get Block Children; 1 ile 100 arasında bir sayfa boyutu ve isteğe bağlı
bir başlangıç imleci kabul eder. İmleçleri otomatik olarak takip etmek ve düğümün 10.000 sonuçluk
güvenlik sınırına kadar tüm sonuçları birleştirmek için sayfa boyutunu `0` olarak ayarlayın.

## Credential kurulumu

Credential iletişim kutusunda iki kurulumdan birini seçin (**Internal token** veya **OAuth**):

- **Internal token:** Bir internal integration oluşturun, token'ını Heym'e kopyalayın, ardından
  gerekli her sayfayı veya data source'u integration ile paylaşın. Erişimi doğrulamak için
  **Test Connection** seçeneğini kullanın.
- **OAuth:** Bir public Notion integration oluşturun ve Notion'da
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` adresini kaydedin. Heym credential iletişim
  kutusunda **OAuth** seçeneğini seçin, integration'ın Client ID ve Client Secret değerlerini girin,
  ardından bir workspace'i yetkilendirmek için **Connect** düğmesine tıklayın. Secret, credential ile
  birlikte şifrelenmiş olarak saklanır ve OAuth state veya ortam yapılandırmasına yerleştirilmez.
  Yetkilendirmeden sonra credential, bağlı workspace adını gösterir (`connected (Workspace Name)`).
  Bekleyen OAuth credential'ları `Not connected` olarak gösterir.

Düzenleme sırasında internal token alanının boş bırakılması, saklanan token'ı korur.

Özel [HTTP](../nodes/http-node.md) istekleri için `$credentials.YourNotionCredential`, Notion
düğümünün kullandığı aynı bearer token'a (internal token veya OAuth access token) çözümlenir.

## API sürüm notları

Heym, Notion isteklerini API sürümü `2026-03-11` ile sabitler. Bu sürüm şunları kullanır:

- Eski database-query yolları yerine `data_source_id` parent'ları ve `/data_sources` endpoint'leri
- Sayfa çöp kutusu/geri yükleme işlemleri için `archived` yerine `in_trash`
- Append Block Children için `position` nesneleri (`start`, `end`, `after_block`)

Eski Notion otomasyon örneklerini taşırken:

- Database parent/query referanslarını **Retrieve Database** veya editör data-source seçicisinden
  alınan data source ID'leriyle değiştirin
- `archived: true` yerine `in_trash: true` kullanın
- Append `after` parametrelerini düğümün **Append Position** alanıyla değiştirin

Hâlâ `database` nesne değerini kullanan arama filtreleri otomatik olarak `data_source` olarak
normalize edilir.

## İlgili

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)
