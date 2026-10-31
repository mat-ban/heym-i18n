# Vjerodajnice

Vjerodajnice pohranjuju API ključeve i tajne koje koriste čvorovi u workflow-ima. Dodajete ih u [Karticu Vjerodajnica](../tabs/credentials-tab.md) i referencirate ih po imenu u konfiguraciji čvora.

## Što su Vjerodajnice

- **Pohranjene po korisniku** – Svaka vjerodajnica pripada korisniku i može se [dijeliti](./credentials-sharing.md) s drugim korisnicima ili [Timovima](./teams.md).
- **Enkriptirane u mirovanju** – Osjetljive vrijednosti su enkriptirane; korisničko sučelje ih maskira nakon stvaranja.
- **Referencirane po imenu** – Čvorovi odabiru vjerodajnicu po imenu (ili ID-u). Izvršni motor rješava vjerodajnicu za vlasnika workflow-a u vrijeme izvođenja.

## Kako Čvorovi Koriste Vjerodajnice

| Tip čvora | Tipična vjerodajnica | Svrha |
|-----------|----------------------|-------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evaluacije](../tabs/evals-tab.md) | OpenAI, Google, Custom | API ključ za model |
| [Odluka](../nodes/decision-node.md), [Evaluacije](../tabs/evals-tab.md) sudac | Model odluke | Osnovni URL endpointa modela odluke, plus opcionalni API ključ |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Zadaci, [Evaluacije](../tabs/evals-tab.md) paketi promptova | Model Router (Auto Model) | Određuje koji od Vaših modela poslužuje svaki zahtjev, koristeći model odluke |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Prijava za ChatGPT pretplatu (OAuth) ili pristupni token za Codex za izvršitelja, plus GitHub PAT za operacije s repozitorijem |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API ključ za OpenCode Go gateway (opcionalni osnovni URL) za izvršitelja, plus GitHub PAT za operacije s repozitorijem |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Osobni pristupni token (PAT) za GitHub API pozive, operacije s GitHub čvorovima i MCP integracije |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token, Data Center korisničko ime/lozinka ili osobni pristupni token, osnovni URL Jira stranice, način implementacije i opcionalna verzija REST API-a |
| [Linear](../nodes/linear-node.md) | Linear | Osobni API ključ ili OAuth2 za timove, projekte, probleme i komentare |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Autentifikacija za zahtjeve |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token i opcionalna tajna webhooka |
| [Discord](../nodes/discord-node.md) | Discord | URL za dolazni webhook |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Javni ključ) | Javni ključ aplikacije za verifikaciju potpisa |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Veza s vektorskim spremištem (vanjski Qdrant, ili Heym-ov vlastiti Postgres putem pgvector), s OpenAI ili bilo kojim OpenAI-kompatibilnim endpointom za ugradnju |
| [Slack](../nodes/slack-node.md) | Slack | Webhook ili API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Veza s dolaznom poštom |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mail server |
| [Redis](../nodes/redis-node.md) | Redis | Veza |
| [Grist](../nodes/grist-node.md) | Grist | API ključ + URL servera |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Klijent ID + Klijent tajna + OAuth2 suglasnost |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Klijent ID + Klijent tajna + OAuth2 suglasnost |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Klijent ID + Klijent tajna + OAuth2 suglasnost |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL projekta + API ključ (+ opcionalni zadani shema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + korisničko ime/lozinka + baza podataka (+ sigurno) |
| [Notion](../nodes/notion-node.md) | Notion | Interni integracijski token, ili javni integracijski Klijent ID + Klijent tajna + OAuth suglasnost |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token plus opcionalni URL za samostalno hostanje |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Pristupni ključ, tajni ključ, regija |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Za detaljnu konfiguraciju (hostove, portove, specifična polja za pružatelje), pogledajte [Integracije trećih strana](./integrations.md). To uključuje postavljanje Telegram bota, dolaznu e-poštu putem IMAP-a i odlaznu e-poštu putem SMTP-a.

GitHub vjerodajnice također mogu uključivati opcionalni `base_url` kada ciljate GitHub Enterprise Server umjesto GitHub.com. Kada uređujete GitHub vjerodajnicu za rotaciju tokena, ostavljanje `base_url` praznim čuva postojeći Enterprise endpoint. Unesite novu URL adresu samo kada želite promijeniti taj endpoint.

Jira, Linear, Supabase, Notion, Sentry i ClickHouse vjerodajnice nude **Testiraj vezu** u dijalogu vjerodajnica. Za Jira, provjera poziva trenutni korisnički endpoint Jira-e. Za Linear, provjera poziva Linear API s `getViewer` i potvrđuje da je API ključ ili OAuth token valjan. Kada uređujete, možete testirati bez ponovnog unosa API ključa ako je pohranjena tajna još uvijek prisutna. Za Notion, odaberite **Interni token** ili **OAuth** u dijalogu; OAuth koristi Klijent ID i Klijent tajnu iz Vaše javne integracije Notion. Pogledajte [Integracije trećih strana](./integrations.md#notion) za detalje o postavljanju Notion-a.
## Korištenje paketa za kodiranje

Zavičajni tab **AI Defaults** u [Postavkama](./user-settings.md) prikazuje preostalu upotrebu paketa za kodiranje za Vaše Codex vjerodajnice (vlastite i dijeljene). Za svaku Codex vjerodajnicu prikazuje se horizontalna traka po aktivnom prozoru ograničenja brzine — obično **5 sati** i/ili **Tjedni** prozor, ovisno o Vašem planu — s postotkom preostale kvote i odbrojavanjem do ponovnog postavljanja. Podaci dolaze iz zaglavlja odgovora ograničenja brzine Codex backend-a, dohvaćenih na zahtjev.

OpenCode Go vjerodajnice također su navedene, ali označene kao **"upotreba nedostupna"**: OpenCode zen gateway ne izlaže podatke o preostaloj kvoti, stoga se ne može prikazati traka.

## U Izrazima

Neki čvorovi omogućuju izraze za autentifikaciju. Koristite [Expression DSL](./expression-dsl.md) s `$credentials.CredentialName` za referenciranje riješenog tajnog ključa vjerodajnice unutar izraza. Za zaglavlje koje je potrebno za svaki tip vjerodajnice u HTTP zahtjevu, pogledajte [HTTP › Autentifikacija s vjerodajnicama](../nodes/http-node.md#authenticating-with-credentials).

Codex vjerodajnice su namjerno isključene iz `$credentials`. Bez obzira na to prijavite li se s ChatGPT (pretplata, bez troška po tokenu API) ili zalijepite Codex `access_token`, tokeni se samo prosljeđuju lokalnom procesu Codex izvršitelja. Tokeni za prijavu ChatGPT automatski se obnavljaju kada isteknu.

Jira vjerodajnice također su isključene iz `$credentials`. [Jira čvor](../nodes/jira-node.md) učitava vjerodajnicu prema `credentialId` u vrijeme izvođenja. Za prilagođene Jira REST pozive koji nisu pokriveni Jira čvorom, koristite [HTTP čvor](../nodes/http-node.md) s Jira Basic Auth (`email:api_token` za Jira Cloud ili `username:password` za Data Center / Server), na primjer `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Također možete koristiti [Zaglavlje](../nodes/http-node.md) vjerodajnicu s `Authorization: Basic <base64(user:secret)>`. Za osobne pristupne tokene za Jira Data Center / Server umjesto toga pošaljite `Authorization: Bearer <token>`; sama Jira vjerodajnica to podržava putem svog načina provjere autentičnosti **Personal Access Token**.

| Tip vjerodajnice | Vrijednost izložena `$credentials.Name` |
|------------------|-----------------------------------------|
| Bearer           | Bearer token string                     |
| Header           | Potpuni `header key: header value` redak, spreman za umetanje u cURL `-H` argument |
| GitHub           | Osobni pristupni token                  |
| Notion           | Interni `api_token` ili OAuth `access_token` (Bearer token za Notion API pozive) |
| Sentry           | Sentry auth token                       |
| Discord / Slack  | Webhook URL                             |

Primjer:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Koristite Notion **čvor** za izvorne operacije s bazama podataka, stranicama i blokovima. Koristite `$credentials` kada prilagođeni [HTTP](../nodes/http-node.md) zahtjev treba isti Notion bearer token.

## Kreiranje vjerodajnica iz Chata

[AI Asistent](./ai-assistant.md#credentials), [Chat tab](../tabs/chat-tab.md) i [Chat s Heym](./chat-with-heym.md) mogu kreirati vjerodajnicu kada workflow to zahtijeva, ili kad god zatražite jednu. Asistent predlaže tip i naziv, a redovni obrazac za vjerodajnice otvara se u razgovoru. Zatražite ažuriranje vjerodajnice koju posjedujete i isti obrazac se otvara s njenim tajnama maskiranim. Asistent vidi samo naziv i tip. `heym_chat` preko [MCP](../tabs/mcp-tab.md) ne može kreirati, ažurirati ili odabrati vjerodajnice.

## Povezano

- [Tablica vjerodajnica](../tabs/credentials-tab.md) – Dodavanje, uređivanje, brisanje vjerodajnica
- [GitHub Čvor](../nodes/github-node.md) – Izvorne GitHub REST operacije
- [Jira Čvor](../nodes/jira-node.md) – Automatizacija projekata, problema, komentara, privitaka, korisnika, obavijesti i prijelaza u Jiri
- [Linear Čvor](../nodes/linear-node.md) – Automatizacija Linear GraphQL radnog prostora i problema
- [Notion Čvor](../nodes/notion-node.md) – Pretraživanje i upravljanje Notion sadržajem
- [Sentry Čvor](../nodes/sentry-node.md) – Automatizacija organizacije, projekta, tima, problema, događaja i izdanja u Sentryju
- [Dijeljenje vjerodajnica](./credentials-sharing.md) – Dijelite s korisnicima i timovima
- [Integracije trećih strana](./integrations.md) – Vodič za postavljanje po tipu vjerodajnice
- [Expression DSL](./expression-dsl.md) – `$credentials` u izrazima

## Model Router (Auto Model)

Model Router ne drži ključ. Drži **vjerodajnicu modela odluke**, popis **model opcija** — svaka je postojeća OpenAI, Google ili prilagođena vjerodajnica plus model — i, za svaku opciju, slobodan tekst koji govori kada se ta opcija treba koristiti.

Pojavljuje se u svakom odabiru koji nudi model: [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md) čvorovi, Chat, AI Defaults, Dashboards, graditelj izraza i Tablice podataka. Njegov jedini model je **Auto**. Odaberite ga, a model odluke čita svaki zahtjev i usmjerava ga. [Evaluacije](../tabs/evals-tab.md) ga isključuju, jer eval uspoređuje specifične modele, a usmjerivač bira svoj.

Agent ponovno usmjerava kako se njegov alatni ciklus odvija, tako da je jeftiniji model može preuzeti rane okrete, a jači onaj koji je potreban. Identični ulazi ponovo koriste prethodnu odluku, tako da ciklus plaća za odluku samo kada je razgovor zapravo napredovao.

### Što ne može

Auto Model se ne može kombinirati s **Responses API**, **Batch mode** ili **izlazom slika**. Ti prekidači se onemogućuju kada je odabran usmjerivač, a svaki objašnjava zašto. Provjere sigurnosti i klasifikator politike ljudske revizije su fiksni pozivi s jednim modelom i nikada ne usmjeravaju.
### Kada usmjeravanje ne uspije

Oz označite jednu opciju **Koristite ovu opciju kada usmjeravanje ne uspije** i kvar modela odluke nikada ne zaustavlja izvršavanje; koristi se rezervna opcija, a razlog se bilježi na izvršavanju. Bez nje, čvor ne uspijeva umjesto da nagađa.

### Gdje je zahtjev otišao

Izvršavanja prikazuju `Auto Model / GPT-5` umjesto samog modela, a trošak ostaje pripisan modelu koji je zapravo izvršen. Canvas Log izvršavanja i Pregled raspona prikazuju isti par, a Pregled raspona navodi koji je okret otišao kamo.
