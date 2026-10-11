# Akreditācijas Dati

**Akreditācijas Datu** cilne pārvalda API atslēgas un slepenos kodus, kurus izmanto mezgli. Pievienojiet šeit akreditācijas datus un atsaucieties uz tiem pēc nosaukuma darba plūsmu mezglos. Lai iegūtu pārskatu par to, kas ir akreditācijas dati un kā mezgli tos izmanto, skatiet [Akreditācijas Dati](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Skatīt Akreditācijas Datu demonstrāciju</a></p>

## Akreditācijas Datu Veidi

| Veids | Lietošanas Gadījums |
|-------|---------------------|
| **OpenAI** | OpenAI API atslēga LLM, Agent un RAG mezgliem |
| **Google** | Google AI (Gemini) API atslēga |
| **GitHub** | GitHub personīgā piekļuves atslēga (PAT) GitHub API, GitHub mezglu darba plūsmām, MCP serveriem un aģentu darba plūsmām; opcional GitHub Enterprise `base_url` |
| **Linear** | Linear personīgā API atslēga vai OAuth2 komandām, projektiem, problēmām un komentāriem |
| **Notion** | Iekšējā integrācijas atslēga vai publiskās integrācijas OAuth darba telpas autorizācija |
| **Custom** | Pielāgoti LLM galapunkti |
| **Bearer** | Bearer atslēga HTTP autentifikācijai |
| **Header** | Pielāgota galvene atslēga-vērtība HTTP pieprasījumiem |
| **Telegram** | Telegram bot atslēga un opcional webhook slepenais kods |
| **Slack** | Slack ienākošā webhook URL |
| **Discord** | Discord ienākošā webhook URL |
| **Discord Trigger** | Discord lietojumprogrammas publiskā atslēga |
| **IMAP** | Ienākošā pasta kastes triggera akreditācijas dati |
| **SMTP** | E-pasta sūtīšanas akreditācijas dati |
| **Redis** | Redis savienojums |
| **RAG: Qdrant + OpenAI** | Vektoru krātuve RAG mezgliem, ko atbalsta ārējais Qdrant serveris |
| **RAG: Psql + OpenAI** | Vektoru krātuve RAG mezgliem, ko atbalsta Heym paša Postgres datubāze (pgvector) — bez ārējās pakalpojuma |
| **RAG: Custom Embeddings** | Vektoru krātuve RAG mezgliem, izmantojot jebkuru OpenAI saderīgu embedding galapunktu, ar Qdrant vai Postgres (pgvector) kā krātuvi |
| **Cohere** | Cohere API embeddingiem |

## Akreditācijas Datu Pievienošana

1. Noklikšķiniet uz **Pievienot Akreditācijas Datus**
2. Izvēlieties akreditācijas datu veidu
3. Ievadiet nepieciešamās vērtības (API atslēga, URL utt.)
4. Piešķiriet tam nosaukumu atsaucei mezglos

GitHub gadījumā pašreizējā akreditācijas datu plūsma ir balstīta uz PAT. Ieteicams izmantot smalki regulētas PAT. GitHub lietojumprogrammu instalēšanas plūsmas šobrīd nav pirmās klases UI. Ja izmantojat GitHub Enterprise Server, varat arī iestatīt opcional GitHub API pamata URL, piemēram, `https://github.example.com/api/v3`.

Linear gadījumā izvēlieties **Personīgā API atslēga** vai **OAuth2** dialogā. Personīgās API atslēgas tiek izveidotas
sadaļā **Iestatījumi → Drošība un Piekļuve → Personīgās API atslēgas** Linear. OAuth2 izmanto Linear OAuth
lietojumprogrammas Klienta ID un Klienta Slepeno kodu, ar `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
reģistrētu kā pāradresācijas URI. Akreditācijas dati darbojas ar Linear lietotāja, kurš tos izveidoja vai autorizēja, atļaujām. Izmantojiet **Pārbaudīt Savienojumu** akreditācijas datu dialogā, lai pārbaudītu API atslēgu vai
OAuth token pirms saglabāšanas.

Attiecībā uz **Notion**, izvēlieties **Iekšējā atslēga** vai **OAuth** dialogā. OAuth izmanto Klienta ID un
Klienta Slepeno kodu no jūsu Notion publiskās integrācijas; Heym tos glabā šifrētus akreditācijas datos.
Izmantojiet **Pārbaudīt Savienojumu**, lai pārbaudītu Supabase, Linear vai Notion akreditācijas datus pirms darba plūsmas saglabāšanas. Skatiet
[Trešo Pušu Integrācijas](../reference/integrations.md#notion) par Notion iestatīšanas detaļām.

OAuth akreditācijas dati atver pakalpojumu sniedzēja autorizācijas lapu uznirstošajā logā. Ja pārlūkprogramma to bloķē, izmantojiet saiti **Atvērt autorizācijas lapu** zem Savienot pogas; dialogs paziņo, kad savienojums ir pabeigts. Kad jauni akreditācijas dati ir savienoti, poga rāda **Savienots**.

## Rediģēšana un Dzēšana

- **Rediģēt** – Atjaunināt akreditācijas datu vērtības (jutīgās vērtības ir maskētas)
- **Dzēst** – Noņemt akreditācijas datus; darba plūsmas, kas tos izmanto, būs nepieciešams aizstājējs

Rediģējot **GitHub** akreditācijas datus GitHub Enterprise Server, atstājot opcional **GitHub
API Pamata URL** tukšu, tiek saglabāta esošā Enterprise galapunkta. Ievadiet jaunu URL tikai tad, ja vēlaties mainīt šo galapunktu.

## Koplietošana

- [Koplietojiet akreditācijas datus](../reference/credentials-sharing.md) ar citiem lietotājiem pa e-pastu vai ar [Komandām](../reference/teams.md)
- Koplietotie akreditācijas dati parādās ar indikatoru
- Atcelt koplietošanu no akreditācijas datu kartes izvēlnes
## Izmantošana mezglos

Atsaucieties uz akreditācijas datiem pēc nosaukuma mezgla konfigurācijā. Piemēram:
- [LLM mezgls](../nodes/llm-node.md) – Izvēlieties akreditācijas datus modeļa API
- [HTTP mezgls](../nodes/http-node.md) – Izmantojiet Bearer vai Header akreditācijas datus autentifikācijai
- [Aģenta mezgls](../nodes/agent-node.md) – Nododiet GitHub tokenus MCP servera vides mainīgajiem, piemēram, `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub mezgls](../nodes/github-node.md) – Veiciet vietējās GitHub krātuves, lietotāja, problēmu, pārskatu, izlaidumu, darba plūsmu, satiksmes un failu operācijas
- [Linear mezgls](../nodes/linear-node.md) – Lasiet darba telpas metadatus un automatizējiet Linear problēmas un komentārus
- [Notion mezgls](../nodes/notion-node.md) – Pārvaldiet Notion datu bāzes, datu avotus, lapas un blokos
- [RAG mezgls](../nodes/rag-node.md) – Izmantojiet Qdrant vai Postgres (pgvector) akreditācijas datus vektoru krātuvei
- [Telegram Trigger mezgls](../nodes/telegram-trigger-node.md) – Saņemiet Telegram bot webhook
- [Telegram mezgls](../nodes/telegram-node.md) – Sūtiet Telegram bot ziņojumus
- [Discord Trigger mezgls](../nodes/discord-trigger-node.md) – Saņemiet Discord mijiedarbības webhook
- [Discord mezgls](../nodes/discord-node.md) – Sūtiet Discord webhook ziņojumus
- [IMAP Trigger mezgls](../nodes/imap-trigger-node.md) – Pārbaudiet kopīgu iesūtni jaunām e-pasta vēstulēm

Skatiet [Expression DSL](../reference/expression-dsl.md), lai atsauktos uz akreditāciju atbalstītām vērtībām izteiksmēs.

## Saistītie

- [Trešo pušu integrācijas](../reference/integrations.md) – Detalizēta iestatīšanas rokasgrāmata katram akreditācijas datu tipam (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack un citi)
- [Akreditācijas datu koplietošana](../reference/credentials-sharing.md) – Koplietojiet akreditācijas datus ar citiem lietotājiem
- [Drošība](../reference/security.md) – Šifrēšana miera stāvoklī, sesiju pārvaldība, ātruma ierobežošana
- [Mezglu tipi](../reference/node-types.md) – Mezgli, kas izmanto akreditācijas datus ([LLM](../nodes/llm-node.md), [Aģents](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Sūtīt e-pastu](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vektoru krātuves cilne](./vectorstores-tab.md) – Izmanto Qdrant vai Postgres (pgvector) akreditācijas datus
- [Čata cilne](./chat-tab.md) – Izmanto OpenAI/Google akreditācijas datus
- [Kontekstualais demonstrējums](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata informācijas paneļa virsmām
