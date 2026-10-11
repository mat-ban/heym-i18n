# Codex

**Codex** düğümü, OpenAI Codex CLI'yi bir GitHub deposuna karşı izole bir Heym çalışma alanında çalıştırır. Testleri düzeltme, dosyaları düzenleme, bir yama üretme veya taslak bir pull request açma gibi kodlama görevleri için tasarlanmıştır.

## Genel Bakış

| Özellik | Değer |
|----------|-------|
| Girişler | 1 |
| Çıkışlar | 1, ayrıca `question` |
| Kimlik Bilgisi | Codex access token + GitHub |
| Çıkış | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Kimlik Doğrulama

**OpenAI Codex** kimlik bilgisi iki kimlik doğrulama modunu destekler:

| Mod | Açıklama |
|------|-------------|
| **Sign in with ChatGPT** (önerilen) | ChatGPT Plus/Pro aboneliğinizi kullanan OAuth (PKCE) oturum açma yöntemi; böylece çalıştırmalar **token başına API maliyeti doğurmaz**. Kimlik bilgisi iletişim kutusunda **Sign in with ChatGPT** seçeneğine tıklayın, tarayıcınızda yetkilendirin, ardından `localhost:1455` yönlendirme URL'sini Heym'e geri yapıştırın. Heym, ortaya çıkan token paketini saklar ve süresi doldukça otomatik olarak yeniler. |
| **Access token** | Yalnızca yerel Codex çalıştırıcısı tarafından kullanılan bir ChatGPT/Codex `access_token` değerini yapıştırın. |

Codex kimlik bilgisi için API anahtarları kabul edilmez. Düğüm, bulut Codex görevlerini göndermez; depoyu Heym çalışma zamanı içinde klonlar, ChatGPT token paketini izole bir `auth.json` dosyasına yazar (veya `CODEX_ACCESS_TOKEN` değerini geçirir) yalnızca Codex sürecine iletir ve token'ı `$credentials` dışında tutar.

Düğüm ayrıca özel depoları klonlamak, çalışma dalını push etmek ve taslak pull request'ler oluşturmak için bir **GitHub** kimlik bilgisi gerektirir.

Docker dağıtımlarında Heym, Codex'i aynı Heym imajından bir kardeş container içinde çalıştırır (ayrı bir GHCR imajı değil). Bu container yalnızca Codex çalışma alanı birimini bağlar ve Codex'in kendi bubblewrap sandbox'ının namespace'ler ve yeni bir `/proc` oluşturmasına izin verir. Çalıştırıcı `SYS_ADMIN`, kısıtlanmamış seccomp ve AppArmor ile `systempaths=unconfined` (Docker Engine 25+) ekler. Son bayrak olmadan, her komut başlatılmadan önce `bwrap: Can't mount proc on /newroot/proc: Operation not permitted` hatasıyla başarısız olur.

OpenAI referansları:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## Alanlar

| Alan | Açıklama |
|-------|-------------|
| Codex Credential | OpenAI Codex kimlik bilgisi (ChatGPT oturum açma veya `access_token`) |
| GitHub Credential | Depo erişimi için kullanılan GitHub PAT kimlik bilgisi |
| Repository URL | HTTPS GitHub depo URL'si |
| Base Branch | Codex çalışmadan önce klonlanacak dal, varsayılan `main` |
| Model | İsteğe bağlı Codex modeli (düzenlenebilir açılır liste, örn. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); boş bırakılırsa Codex'in varsayılanı kullanılır |
| Reasoning Effort | Codex akıl yürütme derinliği: `low`, `medium`, `high`, `xhigh` (Extra High), `max` veya `ultra` (varsayılan `medium`) |
| Task Prompt | Codex için kodlama görevi; `$input.text` gibi ifadeleri destekler |
| Publish Mode | Değişikliklerin nasıl teslim edileceği (aşağıdaki tabloya bakın) |
| Branch Name | PR/commit modları için çalışma dalı, varsayılan `codex/$executionId` |
| Timeout | Saniye cinsinden maksimum Codex yürütme süresi |

## Publish Modları

| Mod | Ne yapar |
|------|--------------|
| `diff_only` | Dosyaları yerel olarak düzenler ve yamayı ve değiştirilen dosyaları döndürür. Hiçbir şey push edilmez. |
| `draft_pr` | Dalı commit eder, push eder ve taslak bir pull request açar. |
| `open_pr` | Dalı commit eder, push eder ve incelemeye hazır (taslak olmayan) bir pull request açar. |
| `commit_push` | Dalı commit eder ve push eder, pull request açmaz. |
| `direct_commit` | Doğrudan temel dala commit eder ve push eder (ayrı dal veya PR yok). |
| `open_or_update_pr` | Ajanın mevcut açık PR'ı varsa onu günceller — dal adı farklı olsa bile çalıştırıcı bunu yazar + temel dal ile bulur — aksi takdirde yeni bir tane açar. Yeniden çalıştırmalar ve "açık PR'ı güncelle" talimatları için en uygunudur. |
| `update_existing_pr` | Mevcut dal/PR'a bir commit ekler; henüz yoksa bir tane açar. |
| `patch_artifact` | Diff'i indirilebilir bir dosya olarak kaydeder ve `patchUrl` döndürür. Hiçbir şey push edilmez. |

