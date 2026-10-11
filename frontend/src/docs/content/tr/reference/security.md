# Güvenlik

Heym platformu için güvenlik uygulamaları ve yapılandırması.

## Parola Politikası

Tüm parolalar — kayıt sırasında ve parolanızı değiştirirken — aşağıdaki gereksinimleri karşılamalıdır:

| Kural | Gereksinim |
|------|-------------|
| Minimum uzunluk | 8 karakter |
| Büyük harf | En az bir büyük harf (A–Z) |
| Küçük harf | En az bir küçük harf (a–z) |
| Rakam | En az bir sayı (0–9) |

Bu kurallar hem frontend hem de backend (Pydantic validator) tarafında uygulanır. Uyumlu olmayan bir parola içeren istek, herhangi bir veritabanı yazımı gerçekleşmeden önce `422 Unprocessable Entity` yanıtıyla reddedilir.

**Geçerli bir parola örneği:** `MyWorkflow7!`

## Oturum Yönetimi

- Access token'lar `localStorage` yerine **HttpOnly** cookie'lerde saklanır. Bu, JavaScript'in (XSS payload'ları dahil) token'ı okumasını engeller.
- Refresh token yalnızca `/api/auth/refresh` yoluna kapsamlandırılmıştır ve diğer endpoint'lere gönderilemez.
- Her `/api/auth/refresh` çağrısı refresh token'ı **rotasyona** sokar: eski token derhal iptal edilir ve yeni bir token verilir. Kullanılmış bir refresh token'ın tekrar oynatılması `401` döndürür.

## Hız Sınırlama

Aşağıdaki endpoint'ler IP başına hız sınırlamasına tabidir:

| Endpoint | Sınır | Ban süresi |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 istek / 60 sn | 15 dk |
| `POST /api/auth/register` | 5 istek / 60 sn | 10 dk |
| `POST /register` (OAuth istemcileri) | 5 istek / 60 sn | 10 dk |
| Portal girişi | 3 deneme | 24 sa |

`REDIS_URL` yapılandırıldığında, hız sınırları tüm backend worker'ları arasında paylaşılır. Yapılandırılmadığında, sınırlar worker process başına uygulanır.

## Kimlik Bilgisi Şifreleme

[Credentials](../tabs/credentials-tab.md) panelinde saklanan tüm API anahtarları, webhook URL'leri ve bearer token'lar, veritabanına yazılmadan önce AES-256 (Fernet) kullanılarak bekleme durumunda şifrelenir. Anahtar, `ENCRYPTION_KEY` ortam değişkeninden türetilir. `run.sh` ve `deploy.sh` betikleri, boş olduğunda otomatik olarak güçlü bir değer üretir; `ENCRYPTION_KEY` boşsa veya bilinen bir yer tutucu değerde bırakılmışsa uygulama başlamayı reddeder.

## MCP API Key

MCP API key, `/api/mcp/sse` endpoint'ine bağlanan harici MCP istemcilerinin kimliğini doğrulamak için kullanılır. SSE bağlantısı kurulduğunda, gerçek API key yerine mesaj endpoint URL'sine gömülü kısa ömürlü (1 saatlik) bir oturum token'ı verilir; bu, anahtarın sunucu erişim günlüklerinde görünmesini engeller. Kurulum için [MCP Tab](../tabs/mcp-tab.md) bölümüne bakın.

## OAuth / PKCE

OAuth 2.0 yetkilendirme sunucusu (MCP istemcileri için kullanılır) yalnızca PKCE (`S256`) ile `authorization_code` grant'ını destekler. Onay formu, 10 dakika geçerli HMAC-SHA256 CSRF token'ları kullanır. Onay sayfasında görüntülenen tüm değerler HTML-escape edilir.

## Execution Token'ları

