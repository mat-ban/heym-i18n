# Kredencialų skirtukas

**Kredencialų** skirtukas valdo API raktus ir slaptažodžius, naudojamus mazguose. Pridėkite kredencialus čia ir nurodykite juos pagal pavadinimą darbo eigos mazguose. Norėdami gauti apžvalgą apie tai, kas yra kredencialai ir kaip juos naudoja mazgai, žr. [Kredencialai](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Žiūrėti Kredencialų demonstraciją</a></p>

## Kredencialų tipai

| Tipas | Naudojimo atvejis |
|-------|-------------------|
| **OpenAI** | OpenAI API raktas LLM, Agent ir RAG mazgams |
| **Google** | Google AI (Gemini) API raktas |
| **GitHub** | GitHub asmeninis prieigos raktas (PAT) GitHub API, GitHub mazgų darbo eigos, MCP serverių ir agentų darbo eigos; neprivalomas GitHub Enterprise `base_url` |
| **Linear** | Linear asmeninis API raktas arba OAuth2 komandoms, projektams, užduotims ir komentarams |
| **Notion** | Vidinis integracijos raktas arba viešos integracijos OAuth darbo vietos autorizacija |
| **Custom** | Pasirinktinių LLM galinių taškų raktai |
| **Bearer** | Bearer raktas HTTP autentifikacijai |
| **Header** | Pasirinktinis antraštės raktas-reikšmė HTTP užklausoms |
| **Telegram** | Telegram bot raktas ir neprivalomas webhook slaptažodis |
| **Slack** | Slack įeinančio webhook URL |
| **Discord** | Discord įeinančio webhook URL |
| **Discord Trigger** | Discord programos viešas raktas |
| **IMAP** | Įeinančio pašto dėžutės trigger kredencialai |
| **SMTP** | El. pašto siuntimo kredencialai |
| **Redis** | Redis ryšys |
| **RAG: Qdrant + OpenAI** | Vektorių saugykla RAG mazgams, paremta išoriniu Qdrant serveriu |
| **RAG: Psql + OpenAI** | Vektorių saugykla RAG mazgams, paremta Heym nuosava Postgres duomenų baze (pgvector) — be išorinės paslaugos |
| **RAG: Custom Embeddings** | Vektorių saugykla RAG mazgams naudojant bet kurį OpenAI suderinamą embedding galinį tašką, su Qdrant arba Postgres (pgvector) kaip saugykla |
| **Cohere** | Cohere API embeddingams |

## Kredencialų pridėjimas

1. Paspauskite **Pridėti kredencialą**
2. Pasirinkite kredencialų tipą
3. Įveskite reikiamas reikšmes (API raktas, URL ir kt.)
4. Pavadinkite jį, kad galėtumėte nurodyti mazguose

GitHub atveju, dabartinė kredencialų srauto sistema yra paremta PAT. Rekomenduojama naudoti smulkiai apibrėžtus PAT. GitHub programų diegimo srautai šiuo metu nėra pirmos klasės UI. Jei naudojate GitHub Enterprise Server, taip pat galite nustatyti neprivalomą GitHub API pagrindinį URL, pvz., `https://github.example.com/api/v3`.

Linear atveju pasirinkite **Asmeninį API raktą** arba **OAuth2** dialoge. Asmeniniai API raktai kuriami
skiltyje **Nustatymai → Saugumas ir prieiga → Asmeniniai API raktai** Linear. OAuth2 naudoja Linear OAuth
programos Kliento ID ir Kliento slaptažodį, o `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
yra registruotas kaip nukreipimo URI. Kredencialas veikia su Linear vartotojo, kuris jį sukūrė arba autorizavo, leidimais. Naudokite **Išbandyti ryšį** kredencialų dialoge, kad patvirtintumėte API raktą arba
OAuth token prieš išsaugodami.

Dėl **Notion**, pasirinkite **Vidinį raktą** arba **OAuth** dialoge. OAuth naudoja Kliento ID ir
Kliento slaptažodį iš jūsų Notion viešos integracijos; Heym juos saugo užšifruotus kredencialuose.
Naudokite **Išbandyti ryšį**, kad patvirtintumėte Supabase, Linear arba Notion kredencialus prieš išsaugodami darbo eigą. Žr.
[Trečiųjų šalių integracijos](../reference/integrations.md#notion) dėl Notion nustatymo detalių.

OAuth kredencialai atidaro paslaugų teikėjo autorizacijos puslapį iššokančiame lange. Jei naršyklė tai blokuoja, naudokite **Atidaryti autorizacijos puslapį** nuorodą po Prijungti mygtuku; dialogas pastebi, kai ryšys užbaigiamas. Kai naujas kredencialas yra prijungtas, mygtukas rodo **Prijungta**.

## Redagavimas ir šalinimas

- **Redaguoti** – Atnaujinti kredencialų reikšmes (sensitive reikšmės yra maskuojamos)
- **Šalinti** – Pašalinti kredencialą; darbo eigos, naudojančios jį, turės pakeitimą

Redaguojant **GitHub** kredencialą GitHub Enterprise Server, palikdami neprivalomą **GitHub
API pagrindinį URL** tuščią, išsaugosite esamą Enterprise galinį tašką. Naują URL įveskite tik tada, kai
norite pakeisti tą galinį tašką.

## Dalijimasis

- [Bendrinti kredencialus](../reference/credentials-sharing.md) su kitais vartotojais el. paštu arba su [Komandomis](../reference/teams.md)
- Bendri kredencialai pasirodo su indikatoriumi
- Atšaukti bendrinimą iš kredencialų kortelės meniu
## Naudojimas mazguose

Nuorodų kredencialus pagal pavadinimą mazgo konfigūracijoje. Pavyzdžiui:
- [LLM mazgas](../nodes/llm-node.md) – Pasirinkite kredencialą modelio API
- [HTTP mazgas](../nodes/http-node.md) – Naudokite Bearer arba Header kredencialus autentifikacijai
- [Agent mazgas](../nodes/agent-node.md) – Perduokite GitHub tokenus į MCP serverio aplinkos kintamuosius, tokius kaip `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub mazgas](../nodes/github-node.md) – Vykdykite natūralius GitHub saugyklos, vartotojo, užduoties, peržiūros, leidimo, workflow, srauto ir failų veiksmus
- [Linear mazgas](../nodes/linear-node.md) – Skaitykite darbo erdvės metaduomenis ir automatizuokite Linear užduotis bei komentarus
- [Notion mazgas](../nodes/notion-node.md) – Tvarkykite Notion duomenų bazes, duomenų šaltinius, puslapius ir blokus
- [RAG mazgas](../nodes/rag-node.md) – Naudokite Qdrant arba Postgres (pgvector) kredencialą vektorių saugyklai
- [Telegram Trigger mazgas](../nodes/telegram-trigger-node.md) – Gaukite Telegram bot webhook'us
- [Telegram mazgas](../nodes/telegram-node.md) – Siųskite Telegram bot žinutes
- [Discord Trigger mazgas](../nodes/discord-trigger-node.md) – Gaukite Discord sąveikos webhook'us
- [Discord mazgas](../nodes/discord-node.md) – Siųskite Discord webhook žinutes
- [IMAP Trigger mazgas](../nodes/imap-trigger-node.md) – Stebėkite bendrą pašto dėžutę naujiems el. laiškams

Žr. [Expression DSL](../reference/expression-dsl.md) norint nurodyti kredencialais pagrįstas reikšmes išraiškose.

## Susiję

- [Trečiųjų šalių integracijos](../reference/integrations.md) – Išsami nustatymo instrukcija kiekvienam kredencialų tipui (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack ir kt.)
- [Kredencialų dalijimasis](../reference/credentials-sharing.md) – Dalinkitės kredencialais su kitais vartotojais
- [Saugumas](../reference/security.md) – Šifravimas ramybėje, sesijų valdymas, greičio ribojimas
- [Mazgų tipai](../reference/node-types.md) – Mazgai, kurie naudoja kredencialus ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Siųsti el. laišką](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vektorių saugyklos skirtukas](./vectorstores-tab.md) – Naudoja Qdrant arba Postgres (pgvector) kredencialus
- [Chat skirtukas](./chat-tab.md) – Naudoja OpenAI/Google kredencialus
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Kompaktiška puslapio instrukcija valdymo skydeliams
