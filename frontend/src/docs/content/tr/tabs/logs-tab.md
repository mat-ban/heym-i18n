# Logs Sekmesi

**Logs** sekmesi, Heym stack'i için Docker container loglarını gösterir. Hata ayıklama, izleme ve sorun giderme için kullanın. Workflow yürütme logları (node sonuçları, çıktılar) için workflow editöründeki Debug panelini kullanın—bkz. [Canvas Features](../reference/canvas-features.md#execution-logs).

Docker destekli loglar, self-hosted kurulumlarda varsayılan olarak devre dışıdır. Bunları etkinleştirmek için `DOCKER_LOGS_ENABLED=true` olarak ayarlayın, `DOCKER_LOGS_ALLOWED_EMAILS` değerini Docker loglarına erişmesine izin verilen güvenilir kullanıcı e-postalarının virgülle ayrılmış listesi olarak ayarlayın ve `/var/run/docker.sock` dosyasının backend container'ına bağlandığından emin olun. Varsayılan Docker Compose servisi ve doğrudan `docker run` örneği, Docker tabanlı MCP stdio araçları için bu bağlamayı içerir; yalnızca Docker socket güven sınırını kabul ettiğinizde bunu koruyun.

Kayıt açıksa, Docker loglarını etkinleştirmeden önce güvenilir admin hesabını oluşturun veya `ALLOW_REGISTER=false` olarak bırakın; aksi takdirde doğrulanmamış bir self-registration, izin listesindeki bir e-postayı talep edebilir.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Logs demosunu izleyin</a></p>

## Container Seçimi

- **All Containers** – backend, frontend ve PostgreSQL'den birleştirilmiş loglar
- **Backend** – `heym-backend` container
- **Frontend** – `heym-frontend` container
- **PostgreSQL** – `heym-postgres` container

## Log Level Filtresi

- **All** – Tüm log seviyelerini göster
- **INFO** – INFO ve üzeri
- **WARNING** – Uyarılar ve hatalar
- **ERROR** – Yalnızca hatalar
- **DEBUG** – Debug ve üzeri

## Arama

- Logları metin aramasıyla filtreleyin
- Eşleşmeler log çıktısında vurgulanır

## Özellikler

- **Auto scroll** – Yeni loglar geldikçe en alta kaydır
- **Stream** – Logları gerçek zamanlı olarak akıt (desteklendiğinde)
- **Copy** – Logları panoya kopyala
- **Download** – Logları dosya olarak indir

## Kullanım Senaryoları

- Workflow yürütme hatalarında hata ayıklama
- API istek/yanıt loglarını inceleme
- Veritabanı sorgularını izleme
- Başlatma ve sağlık mesajlarını kontrol etme

## İlgili

- [Canvas Features](../reference/canvas-features.md) – Workflow Debug panelindeki yürütme logları
- [Traces Tab](./traces-tab.md) – LLM trace incelemesi
- [Analytics Tab](./analytics-tab.md) – Yürütme metrikleri
- [Workflows Tab](./workflows-tab.md) – Workflow yönetimi
- [Contextual Showcase](../reference/contextual-showcase.md) – Dashboard yüzeyleri için kompakt sayfa kılavuzu
