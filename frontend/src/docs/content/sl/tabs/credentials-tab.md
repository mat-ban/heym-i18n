# Zavihek Poverilnice

Zavihek **Poverilnice** upravlja z API ključi in skrivnostmi, ki jih uporabljajo vozlišča. Tukaj dodajte poverilnice in jih navajajte po imenu v vozliščih workflow. Za pregled, kaj so poverilnice in kako jih vozlišča uporabljajo, si oglejte [Poverilnice](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Oglejte si predstavitev Poverilnic</a></p>

## Vrste Poverilnic

| Vrsta | Uporaba |
|-------|---------|
| **OpenAI** | OpenAI API ključ za LLM, Agent in RAG vozlišča |
| **Google** | Google AI (Gemini) API ključ |
| **GitHub** | Osebni dostopni žeton (PAT) za GitHub API, GitHub vozlišča workflow, MCP strežnike in agent workflows; neobvezni `base_url` za GitHub Enterprise |
| **Linear** | Osebni API ključ ali OAuth2 za ekipe, projekte, težave in komentarje |
| **Notion** | Notranji integracijski žeton ali avtorizacija za javno integracijo OAuth |
| **Custom** | Prilagojeni LLM končni točki |
| **Bearer** | Bearer žeton za HTTP avtentikacijo |
| **Header** | Prilagojena ključ-vrednost za HTTP zahteve |
| **Telegram** | Telegram bot žeton in neobvezna skrivnost za webhook |
| **Slack** | URL za Slack prihajajoči webhook |
| **Discord** | URL za Discord prihajajoči webhook |
| **Discord Trigger** | Javni ključ aplikacije Discord |
| **IMAP** | Poverilnice za sprožitev vhodnega nabiralnika |
| **SMTP** | Poverilnice za pošiljanje e-pošte |
| **Redis** | Povezava z Redisom |
| **RAG: Qdrant + OpenAI** | Vektorska shramba za RAG vozlišča, podprta z zunanjim Qdrant strežnikom |
| **RAG: Psql + OpenAI** | Vektorska shramba za RAG vozlišča, podprta z Heym-ovo lastno Postgres bazo (pgvector) — brez zunanje storitve |
| **RAG: Custom Embeddings** | Vektorska shramba za RAG vozlišča, ki uporablja katerikoli OpenAI-kompatibilen končni točki za vdelke, z Qdrant ali Postgres (pgvector) kot shrambo |
| **Cohere** | Cohere API za vdelke |

## Dodajanje Poverilnic

1. Kliknite **Dodaj Poverilnico**
2. Izberite vrsto poverilnice
3. Vnesite zahtevane vrednosti (API ključ, URL itd.)
4. Dajte ji ime za sklicevanje v vozliščih

Za GitHub je trenutni postopek poverilnic temelji na PAT. Priporočajo se natančni PAT-ji. Tokovi namestitve GitHub aplikacij trenutno niso v prvi vrsti v uporabniškem vmesniku. Če uporabljate GitHub Enterprise Server, lahko nastavite tudi neobvezni osnovni URL za GitHub API, kot je `https://github.example.com/api/v3`.

Za Linear izberite **Osebni API ključ** ali **OAuth2** v pogovornem oknu. Osebni API ključi se ustvarijo pod **Nastavitve → Varnost in dostop → Osebni API ključi** v Linear. OAuth2 uporablja ID stranke in skrivnost stranke Linear OAuth aplikacije, z `{FRONTEND_URL}/api/credentials/linear/oauth/callback` registriranim kot preusmeritvena URI. Poverilnica deluje s pravicami Linear uporabnika, ki jo je ustvaril ali avtoriziral. Uporabite **Preizkusi povezavo** v pogovornem oknu poverilnice za preverjanje API ključa ali OAuth žetona pred shranjevanjem.

Za **Notion** izberite **Notranji žeton** ali **OAuth** v pogovornem oknu. OAuth uporablja ID stranke in skrivnost stranke iz vaše javne integracije Notion; Heym jih shranjuje šifrirane v poverilnici. Uporabite **Preizkusi povezavo** za preverjanje poverilnic Supabase, Linear ali Notion pred shranjevanjem workflow. Oglejte si [Integracije tretjih oseb](../reference/integrations.md#notion) za podrobnosti o nastavitvi Notion.

Poverilnice OAuth odprejo stran za avtorizacijo ponudnika v pojavnem oknu. Če brskalnik to blokira, uporabite povezavo **Odprite stran za avtorizacijo** pod gumbom Poveži; pogovorno okno opazi, ko se povezava zaključi. Ko je nova poverilnica povezana, gumb pokaže **Povezano**.

## Urejanje in Brisanje

- **Uredi** – Posodobite vrednosti poverilnice (občutljive vrednosti so prikazane kot maskirane)
- **Izbriši** – Odstranite poverilnico; workflow, ki jo uporablja, bo potreboval zamenjavo

Ko urejate **GitHub** poverilnico na GitHub Enterprise Server, pustite neobvezno **GitHub API Base URL** prazno, da ohranite obstoječi Enterprise končni točki. Vnesite nov URL le, ko želite spremeniti ta končni točki.

## Deljenje

- [Delite poverilnice](../reference/credentials-sharing.md) z drugimi uporabniki po e-pošti ali z [Ekipami](../reference/teams.md)
- Deljene poverilnice se prikažejo z indikatorjem
- Prekličite deljenje iz menija kartice poverilnice
## Uporaba v vozliščih

Referencirajte poverilnice po imenu v konfiguraciji vozlišč. Na primer:
- [LLM vozlišče](../nodes/llm-node.md) – Izberite poverilnico za model API
- [HTTP vozlišče](../nodes/http-node.md) – Uporabite Bearer ali Header poverilnice za avtentikacijo
- [Agent vozlišče](../nodes/agent-node.md) – Prenesite GitHub tokene v okoljske spremenljivke MCP strežnika, kot je `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub vozlišče](../nodes/github-node.md) – Izvajajte operacije z GitHub repozitoriji, uporabniki, težavami, pregledi, izdajami, workflows, prometom in datotekami
- [Linear vozlišče](../nodes/linear-node.md) – Preberite metapodatke delovnega prostora in avtomatizirajte Linear težave in komentarje
- [Notion vozlišče](../nodes/notion-node.md) – Upravljajte Notion baze podatkov, vire podatkov, strani in bloke
- [RAG vozlišče](../nodes/rag-node.md) – Uporabite Qdrant ali Postgres (pgvector) poverilnico za vektorsko shrambo
- [Telegram Trigger vozlišče](../nodes/telegram-trigger-node.md) – Prejemajte Telegram bot webhooke
- [Telegram vozlišče](../nodes/telegram-node.md) – Pošiljajte sporočila Telegram bot
- [Discord Trigger vozlišče](../nodes/discord-trigger-node.md) – Prejemajte Discord interakcijske webhooke
- [Discord vozlišče](../nodes/discord-node.md) – Pošiljajte Discord webhook sporočila
- [IMAP Trigger vozlišče](../nodes/imap-trigger-node.md) – Preverjajte skupno poštno predal za nove e-pošte

Oglejte si [Expression DSL](../reference/expression-dsl.md) za referenciranje vrednosti, podprtih s poverilnicami, v izrazih.

## Sorodno

- [Integracije tretjih oseb](../reference/integrations.md) – Podroben vodnik za nastavitev za vsako vrsto poverilnice (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack in še več)
- [Deljenje poverilnic](../reference/credentials-sharing.md) – Delite poverilnice z drugimi uporabniki
- [Varnost](../reference/security.md) – Šifriranje v mirovanju, upravljanje sej, omejevanje hitrosti
- [Vrste vozlišč](../reference/node-types.md) – Vozlišča, ki uporabljajo poverilnice ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Pošlji e-pošto](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Zavihek vektorskih shramb](./vectorstores-tab.md) – Uporablja Qdrant ali Postgres (pgvector) poverilnice
- [Zavihek Chat](./chat-tab.md) – Uporablja OpenAI/Google poverilnice
- [Kontekstni prikaz](../reference/contextual-showcase.md) – Kompaktni vodnik po površinah nadzorne plošče