[Execution token'ları](./execution-tokens.md), harici sistemlerden bir workflow'un execute endpoint'ini çağırmak için kapsamlandırılmış JWT'lerdir. Kullanıcı oturum token'larından farklı olarak:

- **Tek workflow kapsamlıdır** — bir token başka herhangi bir workflow için reddedilir.
- **Bağımsız olarak iptal edilebilir** — bir token'ın iptal edilmesi, onu veren kullanıcının oturumu üzerinde hiçbir etki yaratmaz.
- **Kısa veya uzun ömürlüdür** — 60 saniyeden 10 yıla kadar bir TTL seçin.

Token'lar aynı uygulama sırrıyla (`SECRET_KEY`) imzalanır ve her istekte kontrol edilir: imza, son kullanma tarihi, `wid` claim eşleşmesi ve iptal durumu. Kurulum ve API referansı için [Execution Tokens](./execution-tokens.md) bölümüne bakın.

## İçerik Güvenliği

LLM ve Agent node'larında, güvenli olmayan veya politikaya aykırı kullanıcı mesajlarını modele ulaşmadan önce engellemek için [Guardrails](./guardrails.md) kullanın. Guardrails, yapılandırılabilir hassasiyet seviyeleriyle dokuz içerik kategorisini (şiddet, nefret söylemi, cinsel içerik vb.) destekler.

## Python Tool Sandbox

[Agent node](../nodes/agent-node.md) üzerindeki kullanıcı tanımlı Python tool'ları güvenilmeyen kod çalıştırır. Varsayılan olarak Heym, her tool'u aşağıdaki özelliklere sahip sıkılaştırılmış, tek kullanımlık bir Docker container'ı içinde çalıştırır:

- ağ erişimi yok,
- küçük bir `tmpfs` çalışma dizini ile salt okunur kök dosya sistemi,
- tüm Linux yetenekleri düşürülmüş ve `no-new-privileges` ayarlanmış root olmayan kullanıcı,
- katı CPU, bellek ve PID sınırları ve
- **Docker socket** bağlanmaz, böylece bir tool host Docker daemon'a erişemez.

Çalıştırma backend'i `HEYM_PYTHON_TOOL_SANDBOX` ortam değişkeni tarafından kontrol edilir:

| Değer | Davranış |
|-------|----------|
| `auto` (varsayılan) | Sıkılaştırılmış Docker container'ında çalıştırır. Docker kullanılamıyorsa, çalıştırma **fail closed** olur — güvenilmeyen kodu işletim sistemi izolasyonu olmadan sessizce çalıştırmaz. |
| `docker` | `auto` ile aynıdır, ancak asla geri dönüş yapmaz. |
| `subprocess` | Bir import allowlist ile korunan yerel, process içi bir subprocess'te çalıştırır. Bu **bir güvenlik sınırı değildir** ve yalnızca güvenilir kod veya yerel geliştirme için tasarlanmıştır. `run.sh` bunu native geliştirme için seçer. |

Sandbox image'ını sabitlemek için `HEYM_PYTHON_TOOL_IMAGE` değişkenini ayarlayın; boş olduğunda Heym çalışan backend image'ını otomatik olarak algılar. Process içi kısıtlamalar (bir import allowlist ile attribute ve introspection filtreleme) derinlemesine savunma olarak uygulanır, ancak gerçek izolasyon sınırı container'dır — çok kullanıcılı ve üretim dağıtımları için varsayılan `auto` (veya `docker`) modunu koruyun.

## Skill Sandbox

Bir [Agent node](../nodes/agent-node.md) düğümüne eklenen Python skill'leri de güvenilmeyen kod çalıştırır — bir skill paylaşılan bir workflow içinde veya `everyone` görünürlüğündeki bir template içinde olduğu gibi gelebilir — bu nedenle skill'ler Python tool'larıyla **aynı** `HEYM_PYTHON_TOOL_SANDBOX` anahtarı üzerinden çalışır ve aynı şekilde fail closed davranır. Skill container'ı da birebir aynı şekilde sertleştirilmiştir (non-root, tüm yetenekler kaldırılmış, `no-new-privileges`, salt okunur root dosya sistemi, CPU/bellek/PID limitleri ve **Docker socket yok**), ancak skill'lerin meşru olarak ihtiyaç duyması nedeniyle iki kasıtlı farkla:

- **Ağ çıkışına izin verilir** (skill'ler API'leri çağırır ve `uv` aracılığıyla kendi bağımlılıklarını kurar) ve
- **yazılabilir bir workspace bağlanır**, böylece skill'ler çıktı dosyaları üretebilir ve Heym Drive dosyalarını okuyabilir.

Workspace, Codex runner'ın kullandığı aynı adlandırılmış Docker volume'ü (`heym-codex-workspaces`, `/app/data/codex-workspaces` konumuna bağlanır) üzerinden tek kullanımlık kardeş container ile paylaşılır. Kardeş container'a yalnızca bu çalıştırmaya ait alt dizin bağlanır — çalıştırma başına bir `volume-subpath` aracılığıyla — böylece bir skill hiçbir zaman başka bir çalıştırmanın veya Codex'in workspace verisini görmez. Docker Compose stack'i bu volume'ü her zaman bağlar; tek container'lı `docker run` komutu, Codex'in yanı sıra Python skill'leri için de `-v heym-codex-workspaces:/app/data/codex-workspaces` içermelidir. `auto`/`docker` modunda volume eksikse, skill yürütmesi backend'de çalışmak yerine **fail closed** davranır. Çalıştırma başına subpath bağlamaları **Docker Engine 25.0 veya daha yenisini** gerektirdiğinden, eski engine'ler ya yükseltme yapmalı ya da güvenilir skill'leri `HEYM_PYTHON_TOOL_SANDBOX=subprocess` ile çalıştırmalıdır.

Container'a yalnızca gizli olmayan, taşınabilir ortam değişkenleri (proxy ve CA-bundle ayarları, locale) aktarılır; veritabanı URL'leri, `SECRET_KEY`/`ENCRYPTION_KEY`, sağlayıcı API anahtarları ve OAuth sırları bir allowlist tarafından engellenir. Skill dosya yollarının workspace içinde kalması doğrulanır ve çıktı dizinine yerleştirilen symlink'ler (`_hitl_request.json` sentinel'i dahil) hiçbir zaman takip edilmez. Gerekirse varsayılanları `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` ve `HEYM_SKILL_USER` ile geçersiz kılın.

