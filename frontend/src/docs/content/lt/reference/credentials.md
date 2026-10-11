# Kredencialai

Kredencialai saugo API raktus ir slaptažodžius, naudojamus workflow mazguose. Juos galite pridėti [Kredencialų skirtuke](../tabs/credentials-tab.md) ir nurodyti pagal pavadinimą mazgo konfigūracijoje.

## Kas yra Kredencialai

- **Saugojami pagal vartotoją** – Kiekviena kredencialas priklauso vartotojui ir gali būti [dalijamasi](./credentials-sharing.md) su kitais vartotojais arba [Komandomis](./teams.md).
- **Šifruojami poilsio būsenoje** – Jautrūs duomenys yra šifruojami; vartotojo sąsaja juos maskuoja po sukūrimo.
- **Nurodomi pagal pavadinimą** – Mazgai pasirenka kredencialą pagal pavadinimą (arba ID). Vykdymo variklis išsprendžia kredencialą workflow savininkui vykdymo metu.

## Kaip Mazgai Naudoja Kredencialus

| Mazgo tipas | Tipinė kredencialas | Paskirtis |
|-------------|---------------------|-----------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API raktas modeliui |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) sprendimų | Sprendimų modelis | Pagrindinis URL sprendimų modelio endpointui, plius neprivalomas API raktas |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Pasirenka, kuris iš jūsų modelių aptarnauja kiekvieną užklausą, naudodamas sprendimų modelį |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT prenumeratos prisijungimas (OAuth) arba Codex prieigos raktas vykdytojui, plius GitHub PAT saugyklos operacijoms |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | OpenCode Go vartotojo API raktas (neprivalomas pagrindinis URL) vykdytojui, plius GitHub PAT saugyklos operacijoms |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub asmeninis prieigos raktas (PAT) GitHub API skambučiams, GitHub mazgo operacijoms ir MCP integracijoms |
| [Jira](../nodes/jira-node.md) | Jira | Debesų el. pašto/API raktas arba Data Center vartotojo vardas/slaptažodis, Jira svetainės pagrindinis URL, diegimo režimas ir neprivaloma REST API versija |
| [Linear](../nodes/linear-node.md) | Linear | Asmeninis API raktas arba OAuth2 komandoms, projektams, užduotims ir komentarams |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentifikacija užklausoms |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token ir neprivalomas webhook slaptažodis |
| [Discord](../nodes/discord-node.md) | Discord | Įeinančio webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Programos viešasis raktas parašo tikrinimui |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Vektorių saugyklos ryšys (išorinis Qdrant arba Heym nuosavas Postgres per pgvector), su OpenAI arba bet kuriuo OpenAI suderinamu embedding endpointu |
| [Slack](../nodes/slack-node.md) | Slack | Webhook arba API raktas |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Įeinančio pašto dėžutės ryšys |
| [Send Email](../nodes/send-email-node.md) | SMTP | Pašto serveris |
| [Redis](../nodes/redis-node.md) | Redis | Ryšys |
| [Grist](../nodes/grist-node.md) | Grist | API raktas + serverio URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Kliento ID + Kliento slaptažodis + OAuth2 sutikimas |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Kliento ID + Kliento slaptažodis + OAuth2 sutikimas |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Kliento ID + Kliento slaptažodis + OAuth2 sutikimas |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekto URL + API raktas (+ neprivalomas numatytasis schemos) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + prievadas + vartotojo vardas/slaptažodis + duomenų bazė (+ saugus) |
| [Notion](../nodes/notion-node.md) | Notion | Vidinis integracijos raktas arba viešos integracijos Kliento ID + Kliento slaptažodis + OAuth sutikimas |
| [Sentry](../nodes/sentry-node.md) | Sentry | Autentifikacijos raktas plius neprivalomas savarankiškai talpinamas pagrindinis URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Prieigos raktas, slaptažodis, regionas |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Išsamesnei konfigūracijai (hostai, prievadai, teikėjui specifiniai laukai) žr. [Trečiųjų šalių integracijas](./integrations.md). Tai apima Telegram bot konfigūraciją, įeinantį el. paštą per IMAP ir išeinantį el. paštą per SMTP.

GitHub kredencialai taip pat gali apimti neprivalomą `base_url`, kai tikslinate GitHub Enterprise Server, o ne GitHub.com. Redaguodami GitHub kredencialą, kad pakeistumėte raktą, palikite `base_url` tuščią, kad išsaugotumėte esamą Enterprise endpointą. Naują URL įveskite tik tada, kai norite pakeisti tą endpointą.

