# MCP Çağrı Düğümü

**MCP Call** düğümü, bir LLM'in hangi aracı çağıracağına karar vermesine gerek kalmadan belirli bir [Model Context Protocol (MCP)](https://modelcontextprotocol.io) aracını doğrudan çağırır. Hangi aracı çağıracağınızı tam olarak bildiğiniz ve deterministik, tek adımlı bir yürütme istediğiniz durumlarda kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.result` |

## Ne Zaman Kullanılır

MCP Call düğümünü şu durumlarda kullanın:
- Tasarım aşamasında hangi MCP aracını çağıracağınızı tam olarak biliyorsanız
- Araçlar arasında seçim yapmak için bir LLM'e ihtiyaç duymuyorsanız
- Tek bir araç çağrısı için agent düğümüne hafif ve deterministik bir alternatif istiyorsanız

Bir LLM'in hangi araçları çağıracağına karar vermesi gerektiğinde veya çok adımlı akıl yürütmeye ihtiyaç duyduğunuzda bunun yerine [Agent düğümünü](./agent-node.md) kullanın.

> MCP Call düğümü, bir agent düğümüne araç olarak **bağlanamaz**.

## Bağlantı Yapılandırması

Düğüm tek bir MCP sunucusuna bağlanır. Bir transport seçin ve ilgili alanları doldurun.

### SSE / Streamable HTTP

| Alan | Açıklama |
|-------|-------------|
| `transport` | `sse` veya `streamable_http` |
| `url` | MCP sunucusunun tam URL'si (örn. `https://mcp.example.com/sse`). DSL ifadelerini destekler. |
| `headers` | HTTP başlıklarının JSON nesnesi (örn. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Bağlantı başına saniye cinsinden zaman aşımı (varsayılan: 30) |

### stdio

| Alan | Açıklama |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Çalıştırılacak yürütülebilir dosya (örn. `npx`) |
| `args` | Argümanların JSON dizisi (örn. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Ortam değişkenlerinin JSON nesnesi (örn. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Bağlantı başına saniye cinsinden zaman aşımı (varsayılan: 30) |

## Araç Seçimi

1. Bağlantı alanlarını doldurun.
2. **Fetch Tools** seçeneğine tıklayın — düğüm MCP sunucusuna bağlanır ve mevcut araçları listeler.
3. Açılır menüden bir araç seçin.

**Araç seçimi zorunludur.** Düğüm, seçili bir araç olmadan yürütülmez.

## Argümanlar

Bir araç seçtikten sonra düğüm, aracın giriş şemasında tanımlanan her argüman için bir giriş alanı oluşturur. Her alan şunları kabul eder:
- Statik bir değer: `10`
- Bir DSL ifadesi: `$userInput.body.text`

Zorunlu argümanlar `*` ile işaretlenir.

## Çıkış

| Alan | Açıklama |
|-------|-------------|
| `$nodeLabel.result` | Araç sonucu. Yanıt geçerli JSON ise bu, ayrıştırılmış bir nesnedir. Aksi takdirde bir dizedir. |

## Örnek

Bir SSE MCP sunucusunda `search` aracını çağırın ve kullanıcının sorgusunu iletin:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Sonuca akışın ilerleyen kısmından erişin:

```
$searchCall.result.items   ← sonuç bir JSON nesnesiyse
$searchCall.result         ← sonuç düz bir dizeyse
```

## Notlar

- Düğüm, aracı çağırmadan önce `url`, `headers`, `env` ve tüm `toolArguments` değerlerindeki DSL ifadelerini çözümler.
- Düğüm düzeyindeki `timeoutSeconds` genel yürütme için geçerlidir; `connection.timeoutSeconds` ise MCP oturumunun kendisi için geçerlidir.
- MCP sunucusu kullanılamıyorsa veya bir hata döndürürse düğüm başarısız olur ve hata mesajı workflow trace'inde kullanılabilir olur.
