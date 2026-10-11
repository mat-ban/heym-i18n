# Deljenje Poverilnic

Poverilnice lahko delite z drugimi uporabniki, da lahko njihovi workflows uporabljajo vaše API ključe. Oglejte si [Poverilnice](./credentials.md) za pregled in [Zavihek Poverilnic](../tabs/credentials-tab.md) za dodajanje in upravljanje poverilnic.

## Deljenje Poverilnic z LLM

Da omogočite LLM ali AI agentu uporabo API ključa, shranite ključ kot poverilnico in omogočite vozlišču, ki izvaja zahtevo, da ga priloži. Model odloča, kaj poklicati; vozlišče overi klic, ko se izvede.

- **Shranjevanje skrivnosti kot poverilnice.** Občutljive vrednosti so šifrirane v mirovanju in maskirane v uporabniškem vmesniku po ustvarjanju.
- **Navedite jo tam, kjer se izvede zahteva.** Vozlišča [LLM](../nodes/llm-node.md) in [Agent](../nodes/agent-node.md) izberejo svojo modelno poverilnico po ID-ju, HTTP zahteve pa v avtentikacijskem naslovu postavijo `$credentials.CredentialName`. Ohranite skrivnosti zunaj polj za poziv, saj se vse v pozivu pošlje ponudniku modela kot besedilo.
- **Dajte agentu orodja, ne ključev.** Ko Agent pokliče HTTP vozlišče, MCP strežnik ali pod-workflow kot orodje, se poverilnica uporabi znotraj tega orodja in model prejme rezultat orodja.
- **Izhodi so maskirani.** Ko se vrednost poverilnice, daljša od sedmih znakov, prikaže v izhodu vozlišča, se obdrži le prvih sedem znakov, tako da odgovor, ki ponavlja ključ, prikaže le ta predpono v rezultatih in sledi. Oglejte si [Maskiranje Izhodov](#output-masking).
- **Dovolite asistentu, da ustvari poverilnice.** Ko [AI Asistent](./ai-assistant.md#credentials) ali zavihek Chat ustvari poverilnico, vidi le ime in tip, vi pa vnesete skrivnost v običajni obrazec poverilnice.
- **Delite z ljudmi na enak način.** Poverilnico delite z uporabnikom ali ekipo, kot je opisano spodaj, in njihovi workflows lahko uporabljajo vaš ključ preko njihovih lastnih LLM in Agent vozlišč.

## Model Deljenja

- **CredentialShare** – Povezuje `credential_id` z `user_id` (edinstveno za vsak par)
- **Deljenje po e-pošti** – `POST /api/credentials/{credential_id}/shares` z e-pošto; uporabnik se poišče in doda
- **Preklic** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Poverilnice lahko delite tudi z [Timom](./teams.md):

- **CredentialTeamShare** – Povezuje `credential_id` z `team_id`; vsi člani ekipe pridobijo dostop
- **Deljenje s timom** – `POST /api/credentials/{credential_id}/team-shares` z `team_id`
- **Preklic deljenja s timom** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Deljene poverilnice prikazujejo indikator v uporabniškem vmesniku [Zavihek Poverilnic](../tabs/credentials-tab.md).

## Poverilnice Širokega Obsega

Deljenje poverilnice podeli prejemniku vse, kar ta poverilnica lahko stori. Pri večini integracij je to omejeno na eno delovno okolje ali dovoljenja enega API ključa, vendar so nekatere poverilnice precej širše.

> **Poverilnice za Google Drive podeljujejo popoln dostop do Drive-a.** Poverilnica [Google Drive](../nodes/google-drive-node.md) je pooblaščena z obsegom `https://www.googleapis.com/auth/drive`, tako da lahko vozlišče deluje na datotekah, ki jih že imate. Deljenje s uporabnikom ali ekipo daje vsakemu od njih sposobnost, da **bere, spreminja in trajno izbriše karkoli v vašem Google Drive-u** preko workflow-a — ne le datoteke, ki ste jih imeli v mislih. Delite jo le z ljudmi, katerim bi neposredno podelili popoln dostop do Drive-a.

Če potrebujete omejiti izpostavljenost, ustvarite namenski Google račun z dostopom le do map, ki jih workflow potrebuje, in povežite poverilnico s tem računom namesto z vašim primarnim.

Poverilnica **Decision Model** nosi endpoint in, ko je nastavljena, API ključ. Deljenje omogoča prejemniku, da porabi ta ključ iz kateregakoli workflow-a, ki ga lahko izvede, prav tako kot poverilnica LLM.

Poverilnica **Model Router** deli vse, kar usmerja. Ljudje, s katerimi jo delite, lahko izvajajo zahteve proti vsaki poverilnici v njenem seznamu možnosti, te zahteve pa porabijo vaše ključe. Ne morejo prebrati ključev, poverilnice pa se ne prikažejo v njihovem seznamu poverilnic.

To je enaka dodelitev kot deljenje poverilnice OpenAI neposredno, in to je tisto, kar naredi usmerjevalnik koristen za ekipo. Če tega ne želite, delite posamezne poverilnice in dovolite vsakemu, da izbere model.

## Deljenje s Sodelavci v Workflow-u

Ko delite workflow, lahko sodelavci odprejo in izvajajo, vendar ne morejo uporabljati vaših poverilnic, razen če te poverilnice delite tudi z njimi. To velja za poverilnice v glavnem workflow-u in v vseh pod-workflow-ih, ki jih kliče. Delite vsako poverilnico z istimi uporabniki ali ekipami, ki ste jih povabili v workflow. Pod-workflow-i morajo biti prav tako deljeni ločeno od urejevalnika otroškega workflow-a. Oglejte si [Organizacija Workflow-ov](./workflow-organization.md#sharing-workflows).

## Kontekst Izvajanja

Ko se workflow izvaja, se poverilnice rešujejo za **lastnika workflow-a** (ali trenutnega uporabnika, ko se izvaja). `get_credentials_context()` združi:

1. **Lastniške poverilnice** – `Credential.owner_id == user_id`
2. **Uporabniško-deljene poverilnice** – `CredentialShare`, kjer `CredentialShare.user_id == user_id`
3. **Timom-deljene poverilnice** – `CredentialTeamShare`, kjer je uporabnik član ekipe

Vse se združi v enoten kontekstni slovar, ki je ključan po imenu poverilnice.

## Uporaba v Workflows
### Po imenu (Expression DSL)

Poverilnice so izpostavljene kot `$credentials.CredentialName` v [Expression DSL](./expression-dsl.md). Uporabite to za:

- HTTP vozlišča (Bearer/Header avtentikacija)
- Telegram vozlišča
- Slack vozlišča
- Notion bearer token v prilagojenih HTTP zahtevah (notranji token ali OAuth dostopni token)
- Vsako vozlišče, ki sprejema izraze za avtentikacijo

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Po ID (credentialId)

Nekatera vozlišča shranjujejo `credentialId` (UUID) v `node.data`:

| Vrsta vozlišča | Polje | Opis |
|----------------|-------|------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Generiranje slik | `credentialId` | LLM API poverilnica |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Poverilnica za dostop do Codex in GitHub poverilnica |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Poverilnica za OpenCode Go gateway in GitHub poverilnica |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud e-pošta/API token ali Data Center uporabniško ime/geslo |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion notranji token ali OAuth poverilnica za delovno okolje |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry avtentikacijski token in neobvezni osnovni URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL projekta Supabase in API ključ |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Podrobnosti o povezavi ClickHouse (gostitelj, vrata, avtentikacija, baza podatkov) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Poverilnica za Telegram bot |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Javni ključ Discord ali poverilnica za webhook |
| Vektorska shramba | `credential_id` | Qdrant ali Postgres (pgvector) vektorska baza podatkov, prek Qdrant, Psql ali Custom Embeddings RAG poverilnice |
| Vrednotenja | `credential_id`, `judge_credential_id` | Poverilnica modela; poverilnica modela ali odločitev za LLM-as-Judge sodnika |
| [Playwright](../nodes/playwright-node.md) AI korak | `credentialId` | LLM/Vizija model (za AI korak in [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Izvajalec naloži poverilnico neposredno iz baze podatkov po ID-ju in dekriptiira konfiguracijo.

## Maskiranje izhodov

Po izvedbi `mask_sensitive_output()` maskira vrednosti poverilnic v izhodih, pri čemer ohrani prvih sedem znakov vsakega skrivnega podatka, daljšega od sedmih znakov, in nadomesti preostanek z `**`, tako da skrivnosti niso izpostavljene v rezultatih ali sledi.

## Sorodno

- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte in delite poverilnice
- [Integracije tretjih oseb](./integrations.md) – Podrobna nastavitev za vsako vrsto poverilnice
- [Ekipe](./teams.md) – Delite z ekipami
- [Expression DSL](./expression-dsl.md) – Sintaksa `$credentials`
- [Vrste vozlišč](./node-types.md) – Vozlišča, ki uporabljajo poverilnice ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Uporablja `credentialId` za LLM
