# Dijeljenje Vjerodajnica

Vjerodajnice se mogu dijeliti s drugim korisnicima kako bi njihovi workflows mogli koristiti Vaše API ključeve. Pogledajte [Vjerodajnice](./credentials.md) za pregled i [Karticu Vjerodajnica](../tabs/credentials-tab.md) za dodavanje i upravljanje vjerodajnicama.

## Dijeljenje Vjerodajnica s LLM-om

Kako biste omogućili LLM-u ili AI agentu korištenje API ključa, pohranite ključ kao vjerodajnicu i dopustite čvoru koji šalje zahtjev da ga priloži. Model odlučuje što će pozvati; čvor autentificira poziv kada se izvršava.

- **Pohranite tajnu kao vjerodajnicu.** Osjetljive vrijednosti su šifrirane u mirovanju i maskirane u korisničkom sučelju nakon stvaranja.
- **Referencirajte je gdje se šalje zahtjev.** [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md) čvorovi odabiru svoju modelsku vjerodajnicu prema ID-u, a HTTP zahtjevi stavljaju `$credentials.CredentialName` u auth header. Držite tajne izvan polja za prompt, jer se sve u promptu šalje pružatelju modela kao tekst.
- **Dajte agentu alate, a ne ključeve.** Kada Agent poziva HTTP čvor, MCP server ili pod-workflow kao alat, vjerodajnica se primjenjuje unutar tog alata i model prima rezultat alata.
- **Izlazi su maskirani.** Kada se vrijednost vjerodajnice dulje od sedam znakova pojavi u izlazu čvora, zadržava se samo prvih sedam znakova, tako da odgovor koji ponavlja ključ prikazuje samo taj prefiks u rezultatima i tragovima. Pogledajte [Maskiranje Izlaza](#output-masking).
- **Dopustite asistentu da stvara vjerodajnice.** Kada [AI Asistent](./ai-assistant.md#credentials) ili kartica Chat stvara vjerodajnicu, vidi samo naziv i tip, a Vi unosite tajnu u uobičajenom obrascu za vjerodajnice.
- **Dijelite s ljudima na isti način.** Podijelite vjerodajnicu s korisnikom ili timom, kao što je opisano u nastavku, i njihovi workflows mogu koristiti Vaš ključ putem vlastitih LLM i Agent čvorova.

## Model Dijeljenja

- **CredentialShare** – Povezuje `credential_id` s `user_id` (jedinstveno po paru)
- **Dijeli putem e-pošte** – `POST /api/credentials/{credential_id}/shares` s e-poštom; korisnik se pretražuje i dodaje
- **Poništi** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Također možete dijeliti vjerodajnice s [Timovima](./teams.md):

- **CredentialTeamShare** – Povezuje `credential_id` s `team_id`; svi članovi tima dobivaju pristup
- **Dijeli s timom** – `POST /api/credentials/{credential_id}/team-shares` s `team_id`
- **Poništi dijeljenje tima** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Dijeljene vjerodajnice prikazuju indikator u korisničkom sučelju [Kartice Vjerodajnica](../tabs/credentials-tab.md).

## Vjerodajnice Širokog Dosega

Dijeljenje vjerodajnice daje primatelju sve što ta vjerodajnica može učiniti. Za većinu integracija to je ograničeno na jedan workspace ili dozvole jednog API ključa, ali neke vjerodajnice su znatno šire.

> **Google Drive vjerodajnice daju potpuni pristup Drive-u.** [Google Drive](../nodes/google-drive-node.md) vjerodajnica je autorizirana s `https://www.googleapis.com/auth/drive` opsegom tako da čvor može raditi na datotekama koje već posjedujete. Dijeljenje s korisnikom ili timom daje svakome od njih mogućnost **čitati, mijenjati i trajno brisati bilo što u Vašem Google Drive-u** putem workflow-a — ne samo datoteke koje ste imali na umu. Dijelite je samo s osobama kojima biste izravno dali potpuni pristup Drive-u.

Ako trebate ograničiti izloženost, stvorite namjenski Google račun s pristupom samo onim mapama koje workflow treba, i povežite vjerodajnicu s tim računom umjesto s Vašim glavnim.

Vjerodajnica **Decision Model** nosi endpoint i, kada je postavljena, API ključ. Dijeljenje omogućuje primatelju korištenje tog ključa iz bilo kojeg workflow-a koji mogu pokrenuti, baš kao i vjerodajnica LLM-a.

Vjerodajnica **Model Router** dijeli sve što usmjerava. Osobe s kojima je dijelite mogu slati zahtjeve protiv svake vjerodajnice u njenom popisu opcija, a ti zahtjevi troše Vaše ključeve. Ne mogu čitati ključeve, a vjerodajnice se ne pojavljuju u njihovom vlastitom popisu vjerodajnica.

Ovo je isto kao dijeljenje OpenAI vjerodajnice izravno, i to je ono što čini router korisnim za tim. Ako to ne želite, dijelite pojedinačne vjerodajnice umjesto toga i dopustite svakoj osobi da odabere model.

## Dijeljenje s Suradnicima na Workflow-u

Kada dijelite workflow, suradnici ga mogu otvoriti i pokrenuti, ali ne mogu koristiti Vaše vjerodajnice osim ako ih ne podijelite s njima također. Ovo se odnosi na vjerodajnice u glavnom workflow-u i u bilo kojim pod-workflow-ima koje poziva. Podijelite svaku vjerodajnicu s istim korisnicima ili timovima koje ste pozvali u workflow. Pod-workflow-i također moraju biti dijeljeni odvojeno od uređivača djetetovog workflow-a. Pogledajte [Organizacija Workflow-a](./workflow-organization.md#sharing-workflows).

## Kontekst Izvršenja

Kada se workflow izvršava, vjerodajnice se rješavaju za **vlasnika workflow-a** (ili trenutnog korisnika kada se izvršava). `get_credentials_context()` spaja:

1. **Vjerodajnice u vlasništvu** – `Credential.owner_id == user_id`
2. **Vjerodajnice dijeljene s korisnikom** – `CredentialShare` gdje `CredentialShare.user_id == user_id`
3. **Vjerodajnice dijeljene s timom** – `CredentialTeamShare` gdje je korisnik član tima

Sve se spaja u jedan kontekstni rječnik s ključevima prema nazivima vjerodajnica.

## Korištenje u Workflows
### Prema Nazivu (Expression DSL)

Vjerodajnice su dostupne kao `$credentials.CredentialName` u [Expression DSL](./expression-dsl.md). Koristite ovo za:

- HTTP čvorove (Bearer/Header autentifikacija)
- Telegram čvorove
- Slack čvorove
- Notion bearer tokene u prilagođenim HTTP zahtjevima (interni token ili OAuth pristupni token)
- Bilo koji čvor koji prihvaća izraze za autentifikaciju

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Prema ID-u (credentialId)

Neki čvorovi pohranjuju `credentialId` (UUID) u `node.data`:

| Tip Čvora | Polje | Opis |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Generiranje Slika | `credentialId` | LLM API vjerodajnica |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Vjerodajnica za pristup Codexu i GitHub vjerodajnica |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Vjerodajnica za OpenCode Go gateway i GitHub vjerodajnica |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud email/API token ili Data Center korisničko ime/lozinka |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion interni token ili OAuth vjerodajnica za radnu površinu |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry autentifikacijski token i opcionalna osnovna URL adresa |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase URL projekta i API ključ |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Detalji o ClickHouse vezi (host, port, autentifikacija, baza podataka) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Vjerodajnica za Telegram bot |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord javni ključ ili webhook vjerodajnica |
| Vektorska Spremišta | `credential_id` | Qdrant ili Postgres (pgvector) vektorska DB, putem Qdrant, Psql ili prilagođene RAG vjerodajnice |
| Evaluacije | `credential_id`, `judge_credential_id` | Vjerodajnica modela; vjerodajnica modela ili Odluka Modela za LLM-as-Judge suca |
| [Playwright](../nodes/playwright-node.md) AI korak | `credentialId` | LLM/Vision model (za AI korak i [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Izvršitelj učitava vjerodajnicu izravno iz baze podataka prema ID-u i dekriptira konfiguraciju.

## Maskiranje Izlaza

Nakon izvršenja, `mask_sensitive_output()` maskira vrijednosti vjerodajnica u izlazima, zadržavajući prvih sedam znakova svake tajne duže od sedam znakova i zamjenjujući ostatak s `**`, tako da tajne nisu izložene u rezultatima ili tragovima.

## Povezano

- [Kartica Vjerodajnica](../tabs/credentials-tab.md) – Dodajte i dijelite vjerodajnice
- [Integracije Trećih Strana](./integrations.md) – Detaljna postavka za svaki tip vjerodajnice
- [Timovi](./teams.md) – Dijelite s timovima
- [Expression DSL](./expression-dsl.md) – `$credentials` sintaksa
- [Tipovi Čvorova](./node-types.md) – Čvorovi koji koriste vjerodajnice ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Čvor](../nodes/agent-node.md) – Koristi `credentialId` za LLM
