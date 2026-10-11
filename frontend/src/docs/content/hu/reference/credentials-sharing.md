# Hitelesítési adatok megosztása

A hitelesítési adatok megoszthatók más felhasználókkal, így azok workflow-i használhatják az Ön API-kulcsait. Az áttekintésért lásd a [Hitelesítési adatok](./credentials.md) oldalt, a hitelesítési adatok hozzáadásáért és kezeléséért pedig a [Hitelesítési adatok lapot](../tabs/credentials-tab.md).

## Hitelesítési adatok megosztása LLM-mel

Ahhoz, hogy egy LLM vagy egy AI-ügynök használhasson egy API-kulcsot, tárolja a kulcsot hitelesítési adatként, és engedje, hogy a kérést végző csomópont csatolja azt. A modell dönti el, mit hívjon meg; a csomópont hitelesíti a hívást, amikor lefut.

- **Tárolja a titkot hitelesítési adatként.** Az érzékeny értékek nyugalmi állapotban titkosítva vannak, és a létrehozás után a felületen maszkolva jelennek meg.
- **Hivatkozzon rá ott, ahol a kérés történik.** Az [LLM](../nodes/llm-node.md) és az [Agent](../nodes/agent-node.md) csomópontok ID alapján választják ki a modell hitelesítési adatait, az HTTP-kérések pedig a `$credentials.CredentialName` értéket teszik a hitelesítési fejlécbe. Tartsa a titkokat a prompt mezőkön kívül, mert a promptban szereplő minden szöveg szövegként kerül elküldésre a modellszolgáltatónak.
- **Az ügynöknek eszközöket adjon, ne kulcsokat.** Amikor egy Agent egy HTTP-csomópontot, egy MCP-szervert vagy egy al-workflow-t hív meg eszközként, a hitelesítési adat az adott eszközön belül kerül alkalmazásra, és a modell az eszköz eredményét kapja meg.
- **A kimenetek maszkolva vannak.** Amikor egy hét karakternél hosszabb hitelesítési adat érték jelenik meg egy csomópont kimenetében, csak az első hét karakter marad meg, így egy kulcsot visszaíró válasz csak ezt a prefixet mutatja az eredményekben és a futtatásokban. Lásd a [Kimenet maszkolása](#output-masking) részt.
- **Engedje, hogy az asszisztens hitelesítési adatokat hozzon létre.** Amikor az [AI Assistant](./ai-assistant.md#credentials) vagy a Chat lap hitelesítési adatot hoz létre, csak a nevet és a típust látja, a titkot pedig Ön adja meg a szokásos hitelesítési adat űrlapon.
- **Ugyanígy ossza meg másokkal.** Ossza meg a hitelesítési adatot egy felhasználóval vagy egy csapattal az alábbiak szerint, és az ő workflow-jaik a saját LLM- és Agent-csomópontjaikon keresztül használhatják az Ön kulcsát.

## Megosztási modell

- **CredentialShare** – A `credential_id`-t a `user_id`-hoz kapcsolja (páronként egyedi)
- **Megosztás e-mail-cím alapján** – `POST /api/credentials/{credential_id}/shares` e-mail-címmel; a felhasználó kikeresésre és hozzáadásra kerül
- **Visszavonás** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

A hitelesítési adatokat [Csapatokkal](./teams.md) is megoszthatja:

- **CredentialTeamShare** – A `credential_id`-t a `team_id`-hoz kapcsolja; minden csapattag hozzáférést kap
- **Megosztás csapattal** – `POST /api/credentials/{credential_id}/team-shares` a `team_id` értékkel
- **Csapatmegosztás visszavonása** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

A megosztott hitelesítési adatok jelzést jelenítenek meg a [Hitelesítési adatok lap](../tabs/credentials-tab.md) felületén.

## Széles hatókörű hitelesítési adatok

Egy hitelesítési adat megosztása mindent megad a címzettnek, amire az adott hitelesítési adat képes. A legtöbb integráció esetében ez egy munkaterületre vagy egy API-kulcs jogosultságaira korlátozódik, de bizonyos hitelesítési adatok ennél jóval szélesebbek.

> **A Google Drive hitelesítési adatok teljes Drive-hozzáférést adnak.** A [Google Drive](../nodes/google-drive-node.md) hitelesítési adat a `https://www.googleapis.com/auth/drive` hatókörrel van engedélyezve, hogy a csomópont a már Ön által birtokolt fájlokon működhessen. Ha megosztja egy felhasználóval vagy egy csapattal, mindannyiuknak lehetősége lesz arra, hogy egy workflow-n keresztül **olvassák, módosítsák és véglegesen töröljék a Google Drive-jában található bármit** — nem csak azokat a fájlokat, amelyekre gondolt. Csak olyan személyekkel ossza meg, akiknek közvetlenül is teljes Drive-hozzáférést adna.

Ha korlátoznia kell a kitettséget, hozzon létre egy dedikált Google-fiókot, amely csak azokhoz a mappákhoz fér hozzá, amelyekre a workflow-nak szüksége van, és a hitelesítési adatot azzal a fiókkal kapcsolja össze az elsődleges helyett.

A **Decision Model** hitelesítési adat tartalmazza az endpointot, és ha be van állítva, egy API-kulcsot. Megosztása lehetővé teszi a címzett számára, hogy az adott kulcs terhére költekezzen bármely workflow-ból, amelyet futtatni tud, pontosan úgy, mint egy LLM hitelesítési adat esetében.

A **Model Router** hitelesítési adat mindent megoszt, amit továbbít. Azok, akikkel megosztja, kéréseket futtathatnak a beállításlistájában szereplő összes hitelesítési adat ellen, és ezek a kérések az Ön kulcsait használják fel. A kulcsokat nem tudják elolvasni, és a hitelesítési adatok nem jelennek meg a saját hitelesítési adatlistájukban.

Ez ugyanaz a jogosultság, mint egy OpenAI hitelesítési adat közvetlen megosztása, és ez teszi a routert hasznossá egy csapat számára. Ha ezt nem szeretné, ossza meg inkább az egyes hitelesítési adatokat, és engedje, hogy mindenki maga válasszon modellt.

## Megosztás workflow-munkatársakkal

Amikor megoszt egy workflow-t, a munkatársak megnyithatják és futtathatják azt, de nem használhatják az Ön hitelesítési adatait, hacsak Ön azokat is meg nem osztja velük. Ez vonatkozik a fő workflow-ban és az általa hívott al-workflow-kban lévő hitelesítési adatokra is. Ossza meg minden hitelesítési adatot ugyanazokkal a felhasználókkal vagy csapatokkal, akiket a workflow-hoz meghívott. Az al-workflow-kat a gyermek-workflow szerkesztőjéből is külön meg kell osztani. Lásd a [Workflow szervezése](./workflow-organization.md#sharing-workflows) részt.

## Végrehajtási kontextus

Amikor egy workflow lefut, a hitelesítési adatok a **workflow tulajdonosa** (vagy futtatáskor az aktuális felhasználó) számára kerülnek feloldásra. A `get_credentials_context()` a következőket vonja össze:

1. **Tulajdonolt hitelesítési adatok** – `Credential.owner_id == user_id`
2. **Felhasználóval megosztott hitelesítési adatok** – `CredentialShare`, ahol `CredentialShare.user_id == user_id`
3. **Csapattal megosztott hitelesítési adatok** – `CredentialTeamShare`, ahol a felhasználó tagja a csapatnak

Mindegyik egyetlen kontextus-dictbe kerül összevonásra, hitelesítési adat név szerint kulcsolva.

## Használat workflow-kban
### Név szerint (Expression DSL)

A hitelesítési adatok `$credentials.CredentialName` formában érhetők el az [Expression DSL](./expression-dsl.md) nyelven. Ezt a következőkhöz használja:

- HTTP csomópontok (Bearer/Header hitelesítés)
- Telegram csomópontok
- Slack csomópontok
- Notion bearer tokenek egyedi HTTP-kérésekben (belső token vagy OAuth access token)
- Bármely csomópont, amely kifejezéseket fogad el a hitelesítéshez

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Azonosító szerint (credentialId)

Egyes csomópontok a `credentialId` (UUID) értéket a `node.data` mezőben tárolják:

| Csomópont típusa | Mező | Leírás |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API hitelesítési adat |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex access token hitelesítési adat és GitHub hitelesítési adat |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go gateway hitelesítési adat és GitHub hitelesítési adat |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud e-mail/API token vagy Data Center felhasználónév/jelszó hitelesítési adat |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion belső token vagy OAuth workspace hitelesítési adat |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token és opcionális base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase projekt URL és API kulcs |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse kapcsolati adatok (host, port, hitelesítés, adatbázis) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot hitelesítési adat |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord public key vagy webhook hitelesítési adat |
| Vektortároló | `credential_id` | Qdrant vagy Postgres (pgvector) vektor adatbázis, Qdrant, Psql vagy Custom Embeddings RAG hitelesítési adaton keresztül |
| Értékelések | `credential_id`, `judge_credential_id` | Modell hitelesítési adat; modell vagy Decision Model hitelesítési adat az LLM-as-Judge bírálathoz |
| [Playwright](../nodes/playwright-node.md) AI lépés | `credentialId` | LLM/Vision modell (az AI lépéshez és az [Auto Heal](../nodes/playwright-node.md#ai-auto-heal) funkcióhoz) |

A végrehajtó közvetlenül az adatbázisból tölti be a hitelesítési adatot azonosító alapján, és visszafejti a konfigurációt.

## Kimeneti maszkolás

A végrehajtás után a `mask_sensitive_output()` maszkolja a hitelesítési adatok értékeit a kimenetekben: minden hét karakternél hosszabb titok első hét karakterét megtartja, a többit pedig `**` karakterekkel helyettesíti, így a titkok nem jelennek meg az eredményekben vagy a futtatásokban.

## Kapcsolódó

- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Hitelesítési adatok hozzáadása és megosztása
- [Külső integrációk](./integrations.md) – Részletes beállítás minden hitelesítési adat típushoz
- [Csapatok](./teams.md) – Megosztás csapatokkal
- [Expression DSL](./expression-dsl.md) – `$credentials` szintaxis
- [Csomópont típusok](./node-types.md) – Hitelesítési adatokat használó csomópontok ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent csomópont](../nodes/agent-node.md) – `credentialId` használata az LLM-hez
