# Mandaadid

Mandaadid salvestavad API võtmeid ja saladusi, mida workflow'de sõlmed kasutavad. Need lisatakse [Mandaatide vahekaardil](../tabs/credentials-tab.md) ja neile viidatakse nime järgi sõlme konfiguratsioonis.

## Mis on mandaadid

- **Salvestatud kasutajapõhiselt** – Iga mandaat kuulub kasutajale ja seda saab [jagada](./credentials-sharing.md) teiste kasutajatega või [Tiimidega](./teams.md).
- **Krüpteeritud salvestamisel** – Tundlikud väärtused on krüpteeritud; kasutajaliides maskeerib need pärast loomist.
- **Viidatud nime järgi** – Sõlmed valivad mandaadi nime (või ID) järgi. Käitusmootor lahendab mandaadi workflow omaniku jaoks käitusajal.

## Kuidas sõlmed neid kasutavad

| Sõlme tüüp | Tüüpiline mandaat | Otstarve |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Hindamised](../tabs/evals-tab.md) | OpenAI, Google, Kohandatud | API võti mudeli jaoks |
| [Otsus](../nodes/decision-node.md), [Hindamiste](../tabs/evals-tab.md) hindaja | Otsustusmudel | Otsustusmudeli endpoint'i baas-URL ja valikuline API võti |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI vaikeväärtused | Mudelite ruuter (automaatne mudel) | Valib otsustusmudeli abil, milline teie mudelitest teenindab iga päringut |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT tellimuse sisselogimine (OAuth) või Codex'i juurdepääsu token runneri jaoks, pluss GitHub PAT hoidla toimingute jaoks |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | OpenCode Go lüüsi API võti (valikuline baas-URL) runneri jaoks, pluss GitHub PAT hoidla toimingute jaoks |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHubi isiklik juurdepääsu token (PAT) GitHubi API kutsete, GitHub node'i toimingute ja MCP integratsioonide jaoks |
| [Jira](../nodes/jira-node.md) | Jira | Cloud'i e-post/API token, Data Centeri kasutajanimi/parool või isiklik juurdepääsutoken, Jira saidi baas-URL, juurutusrežiim ja valikuline REST API versioon |
| [Linear](../nodes/linear-node.md) | Linear | Isiklik API võti või OAuth2 tiimide, projektide, teemade ja kommentaaride jaoks |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentimine päringute jaoks |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Boti token ja valikuline webhooki saladus |
| [Discord](../nodes/discord-node.md) | Discord | Sissetuleva webhooki URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (avalik võti) | Rakenduse avalik võti allkirja kontrollimiseks |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: kohandatud embeddingud | Vektorhoidla ühendus (väline Qdrant või Heymi enda Postgres pgvectori kaudu), OpenAI või mis tahes OpenAI-ga ühilduva embedding-endpoint'iga |
| [Slack](../nodes/slack-node.md) | Slack | Webhook või API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Sissetuleva postkasti ühendus |
| [Send Email](../nodes/send-email-node.md) | SMTP | Postiserver |
| [Redis](../nodes/redis-node.md) | Redis | Ühendus |
| [Grist](../nodes/grist-node.md) | Grist | API võti + serveri URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 nõusolek |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 nõusolek |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 nõusolek |
| [Supabase](../nodes/supabase-node.md) | Supabase | Projekti URL + API võti (+ valikuline vaikeskeem) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + kasutajanimi/parool + andmebaas (+ turvaline) |
| [Notion](../nodes/notion-node.md) | Notion | Sisemise integratsiooni token või avaliku integratsiooni Client ID + Client Secret + OAuth nõusolek |
| [Sentry](../nodes/sentry-node.md) | Sentry | Autentimise token ja valikuline isemajutatud baas-URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Juurdepääsuvõti, salajane võti, regioon |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Üksikasjaliku seadistamise (hostid, pordid, teenusepakkuja-spetsiifilised väljad) kohta vaadake [Kolmandate osapoolte integratsioone](./integrations.md). See hõlmab Telegrami boti seadistamist, sissetulevat e-posti IMAP-i kaudu ja väljaminevat e-posti SMTP kaudu.

