# Playwright

**Playwright** düğümü, yapılandırılabilir adımlarla tarayıcı etkileşimlerini otomatikleştirir. Web kazıma, form doldurma ve tarayıcı tabanlı iş akışları için kullanın.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.results`, `$nodeLabel.screenshot` ve isteğe bağlı ağ/tarayıcı verileri |

## Parametreler

| Parametre | Tür | Açıklama |
|-----------|------|-------------|
| `playwrightMode` | string | `"steps"` (varsayılan) veya `"code"` (Kod Çalıştır). Özellikler Paneli Mod açılır menüsünden seçin |
| `playwrightSteps` | array | Adımlar: navigate, click, type, aiStep vb. Her adımda action ve selector/params bulunur. `disabled: true` bir adımı listede tutar ancak çalışma zamanında atlar |
| `playwrightCode` | string | Mod Kod Çalıştır olduğunda kullanılan özel Playwright Python kodu. Sıkılaştırılmış sandbox'ta çalışır ve **varsayılan olarak devre dışıdır** — aşağıdaki güvenlik notuna bakın |
| `playwrightHeadless` | boolean | Headless çalıştır (varsayılan: true) |
| `playwrightStealth` | boolean | Yaygın Playwright otomasyon sinyallerini azaltan, isteğe bağlı Steps modu ayarı (varsayılan: false). Özellikler Paneli etiketi: Otomasyon bayraklarını azalt |
| `playwrightTimeout` | number | Milisaniye cinsinden zaman aşımı (varsayılan: 30000) |
| `playwrightCaptureNetwork` | boolean | JSON yanıtlarını, başlıkları, çerezleri ve tarayıcı depolamasını yakala |
| `playwrightAuthEnabled` | boolean | Adımları çalıştırmadan önce tarayıcı kimlik doğrulamasını çerezlerden/storageState'ten geri yükle |
| `playwrightAuthStateExpression` | string | Playwright `storageState` veya ham `cookies[]` değerine çözümlenen ifade ya da JSON |
| `playwrightAuthCheckSelector` | string | Kimlik doğrulama başlatma sonrasında görünür olması gereken seçici |
| `playwrightAuthCheckTimeout` | number | Kimliği doğrulanmış seçici kontrolü için milisaniye cinsinden zaman aşımı (varsayılan: 5000) |
| `playwrightAuthFallbackSteps` | array | Çerez geri yükleme sayfayı doğrulamadığında çalıştırılacak yalnızca giriş amaçlı yedek adımlar |

## Adım Türleri

- **navigate** – URL'ye git
- **refresh** – Geçerli sayfayı yeniden yükle (yeniden yükleme navigasyonu için isteğe bağlı adım `timeout` milisaniye cinsinden)
- **click** – Seçiciye göre öğeye tıkla
- **type** – Girişe metin yaz (karakter karakter)
- **fill** – Giriş değerini doldur
- **wait** – Zaman aşımı bekle (ms)
- **screenshot** – Ekran görüntüsü al (`outputKey` base64'ü results içinde saklar)
- **getText** – Bir öğenin metin içeriği (`selector`, isteğe bağlı `outputKey`)
- **getAttribute** – Öznitelik değeri (`selector`, `attribute`, isteğe bağlı `outputKey`)
- **getHTML** – Bir öğenin dış HTML'i (`selector`, isteğe bağlı `outputKey`)
- **getVisibleTextOnPage** – `document.body.innerText` olarak tam sayfa görünür metni (seçici yok; `outputKey` kullanın; isteğe bağlı adım `timeout` milisaniye cinsinden yakalamadan önce bekler)
- **hover** – Öğenin üzerine gel
- **selectOption** – Bir `<select>` içinde seçenek seç
- **scrollDown** / **scrollUp** – Fare tekerleği kaydırma (isteğe bağlı `amount` piksel cinsinden)
- **aiStep** – LLM, manuel adımlarla aynı türde eylemleri döndürür (aşağıya bakın); iç içe `aiStep` desteklenmez

## Bir Adımı Devre Dışı Bırakma

Her adımın başlığında bir güç düğmesi bulunur. Kapatılan bir adım, başlığı üstü çizili ve soluk olarak gösterilir, tüm alanlarıyla listede kalır ve düğüm çalıştığında atlanır — bu, çalışmanızı silmeden başarısız bir seçiciyi izole etmek için kullanışlıdır. Saklanan adım `disabled: true` taşır; bu bayrağı olmayan adımlar normal şekilde çalışır.

Devre dışı bırakılan adımlar düğümün geri kalanı için görünmezdir: kimlik doğrulama başlatmanın "ilk adım `navigate` olmalıdır" kuralını karşılamazlar, devre dışı bir `aiStep` LLM çağrısı yapmaz ve `playwrightAuthFallbackSteps` içindeki devre dışı girdiler de atlanır. Tüm adımların kapatılması, çalışmayı bir adımı etkinleştirmenizi isteyen bir mesajla başarısız kılar.

## AI Adımı

**aiStep** eylemi, sayfa HTML'ini (ve isteğe bağlı olarak bir ekran görüntüsünü) analiz etmek ve doğal dil talimatlarından Playwright eylemleri üretmek için bir LLM kullanır. API, manuel adımlarla aynı eylem adlarını kabul eder (`navigate`, `refresh`, `getText`, `getHTML`, `getAttribute`, `getVisibleTextOnPage`, `screenshot`, kaydırmalar vb. dahil). **Otomatik onarım** yalnızca başarısız seçici tabanlı adımları click, type, fill, hover ve selectOption için alternatiflerle değiştirir.

| Seçenek | Açıklama |
|--------|-------------|
| `instructions` | AI'nın ne yapması gerektiği (örn. "Giriş düğmesine tıkla") |
| `credentialId` | LLM kimlik bilgisi (OpenAI, Google veya Özel) |
| `model` | Seçili LLM kimlik bilgisinden aranabilir model listesi |
| `saveStepsForFuture` | Üretilen adımları sonraki çalıştırmalar için önbelleğe al (LLM çağrısını önler) |
| `sendScreenshot` | Görsel öğeler için LLM'e ekran görüntüsü gönder |
| `aiStepTimeout` | LLM çağrısı için milisaniye cinsinden zaman aşımı (varsayılan 30000) |

### AI Otomatik Onarım

**AI Otomatik Onarım**, iş akışlarını DOM değişikliklerine karşı dayanıklı hale getirir. Bir seçici iki kez başarısız olduğunda (örn. bir site yeniden tasarlandıktan sonra), Heym alternatif bir konumlandırıcı bulmak için LLM'i çağırır — genellikle CSS seçicileri yerine `role=button[name='Submit']` veya `text=Exact text`.

AI adımı özelliklerinde **Otomatik onarım modu**nu etkinleştirin. Kaydedilen adım başarısız olursa:

1. Heym geçerli HTML'i ve ekran görüntüsünü yakalar
2. Başarısız adımı + sayfa bağlamını LLM'e gönderir
3. LLM sağlam bir alternatif döndürür (role tabanlı konumlandırıcı, metin konumlandırıcı veya yedek CSS)
4. Yeni seçiciyle yeniden dener

Bu, siteler işaretlemelerini veya sınıf adlarını güncellediğinde kararsızlığı azaltır.
## Otomasyon bayraklarını azaltma

Bir site, standart otomasyon sinyalleri nedeniyle (user agent içindeki `HeadlessChrome`, `navigator.webdriver`, eksik `window.chrome`) Playwright'ın paketlenmiş Chromium'unu bot olarak algıladığında **Otomasyon bayraklarını azalt** (`playwrightStealth: true`) seçeneğini etkinleştirin.

Bu seçenek yalnızca **Adımlar** modunda geçerlidir. Şunları yapar:

- Chromium'un `--enable-automation` bayrağını kaldırır ve `--disable-blink-features=AutomationControlled` ayarını yapar
- Standart bir Chrome user agent gönderir (`HeadlessChrome` olmadan)
- Playwright'ın boş bıraktığı yaygın tarayıcı yüzeylerini geri yükler (`window.chrome`, eklentiler)
- Bir GPU mevcut olduğunda (yerel macOS/Windows) ana makinenin GPU oluşturucusunu değiştirmeden bırakır. Linux/Docker'da GPU yoktur; Chromium'un yazılım oluşturucu dizesi SwiftShader yerine tipik bir Mali (ARM) veya Mesa (x86) GPU olarak bildirilir.

Bu seçenek, oturumun Chrome DevTools Protocol üzerinden yönetildiğini gizlemez ve site güvenliğini, CAPTCHA'ları veya erişim kontrollerini atlatmanın bir yolu değildir. Bunu, çalıştırma yetkiniz olan workflow'lar için kullanın — dahili araçlar, kendi siteleriniz ve izin verilen tarayıcı otomasyonu.

Run Code modu değişmez — özel script'ler Chromium'u kendileri başlatır.

## Ağ Yakalama

Çalıştırma sırasında ek hata ayıklama verisi toplamak için `playwrightCaptureNetwork` seçeneğini etkinleştirin:

- `networkRequests` – Yakalanan JSON/API yanıtları
- `cookies` – Çalıştırmanın sonundaki tarayıcı cookie'leri
- `localStorage` – Tarayıcı `localStorage` anahtar-değer çiftleri
- `sessionStorage` – Tarayıcı `sessionStorage` anahtar-değer çiftleri

Bu, otomatik bir akıştan sonra gizli API çağrılarını, kimlik doğrulama durumunu veya tarayıcı tarafındaki verileri incelemeniz gerektiğinde kullanışlıdır.

## Cookie Başlatma Ve Giriş Yedekleme

Playwright'ın zaten oturum açılmış bir sayfayı açmasını istediğinizde `playwrightAuthEnabled` seçeneğini etkinleştirin.

### Kimlik Doğrulama Durumu Kaynağı

`playwrightAuthStateExpression` değerini `$global.authState` gibi bir ifadeye ayarlayın. Değer şunlardan biri olabilir:

- Bir Playwright `storageState` nesnesi: `{"cookies": [...], "origins": [...]}`
- Ham bir `cookies[]` dizisi
- Her iki biçimi de içeren bir JSON dizesi

Önerilen desen:

1. Ağ yakalama veya kimlik doğrulama başlatma etkinleştirilmiş bir Playwright düğümü çalıştırın
2. `$playwrightNode.cookies` değerini veya tam bir kimlik doğrulama durumu nesnesini bir [Global Değişken](../reference/global-variables.md) içinde saklayın
3. Bu değişkeni sonraki Playwright düğümlerinde `$global.authState` aracılığıyla yeniden kullanın

### Kimlik Doğrulama Kontrolü

İlk ana Playwright adımı `navigate` olmalıdır. Bu adım yüklendikten sonra Heym, `playwrightAuthCheckSelector` seçicisini kontrol eder.

- Seçici görünürse, kalan ana adımlar normal şekilde devam eder
- Seçici yoksa, Heym `playwrightAuthFallbackSteps` adımlarını çalıştırır
- Yedekleme adımları tamamlandıktan sonra Heym aynı seçiciyi tekrar kontrol eder
- Seçici hâlâ yoksa, düğüm bir kimlik doğrulama başlatma hatasıyla başarısız olur

Yedekleme adımları, kimlik doğrulama hatasından sonraki navigasyonun sahibidir. Tarayıcıyı, ana akışın geri kalanının beklediği kimliği doğrulanmış sayfada bırakmalıdırlar.

## Çıktı Alanları

- `$playwrightNode.status` – Başarı durumunda `"ok"`
- `$playwrightNode.results` – Adım çıktıları (getText, getHTML, getVisibleTextOnPage, getAttribute, screenshot anahtarları vb.)
- `$playwrightNode.screenshot` – Bir adım kaydettiğinde Base64 screenshot
- `$playwrightNode.cookies` – Kimlik doğrulama başlatma veya ağ yakalama etkinleştirildiğinde son tarayıcı cookie'leri
- `$playwrightNode.networkRequests` – Yakalanan ağ yanıtları (etkinleştirildiğinde)
- `$playwrightNode.localStorage` – Tarayıcı yerel depolaması (etkinleştirildiğinde)
- `$playwrightNode.sessionStorage` – Tarayıcı oturum depolaması (etkinleştirildiğinde)

## Örnek

```json
{
  "type": "playwright",
  "data": {
    "label": "browserAutomation",
    "playwrightSteps": [
      { "action": "navigate", "url": "$userInput.body.url" },
      { "action": "type", "selector": "#search", "text": "query" },
      { "action": "click", "selector": "button[type=submit]" }
    ],
    "playwrightHeadless": true
  }
}
```

## Run Code modu

Özellikler Panelinde, görsel adımlar yerine `playwrightCode` düzenlemek için **Mod** seçeneğini **Run Code** olarak ayarlayın. Kimlik doğrulama başlatma yalnızca Adımlar modu için geçerlidir.

Örnek (sandbox / Docker — Chromium'un `--no-sandbox` seçeneğine ihtiyacı vardır):

```python
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=headless,
        args=["--no-sandbox", "--force-webrtc-ip-handling-policy=disable_non_proxied_udp"],
    )
    page = browser.new_page()
    page.set_default_timeout(timeout_ms)
    page.goto("https://example.com")
    title = page.title()
    browser.close()
    print(json.dumps({"status": "ok", "results": {"title": title}}))
