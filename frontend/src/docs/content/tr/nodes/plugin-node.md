# Plugin

**Plugin** düğümü, yüklü bir plugin tarafından sağlanan özel bir eylemi çalıştırır. Plugin'ler, çekirdek uygulamayı değiştirmeden Heym'i yeni düğüm türleriyle — eylemler, üçüncü taraf entegrasyonları veya Python ile ifade edilebilecek herhangi bir şeyle — genişletir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.<plugin tarafından döndürülen anahtarlar>` |

Bir plugin **paketi** (tek bir zip), **birden fazla düğüm** içerebilir — eylem ve trigger'ların herhangi bir karışımı. Her düğüm, palette **Plugins** altında kendi adı ve açıklamasıyla görünür. Birini tuvale sürüklemek, o pakete (`pluginId`) ve düğüme (`pluginNodeKey`) bağlı bir Plugin düğümü oluşturur.

## Ne Zaman Kullanılır

Bir operatör, ihtiyacınız olan eylemi gerçekleştiren bir plugin yüklediğinde — örneğin özel bir API'yi çağırmak, dahili bir sistemle konuşmak veya dağıtımınız için yazılmış özel mantığı çalıştırmak için — bir Plugin düğümü kullanın.

Bir workflow başlatan trigger tarzı plugin'ler için [Plugin Trigger düğümüne](./plugin-trigger-node.md) bakın.

## Yapılandırma

Düğümün yapılandırma formu, plugin'in manifest'inden oluşturulur. Plugin tarafından bildirilen her alan (`string`, `number`, `boolean` veya `select`) otomatik olarak oluşturulur. Gizli olmayan string alanları expression girişini kullanır ve `$` ile başlayan kayıtlı string yapılandırma değerleri, plugin handler'ı çalışmadan önce çözümlenir.

Gizli alanlar (API anahtarları gibi) arayüzde maskelenir ve hiçbir zaman loglara yazılmaz.

## Plugin'ler Nasıl Çalışır

Plugin'ler Heym tarafından sağlanır ve bir operatör tarafından yüklenir; bu nedenle plugin kodu **güvenilirdir** ve yerleşik bir düğüm gibi süreç içinde çalışır, tam ağ ve kütüphane erişimine sahiptir. Bir plugin, yükleme sırasında instance'a kurulan pip `dependencies` bildirebilir.

Plugin'leri yükleme ve kaldırma, e-postası `HEYM_PLUGIN_ADMIN_EMAILS` içinde listelenen operatörlerle sınırlıdır ve tüm alt sistem `HEYM_PLUGINS_ENABLED` tarafından denetlenir (varsayılan olarak devre dışıdır). Ortam değişkenleri için [Çalıştırma ve Dağıtım](../getting-started/running-and-deployment.md) bölümüne bakın.

## Özel Simgeler

Bir plugin özel SVG logoları içerebilir. Her düğüm için varsayılan bir simge belirlemek üzere paket köküne bir `icon.svg` koyun ve/veya manifest'te bir düğüme kendi `"icon": "<file>.svg"` değerini verin. Simge hem palette kartında hem de tuval düğümünde görünür; simgesi olmayan düğümler varsayılan yapboz parçası simgesine geri döner.

## AI Builder

Yüklü plugin'ler AI asistanına ve sohbet tuvaline sunulur; böylece Heym'den "bir kayıt oluşturmak için Acme CRM plugin'ini kullan" diye isteyebilirsiniz ve doğru `pluginId` ve `config` ile Plugin düğümünü oluşturur.

## Plugin Yazma

Bir plugin paketi oluşturmak için zip düzeni, manifest alanları, handler imzaları, simgeler, bağımlılıklar ve çalışma zamanı güven modeli için [Plugin Yazma](../reference/plugin-authoring.md) bölümüne bakın.
