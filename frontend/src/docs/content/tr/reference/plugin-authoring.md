# Plugin Geliştirme

Heym pluginleri, bir operatör tarafından yüklenen güvenilir zip paketleridir. Bir paket, çekirdek uygulamayı değiştirmeden bir veya daha fazla özel action veya trigger düğümü ekleyebilir.

## Paket Düzeni

Bir plugin zip'i, paket kökünde `plugin.json` ve `entry` ile adlandırılan Python giriş dosyasını (varsayılan olarak `handler.py`) içermelidir.

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` isteğe bağlıdır ve pluginin dokümantasyon sayfası olarak sunulur. Varsayılan düğüm simgesi için paket köküne bir `icon.svg` yerleştirin veya `plugin.json` içinde düğüme özel bir `icon` yolu ayarlayın.

## Manifest

Bir paket birden fazla düğüm sunduğunda çok düğümlü bir `plugin.json` kullanın:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Eski tek düğümlü manifestler de kabul edilir: `nodes` alanını atlayın ve üst düzey `kind`, `fields`, `dslHint` ve `docSlug` alanlarını sağlayın.

## Manifest Alanları

| Alan | Notlar |
|-------|-------|
| `id` | Harf, sayı ve tire kullanan küçük harfli paket kimliği. |
| `name` | İnsan tarafından okunabilir paket adı. |
| `version` | Görüntüleme ve handler önbellekleme için kullanılan paket sürümü. |
| `description` | UI'da ve asistan bağlamında gösterilen kısa açıklama. |
| `entry` | Zip içindeki Python handler dosya yolu; varsayılan olarak `handler.py`. |
| `dependencies` | `uv pip install` ile yüklenen isteğe bağlı pip gereksinimleri. |
| `nodes` | Bu paket tarafından sunulan özel düğümler. |

Her düğüm benzersiz bir `key`, bir `name` ve `action` ya da `trigger` değerlerinden biri olan bir `kind` gerektirir. `function` atlanırsa, action'lar `run` ve trigger'lar `trigger` çağırır.

Desteklenen alan türleri `string`, `number`, `boolean` ve `select`'tir. Select alanları, `{ "label": "...", "value": "..." }` nesnelerinden oluşan bir `options` dizisi kullanır. Zorunlu alanlar için `required` ve maskelenmiş girdiler için `secret` ayarlayın. Manifest ayrıca alanlar için `default`, `dynamic` ve `expression` meta verilerini kabul eder; bunlar manifest ile birlikte saklanır, ancak plugin düğümleri şu anda varsayılanlardan eksik config'i otomatik doldurmak yerine çalışma zamanında kaydedilmiş düğüm config'ini okur.

Gizli olmayan string alanları, expression giriş UI'ı ile oluşturulur. Çalışma zamanında, `$` ile başlayan kaydedilmiş herhangi bir string config değeri, handler çağrılmadan önce çözümlenir.

## Handler Fonksiyonları

Action handler'ları workflow girdilerini, çözümlenmiş config'i ve küçük bir bağlamı alır:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Trigger handler'ları çözümlenmiş config'i ve bağlamı alır:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Adlandırılmış çıktı alanlarını sunmak için bir sözlük döndürün. Bir handler başka bir tür döndürürse, Heym bunu `{ "value": result }` olarak sarar.

## Kurulum ve Çalışma Zamanı

Pluginler varsayılan olarak devre dışıdır. Operatörler bunları `HEYM_PLUGINS_ENABLED=true` ile etkinleştirir ve yönetimi `HEYM_PLUGIN_ADMIN_EMAILS` ile kısıtlar. Yüklenen plugin dosyaları `HEYM_PLUGINS_DIR` altında bulunur ve container dağıtımlarında kalıcı olarak bağlanmalıdır.

Plugin kodu, backend ile aynı süreçte çalışan güvenilir, operatör tarafından yüklenmiş Python'dur. Ağa ve yüklü kütüphanelere erişebilir, bu nedenle yalnızca Heym'in kendisiyle aynı güven düzeyinde çalıştırmaya razı olduğunuz paketleri yükleyin.