```

Sarmalayıcı `inputs`, `headless`, `timeout_ms` ve `capture_network` sağlar. Kod içine `$nodeLabel.field` ifadelerini gömebilirsiniz; `status` ve `results` içeren JSON yazdırın.
## Özel kod güvenliği

`playwrightCode` alanı rastgele Python kodu çalıştırır. Bu, kod yürütmeye eşdeğer olduğundan **varsayılan olarak devre dışıdır** ve etkinleştirildiğinde sandbox ortamında çalıştırılır:

- **Varsayılan olarak devre dışıdır.** `playwrightCode` ayarlanmış bir düğümün yürütülmesi, bir operatör `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` olarak ayarlamadığı sürece açık bir hata ile başarısız olur. Bu kontrol yürütme anında çalıştığından, daha önce kaydedilmiş workflow'ları ve zamanlanmış / alt workflow çalıştırmalarını da kapsar.
- **Etkinleştirildiğinde izole edilir.** Özel kod backend sürecinde çalışmaz. Docker soketi olmayan, backend bind mount'ları bulunmayan, ortamında backend sırları barındırmayan, yetkileri düşürülmüş, `no-new-privileges` uygulanmış ve CPU / bellek / PID limitleri tanımlanmış, sıkılaştırılmış, geçici bir kardeş container içinde çalışır. Docker kullanılamıyorsa çalıştırma güvenli biçimde (fail closed) başarısız olur. `HEYM_PLAYWRIGHT_SANDBOX=subprocess` seçeneği, yalnızca güvenilen veya yerel geliştirme kullanımı için süreç içi yola geri dönüş sağlar (bir güvenlik sınırı değildir). Yerel `./run.sh`, `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` ayarlanmadığında varsayılan olarak `subprocess` kullanır. `./deploy.sh` (Compose) ve GHCR tek imajı, kardeş runner'ı `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` üzerinden çözümler (`HEYM_CODEX_DOCKER_IMAGE` değerine geri dönerek) ve eşleşen venv yolunu (`/app/.venv` ile `/app/backend/.venv`) kullanır.
- **Chromium notu.** Sandbox container varsayılan olarak root kullanıcısıyla çalışır ve Chromium, `--no-sandbox` olmadan root olarak çalışmayı reddeder. Chromium başlatan özel kod bu bayrağı iletmelidir; örneğin `browser = p.chromium.launch(headless=True, args=["--no-sandbox"])`. Adım tabanlı (ve stealth) başlatmalar ayrıca `--force-webrtc-ip-handling-policy=disable_non_proxied_udp` bayrağını iletir; böylece fingerprint script'leri `stun.l.google.com:19302` adresine STUN UDP bağlantısı açamaz. Özel `chromium.launch` çağrıları da bu bayrağı içermelidir.

Adım tabanlı Playwright düğümleri (`playwrightSteps`) tamamen Heym tarafından üretilir (rastgele kod içermez), yukarıdakilerin hiçbirinden etkilenmez ve her zaman kullanılabilir — bunları tercih edin.

## İlgili

- [Düğüm Türleri](../reference/node-types.md) – Tüm düğüm türlerine genel bakış
- [Crawler Düğümü](./crawler-node.md) – FlareSolverr ile daha basit web kazıma
- [Credential Paylaşımı](../reference/credentials-sharing.md) – AI adımları için LLM credential'ları
