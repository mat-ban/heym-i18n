# Kredencialų Dalijimasis

Kredencialai gali būti dalijami su kitais vartotojais, kad jų workflows galėtų naudoti Jūsų API raktus. Žr. [Kredencialai](./credentials.md) apžvalgai ir [Kredencialų Skirtukas](../tabs/credentials-tab.md) kredencialų pridėjimui ir valdymui.

## Kredencialų Dalijimasis su LLM

Norint leisti LLM arba AI agentui naudoti API raktą, saugokite raktą kaip kredencialą ir leiskite mazgui, kuris atlieka užklausą, jį pridėti. Modelis nusprendžia, ką skambinti; mazgas autentifikuoja skambutį, kai jis vykdomas.

- **Saugokite paslaptį kaip kredencialą.** Jautrūs duomenys yra užšifruoti ramybėje ir paslėpti vartotojo sąsajoje po sukūrimo.
- **Nurodykite jį ten, kur atliekama užklausa.** [LLM](../nodes/llm-node.md) ir [Agent](../nodes/agent-node.md) mazgai pasirenka savo modelio kredencialą pagal ID, o HTTP užklausose į auth antraštę dedamas `$credentials.CredentialName`. Laikykite paslaptis už prompt laukų, nes viskas, kas yra prompt'e, siunčiama modelio tiekėjui kaip tekstas.
- **Duokite agentui įrankius, o ne raktus.** Kai Agentas skambina HTTP mazgui, MCP serveriui arba sub-workflow kaip įrankiui, kredencialas taikomas tame įrankyje, o modelis gauna įrankio rezultatą.
- **Išvestys yra paslėptos.** Kai kredencialo reikšmė, ilgesnė nei septyni simboliai, pasirodo mazgo išvestyje, išlaikomi tik pirmieji septyni simboliai, todėl atsakymas, kuris atspindi raktą, rodo tik tą prefiksą rezultatuose ir vykdymuose. Žr. [Išvesties Maskavimas](#output-masking).
- **Leiskite asistentui kurti kredencialus.** Kai [AI Asistentas](./ai-assistant.md#credentials) arba Chat skirtukas sukuria kredencialą, jis mato tik pavadinimą ir tipą, o Jūs įvedate paslaptį į įprastą kredencialo formą.
- **Dalinkitės su žmonėmis taip pat.** Dalinkitės kredencialu su vartotoju arba komanda, kaip aprašyta žemiau, ir jų workflows gali naudoti Jūsų raktą per jų pačių LLM ir Agent mazgus.

## Kredencialų Dalijimosi Modelis

- **CredentialShare** – Susieja `credential_id` su `user_id` (unikalus kiekvienai porai)
- **Dalijimasis el. paštu** – `POST /api/credentials/{credential_id}/shares` su el. pašto adresu; vartotojas ieškomas ir pridedamas
- **Atšaukti** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Kredencialus taip pat galima dalinti su [Komandomis](./teams.md):

- **CredentialTeamShare** – Susieja `credential_id` su `team_id`; visi komandos nariai gauna prieigą
- **Dalijimasis su komanda** – `POST /api/credentials/{credential_id}/team-shares` su `team_id`
- **Atšaukti komandos dalijimą** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Bendrinami kredencialai rodo indikatorių [Kredencialų Skirtuke](../tabs/credentials-tab.md) vartotojo sąsajoje.

## Plačios Apimties Kredencialai

Dalijimasis kredencialu suteikia gavėjui viską, ką tas kredencialas gali daryti. Daugumai integracijų tai yra apribota vienai darbo erdvei arba vieno API rakto leidimams, tačiau kai kurie kredencialai yra daug platesni.

> **Google Drive kredencialai suteikia pilną prieigą prie Drive.** [Google Drive](../nodes/google-drive-node.md) kredencialas yra autorizuotas su `https://www.googleapis.com/auth/drive` apimtimi, todėl mazgas gali dirbti su failais, kuriuos jau turite. Dalijimasis juo su vartotoju arba komanda suteikia kiekvienam iš jų galimybę **skaityti, keisti ir visam laikui ištrinti bet ką Jūsų Google Drive** per workflow — ne tik failus, kuriuos turėjote omenyje. Dalinkitės juo tik su žmonėmis, kuriems tiesiogiai suteiktumėte pilną Drive prieigą.

Jei reikia apriboti prieigą, sukurkite specialų Google paskyrą, turinčią prieigą tik prie tų aplankų, kurių workflow reikia, ir prijunkite kredencialą prie tos paskyros, o ne prie savo pagrindinės.

**Decision Model** kredencialas turi endpoint'ą ir, kai nustatytas, API raktą. Dalijimasis juo leidžia gavėjui naudoti tą raktą bet kuriame workflow, kurį jie gali vykdyti, lygiai taip pat kaip LLM kredencialas.

**Model Router** kredencialas dalijasi viskuo, ką jis nukreipia. Žmonės, su kuriais dalijatės, gali vykdyti užklausas prieš kiekvieną kredencialą jo pasirinkimų sąraše, o tos užklausos naudoja Jūsų raktus. Jie negali skaityti raktų, o kredencialai neatsispindi jų pačių kredencialų sąraše.

Tai yra tas pats suteikimas, kaip dalijantis OpenAI kredencialu tiesiogiai, ir tai daro maršrutizatorių naudingą komandai. Jei to nenorite, dalinkitės atskirais kredencialais ir leiskite kiekvienam pasirinkti modelį.

## Dalijimasis su Workflow Bendradarbiais

Kai dalijatės workflow, bendradarbiai gali jį atidaryti ir vykdyti, tačiau negali naudoti Jūsų kredencialų, nebent taip pat dalijatės tais kredencialais su jais. Tai taikoma kredencialams pagrindiniame workflow ir bet kuriuose sub-workflow, kuriuos jis kviečia. Dalinkitės kiekvienu kredencialu su tais pačiais vartotojais ar komandomis, kuriuos pakvietėte į workflow. Sub-workflow taip pat turi būti dalijami atskirai nuo vaiko workflow redaktoriaus. Žr. [Workflow Organizacija](./workflow-organization.md#sharing-workflows).

## Vykdymo Kontekstas

Kai workflow vykdomas, kredencialai yra sprendžiami **workflow savininkui** (arba dabartiniam vartotojui, kai vykdoma). `get_credentials_context()` sujungia:

1. **Nuosavybės kredencialai** – `Credential.owner_id == user_id`
2. **Vartotojo dalijami kredencialai** – `CredentialShare`, kur `CredentialShare.user_id == user_id`
3. **Komandos dalijami kredencialai** – `CredentialTeamShare`, kur vartotojas yra komandos narys

Visi jie sujungiami į vieną konteksto žodyną, kurio raktai yra kredencialų pavadinimai.

## Naudojimas Workflows
### Pagal Pavadinimą (Expression DSL)

Kredencialai yra pateikiami kaip `$credentials.CredentialName` [Expression DSL](./expression-dsl.md). Naudokite tai:

- HTTP mazgams (Bearer/Header auth)
- Telegram mazgams
- Slack mazgams
- Notion bearer tokenams individualiuose HTTP užklausose (vidinis tokenas arba OAuth prieigos tokenas)
- Bet kuriam mazgui, kuris priima išraiškas autentifikacijai

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Pagal ID (credentialId)

Kai kurie mazgai saugo `credentialId` (UUID) `node.data`:

| Mazgo tipas | Laukas | Aprašymas |
|-------------|--------|-----------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API kredencialas |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex prieigos tokeno kredencialas ir GitHub kredencialas |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go vartotojo kredencialas ir GitHub kredencialas |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud el. pašto/API tokeno arba Data Center vartotojo vardo/slaptažodžio kredencialas |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion vidinis tokenas arba OAuth darbo vietos kredencialas |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry autentifikavimo tokenas ir pasirenkamas bazinis URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase projekto URL ir API raktas |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse prisijungimo detalės (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot kredencialas |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord viešasis raktas arba webhook kredencialas |
| Vektorių saugykla | `credential_id` | Qdrant arba Postgres (pgvector) vektorinė DB, per Qdrant, Psql arba Custom Embeddings RAG kredencialą |
| Vertinimai | `credential_id`, `judge_credential_id` | Modelio kredencialas; modelio arba Decision Model kredencialas LLM-as-Judge teisėjui |
| [Playwright](../nodes/playwright-node.md) AI žingsnis | `credentialId` | LLM/Vizijos modelis (AI žingsniui ir [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Vykdytojas tiesiogiai įkelia kredencialą iš duomenų bazės pagal ID ir dešifruoja konfigūraciją.

## Išvesties Maskavimas

Po vykdymo, `mask_sensitive_output()` maskuoja kredencialų reikšmes išvestyse, išlaikydamas pirmus septynis simbolius kiekvieno slapto, ilgesnio nei septyni simboliai, ir pakeisdamas likusius simbolius `**`, kad paslaptys nebūtų atskleistos rezultatuose ar pėdsakuose.

## Susiję

- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti ir dalintis kredencialais
- [Trečiųjų šalių integracijos](./integrations.md) – Išsami kiekvieno kredencialo tipo nustatymo informacija
- [Komandos](./teams.md) – Dalintis su komandomis
- [Expression DSL](./expression-dsl.md) – `$credentials` sintaksė
- [Mazgų tipai](./node-types.md) – Mazgai, kurie naudoja kredencialus ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Naudoja `credentialId` LLM.