Tool'larda olduğu gibi, `subprocess` modu skill'i backend sürecinde çalıştırır ve **bir güvenlik sınırı değildir** — yalnızca güvenilir tek kullanıcılı veya yerel geliştirme için kullanın (`run.sh` bunu native geliştirme için seçer).

## Code Node Sandbox

[Code node](../nodes/code-node.md), rastgele kullanıcı Python kodunu rastgele üçüncü taraf bağımlılıklarla birlikte çalıştırır; bu nedenle üç sandbox arasında en katı olanıdır ve **kaçış kapısı olmayan** tek sandbox'tır: hiçbir sandbox-mode değişkenini okumaz, `subprocess` modu yoktur ve erişilebilir bir Docker daemon olmadığında fail closed davranır. Hiçbir zaman kullanıcı kodunu backend sürecinde çalıştırmaya geri dönmez.

Yürütme, her ikisi de tool ve skill sandbox'ları gibi sertleştirilmiş (non-root, tüm yetenekler kaldırılmış, `no-new-privileges`, salt okunur root dosya sistemi, CPU/bellek/PID limitleri ve **Docker socket yok**) bir veya iki tek kullanımlık container'dır:

- Boş bir `requirements.txt` ile, **`--network none` kullanan tek bir container** kodu çalıştırır. Runner container'ın stdin payload'ı içinde gelir, bu nedenle hiçbir şey bağlanmaz.
- Bağımlılıklar mevcut olduğunda, ilk container bunları ağ erişimiyle çalıştırma başına bir `.deps` dizinine kurar ve ikinci container bu alt ağacı **salt okunur** olarak bağlar ve kodu çalıştırır. Yürütme container'ının, düğümün `codeAllowNetwork` seçeneği açılmadığı sürece ağı yoktur.