GitHubi mandaadid võivad sisaldada ka valikulist `base_url`-i, kui suunate GitHub.com'i asemel GitHub Enterprise Serverile. Kui muudate GitHubi mandaati tokeni vahetamiseks, säilitab tühjaks jäetud `base_url` olemasoleva Enterprise endpoint'i. Sisestage uus URL ainult siis, kui soovite seda endpoint'i muuta.

Jira, Linear, Supabase, Notion, Sentry ja ClickHouse mandaadid pakuvad mandaadi dialoogis funktsiooni **Testi ühendust**. Jira puhul kutsub kontroll välja Jira praeguse kasutaja endpoint'i. Linear puhul kutsub kontroll Linear API-t välja `getViewer`-iga ja kinnitab, et API võti või OAuth token on kehtiv. Muutmisel saate testida ilma API võtit uuesti sisestamata, kui salvestatud saladus on endiselt olemas. Notioni puhul valige dialoogis **Sisemine token** või **OAuth**; OAuth kasutab teie Notioni avaliku integratsiooni Client ID-d ja Client Secret'i. Notioni seadistamise üksikasju vaadake jaotisest [Kolmandate osapoolte integratsioonid](./integrations.md#notion).
## Kodeerimispaketi kasutamine

Vahekaart **AI vaikeväärtused** jaotises [Seaded](./user-settings.md) näitab teie Codexi mandaatide (omandatud ja jagatud) järelejäänud kodeerimispaketi kasutust. Iga Codexi mandaadi kohta kuvatakse horisontaalne riba iga aktiivse kiiruspiirangu akna kohta — tavaliselt **5 tunni** ja/või **nädala** aken, sõltuvalt teie plaanist — koos järelejäänud kvoodi protsendi ja lähtestamise loenduriga. Andmed pärinevad Codexi taustsüsteemi kiiruspiirangu vastuse päistest, mis tuuakse nõudmisel.

Ka OpenCode Go mandaadid on seal loetletud, kuid märgitud kui **"kasutus pole saadaval"**: OpenCode zeni värav ei avalda järelejäänud kvoodi andmeid, seega riba ei saa kuvada.

## Avaldistes

Mõned sõlmed lubavad autentimiseks avaldisi. Kasutage [Avaldise DSL](./expression-dsl.md) koos `$credentials.CredentialName`, et viidata mandaadi lahendatud saladusele avaldise sees. Päise rea kohta, mida iga mandaadi tüüp HTTP-päringus vajab, vaadake [HTTP › Autentimine mandaatidega](../nodes/http-node.md#authenticating-with-credentials).

Codexi mandaadid on `$credentials`-ist teadlikult välja jäetud. Olenemata sellest, kas logite sisse ChatGPT-ga (tellimus, ilma tokenipõhise API kuluta) või kleepite Codexi `access_token`-i, edastatakse tokenid ainult kohalikule Codexi käitaja protsessile. ChatGPT sisselogimise tokenid värskendatakse automaatselt nende aegumisel.

Ka Jira mandaadid on `$credentials`-ist välja jäetud. [Jira sõlm](../nodes/jira-node.md) laadib mandaadi käitusajal `credentialId` järgi. Kohandatud Jira REST-kutsete jaoks, mida Jira sõlm ei kata, kasutage [HTTP sõlme](../nodes/http-node.md) koos Jira Basic Auth-iga (`email:api_token` Jira Cloudi jaoks või `username:password` Data Centeri / Serveri jaoks), näiteks `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Võite kasutada ka [Header](../nodes/http-node.md) mandaati koos `Authorization: Basic <base64(user:secret)>`. Jira Data Centeri / Serveri isiklike juurdepääsutokenite puhul saatke selle asemel `Authorization: Bearer <token>`; Jira mandaat ise toetab seda oma **Personal Access Token** autentimisrežiimi kaudu.

| Mandaadi tüüp | Väärtus, mis on avatud `$credentials.Name`-ile |
|-----------------|--------------------------------------|
| Bearer | Bearer-tokeni string |
| Header | Täielik `header key: header value` rida, valmis cURL-i `-H` argumendiks |
| GitHub | Isiklik juurdepääsutoken |
| Notion | Sisemine `api_token` või OAuth `access_token` (Bearer-token Notioni API kutsete jaoks) |
| Sentry | Sentry autentimistoken |
| Discord / Slack | Webhooki URL |

Näide:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Kasutage Notioni **sõlme** natiivsete andmebaasi, lehe ja ploki toimingute jaoks. Kasutage `$credentials`-i, kui kohandatud [HTTP](../nodes/http-node.md) päring vajab sama Notioni bearer-tokenit.

## Mandaatide loomine Chatist

[AI assistent](./ai-assistant.md#credentials), [Chati vahekaart](../tabs/chat-tab.md) ja [Chat with Heym](./chat-with-heym.md) saavad luua mandaadi, kui workflow seda vajab, või alati, kui te seda palute. Assistent soovitab tüübi ja nime ning tavaline mandaadi vorm avaneb vestluses. Kui palute uuendada mandaati, mille omanik te olete, avaneb sama vorm sellel, saladused on maskeeritud. Assistent näeb ainult nime ja tüüpi. `heym_chat` üle [MCP](../tabs/mcp-tab.md) ei saa mandaate luua, uuendada ega valida.

## Seotud

- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Mandaatide lisamine, muutmine, kustutamine
- [GitHubi sõlm](../nodes/github-node.md) – Natiivsed GitHubi REST-toimingud
- [Jira sõlm](../nodes/jira-node.md) – Jira projekti, teema, kommentaari, manuse, kasutaja, teavituse ja ülemineku automatiseerimine
- [Lineari sõlm](../nodes/linear-node.md) – Lineari GraphQL tööruumi ja teema automatiseerimine
- [Notioni sõlm](../nodes/notion-node.md) – Notioni sisu otsimine ja haldamine
- [Sentry sõlm](../nodes/sentry-node.md) – Sentry organisatsiooni, projekti, meeskonna, teema, sündmuse ja väljalaske automatiseerimine
- [Mandaatide jagamine](./credentials-sharing.md) – Jagamine kasutajate ja meeskondadega
- [Kolmandate osapoolte integratsioonid](./integrations.md) – Seadistusjuhend iga mandaadi tüübi kohta
- [Avaldise DSL](./expression-dsl.md) – `$credentials` avaldistes

## Mudelite ruuter (automaatne mudel)

Mudelite ruuteril pole võtit. Sellel on **otsustusmudeli mandaat**, **mudelivalikute** loend — igaüks olemasolev OpenAI, Google või kohandatud mandaat pluss mudel — ja iga valiku jaoks vaba tekst, mis ütleb, millal seda valikut kasutada.

See kuvatakse igas valijas, mis pakub mudelit: [LLM](../nodes/llm-node.md) ja [Agendi](../nodes/agent-node.md) sõlmed, Chat, AI vaikeväärtused, Tahvlid, avaldise koostaja ja Andmetabelid. Selle ainus mudel on **Auto**. Valige see ja otsustusmudel loeb iga päringut ning suunab selle. [Hindamised](../tabs/evals-tab.md) jätavad selle välja, sest hindamine võrdleb konkreetseid mudeleid ja ruuter valib ise.

Agent suunab ümber, kui selle tööriistatsükkel edeneb, nii et odav mudel saab teha varajased käigud ja tugevam selle käigu, mis seda vajab. Identsed sisendid kasutavad uuesti eelmist otsust, nii et tsükkel maksab otsuse eest ainult siis, kui vestlus on tegelikult edasi liikunud.

### Mida see ei saa teha

Automaatset mudelit ei saa kombineerida **Responses API**, **Partii režiimi** ega **pildi väljundiga**. Need lülitid lülitavad end välja, kui ruuter on valitud, ja igaüks ütleb, miks. Kaitsepiirde kontrollid ja inimülevaatuse poliitika klassifitseerija on fikseeritud üksiku mudeli kutsed ega suuna kunagi.
### Kui marsruutimine ebaõnnestub

Märkige üks valik **Kasuta seda valikut, kui marsruutimine ebaõnnestub** ja otsustusmudeli katkestus ei peata kunagi käivitust; kasutatakse varuvalikut ja põhjus salvestatakse käivitusele. Ilma selleta ebaõnnestub sõlm selle asemel, et oletada.

### Näha, kuhu päring läks

Käivitused näitavad `Auto Model / GPT-5`, mitte ainult mudelit, ja kulu jääb omistatuks mudelile, mis tegelikult töötas. Lõuendil näitavad Execution Log ja Span View sama paari ning Span View loetleb, milline voor kuhu läks.
