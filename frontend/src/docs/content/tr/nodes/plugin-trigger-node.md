# Plugin Trigger

**Plugin Trigger** düğümü, [Plugin düğümünün](./plugin-node.md) trigger tarzındaki karşılığıdır. `kind` değeri `trigger` olan kurulu bir plugin tarafından sağlanır ve bir workflow'un başladığı başlangıç verisini üretir.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 0 |
| Çıkışlar | 1 |
| Çıkış | `$nodeLabel.<plugin tarafından döndürülen anahtarlar>` |

Bir trigger plugin'i, plugin'in handler'ı workflow'un başlaması gereken veriyi döndürdüğü sürece herhangi bir kaynağı — farklı bir uygulamayı, üçüncü taraf bir hizmeti veya başka bir teknolojiyi — temsil edebilir.

## Ne Zaman Kullanılır

Kurulu bir plugin, workflow'unuzu başlatan bir trigger tanımladığında bir Plugin Trigger düğümü kullanın. Workflow ortasında bir eylem gerçekleştiren plugin'ler için bunun yerine [Plugin düğümünü](./plugin-node.md) kullanın.

## Yapılandırma

Plugin düğümünde olduğu gibi, yapılandırma formu plugin'in manifest alanlarından oluşturulur. Gizli olmayan string alanları expression girişini kullanır ve gizli alanlar maskelenir.

## Plugin'ler Nasıl Çalışır

Plugin kodu güvenilirdir (Heym tarafından teslim edilir, operatör tarafından kurulur) ve in-process olarak çalışır. Kurulum `HEYM_PLUGIN_ADMIN_EMAILS` ile kısıtlanmıştır ve alt sistem `HEYM_PLUGINS_ENABLED` ile kapılandırılmıştır. Bkz. [Çalıştırma ve Dağıtım](../getting-started/running-and-deployment.md).

## Plugin Yazma

Bir trigger plugin paketi oluşturmak için zip düzeni, manifest alanları, handler imzaları, simgeler, bağımlılıklar ve çalışma zamanı güven modeli hakkında bilgi edinmek üzere [Plugin Yazma](../reference/plugin-authoring.md) bölümüne bakın.
