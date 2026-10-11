# Crawler

**Crawler** düğümü, FlareSolverr kullanarak web sayfalarını kazır ve isteğe bağlı olarak CSS seçicileri aracılığıyla HTML çıkarımı yapar. Web kazıma ve içerik çıkarımı için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.body` (HTML veya çıkarılan içerik) |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md) bölümünden FlareSolverr kimlik bilgisi |
| `crawlerUrl` | expression | Kazınacak URL (ifadeleri destekler) |
| `crawlerWaitSeconds` | number | Kazımadan önce beklenecek saniye (varsayılan: 0) |
| `crawlerMaxTimeout` | number | Maksimum zaman aşımı (ms) (varsayılan: 60000) |
| `crawlerMode` | string | `"basic"` veya diğer modlar |
| `crawlerSelectors` | array | Çıkarım için CSS seçicileri. Her biri: `{ selector, attribute? }` |

## Örnek

```json
{
  "type": "crawler",
  "data": {
    "label": "scrapePage",
    "credentialId": "flaresolverr-credential-uuid",
    "crawlerUrl": "$userInput.body.url",
    "crawlerWaitSeconds": 2,
    "crawlerSelectors": [
      { "selector": "h1" },
      { "selector": ".content", "attribute": "innerHTML" }
    ]
  }
}
```

## Çıkış Güvenliği

- Kimlik bilgisinde saklanan FlareSolverr URL'si `http://` veya `https://` kullanmalıdır ve link-local veya cloud-metadata adresine çözümlenmemelidir. Reddedilen küme `169.254.0.0/16`, `fe80::/10`, Alibaba Cloud ve AWS IPv6 metadata adresleri ile bunlardan birini taşıyabilen IPv6 geçiş biçimleridir. Bu, bilinen endpoint'lerin bir listesidir; her sağlayıcı hakkında bir garanti değildir.
- Loopback ve özel adreslere kasıtlı olarak izin verilir; böylece belgelenen `http://localhost:8191` kurulumu ve `http://flaresolverr:8191` gibi compose servis adları çalışmaya devam eder. Bunun sonucu olarak, bu alan backend'in bu adreslerde erişebildiği herhangi bir diğer servise de yönlendirilebilir ve yanıt düğüm çıkışında geri döner. Kimlik bilgisi paylaşımı bunu engellemez: oturum açmış herhangi bir kullanıcı kendi FlareSolverr kimlik bilgisini oluşturabilir, dolayısıyla mevcut bir kimlik bilgisini saklamak hiçbir şeyi değiştirmez. Geçerli olan kontroller, workflow yazabilecek kişilere güvenmek ve backend'in erişebileceği kapsamı sınırlayan ağ kurallarıdır.
- Heym, bağlanmadan önce çözümlenen adresi sabitler; böylece bir DNS yanıtı, kontrol sonrasında isteği bir metadata adresine taşıyamaz. Koruma etkinken ortam proxy'leri devre dışı bırakılır ve yönlendirmeler takip edilmez.
- FlareSolverr'ın sizin için ardından getirdiği sayfa, FlareSolverr'ın kendisinin çözümlediği ayrı bir atlamadır. Heym bunu denetlemez; dolayısıyla FlareSolverr container'ının nereye bağlanabileceğini kısıtlamak ağ politikanıza aittir.
- Güvenilen self-hosted kurulumlar, `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ile metadata kuralını kaldırabilir. Hosted veya çok kiracılı kurulumlarda varsayılanı açık tutun.

## İlgili

- [Node Types](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Playwright Node](./playwright-node.md) – Tarayıcı otomasyonu alternatifi
- [Credentials Tab](../tabs/credentials-tab.md) – FlareSolverr kimlik bilgisi ekleme
