# OpenCode Go

**OpenCode Go** düğümü, [OpenCode](https://opencode.ai) CLI'ını (Go) bir GitHub deposuna karşı izole edilmiş, sıkılaştırılmış bir Heym konteynerinde çalıştırır. Codex düğümü gibi, testleri düzeltme, dosyaları düzenleme, bir yama üretme veya bir pull request açma gibi kodlama görevleri için tasarlanmıştır — ancak OpenAI Codex yerine sağlayıcıdan bağımsız **OpenCode Go** model ağ geçidini kullanır.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1 |
| Kimlik Bilgisi | OpenCode Go API anahtarı + GitHub |
| Çıkış | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Kimlik Doğrulama

**OpenCode Go** kimlik bilgisi, bir OpenCode Go ağ geçidi **API anahtarı** ([opencode.ai/go](https://opencode.ai/go) adresinden) ve isteğe bağlı bir **Gateway Base URL** (varsayılan olarak `https://opencode.ai/zen/go/v1`; yalnızca kendi barındırdığınız veya proxy üzerinden çalışan bir ağ geçidi için geçersiz kılın) saklar.

Düğüm ayrıca özel depoları klonlamak, çalışma dalını push etmek ve pull request oluşturmak için bir **GitHub** kimlik bilgisi gerektirir. GitHub token'ı **asla sandbox konteynerinin içine yerleştirilmez** — Heym tüm git ve GitHub işlemlerini ana makinede gerçekleştirir, böylece üretilen kod push kimlik bilgilerini sızdıramaz.

## İzolasyon ve güvenlik

Yürütme izolasyonu, tıpkı Codex düğümünde olduğu gibi `HEYM_OPENCODE_CLI_COMMAND` tarafından seçilir:

- **Yerel geliştirme (`run.sh`)** bunu varsayılan `opencode` değerinde bırakır, böylece OpenCode klonlanan çalışma alanına karşı bir ana makine alt süreci olarak çalışır — Docker gerekmez, ek bayrak gerekmez.
- **Docker dağıtımları (`deploy.sh` ve tek GHCR imajı)** bunu `/usr/local/bin/heym-opencode-docker` olarak ayarlar; bu, OpenCode çalışma alanı adlı volume'ünü paylaşan **sıkılaştırılmış, tek kullanımlık bir kardeş konteyner** içinde `opencode run` komutunu çalıştıran bir sarmalayıcıdır.

Sıkılaştırılmış runner konteyneri tüm Linux yeteneklerini düşürür, `no-new-privileges` ayarlar, salt okunur bir kök ve bir tmpfs `/tmp` kullanır ve pid/bellek/CPU limitleri uygular. Ağ çıkışına izin verilir (OpenCode model ağ geçidine ulaşmalıdır). **GitHub token'ı asla konteynerin içine yerleştirilmez** — tüm git ve GitHub işlemleri ana makine tarafında çalışır, böylece içeride yalnızca OpenCode API anahtarı ve depo dosyaları bulunur.

OpenCode yalnızca diskteki dosyaları düzenler; her git/GitHub eyleminin sahibi Heym'dir.

## Modeller

OpenCode Go'nun model listesi sık sık değişir, bu nedenle **Model** alanı ağ geçidinin model listesinden (`GET https://opencode.ai/zen/go/v1/models`) canlı olarak doldurulur ve aranabilir bir açılır menü olarak gösterilir. Canlı liste kullanılamıyorsa yerleşik bir yedek liste kullanılır. Model kimlikleri `opencode-go/<model>` biçimini kullanır (örneğin `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go`, OpenCode CLI'ının Go ağ geçidi için sağlayıcı kimliğidir. Runner varsayılanını (`opencode-go/kimi-k3`) kullanmak için alanı boş bırakın. Eski `opencode/<model>` biçiminde kaydedilmiş model kimlikleri çalışma zamanında otomatik olarak yeniden yazılır.

## Alanlar

| Alan | Açıklama |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go kimlik bilgisi (ağ geçidi API anahtarı) |
| GitHub Credential | Depo erişimi için kullanılan GitHub PAT kimlik bilgisi |
| Repository URL | HTTPS GitHub depo URL'si; ifadeleri destekler |
| Base Branch | OpenCode çalışmadan önce klonlanacak dal, varsayılan `main` |
| Model | OpenCode Go modeli (canlı aranabilir açılır menü, `opencode-go/<model>`); boş bırakılırsa runner varsayılanı kullanılır |
| Reasoning Variant | İsteğe bağlı; reasoning effort destekleyen modeller için `opencode run --variant` ile eşleşir |
| Task Prompt | OpenCode için kodlama görevi; `$input.text` gibi ifadeleri destekler |
| Publish Mode | Değişikliklerin nasıl teslim edileceği (aşağıdaki tabloya bakın) |
| Branch Name | PR/commit modları için çalışma dalı, varsayılan `opencode/$executionId` |
| Timeout | Saniye cinsinden maksimum OpenCode yürütme süresi |

## Yayınlama Modları

| Mod | Ne yapar |
|------|--------------|
| `diff_only` | Dosyaları yerel olarak düzenler ve yamayı ve değişen dosyaları döndürür. Hiçbir şey push edilmez. |
| `draft_pr` | Dalda commit yapar, dalı push eder ve bir taslak pull request açar. |
| `open_pr` | Dalda commit yapar, dalı push eder ve incelemeye hazır (taslak olmayan) bir pull request açar. |
| `commit_push` | Dalda commit yapar ve dalı push eder, pull request açmaz. |
| `direct_commit` | Doğrudan temel dala commit yapar ve push eder (ayrı dal veya PR yok). |
| `open_or_update_pr` | Ajanın mevcut açık bir PR'ı olduğunda onu günceller — dal adı farklı olsa bile runner bunu yazar + temel dal ile bulur — aksi takdirde yeni bir tane açar. Yeniden çalıştırmalar ve "açık PR'ı güncelle" talimatları için en uygunudur. |
| `update_existing_pr` | Mevcut dal/PR'a bir commit ekler; henüz yoksa bir tane açar. |
| `patch_artifact` | Diff'i indirilebilir bir dosya olarak kaydeder ve `patchUrl` döndürür. Hiçbir şey push edilmez. |

## Çıkışlar

| Anahtar | Açıklama |
|-----|-------------|
| `status` | Her zaman `completed` (OpenCode Go düğümü giriş için duraklamaz) |
| `summary` | OpenCode'un son mesajı |
| `validation` | Bildirildiğinde doğrulama notları |
| `diff` | Dosyalar değiştiğinde git yaması |
| `changedFiles` | Değişen dosya yolları |
| `branchName` | Çalışma dalı adı |
| `pullRequestUrl` | `draft_pr`, `open_pr`, `open_or_update_pr` ve `update_existing_pr` modlarında PR URL'si |
| `pushedBranch` | Commit/PR modlarında push edilen dal |
| `patchUrl` | `patch_artifact` modunda diff için indirme bağlantısı |
## Pull request'lerde UI ekran görüntüleri

UI/frontend görevleri için OpenCode, PNG ekran görüntülerini `frontend/.e2e-artifacts/` gibi gitignore'lanmış bir yol altında kaydetmelidir (kaynak kod içinde değil). Frontend bağımlılıkları eksikse, runner prompt'u hedefli bir paket kurulumuna (örneğin `bun install`) ve yalnızca UI'ı yakalamak amacıyla kısa ömürlü bir önizleme/`bun run dev` çalıştırmasına izin verir. Heym bu görselleri tek bir paylaşılan GitHub **prerelease**'ine (`opencode-pr-assets`) `<branch>-…` olarak adlandırılan asset'ler halinde yükler, ardından bunları **pull request açılmadan önce** PR açıklamasına gömer; böylece yeni bir PR, ekran görüntülerini hâlihazırda içerecek şekilde oluşturulur (mevcut PR'ler yerinde güncellenir).

OpenCode ayrıca, Heym'in pull request'i `Done.` gibi yer tutucular yerine anlamlı bir konu başlığıyla açabilmesi için `PR_TITLE: …` satırıyla bitirmesi konusunda yönlendirilir.

OpenCode bazen bir turu görev ortasında sonlandırır ("…Şimdi bir ekran görüntüsü alayım"), bu da ekran görüntüsü yakalanmadan önce çalıştırmayı sonlandırır. Bunu önlemek için runner prompt'u, ekran görüntülerinin **son mesajdan önce** yakalanmasını gerektirir; çalıştırma yine de yayımlanabilir bir özet olmadan ya da bir UI değişikliği olup ekran görüntüsü olmadan tamamlanırsa, Heym tamamlamak için aynı workspace'te bir OpenCode geçişi daha çalıştırır. Bir UI değişikliğinin ardından hâlâ ekran görüntüsü yoksa, PR gövdesine görünür bir not eklenir; böylece bu eksiklik asla sessiz kalmaz.

## GitHub'a neler yayımlanır

**Task Prompt** özel bir girdidir, PR içeriği değildir. Yalnızca iki şey yayımlanır: kod değişikliğinin ne yaptığını açıklayan bir `## Change Summary` ve ekran görüntüleri yakalandığında bir `## Screenshots` bölümü. PR başlığı yalnızca değişiklik özetinden türetilir.

Runner prompt'u bu politikayı belirtir ve Heym bunu çalıştırmadan sonra da uygular: herhangi bir şey commit edilmeden veya pull request olarak açılmadan önce, prompt yankısı bölümlerini (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ve görev prompt'undan birebir kopyalanan herhangi bir paragrafı özetten, PR gövdesinden ve commit mesajından çıkarır.

Heym, `## Change Summary` bölümünü ajanın mesajlarından okur; en son söylediğini almaz; çünkü OpenCode her adım için bir mesaj üretir ve sonuncusu genellikle çalıştırma ortası yorumdur. Adım anlatımı (`Both pass. Let me do a final review:`) da PR başlığı veya commit konusu olarak reddedilir. Çalıştırma kullanılabilir bir değişiklik özeti üretmezse, pull request yorum yayımlamak yerine değiştirilen dosyaları listelemeye geri döner.

## Bir ajan aracı olarak

OpenCode Go düğümü, ajanın kodlama görevlerini devredebilmesi için bir **AI Agent** düğümünün tool handle'ına bağlanabilir. Düğüm üzerinde credential, GitHub credential ve repository'yi yapılandırın, ardından **Task Prompt** (ve isteğe bağlı olarak **Repository URL**) alanını ajan tarafından sağlanan toggle ile işaretleyin; böylece ajan bunları çağrı sırasında sağlar.

## Örnek

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## İlgili

- [Codex Düğümü](./codex-node.md)
- [GitHub Düğümü](./github-node.md)
- [Agent Düğümü](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Düğüm Türleri](../reference/node-types.md)
