# Poverilnice

Poverilnice shranjujejo API ključe in skrivnosti, ki jih uporabljajo vozlišča v workflow-ih. Dodate jih v [Zavihek Poverilnice](../tabs/credentials-tab.md) in jih navajate po imenu v konfiguraciji vozlišča.

## Kaj so Poverilnice

- **Shranjene po uporabniku** – Vsaka poverilnica pripada uporabniku in jo je mogoče [deliti](./credentials-sharing.md) z drugimi uporabniki ali [Timom](./teams.md).
- **Šifrirane v mirovanju** – Občutljive vrednosti so šifrirane; uporabniški vmesnik jih po ustvarjanju prikrije.
- **Navajene po imenu** – Vozlišča izberejo poverilnico po imenu (ali ID-ju). Izvršilni motor ob izvajanju razreši poverilnico za lastnika workflow-a.

## Kako jih Vozlišča Uporabljajo

| Tip vozlišča | Tipična poverilnica | Namen |
|---------------|---------------------|-------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Vrednotenja](../tabs/evals-tab.md) | OpenAI, Google, Custom | API ključ za model |
| [Odločitev](../nodes/decision-node.md), [Vrednotenja](../tabs/evals-tab.md) sodnik | Model odločitev | Osnovni URL končne točke modela odločitev, plus opcijski API ključ |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Privzete vrednosti | Usmerjevalnik modelov (Auto Model) | Izbere, kateri od vaših modelov obravnava vsako zahtevo, z uporabo modela odločitev |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Prijava na ChatGPT naročnino (OAuth) ali dostopni token Codex za izvajalca, plus GitHub PAT za operacije z repozitoriji |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API ključ OpenCode Go prehodne točke (opcijski osnovni URL) za izvajalca, plus GitHub PAT za operacije z repozitoriji |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Osebni dostopni token (PAT) za klice GitHub API, operacije GitHub vozlišča in MCP integracije |
| [Jira](../nodes/jira-node.md) | Jira | Oblačni e-poštni/API token, uporabniško ime/geslo Data Center ali osebni dostopni žeton, osnovni URL spletnega mesta Jira, način namestitve in opcijska različica REST API |
| [Linear](../nodes/linear-node.md) | Linear | Osebni API ključ ali OAuth2 za ekipe, projekte, težave in komentarje |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Avtentikacija za zahteve |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token bota in opcijska skrivnost webhook-a |
| [Discord](../nodes/discord-node.md) | Discord | URL za prihajajoči webhook |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Javni ključ) | Javni ključ aplikacije za preverjanje podpisa |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Povezava do vektorske shrambe (zunanji Qdrant ali Heym-ov lastni Postgres preko pgvector), z OpenAI ali katero koli OpenAI-omogočeno končno točko za vdelovanje |
| [Slack](../nodes/slack-node.md) | Slack | Webhook ali API ključ |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Povezava do vhodne poštne predale |
| [Pošlji e-pošto](../nodes/send-email-node.md) | SMTP | Mail strežnik |
| [Redis](../nodes/redis-node.md) | Redis | Povezava |
| [Grist](../nodes/grist-node.md) | Grist | API ključ + URL strežnika |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | ID odjemalca + skrivnost odjemalca + soglasje OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | ID odjemalca + skrivnost odjemalca + soglasje OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | ID odjemalca + skrivnost odjemalca + soglasje OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL projekta + API ključ (+ opcijski privzeti shema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Gostitelj + vrata + uporabniško ime/geslo + baza podatkov (+ varno) |
| [Notion](../nodes/notion-node.md) | Notion | Notranji integracijski token ali javni integracijski ID odjemalca + skrivnost odjemalca + soglasje OAuth |
| [Sentry](../nodes/sentry-node.md) | Sentry | Avtentikacijski token plus opcijski osnovni URL za samostojno gostovanje |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Dostopni ključ, skrivni ključ, regija |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Za podrobno nastavitev (gostitelji, vrata, specifična polja za ponudnike) si oglejte [Integracije tretjih oseb](./integrations.md). To vključuje nastavitev Telegram bota, vhodno e-pošto preko IMAP in odhodno e-pošto preko SMTP.

Poverilnice GitHub lahko vključujejo tudi opcijski `base_url`, ko ciljate na GitHub Enterprise Server namesto GitHub.com. Ko urejate poverilnico GitHub za rotacijo tokena, pustite `base_url` prazno, da ohranite obstoječo končno točko Enterprise. Vnesite nov URL le, ko želite spremeniti to končno točko.

Poverilnice Jira, Linear, Supabase, Notion, Sentry in ClickHouse izpostavljajo **Preizkusi povezave** v pogovornem oknu poverilnice. Za Jira preverjanje pokliče trenutni uporabniški endpoint Jira. Za Linear preverjanje pokliče Linear API z `getViewer` in potrdi, da je API ključ ali OAuth token veljaven. Pri urejanju lahko preizkusite, ne da bi ponovno vnašali API ključ, če je shranjena skrivnost še vedno prisotna. Za Notion izberite **Notranji token** ali **OAuth** v pogovornem oknu; OAuth uporablja ID odjemalca in skrivnost odjemalca iz vaše javne integracije Notion. Oglejte si [Integracije tretjih oseb](./integrations.md#notion) za podrobnosti o nastavitvi Notion.
## Uporaba paketa za kodiranje

Zavihek **AI Defaults** v [Nastavitvah](./user-settings.md) prikazuje preostalo uporabo paketa za kodiranje za vaše poverilnice Codex (lastne in deljene). Za vsako poverilnico Codex prikaže horizontalno vrstico za vsak aktivni časovni okvir omejitve — običajno **5 ur** in/ali **tedenski** okvir, odvisno od vašega načrta — s procentom preostale kvote in odštevanjem do ponastavitve. Podatki izhajajo iz odzivnih glav v ozadju Codex, ki se pridobivajo na zahtevo.

Poverilnice OpenCode Go so tam prav tako navedene, vendar označene kot **"uporaba nedostopna"**: OpenCode zen prehod ne razkriva podatkov o preostali kvoti, zato vrstica ne more biti prikazana.

## V izrazih

Nekatera vozlišča omogočajo izraze za avtentikacijo. Uporabite [Expression DSL](./expression-dsl.md) z `$credentials.CredentialName`, da se sklicujete na razrešeni skrivni ključ poverilnice znotraj izraza. Za vrstico glave, ki jo vsaka vrsta poverilnice potrebuje v HTTP zahtevi, si oglejte [HTTP › Avtentikacija s poverilnicami](../nodes/http-node.md#authenticating-with-credentials).

Poverilnice Codex so namerno izključene iz `$credentials`. Ne glede na to, ali se prijavite z ChatGPT (naročnina, brez stroškov API na podlagi žetonov) ali prilepite `access_token` Codex, se žetoni prenašajo samo v lokalni proces izvajalca Codex. Žetoni za prijavo ChatGPT se samodejno osvežijo, ko potečejo.

Poverilnice Jira so prav tako izključene iz `$credentials`. [Jira vozlišče](../nodes/jira-node.md) naloži poverilnico po `credentialId` med izvajanjem. Za prilagojene REST klice Jira, ki jih ne pokriva Jira vozlišče, uporabite [HTTP vozlišče](../nodes/http-node.md) z osnovno avtentikacijo Jira (`email:api_token` za Jira Cloud ali `username:password` za Data Center / Server), na primer `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Uporabite lahko tudi [Header](../nodes/http-node.md) poverilnico z `Authorization: Basic <base64(user:secret)>`. Za osebne dostopne žetone Jira Data Center / Server namesto tega pošljite `Authorization: Bearer <token>`; sama poverilnica Jira to podpira prek svojega načina avtentikacije **Personal Access Token**.

| Vrsta poverilnice | Vrednost, izpostavljena `$credentials.Name` |
|-------------------|---------------------------------------------|
| Bearer            | Bearer žeton |
| Header            | Celotna vrstica `header key: header value`, pripravljena za uporabo v cURL `-H` argumentu |
| GitHub            | Osebni dostopni žeton |
| Notion            | Notranji `api_token` ali OAuth `access_token` (Bearer žeton za klice API Notion) |
| Sentry            | Sentry avtentikacijski žeton |
| Discord / Slack   | Webhook URL |

Primer:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Uporabite **vozlišče** Notion za nativne operacije z bazami podatkov, stranmi in bloki. Uporabite `$credentials`, kadar prilagojena [HTTP](../nodes/http-node.md) zahteva potrebuje isti Bearer žeton Notion.

## Ustvarjanje poverilnic iz klepeta

[AI Assistant](./ai-assistant.md#credentials), zavihek [Chat](../tabs/chat-tab.md) in [Klepet z Heym](./chat-with-heym.md) lahko ustvarijo poverilnico, kadar jo potrebuje delovni tok, ali kadar koli jo zahtevate. Asistent predlaga vrsto in ime, redni obrazec za poverilnice pa se odpre v pogovoru. Če želite posodobiti poverilnico, ki jo imate, se odpre isti obrazec, pri čemer so njene skrivnosti prikrite. Asistent vidi le ime in vrsto. `heym_chat` preko [MCP](../tabs/mcp-tab.md) ne more ustvarjati, posodabljati ali izbirati poverilnic.

## Sorodno

- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajanje, urejanje, brisanje poverilnic
- [GitHub Vozlišče](../nodes/github-node.md) – Nativne operacije REST GitHub
- [Jira Vozlišče](../nodes/jira-node.md) – Avtomatizacija projektov, težav, komentarjev, priponk, uporabnikov, obvestil in prehodov Jira
- [Linear Vozlišče](../nodes/linear-node.md) – Avtomatizacija GraphQL delovnega prostora in težav Linear
- [Notion Vozlišče](../nodes/notion-node.md) – Iskanje in upravljanje vsebine Notion
- [Sentry Vozlišče](../nodes/sentry-node.md) – Avtomatizacija organizacij, projektov, ekip, težav, dogodkov in izdaj Sentry
- [Deljenje poverilnic](./credentials-sharing.md) – Delite z uporabniki in ekipami
- [Integracije tretjih oseb](./integrations.md) – Vodnik za nastavitev po vrsti poverilnice
- [Expression DSL](./expression-dsl.md) – `$credentials` v izrazih

## Model Router (Avtomatski model)

Model Router ne vsebuje ključa. Vsebuje **odločitveni model poverilnice**, seznam **možnosti modela** — vsaka je obstoječa poverilnica OpenAI, Google ali prilagojena poverilnica plus model — in za vsako možnost prosto besedilo, ki opisuje, kdaj naj se ta možnost uporabi.

Pojavi se v vsakem izbirniku, ki ponuja model: [LLM](../nodes/llm-node.md) in [Agent](../nodes/agent-node.md) vozlišča, Klepet, AI Defaults, Nadzorne plošče, graditelj izrazov in Tabele podatkov. Njegov edini model je **Auto**. Izberite ga, in odločitev model prebere vsako zahtevo in jo usmeri. [Vrednotenja](../tabs/evals-tab.md) ga izključujejo, ker vrednotenje primerja specifične modele, medtem ko usmerjevalnik izbira svojega.

Agent ponovno usmerja, ko napreduje njegov cikel orodij, tako da lahko poceni model prevzame zgodnje poteze, močnejši pa tisto, ki jo potrebuje. Identični vnosi ponovno uporabijo prejšnjo odločitev, tako da cikel plača za odločitev le, ko se je pogovor dejansko premaknil.

### Česar ne more storiti

Avtomatski model se ne more kombinirati z **Responses API**, **Batch načinom** ali **izhodom slik**. Ti preklopniki se onemogočijo, ko je izbran usmerjevalnik, in vsak pojasni zakaj. Preverjanja varnostnih meja in klasifikator politike človeškega pregleda so fiksni klici enega modela in nikoli ne usmerjajo.
### Ko usmerjanje ne uspe

Označite eno možnost **Uporabite to možnost, ko usmerjanje ne uspe**, in izpad odločitvenega modela nikoli ne ustavi izvajanja; uporabi se rezervna možnost, razlog pa se zabeleži pri izvajanju. Brez tega vozlišče ne uspe, namesto da bi ugibalo.

### Oglejte si, kam je zahteva šla

Izvajanja prikazujejo `Auto Model / GPT-5` namesto samega modela, stroški pa ostanejo pripisani modelu, ki je dejansko deloval. Zapis izvajanja na platnu in pogled razpona prikazujeta isto kombinacijo, pogled razpona pa navaja, kateri obrat je šel kam.
