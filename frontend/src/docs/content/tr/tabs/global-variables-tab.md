# Variables Sekmesi

**Variables** sekmesi, tüm workflow'larınız arasında paylaşılan kalıcı anahtar-değer verilerini yöneten **Global Variable Store**'u yönetir.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Variables demosunu izleyin</a></p>

## Genel Bakış

- Global değişkenleri oluşturun, düzenleyin ve silin
- Değişkenler kullanıcı kapsamlıdır ve workflow yürütmeleri boyunca kalıcıdır
- İfadelerde `$global.variableName` aracılığıyla başvurun

## Değişken Oluşturma

1. **New Variable** seçeneğine tıklayın
2. Bir **ad** girin (ifadelerde kullanılır)
3. **Değeri** ayarlayın (string, number, boolean, array veya object)
4. **Değer türünü** seçin (Auto, String, Number, Boolean, Array, Object)

## Düzenleme ve Silme

- **Düzenle** – Bir değişken satırındaki düzenleme simgesine tıklayın
- **Sil** – Çöp kutusu simgesine tıklayın; bunu kullanan workflow'ların bir yedeğe ihtiyacı olacaktır
- **Toplu silme** – Birden fazla değişken seçin ve **Delete selected** seçeneğini kullanın

## Workflow'larda Kullanma

Herhangi bir ifadede değişkenlere başvurun:

```
$global.environment
$global.settings.baseUrl
```

Ayrıca **Store in Global Variable Store** seçeneğini etkinleştirerek bir [Variable node](../nodes/variable-node.md) üzerinden global değişkenler ayarlayabilirsiniz.

## İlgili

- [Global Variables](../reference/global-variables.md) – Başvuru kılavuzu
- [Variable Node](../nodes/variable-node.md) – `isGlobal` ile değişkenleri ayarlayın
- [Expression DSL](../reference/expression-dsl.md) – `$global` sözdizimi
- [Chat Tab](./chat-tab.md) – Chat, global değişkenlere erişebilir
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu
