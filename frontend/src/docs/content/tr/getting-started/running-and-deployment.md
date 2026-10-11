# Çalıştırma ve Dağıtım

Heym, farklı ortamlar için iki script sunar: yerel geliştirme için `run.sh` ve Docker Compose kullanan üretim dağıtımları için `deploy.sh`.

> **Video anlatımı:** [Heym'i 2 Dakikadan Kısa Sürede Yerel Olarak Kurun](https://www.youtube.com/watch?v=P6YvlupUboU) — repository'yi klonlayın, PostgreSQL'i başlatın, gerekli ortam değişkenlerini doldurun ve yerel bir instance üzerinde ilk hesabınızı oluşturun.

## Ön Koşullar

Her iki script de aşağıdaki araçların kurulu olmasını gerektirir:

| Araç | Amaç |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Veritabanı container'ı (dev) ve tam stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Backend için Python paket yöneticisi |
| [bun](https://bun.sh) | Frontend için JavaScript runtime |

## Ortam Kurulumu

Hem `run.sh` hem de `deploy.sh`, proje kök dizinindeki bir `.env` dosyasından okur. Dosya mevcut değilse, script hem yerel geliştirme hem de üretim için `.env.example` dosyasından otomatik olarak bir tane oluşturur.

`SECRET_KEY` ve `ENCRYPTION_KEY`, `.env.example` içinde boş olarak gelir. Herhangi biri boş olduğunda, `run.sh` ve `deploy.sh` kriptografik olarak güçlü bir değer üretir ve bunu `.env` dosyasına geri yazar; böylece yeni bir kurulum manuel anahtar işlemi gerektirmez. Mevcut bir `.env` dosyası hâlâ eski `ENCRYPTION_KEY` placeholder'ını (`change_this_to_a_random_32_byte_hex_value`) içeriyorsa, script'ler bunun üzerine yazmak yerine açık bir hatayla durur — bu anahtarın döndürülmesi daha önce şifrelenmiş credential'ları okunamaz hale getirir. Backend'in kendisi de herhangi bir anahtar boşsa veya bilinen bir placeholder'da bırakılmışsa başlamayı reddeder.

Dosyayı manuel olarak oluşturmak için (isteğe bağlı — script'ler bunu sizin için yapar):

```bash
cp .env.example .env
```

Temel ortam değişkenleri:

Desteklenen her değişken, varsayılan değer ve üretim notu için [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) sayfasına bakın.

| Değişken | Açıklama |
|----------|-------------|
| `SECRET_KEY` | **Gerekli.** JWT imzalama secret'ı. Boş olduğunda `run.sh`/`deploy.sh` tarafından otomatik oluşturulur. |
| `ENCRYPTION_KEY` | **Gerekli.** Credential şifreleme anahtarı. Boş olduğunda `run.sh`/`deploy.sh` tarafından otomatik oluşturulur. |
| `DATABASE_URL` | İsteğe bağlı veritabanı bağlantı string'i override'ı. Boşsa, Heym bunu `POSTGRES_*` ayarlarından oluşturur. |
| `BACKEND_PORT` | Backend API portu — varsayılan olarak `10105` |
| `FRONTEND_PORT` | Frontend portu — varsayılan olarak `4017` |
| `FRONTEND_URL` | **Üretimde gerekli.** Uygulamanın genel URL'si (scheme + host, örn. `https://heym.example.com`). OAuth redirect URI'leri (Google Sheets, BigQuery, Notion ve benzerleri) ile arka plan çalıştırmalarının oluşturduğu review, Codex follow-up ve dosya link'leri için kullanılır; kullanıcıların tarayıcıda kullandığı URL ile eşleşmelidir. Bir cluster'da her instance üzerinde aynı değeri ayarlayın. |
| `ALLOW_REGISTER` | Kullanıcı kaydını açın (`prod`'da `false`, `dev`'de `true`). Yalnızca admin hesabınız oluştuktan sonra `false` olarak değiştirin — ilk kullanıcı bootstrap'ı yoktur, bu nedenle boş bir veritabanı ve devre dışı bırakılmış kayıt, hesap oluşturmanın hiçbir yolunu bırakmaz. |
| `DOCKER_LOGS_ENABLED` | `true` olarak ayarlandığında Docker destekli Logs sekmesi erişimini etkinleştirir; ayrıca Docker socket erişimi gerektirir |
| `DOCKER_LOGS_ALLOWED_EMAILS` | `DOCKER_LOGS_ENABLED=true` olduğunda Docker log'larına erişmesine izin verilen güvenilir kullanıcı e-postalarının virgülle ayrılmış listesi |
| `REQUEST_BODY_MAX_SIZE_MB` | Endpoint handler'ları çalışmadan önce kabul edilen maksimum HTTP request body boyutu; varsayılan olarak `100`, multipart ek yükü için yer bırakmak amacıyla `FILE_MAX_SIZE_MB`'nin bir MB üzerinde |
| `HEYM_PYTHON_TOOL_SANDBOX` | Kullanıcı tanımlı Python tool'larının nasıl çalıştığı: `auto` (varsayılan — sıkılaştırılmış, izole Docker container'ı; Docker kullanılamıyorsa fail closed), `docker` (aynı, asla fallback yapmaz) veya `subprocess` (in-process yerel fallback; bir güvenlik sınırı değildir, yalnızca güvenilir/dev). `run.sh`, native dev için `subprocess` ayarlar. [Security](../reference/security.md#python-tool-sandbox) sayfasına bakın. |
| `HEYM_PYTHON_TOOL_IMAGE` | Python tool Docker sandbox'ı için kullanılan image. Boş = çalışan backend image'ını otomatik algıla. |

Veritabanı bağlantı varsayılanları (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`), [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) ve `.env.example` içinde belgelenmiştir.

---

## Geliştirme: `run.sh`

`run.sh`, üç servisin tümünü — veritabanı (Docker container olarak), FastAPI backend ve Vite dev server — tek bir komutla yerel olarak başlatır.

```bash
./run.sh
```

**Adım adım ne yapar:**

1. `docker`, `bun` ve `uv` araçlarının kullanılabilir olduğunu kontrol eder
2. `.env` dosyası yoksa `.env.example` dosyasından oluşturur ve `SECRET_KEY` ile `ENCRYPTION_KEY` boş olduğunda rastgele bir değer üretir
3. `6543` portunda bir veritabanı Docker container'ı başlatır (veya oluşturur); verilerini host dizini yerine `heym-postgres-data` Docker volume'unda saklar
4. Python bağımlılıklarını `uv sync` ile kurar
5. Alembic veritabanı migration'larını çalıştırır (`alembic upgrade head`)
6. Backend ve frontend portları doluysa serbest bırakır
7. FastAPI backend'i `--reload` ile başlatır (kod değişikliklerinde hot-reload)
8. Frontend bağımlılıklarını `bun install` ile kurar
9. Vite dev server'ı başlatır

**Seçenekler:**

| Flag | Açıklama |
|------|-------------|
| *(yok)* | Debug logging etkin olarak başlatır (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Varsayılan log seviyesiyle başlatır (debug çıktısı yok) |
| `--help` | Kullanım bilgisini gösterir |

**Servis adresleri (dev):**

| Servis | Adres |
|---------|---------|
| Frontend | `FRONTEND_PORT` üzerinde `localhost` (varsayılan: 4017) |
| Backend API | `BACKEND_PORT` üzerinde `localhost` (varsayılan: 10105) |
| Interactive API Docs | `localhost:10105/docs` |
| Veritabanı | `localhost:6543` |

Tüm servisleri düzgün şekilde durdurmak için `Ctrl+C` tuşlarına basın.

---

## Uçtan Uca Testler: `run_e2e.sh`

Frontend Playwright suite'i gerçek Vue uygulamasına, FastAPI backend'e ve izole bir
PostgreSQL veritabanına karşı çalışır:

```bash
./run_e2e.sh
```

Bu suite, kapsamlı bir ürün kapsamı değil, kritik yol smoke ve regresyon suite'idir. Kimlik
doğrulama, temel workflow yaşam döngüsü ve yürütme, seçili dashboard kaynakları, public
route'lar ve mock'lanmış bir HITL review UI'ı kapsar. Provider entegrasyonları, her node tipi,
paylaşım/izin matrisleri ve tam HITL resume yürütmesi ağırlıklı olarak backend testleri
tarafından kapsanmaya devam eder veya özel entegrasyon ortamları gerektirir.

Her çalıştırma kendi geçici PostgreSQL 16 container'ını, rastgele uygun veritabanı/backend/frontend
portlarını, kimlik doğrulama durumunu, test sonuçlarını ve HTML raporunu alır. Bu sayede birden
fazla `run_e2e.sh` süreci durum paylaşmadan veya artifact'ları üzerine yazmadan eşzamanlı
çalışabilir. Script, çalıştırma bittiğinde veritabanı container'ını kaldırır ve artifact dizinini
ile rapor yolunu yazdırır.

Faydalı komutlar:

```bash
./run_e2e.sh --ui         # İzole bir veritabanıyla etkileşimli Playwright runner
cd frontend
bun run test:e2e:report   # En son tamamlanan yerel çalıştırmayı aç
```

Doğrudan `bun run test:e2e` ve `bun run test:e2e:ui` çalıştırmaları, yerel geliştirme
veritabanına karşı sessizce başlamamaları için açık bir `DATABASE_URL` gerektirir. Normal yerel
çalıştırmalar için `./run_e2e.sh` kullanın.

`./check.sh`, E2E suite'i olmadan lint, typecheck, formatting ve backend testlerini çalıştırarak
varsayılan yerel kontrol yolunu hızlı tutar. Playwright E2E testlerini `./run_e2e.sh` ile ayrı
olarak çalıştırın. Pull request'ler her zaman GitHub Actions'ta Chromium E2E suite'ini çalıştırır
ve hatalar oluştuğunda trace'leri, ekran görüntülerini, videoları ve HTML raporunu saklar.

---

## Production: `deploy.sh`

`deploy.sh`, Docker Compose kullanarak tüm stack'i derler ve çalıştırır. Üç servisin tamamı — veritabanı, backend ve frontend — container olarak çalışır. Backend entrypoint'i, sunucuyu 8 worker ile başlatmadan önce migration'ları otomatik olarak çalıştırır.

**İlk deploy (build + start):**

```bash
./deploy.sh
```

Bu, zero-downtime bir deploy gerçekleştirir: image'lar önce derlenirken mevcut container'lar çalışmaya devam eder, ardından yeni sürüm devreye alınır.

**Kullanılabilir komutlar:**

| Komut | Açıklama |
|---------|-------------|
| `./deploy.sh` | Image'ları derleyin ve tüm servisleri başlatın/güncelleyin |
| `./deploy.sh --status` | Container durumunu gösterin |
| `./deploy.sh --logs` | Tüm container'lardan log'ları akış halinde izleyin |
| `./deploy.sh --restart` | Tüm container'ları yeniden başlatın |
| `./deploy.sh --down` | Tüm container'ları durdurun ve kaldırın |
| `./deploy.sh --migrate-pgdata` | Tek seferlik migration: mevcut bir `data/postgres` dizinini `heym-postgres-data` Docker volume'üne kopyalayın ve indekslerini yeniden oluşturun |
| `./deploy.sh --help` | Kullanım bilgilerini gösterin |

**Veritabanı depolama: host dizini değil, Docker named volume.**

Compose, PostgreSQL'i `heym-postgres-data` Docker volume'ünde saklar. Önceki sürümler bunun yerine `./data/postgres` host dizinini bind-mount ediyordu. macOS (virtiofs) ve Windows/WSL2 üzerindeki host bind mount'ları, PostgreSQL'e ihtiyaç duyduğu `fsync` ve dosya kapatma garantilerini sağlamaz: buradaki cluster'lar WAL segmentlerinde `PANIC: could not close file … Input/output error` hatasıyla karşılaşır ve zamanla bozulur. Linux bind mount'ları hiçbir zaman etkilenmedi, ancak artık her platform aynı düzeni kullanır.

Hâlâ `./data/postgres` içinde verisi olan bir deployment'ı yükseltmek tek seferlik bir adımdır. `./deploy.sh` bunu algılar, derlemeden önce durur ve önce migration yapmanızı ister:

```bash
./deploy.sh --migrate-pgdata   # servisleri durdurun, volume'e kopyalayın, indeksleri yeniden oluşturun
./deploy.sh                    # her zamanki gibi deploy edin
```

**Migration ayrıca indeksleri yeniden oluşturur.** Kopyalama byte-byte yapılır, dolayısıyla eski bind mount'un neden olduğu indeks hasarı da beraberinde taşınır. Bu nedenle `--migrate-pgdata`, yeni volume üzerinde yalnızca `postgres` servisini başlatır, ona karşı `reindexdb` çalıştırır ve stack'in geri kalanı ayağa kalkmadan önce tekrar durdurur. Bu önemlidir çünkü bu tür bir bozulma, indeks girdilerini heap'in sonunun ötesini işaret eder halde bırakır — `pg_amcheck`'in temiz olarak raporladığı bir durumdur, yani başarılı bir kontrol sağlıklı bir tablonun kanıtı değildir. REINDEX bu girdileri onarır; eski dosya sisteminin zaten kaybettiği heap sayfalarını geri getiremez. Büyük ve sağlıklı olduğu bilinen bir veritabanında, `./deploy.sh --migrate-pgdata --skip-reindex` ile yeniden oluşturmayı atlayabilirsiniz.

Kopyalama yıkıcı değildir. `./data/postgres` yedek olarak yerinde kalır ve migration, hâlihazırda bir veritabanı barındıran bir volume'ün üzerine yazmayı reddeder. Herhangi bir adım başarısız olursa yeni volume kaldırılır, böylece yarı migrate edilmiş bir cluster asla yanlışlıkla deploy edilemez. Workflow'larınızın sağlam olduğunu doğruladıktan sonra eski dizini silin. `postgres` container'ı da aynı korumayı taşır, böylece manuel bir `docker compose up` da verilerinizin üzerine sessizce boş bir veritabanı başlatamaz. Yeni kurulumlar için herhangi bir işlem gerekmez.

**Servis adresleri (production):**

Frontend container'ı `FRONTEND_PORT` üzerinde açığa çıkarılır (varsayılan: 4017). Backend API, `/api` yolu altında sunulur ve frontend container'ı üzerinden proxy'lenir — yani production'da yalnızca tek bir dışa açık port vardır.

**Container genel bakış:**

| Container | Açıklama |
|-----------|-------------|
| `heym-db` | İlişkisel veritabanı |
| `heym-backend` | FastAPI API sunucusu (8 worker, `backend/Dockerfile`'dan derlenir) |
| `heym-frontend` | Derlenmiş Vue uygulamasını sunan frontend preview container'ı (`frontend/Dockerfile`'dan derlenir) |

**Sürüm güncelleme rozeti:**

Uygulama başlığı, çalışan Docker build sürümünü gösterir. Bu sürüm, en son Heym GitHub release'inin gerisinde kaldığında sürümün yanında mor bir **Update** rozeti görünür. Heym GitHub releases sayfasını açmak için sürüme veya rozete tıklayın.

---

## Önceden Oluşturulmuş Image: `docker run`

Uygulamayı yerel olarak derlemek istemiyorsanız, yayımlanmış container image'ını çekip doğrudan çalıştırabilirsiniz.

Image, frontend ve backend'i tek bir container içinde birlikte başlatır. PostgreSQL hâlâ haricidir, ancak `.env.example` dosyasından `DATABASE_URL` ya da `POSTGRES_*` değişkenlerinden birini sağlayabilirsiniz.

> **Veritabanınızı bir Docker named volume içinde saklayın.** Release image'ı hiçbir veritabanı içermez, dolayısıyla `DATABASE_URL` arkasındaki PostgreSQL'i çalıştırmak size aittir. Bunu bir host yoluna değil, `-v heym-postgres-data:/var/lib/postgresql/data` olarak bağlayın: macOS (virtiofs) ve Windows/WSL2 üzerinde bind-mounted bir PostgreSQL data dizini, veritabanının gerektirdiği `fsync` garantilerini yerine getirmez ve zamanla cluster'ı bozar.

> **Vector store backend.** `run.sh` ve `deploy.sh` resmi `postgres:16` image'ını çalıştırır ve başlangıçta `postgresql-16-pgvector` paketini otomatik olarak kurar; böylece **Postgres (pgvector) RAG backend**'i orada verilerinizde hiçbir değişiklik yapmadan kutudan çıktığı gibi çalışır. Ancak önceden oluşturulmuş tek container'lı image, **sizin** sağladığınız bir PostgreSQL'e bağlanır — Postgres backend'ini kullanmak için o veritabanı `vector` uzantısını desteklemelidir. Heym, yönetmediği bir veritabanına pgvector kuramaz. Bu olmadan, başlangıç migration'ı pgvector tablosunu sorunsuz şekilde atlar — deploy yine de başarılı olur, Qdrant RAG çalışmaya devam eder ve pgvector etkinleştirilene kadar bir Postgres vector store oluşturmak veya oraya yükleme yapmak net bir "backend unavailable" mesajı döndürür.

**Doğrudan image çalıştırmaları için anahtarları kendiniz ayarlayın.** `run.sh`/`deploy.sh`'den farklı olarak, önceden oluşturulmuş image anahtarları otomatik olarak üretmez. `cp .env.example .env` komutundan sonra iki boş anahtarı doldurun (yerinde değiştirmek yinelenen girdileri önler):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Dosya ve plugin mount'larını mutlak yol yapın.** `FILE_STORAGE_DIR` ve `HEYM_PLUGINS_DIR` varsayılan olarak `./data/files` ve `data/plugins` göreli yollarını kullanır ve release image'ı backend'i `/app/backend` dizininden başlatır. Göreli bırakıldığında bu yollar `/app/backend/data/files` ve `/app/backend/data/plugins` olarak çözümlenir; dolayısıyla yukarıdaki iki bind mount hiçbir şey almaz ve container değiştirildiğinde yüklemeler kaybolur. `-e` bayrakları, `.env.example` dosyasının `--env-file` aracılığıyla sağladığı göreli değerleri geçersiz kılar, çünkü komut satırındaki `-e`, `--env-file`'a göre önceliklidir. Compose (`./deploy.sh`) buna ihtiyaç duymaz: o image backend'i `/app` dizininden çalıştırır ve göreli varsayılanlar zaten mount'lara denk gelir.

> **Docker socket erişimi.** `/var/run/docker.sock` dosyasını bağlamak, backend'e host Docker daemon'ı üzerinde geniş kontrol verir. Varsayılan Docker Compose servisi ve doğrudan `docker run` örneği, `docker` komutlarını çalıştıran Docker tabanlı MCP stdio araçları için bunu içerir. Logs sekmesi yine de `DOCKER_LOGS_ENABLED=true` ve güvenilen kullanıcı e-postalarının virgülle ayrılmış listesini içeren `DOCKER_LOGS_ALLOWED_EMAILS` gerektirir. Docker loglarını etkinleştirmeden önce güvenilen admin hesabını oluşturun ya da `ALLOW_REGISTER=false` olarak bırakın; böylece doğrulanmamış bir self-registration, izin listesindeki bir e-postayı talep edemez. Kullanıcı tanımlı Python araçları bu socket'i **almaz**: bunlar Docker socket'i olmayan ayrı ve sıkılaştırılmış bir container içinde çalışır. Bkz. [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex node, Codex'in Linux sandbox'ının namespace oluşturabilmesi için aynı `ghcr.io/heymrun/heym` image'ını kardeş bir runner container olarak (`--entrypoint codex`) kullanır. Doğrudan image kurulumunda Codex workflow'ları istiyorsanız `heym-codex-workspaces` volume mount'unu koruyun; runner, Docker socket'ini veya backend secret'larını almaz.

> **OpenCode Go runner.** OpenCode Go node, `heym-opencode-workspaces` paylaşan sıkılaştırılmış bir kardeş runner olarak (`--entrypoint opencode`) aynı image'ı kullanır. Doğrudan image kurulumunda OpenCode workflow'ları istiyorsanız bu volume mount'unu koruyun; runner, Docker socket'ini veya GitHub token'ını almaz.

> **Skill sandbox.** Agent node üzerindeki Python skill'leri, `heym-codex-workspaces` volume'unu paylaşan sıkılaştırılmış bir kardeş container içinde çalışır; dolayısıyla bu volume mount'unu yalnızca Codex için değil, skill'ler için de koruyun. Her çalıştırma, çalıştırma başına izole bir alt yol alır ve kardeş container ne Docker socket'ini ne de backend secret'larını alır. Bu, **Docker Engine 25.0+** gerektirir; daha eski engine'lerde veya volume olmadan `HEYM_PYTHON_TOOL_SANDBOX=auto` fail closed davranır — `HEYM_PYTHON_TOOL_SANDBOX=subprocess` değerini yalnızca güvenilen tek kullanıcılı kurulumlar için ayarlayın. Bkz. [Security](../reference/security.md#skill-sandbox).

> **Playwright için `--shm-size 2g` gereklidir.** Docker bir container'a 64 MB `/dev/shm` ayırır ve Chromium bu sınır altında renderer'ını çökertir. Adım tabanlı Playwright node'ları Chromium'u bu container içinde bir alt süreç olarak çalıştırır, dolayısıyla sınır bu container'a aittir; özel `playwrightCode` ise kendi sınırını belirleyen kardeş bir container'da çalışır. `docker-compose.yml` zaten `shm_size: "2gb"` bildirdiğinden `run.sh` ve `deploy.sh` etkilenmez — yalnızca düz bir `docker run` bu bayrağa ihtiyaç duyar.

> **Playwright Run Code.** Özel Playwright Python için `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` ve yukarıdaki Docker socket mount'u gereklidir. Release image, GHCR düzeni (`/app/backend/.venv`) için `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` değerlerini ayarlar. Compose `./deploy.sh` sandbox image'ını varsayılan olarak `heym-backend:local` yapar. Sandbox container'ları içindeki Chromium başlatma argümanlarında `--no-sandbox` seçeneğini koruyun.

**Doğrudan image çalıştırmaları için minimum ortam değişkenleri:**

| Değişken | Gerekli | Amaç |
|----------|----------|---------|
| `DATABASE_URL` | İsteğe bağlı | Tam PostgreSQL bağlantı dizesi geçersiz kılma |
| `POSTGRES_HOST` | Evet, `DATABASE_URL` boşsa | PostgreSQL host |
| `POSTGRES_PORT` | Evet, `DATABASE_URL` boşsa | PostgreSQL port |
| `POSTGRES_USER` | Evet, `DATABASE_URL` boşsa | PostgreSQL kullanıcı adı |
| `POSTGRES_PASSWORD` | Evet, `DATABASE_URL` boşsa | PostgreSQL parolası |
| `POSTGRES_DB` | Evet, `DATABASE_URL` boşsa | PostgreSQL veritabanı adı |
| `SECRET_KEY` | Evet | JWT imzalama secret'ı |
| `ENCRYPTION_KEY` | Evet | Credential şifreleme anahtarı |
| `FRONTEND_URL` | Önerilir | Genel tarayıcı URL'si, özellikle OAuth callback'leri için |
| `CORS_ORIGINS` | Önerilir | İzin verilen tarayıcı origin'leri |
| `FILE_STORAGE_DIR` | Önerilir | Bu yolu mount ettiğinizde mutlak `/app/data/files` olarak ayarlayın; göreli `./data/files` varsayılanı bu image'da `/app/backend` altında çözümlenir ve mount'u kaçırır |
| `ALLOW_REGISTER` | Önerilir | Açık kayıt amaçlanmıyorsa üretimde `false` olarak ayarlayın, ancak yalnızca admin hesabınız oluşturulduktan sonra — ilk kullanıcı bootstrap'ı yoktur |
| `DOCKER_LOGS_ENABLED` | İsteğe bağlı | Logs sekmesinin Docker socket erişimini kullanmasına izin vermek için `true` olarak ayarlayın |
| `DOCKER_LOGS_ALLOWED_EMAILS` | `DOCKER_LOGS_ENABLED=true` olduğunda gereklidir | Docker loglarına erişmesine izin verilen güvenilir kullanıcı e-postalarının virgülle ayrılmış listesi |
| `HEYM_PLUGINS_ENABLED` | İsteğe bağlı | Plugin alt sistemini (zip olarak yüklenen özel node'lar) etkinleştirmek için `true` olarak ayarlayın. Varsayılan olarak kapalı |
| `HEYM_PLUGIN_ADMIN_EMAILS` | `HEYM_PLUGINS_ENABLED=true` olduğunda gereklidir | Plugin yüklemesine/kaldırmasına izin verilen operatör e-postalarının virgülle ayrılmış listesi |
| `HEYM_PLUGINS_DIR` | İsteğe bağlı | Plugin dosyalarının saklandığı yer. Bu yolu mount ettiğinizde mutlak `/app/data/plugins` olarak ayarlayın; göreli `data/plugins` varsayılanı bu image'da `/app/backend` altında çözümlenir ve mount'u kaçırır |
| `HEYM_PYTHON_TOOL_SANDBOX` | İsteğe bağlı | Python tool izolasyon modu; varsayılan olarak `auto` (sıkılaştırılmış Docker sandbox, fail closed). Bkz. [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | İsteğe bağlı | Python tool sandbox image'ını geçersiz kılın; boş = backend image'ını otomatik algıla |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | İsteğe bağlı | Kardeş Codex runner container'ları tarafından kullanılan Docker volume; Docker dağıtımlarında varsayılan olarak `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | İsteğe bağlı | Codex'in sandbox'lı komutlarının dosya/bağımlılık indirmesine izin verin; Docker dağıtımları bunu varsayılan olarak etkinleştirir |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | İsteğe bağlı | Kardeş OpenCode runner container'ları tarafından kullanılan Docker volume; Docker dağıtımlarında varsayılan olarak `heym-opencode-workspaces` |

**Notlar:**

- Image, `4017` portunu dışa açar
- Backend dahili kalır ve `/api` altında proxy'lenir
- `POSTGRES_HOST=localhost` olduğunda, release image bunu gerektiğinde otomatik olarak `host.docker.internal` olarak yeniden yazar; böylece aynı `.env`, macOS Docker/Desktop araçlarında host düzeyinde bir PostgreSQL container'ı ile çalışır
- Drive yüklemelerinin ve skill tarafından oluşturulan dosyaların container yeniden başlatmalarında hayatta kalmasını istiyorsanız `data/files` mount'unu koruyun
- **Plugin'ler:** bunları etkinleştirmek için `HEYM_PLUGINS_ENABLED=true` ve `HEYM_PLUGIN_ADMIN_EMAILS` değerlerini ayarlayın ve yüklenen plugin dosyalarının container yeniden oluşturmalarında kalıcı olması için `data/plugins` yolunu mount edin. Plugin metadata'sı PostgreSQL'inizde yaşar, dolayısıyla o da hayatta kalır. Bir plugin'in bildirdiği pip `dependencies` yükleme sırasında container'a kurulur; image dosya sistemi geçici olduğundan, yüklü her plugin için **başlangıçta otomatik olarak yeniden kurulurlar** (release image'ın `uv` venv'i yazılabilirdir, dolayısıyla bu tek container'lı image'da da çalışır)

### Mevcut bir veritabanını adlandırılmış bir volume'e taşıma

`./deploy.sh --migrate-pgdata` yalnızca Compose stack'ini bilir. Release image'ı kendi PostgreSQL container'ınıza karşı çalıştırıyorsanız ve o container bir host dizinini bind-mount ediyorsa, taşımayı kendiniz yapın.

Önce veritabanı container'ınızın ne kullandığını kontrol edin:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

`"Type"` değeri `bind` okuyorsa, onu adlandırılmış bir volume'e taşıyın:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

#   volume adı, bu Docker host'u birden fazla Heym dağıtımı çalıştırıyorsa.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. PostgreSQL'i volume üzerinde yeniden başlatın, önceki flag'lerinizi yeniden kullanın
#    ancak bind mount'u değiştirin.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Bağlantıları kabul etmeye başladığında indeksleri yeniden oluşturun.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**2. ve 3. adımlarda `postgres:16` yerine kendi image'ınızı kullanın.** Veritabanınız `pgvector/pgvector:pg16` veya başka bir varyant çalıştırıyorsa, kopyalanan cluster'ı stok image ile başlatmak başarısız olabilir çünkü beklediği extension kütüphaneleri eksiktir.

Orijinal veri dizininiz bu prosedürden etkilenmez, dolayısıyla rollback yolunuz olarak kalır. Yalnızca taşınan veritabanının workflow'larınıza hizmet ettiğini doğruladıktan sonra silin. 4. adım, Compose geçişindekiyle aynı nedenden dolayı önemlidir: kopya, mevcut herhangi bir indeks hasarını da beraberinde taşır.

---

## Birden Fazla Instance Çalıştırma

Yukarıdaki her şey tek bir Heym instance'ı dağıtır. Bir makine artık yeterli olmadığında, ikinci bir instance'ı aynı PostgreSQL veritabanına yönlendirin; worker olarak katılır: arka plan çalışmaları — cron, webhook'lar, MCP tool çağrıları, chat trigger'ları — ardından **Settings → Instances** altında belirlediğiniz bir yüzdeyle instance'lar arasında paylaşılır.

Instance'lar birbirleriyle asla konuşmaz. İşi Postgres taşır, dolayısıyla bir worker'ın açık bir porta ve ana instance'a geri dönen bir rotaya ihtiyacı yoktur ve hiçbir message broker devrede değildir. Yerel diske dokunan işler — Drive dosyaları, coding-agent workspace'leri, yüklü plugin'ler — her zaman ana instance üzerinde çalışır, dolayısıyla hiçbir şeyin bir dosya sistemi üzerinden paylaşılması gerekmez.

Cluster'ın sizin için uygulayamayacağı iki kural: her instance aynı `SECRET_KEY` ve `ENCRYPTION_KEY` değerlerini kullanmalıdır ve ingress yalnızca ana instance'a yönlendirilmelidir. Her ikisi de yerleştirme kuralları ve yüzdelerin nasıl seçileceğiyle birlikte [Load Distribution](../reference/cluster.md) bölümünde açıklanmıştır.

> Bu, yüksek kullanılabilirlik değil yük dağıtımıdır. Ana instance; ingress, dosya depolama ve editör için tek hata noktası olarak kalır.

## Yaygın Workflow'lar

**İlk kurulum:**

```bash
./run.sh          # development — .env dosyasını .env.example'dan oluşturur ve SECRET_KEY/ENCRYPTION_KEY'i otomatik üretir
# veya
./deploy.sh       # production — aynı otomatik .env ve key üretimi
```

Önceden oluşturulmuş `docker run` image'ı için önce key'leri manuel olarak üretin (yukarıdaki **Prebuilt Image** bölümüne bakın).

**Kod değişikliğinden sonra production'ı güncelleyin:**

```bash
git pull
./deploy.sh       # image'ları yeniden oluşturur, sıfır kesintili geçiş
```

**Production log'larını kontrol edin:**

```bash
./deploy.sh --logs
```

**Production servislerini durdurun:**

```bash
./deploy.sh --down
```

---

## İlgili

- [Introduction](./introduction.md) – Platform genel bakışı
- [Quick Start](./quick-start.md) – İlk workflow'unuzu oluşturun
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Tam yapılandırma referansı
- [Security](../reference/security.md) – JWT, şifreleme ve CORS ayarları
- [Load Distribution](../reference/cluster.md) – Tek bir veritabanına karşı birkaç instance çalıştırın
