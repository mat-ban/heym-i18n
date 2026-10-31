# A2A

Heym, **Heym Agent**'ı Agent2Agent protokolü (A2A 1.0, JSON-RPC bağlaması) üzerinden sunar. Heym Agent, [Chat sekmesi](../tabs/chat-tab.md) arkasındaki motordur; MCP istemcileri aynı ajana `heym_chat` aracı olarak erişir (bkz. [MCP / A2A sekmesi](../tabs/mcp-tab.md)). A2A açıkken, başka bir ajan ona doğal dilde bir Task gönderebilir ve Chat'in sahip olduğu tüm yeteneklerle yanıt alabilir.

## Etkinleştirme

1. **MCP / A2A** sekmesini açın.
2. Varsayılan sunucuda veya adlandırılmış bir sunucuda **Heym Agent**'ı açın ve kimlik bilgisi ile modelini seçin.
3. **A2A'yı Etkinleştir** seçeneğini işaretleyin. Kart, **Agent Card** URL'sini ve **JSON-RPC Endpoint** adresini görüntüler.

A2A doğrudan Heym Agent üzerinde çalışır: ajanın kapatılması A2A'yı da kapatır.

## Endpoints

| | Varsayılan sunucu | Adlandırılmış sunucu |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card hiçbir kimlik bilgisi gerektirmez ve hiçbir kullanıcı, sunucu veya Workflow adı belirtmez. Yalnızca A2A açıkken mevcuttur: varsayılan sunucu için en az bir kullanıcıda A2A açık olduğu sürece etki alanı kartı; adlandırılmış bir sunucunun A2A'sı açık olduğu sürece o sunucunun kartı bulunur. Aksi takdirde adres 404 yanıtı verir.

## Kimlik Doğrulama

MCP ile aynı kimlik bilgilerini yalnızca başlıklarda gönderin:

- `X-MCP-Key: <key>`: varsayılan sunucunun anahtarı veya adlandırılmış sunucunun anahtarı
- `Authorization: Bearer <token>`: Heym'in OAuth sunucusundan alınan bir OAuth Token

URL içindeki kimlik bilgileri reddedilir. Agent Card her iki şemayı da bildirir, böylece bir A2A istemcisi bunları karttan okuyabilir.

## Yöntemler

| Yöntem | Ne yapar |
|---|---|
| `SendMessage` | Bir Task başlatır veya girdi bekleyen bir görevi sürdürür. `configuration.returnImmediately` değeri `true` olmadığı sürece yanıtı bekler. |
| `SendStreamingMessage` | Aynısı, görevin ilerlemesini ve sonucunu aktaran bir Server-Sent Events akışı olarak. |
| `GetTask` | Bir görevin durumu, yanıtı ve geçmişi (`historyLength` geçmişi sınırlar). |
| `ListTasks` | Bu sunucudaki görevleriniz, en yeniden başlayarak, `contextId` veya `status` ile filtrelenmiş, `pageSize` ve `pageToken` ile. |
| `CancelTask` | Hâlâ çalışmakta olan veya bekleyen bir Task'ı durdurur. |
| `SubscribeToTask` | Hâlâ çalışmakta olan bir görevi takip eder. |
| `GetExtendedAgentCard` | Sunucunun adını ve atanmış Workflows akışlarını beceri olarak içeren kart. |

Anlık bildirimler (push notifications) sunulmaz: kart `pushNotifications: false` belirtir ve push yöntemleri `PushNotificationNotSupportedError` ile yanıt verir. İstekler A2A 1.0 kullanır; `A2A-Version: 1.0` başlığını gönderin. `message/send` gibi A2A 0.3 yöntem adları `VersionNotSupportedError` yanıtı verir.

## Tasks ve konuşmalar

Her Task, Chat sekmesinde bir ağ simgesiyle işaretlenmiş bir konuşmadır. Görevin `contextId` değeri bu konuşmadır: devam etmek için aynı `contextId` ile ve `taskId` olmadan yeni bir mesaj gönderin.

| Ajanın yaptığı işlem | Task durumu |
|---|---|
| Yanıtladı | `TASK_STATE_COMPLETED`, metin olarak yanıt ve kaydedilmişse Workflows ile değerlendirme paketlerine ait bağlantılar veri olarak |
| Açıklayıcı bir soru sordu | `TASK_STATE_INPUT_REQUIRED`: aynı `taskId` ile yanıt verin |
| Kimlik bilgisi gerekiyor | `TASK_STATE_AUTH_REQUIRED`: durum iletisi Heym'in kimlik bilgileri sayfasına bir bağlantı içerir. Kullanıcı bunu Heym'de oturum açmış bir tarayıcıda açar; değer hiçbir zaman diğer ajanın üzerinden geçmez. Ardından devam etmek için aynı Task üzerinde bir mesaj gönderin. |
| Başarısız oldu | `TASK_STATE_FAILED`, nedeni ile birlikte |
| İptal edildi | `TASK_STATE_CANCELED` |

Tamamlanmış veya hâlâ çalışmakta olan bir göreve gönderilen mesaj `UnsupportedOperationError` ile reddedilir. Mesajlar, toplamda 20.000 karaktere kadar `text` ve `data` bölümlerini kabul eder; dosya bölümleri reddedilir, bu nedenle dosyaları bağlantı olarak gönderin.

## İlerleme

Bir Task çalışırken akış, her adım için Chat sekmesinde görüntülenen ifadelerle bir durum güncellemesi gönderir; örneğin `Running workflow "Invoice Parser"` veya `Testing the workflow · attempt 2/5`. MCP istemcileri aynı adımları `heym_chat` üzerinden `notifications/progress` olarak alır.

## Örnek

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Sınırlar

- `CancelTask`, tıpkı Chat sekmesindeki Durdur düğmesi gibi, çalışan bir turu onu çalıştıran Heym örneğinde hemen durdurur. Başka yerlerde görev iptal edildi olarak işaretlenir ve turun geç sonucu kaydedilmez.
- Anlık bildirim yok, REST veya gRPC bağlaması yok, imzalı Agent Cards yok.

## İlgili

- [MCP / A2A sekmesi](../tabs/mcp-tab.md): Heym Agent ve A2A'yı açın
- [Chat sekmesi](../tabs/chat-tab.md): ajanın arkasındaki motor
- [Güvenlik](./security.md): anahtarların nasıl saklandığı