Jira, Linear, Supabase, Notion, Sentry ir ClickHouse kredencialai turi **Test Connection** funkciją kredencialų dialoge. Jira atveju patikrinimas kviečia Jira dabartinio vartotojo endpointą. Linear atveju patikrinimas kviečia Linear API su `getViewer` ir patvirtina, kad API raktas arba OAuth tokenas yra galiojantis. Redaguojant, galite patikrinti be pakartotinio API rakto įvedimo, jei saugomas slaptažodis vis dar yra. Notion atveju pasirinkite **Internal token** arba **OAuth** dialoge; OAuth naudoja Kliento ID ir Kliento slaptažodį iš jūsų Notion viešos integracijos. Žr. [Trečiųjų šalių integracijas](./integrations.md#notion) dėl Notion konfigūracijos detalių.
## Kodo paketo naudojimas

**AI Defaults** skirtuke [Nustatymai](./user-settings.md) rodomas likęs kodo paketo naudojimas Jūsų Codex kredencialams (nuosaviems ir bendrinamiems). Kiekvienam Codex kredencialui pateikiama horizontali juosta kiekvienam aktyviam greičio apribojimo langui — paprastai **5 valandų** ir/arba **Savaitiniam** langui, priklausomai nuo Jūsų plano — su likusios kvotos procentu ir atstatymo atgaline skaičiavimo laikmačiu. Duomenys gaunami iš Codex backend'o greičio apribojimo atsakymo antraščių, gautų pagal poreikį.

OpenCode Go kredencialai taip pat yra išvardyti, tačiau pažymėti **"naudojimas nepasiekiamas"**: OpenCode zen vartai neatskleidžia likusios kvotos duomenų, todėl juostos rodyti negalima.

## Išraiškose

Kai kurie mazgai leidžia naudoti išraiškas autentifikacijai. Naudokite [Expression DSL](./expression-dsl.md) su `$credentials.CredentialName`, kad nuoroduotumėte į kredencialo išspręstą paslaptį išraiškoje. Dėl antraštės linijos, kurios kiekvienam kredencialo tipui reikia HTTP užklausoje, žr. [HTTP › Autentifikacija su kredencialais](../nodes/http-node.md#authenticating-with-credentials).

Codex kredencialai tyčia yra neįtraukti į `$credentials`. Nesvarbu, ar prisijungiate su ChatGPT (prenumerata, be mokėjimo už kiekvieną tokeną API) ar įklijuojate Codex `access_token`, tokenai perduodami tik vietiniam Codex vykdytojui. ChatGPT prisijungimo tokenai automatiškai atnaujinami, kai jie pasibaigia.

Jira kredencialai taip pat yra neįtraukti į `$credentials`. [Jira mazgas](../nodes/jira-node.md) įkelia kredencialą pagal `credentialId` vykdymo metu. Norint atlikti individualias Jira REST užklausas, kurios nėra apimtos Jira mazgo, naudokite [HTTP mazgą](../nodes/http-node.md) su Jira Basic Auth (`email:api_token` Jira Cloud arba `username:password` Data Center / Server), pavyzdžiui, `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Taip pat galite naudoti [Header](../nodes/http-node.md) kredencialą su `Authorization: Basic <base64(user:secret)>`. Jira Data Center / Server asmeniniai prieigos tokenai ir Bearer auth dar nėra palaikomi Jira kredenciale.

| Kredencialo tipas | Vertė, atskleista `$credentials.Name` |
|-------------------|---------------------------------------|
| Bearer            | Bearer tokeno eilutė                 |
| Header            | Pilna `header key: header value` eilutė, paruošta įdėti į cURL `-H` argumentą |
| GitHub            | Asmeninis prieigos tokenas           |
| Notion            | Vidinis `api_token` arba OAuth `access_token` (Bearer tokenas Notion API užklausoms) |
| Sentry            | Sentry autentifikacijos tokenas      |
| Discord / Slack   | Webhook URL                          |

Pavyzdys:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Naudokite Notion **mazgą** natūraliems duomenų bazės, puslapio ir bloko veiksmams. Naudokite `$credentials`, kai individuali [HTTP](../nodes/http-node.md) užklausa reikalauja to paties Notion bearer tokeno.

## Kredencialų kūrimas iš Chat

[AI Asistentas](./ai-assistant.md#credentials), [Chat skirtukas](../tabs/chat-tab.md) ir [Chat su Heym](./chat-with-heym.md) gali sukurti kredencialą, kai workflow to reikalauja, arba kai tik paprašote. Asistentas siūlo tipą ir pavadinimą, o įprasta kredencialų forma atsidaro pokalbyje. Paprašykite atnaujinti Jūsų turimą kredencialą, ir ta pati forma atsidarys su jo paslaptimis, užmaskuotomis. Asistentas mato tik pavadinimą ir tipą. `heym_chat` per [MCP](../tabs/mcp-tab.md) negali kurti, atnaujinti ar pasirinkti kredencialų.

## Susiję

- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti, redaguoti, ištrinti kredencialus
- [GitHub mazgas](../nodes/github-node.md) – Natūralūs GitHub REST veiksmai
- [Jira mazgas](../nodes/jira-node.md) – Jira projekto, užduoties, komentaro, priedo, vartotojo, pranešimo ir perėjimo automatizavimas
- [Linear mazgas](../nodes/linear-node.md) – Linear GraphQL darbo erdvės ir užduočių automatizavimas
- [Notion mazgas](../nodes/notion-node.md) – Paieška ir Notion turinio valdymas
- [Sentry mazgas](../nodes/sentry-node.md) – Sentry organizacijos, projekto, komandos, užduoties, įvykio ir leidimo automatizavimas
- [Kredencialų dalijimasis](./credentials-sharing.md) – Dalijimasis su vartotojais ir komandomis
- [Trečiųjų šalių integracijos](./integrations.md) – Nustatymo vadovas pagal kredencialo tipą
- [Expression DSL](./expression-dsl.md) – `$credentials` išraiškose

## Modelių maršrutizatorius (Auto Model)

Modelių maršrutizatorius neturi rakto. Jis turi **sprendimų modelio kredencialą**, modelių pasirinkimų sąrašą — kiekvienas yra esamas OpenAI, Google arba Custom kredencialas plius modelis — ir, kiekvienam pasirinkimui, laisvą tekstą, nurodantį, kada tas pasirinkimas turėtų būti naudojamas.

Jis pasirodo kiekviename pasirinkimo lange, kuris siūlo modelį: [LLM](../nodes/llm-node.md) ir [Agent](../nodes/agent-node.md) mazguose, Chat, AI Defaults, Valdymo skydeliuose, išraiškų kūrimo priemonėje ir Duomenų lentelėse. Jo vienintelis modelis yra **Auto**. Pasirinkite jį, ir sprendimų modelis perskaito kiekvieną užklausą ir nukreipia ją. [Vertinimai](../tabs/evals-tab.md) jo neįtraukia, nes vertinimas palygina konkrečius modelius, o maršrutizatorius pasirenka savo.

Agentas permaršrutizuoja, kai jo įrankių ciklas progresuoja, todėl pigus modelis gali imtis ankstyvųjų posūkių, o stipresnis — posūkio, kurio reikia. Identifikuoti įvestys pakartoja ankstesnį sprendimą, todėl ciklas moka už sprendimą tik tada, kai pokalbis iš tikrųjų juda.

### Ko jis negali padaryti

Auto Model negali būti derinamas su **Responses API**, **Batch mode** arba **image output**. Šie perjungimai automatiškai išsijungia, kai pasirenkamas maršrutizatorius, ir kiekvienas nurodo, kodėl. Guardrail patikros ir žmogaus peržiūros politikos klasifikatorius yra fiksuoti vieno modelio skambučiai ir niekada nepermaršrutizuoja.
### Kai maršrutas nepavyksta

Pažymėkite vieną parinktį **Naudokite šią parinktį, kai maršrutas nepavyksta**, o sprendimų modelio gedimas niekada nesustabdo vykdymo; naudojamas atsarginis variantas, o priežastis užfiksuojama vykdyme. Be jo, mazgas nepavyksta, o ne spėja.

### Matyti, kur nuėjo užklausa

Vykdymo istorija rodo `Auto Model / GPT-5`, o kaina lieka priskirta modeliui, kuris iš tikrųjų buvo vykdomas. Drobės Vykdymo žurnalas ir Span View rodo tą patį porą, o Span View nurodo, kuriuo posūkiu kur nuėjo.