## Çıkışlar

| Anahtar | Açıklama |
|-----|-------------|
| `status` | `completed` veya `needs_input` |
| `summary` | Codex'in özeti |
| `validation` | Codex tarafından bildirilen doğrulama notları, testler veya kontroller |
| `diff` | Dosyalar değiştiğinde Git yaması |
| `changedFiles` | Değiştirilen dosya yolları |
| `threadId` | Mevcut olduğunda Codex thread/oturum kimliği |
| `branchName` | Çalışma dalı adı |
| `pullRequestUrl` | `draft_pr`, `open_pr`, `open_or_update_pr` ve `update_existing_pr` modlarında PR URL'si |
| `pushedBranch` | Commit/PR modlarında push edilen dal |
| `patchUrl` | `patch_artifact` modunda diff için indirme bağlantısı |
| `usage` | Mevcut olduğunda Codex CLI tarafından bildirilen kullanım meta verileri |
## Pull request'lerde UI ekran görüntüleri

UI/frontend görevleri için Codex, PNG ekran görüntülerini `frontend/.e2e-artifacts/` gibi gitignore'lanmış bir yol altına kaydetmelidir (kaynak kod içine değil). Frontend bağımlılıkları eksikse Codex, `bun install` (veya npm/pnpm install) çalıştırabilir ve yalnızca UI'ı yakalamak amacıyla kısa ömürlü bir preview/`bun run dev` başlatabilir. Heym bu görselleri `<branch>-…` olarak adlandırılan asset'ler halinde tek bir paylaşılan GitHub **prerelease**'ine (`codex-pr-assets`) yükler, ardından bunları **pull request açılmadan önce** PR açıklamasına gömer; böylece yeni bir PR, ekran görüntülerini hâlihazırda içerecek şekilde oluşturulur (mevcut PR'ler yerinde güncellenir). Codex ayrıca anlamlı bir `pull_request_title` belirlemelidir (asla `Done.` gibi yer tutucular kullanmamalıdır).

Codex bazen bir turu görev ortasında sonlandırır ("…Şimdi bir ekran görüntüsü alayım"), bu da ekran görüntüsü yakalanmadan önce çalıştırmayı sonlandırır. Bunu önlemek için runner prompt'u, ekran görüntülerinin **nihai sonuçtan önce** yakalanmasını gerektirir; eğer çalıştırma yine de yayımlanabilir bir özet olmadan veya bir UI değişikliği olup ekran görüntüsü olmadan tamamlanırsa, Heym tamamlamak için aynı workspace'te bir Codex turu daha çalıştırır. Bir UI değişikliğinin hâlâ ekran görüntüsü yoksa, PR gövdesine görünür bir not eklenir; böylece bu eksiklik asla sessiz kalmaz.

## GitHub'a neler yayımlanır

**Task Prompt** özel bir girdidir, PR içeriği değildir. Yalnızca iki şey yayımlanır: kod değişikliğinin ne yaptığını açıklayan bir `## Change Summary` ve ekran görüntüleri yakalandığında bir `## Screenshots` bölümü. PR başlığı yalnızca değişiklik özetinden türetilir.

Runner prompt'u bu politikayı belirtir ve Heym bunu çalıştırmadan sonra da uygular: herhangi bir şey commit'lenmeden veya pull request olarak açılmadan önce, prompt yankısı içeren bölümleri (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) ve görev prompt'undan birebir kopyalanan herhangi bir paragrafı özetten, PR gövdesinden ve commit mesajından çıkarır. `Both pass. Let me do a final review:` gibi adım anlatımları da PR başlığı veya commit konusu olarak reddedilir.

## Takip Soruları

Codex'in eksik gereksinimlere veya bir ürün kararına ihtiyacı olursa `needs_input` döndürür. Heym yürütmeyi duraklatır ve bir `question` çıktı tutamacı sunar. Bu tutamacı bir bildirim dalına, örneğin Slack veya Send Email'e bağlayarak inceleyiciye genel takip bağlantısını gönderin.

İnceleyici yanıtladığında Heym, kaydedilmiş workspace meta verilerinden aynı yürütme anlık görüntüsünü ve Codex thread'ini sürdürür.

## Bir agent aracı olarak

Codex düğümü, agent'ın kodlama görevlerini devredebilmesi için bir **AI Agent** düğümünün tool tutamacına bağlanabilir. Düğümde credential, GitHub credential ve repository'yi yapılandırın, ardından **Task Prompt** (ve isteğe bağlı olarak **Repository URL**) alanını agent tarafından sağlanan toggle ile işaretleyin; böylece agent bunları çağrı sırasında sağlar. Codex bir araç olarak çalıştığında, `needs_input` sonucu workflow'u duraklatmak yerine agent'a satır içi olarak döndürülür; böylece agent isteği iyileştirip Codex'i yeniden çağırabilir.

## Örnek

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## İlgili

- [GitHub Düğümü](./github-node.md)
- [Agent Düğümü](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials Sharing](../reference/credentials-sharing.md)
- [Düğüm Türleri](../reference/node-types.md)