Bağımlılıklar `uv` ile kurulur, `pip` ile yeniden denenir ve çalıştırmalar arasında hiçbir zaman önbelleğe alınmaz. Backend bir container içinde çalıştığında, çalıştırma başına dizin skill sandbox'ının kullandığı aynı `heym-codex-workspaces` volume'ü üzerinde bulunur ve çalıştırma başına bir `volume-subpath` aracılığıyla bağlanır, böylece bir çalıştırma hiçbir zaman başka birinin dosyalarını görmez; bu biçim **Docker Engine 25.0 veya daha yenisini** gerektirir. Native bir backend'in (`./run.sh`) böyle bir volume'ü yoktur ve buna ihtiyaç da duymaz — çalıştırma başına dizini doğrudan kardeş container'a bind-mount edilen yerel bir geçici yoldur. Her iki durumda da dizin, sonuç ne olursa olsun her yürütmeden sonra silinir.

Container'lara yalnızca gizli olmayan, taşınabilir ortam değişkenleri aktarılır — proxy ayarları, CA bundle'ları ve locale; bağımlılık kurulumunun kurumsal bir proxy arkasında PyPI'ye ulaşması için bunlara ihtiyaç vardır. Veritabanı URL'leri, `SECRET_KEY`/`ENCRYPTION_KEY`, sağlayıcı API anahtarları ve OAuth sırları bir allowlist tarafından engellenir, böylece yeni bir backend sırrı, biri denylist'i güncelleyene kadar sızmak yerine varsayılan olarak düşürülür. Backend'in `HOME` değişkeni, sandbox'ın kendi yazılabilir yolunu hiçbir zaman geçersiz kılmaz.

**Format** düğmesi de aynı sandbox'ı kullanır. Ruff kaynağı yürütmek yerine ayrıştırır ve yeniden yazar, ancak bunu backend host'unda çalıştırmak güvenilmeyen bir dosyaya backend'in tüm ortamını miras alan bir süreç verirdi; bu nedenle aynı limitlere ve aynı allowlist'lenmiş ortama sahip kendi tek kullanımlık `--network none` container'ını alır. Host üzerinde biçimlendirme yapmak yerine Docker olmadan fail closed davranır.

Sandbox limitleri ortam değişkenleri değil sabitlerdir — 512 MB bellek, bir CPU, 256 süreç, 120 saniyelik kurulum zaman aşımı ve 60 saniyelik yürütme zaman aşımı. Image, mevcut `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` zincirinden çözümlenir; düğüm kendi yapılandırmasını sunmaz.

## İlgili

- [Çalıştırma ve Dağıtım](../getting-started/running-and-deployment.md) – Başlangıçta `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` ve `HEYM_PYTHON_TOOL_SANDBOX` değerlerini yapılandırın
- [Code Node](../nodes/code-node.md) – Kendi bağımlılıklarıyla sandbox ortamında Python çalıştırma
- [Agent Node](../nodes/agent-node.md) – Sandbox ortamında çalışan özel Python araçları
- [Execution Tokens](./execution-tokens.md) – Harici sistemlerden workflow çağırmak için kapsamlandırılmış JWT'ler
- [Guardrails](./guardrails.md) – LLM ve Agent node'larında güvenli olmayan içeriği engelleyin
- [Settings](./user-settings.md) – Parolanızı değiştirin
- [Credentials Tab](../tabs/credentials-tab.md) – API anahtarlarını yönetin
- [MCP Tab](../tabs/mcp-tab.md) – MCP API anahtarı ve OAuth istemcileri
- [Portal](./portal.md) – Genel sohbet portalı erişim kontrolü
