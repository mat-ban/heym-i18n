# Küresel Değişkenler

**Global Değişken Deposu**, workflow yürütmeleri arasında kalıcı olan, kullanıcı kapsamlı anahtar-değer verilerini tutar. Bunu yapılandırma, özellik bayrakları, sayaçlar veya birden fazla workflow'un ihtiyaç duyduğu paylaşılan durum için kullanın.

> **Gizli bilgileri burada saklamayın.** Global değişkenler bir gizli bilgi kasası değildir: değerler şifrelenmemiş olarak saklanır, paylaştığınız herkese tam olarak döndürülür ve işbirlikçiler bunları düzenleyebilir. API anahtarları, parolalar ve token'lar, bunları durağan haldeyken şifreleyen ve gizli bilgiyi asla istemciye döndürmeyen [Credentials](./credentials.md) bölümüne aittir.

## Yerel ve Global Karşılaştırması

| Depo | Sözdizimi | Kapsam | Kalıcılık |
|-------|--------|-------|-------------|
| **Workflow-yerel** | `$vars.variableName` | Yalnızca geçerli yürütme | Bellekte, yürütme sona erdiğinde kaybolur |
| **Global** | `$global.variableName` | Kullanıcının tüm workflow'ları | Veritabanında kalıcı |

## Global Değişkenler Oluşturma

1. **Variables sekmesinden** – [Variables Sekmesi](../tabs/global-variables-tab.md): Değişkenleri doğrudan oluşturun, düzenleyin ve silin.
2. **Bir Variable düğümünden** – Düğümün özelliklerinde **Store in Global Variable Store** (`isGlobal: true`) seçeneğini etkinleştirin. Workflow çalıştığında değişken depoya yazılır.

## İfadelerde Kullanma

Global değişkenlere `$global.variableName` ile erişin:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Workflow-yerel değişkenlerle aynı yöntemleri kullanın (örn. diziler için `.upper()`, `.length`, `.add()`).

## Değer Türleri

Desteklenen türler: `string`, `number`, `boolean`, `array`, `object`. Bir değişken oluştururken veya düzenlerken türü seçin.

## Global Değişkenleri Paylaşma

Bir global değişkeni diğer kullanıcılarla veya [Teams](./teams.md) ile paylaşabilirsiniz, böylece kendi workflow'larında kullanabilirler.

- **Kullanıcıyla paylaşma** – Sahip olduğunuz bir değişkenin yanındaki paylaş simgesine tıklayın, alıcının e-postasını girin ve **Share** düğmesine tıklayın. Alıcı, değişkeni Global Variables listesinde bir **Shared** rozeti ve "Shared by &lt;your email&gt;" etiketiyle görecektir.
- **Takımla paylaşma** – Paylaşım iletişim kutusunda bir takım seçin ve **Add** düğmesine tıklayın. Tüm takım üyeleri erişim kazanır.
- **Düzenlenebilir erişim** – Alıcılar paylaşılan değişkeni görüntüleyebilir, düzenleyebilir ve workflow'larında `$global.variableName` aracılığıyla referans verebilir. Değişkeni yalnızca sahibi paylaşabilir, paylaşımı kaldırabilir veya silebilir.
- **Ad çakışmaları** – Alıcının aynı ada sahip bir değişkeni zaten varsa, kendi değişkeni paylaşılan değişkene göre öncelik kazanır.
- **Paylaşımı kaldırma** – Değişkenin paylaşım iletişim kutusunu açın ve erişimini kaldırmak istediğiniz kullanıcının yanındaki **×** düğmesine tıklayın.

## Chat Entegrasyonu

Global değişkenler [Chat](../tabs/chat-tab.md) asistanı tarafından kullanılabilir. LLM, soruları yanıtlarken veya içerik üretirken bunlara başvurabilir.

## İlgili

- [Variables Sekmesi](../tabs/global-variables-tab.md) – Global değişkenleri arayüzde yönetin
- [Variable Düğümü](../nodes/variable-node.md) – `isGlobal` ile değişkenleri ayarlayın
- [Expression DSL](./expression-dsl.md) – `$global` sözdizimi
