# Kartica Vjerodajnica

Kartica **Vjerodajnice** upravlja API ključevima i tajnama koje koriste čvorovi. Ovdje dodajte vjerodajnice i referencirajte ih po imenu u čvorovima workflowa. Za pregled onoga što su vjerodajnice i kako ih čvorovi koriste, pogledajte [Vjerodajnice](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Pogledajte demo Vjerodajnica</a></p>

## Tipovi Vjerodajnica

| Tip | Slučaj upotrebe |
|-----|-----------------|
| **OpenAI** | OpenAI API ključ za LLM, Agent i RAG čvorove |
| **Google** | Google AI (Gemini) API ključ |
| **GitHub** | GitHub osobni pristupni token (PAT) za GitHub API, GitHub node workflows, MCP poslužitelje i agent workflows; opcionalni GitHub Enterprise `base_url` |
| **Linear** | Linear osobni API ključ ili OAuth2 za timove, projekte, probleme i komentare |
| **Notion** | Interni integracijski token ili autorizacija javne integracije OAuth radnog prostora |
| **Custom** | Prilagođeni LLM endpointi |
| **Bearer** | Bearer token za HTTP autentifikaciju |
| **Header** | Prilagođeni ključ-vrijednost zaglavlja za HTTP zahtjeve |
| **Telegram** | Telegram bot token i opcionalna tajna webhooka |
| **Slack** | Slack URL za dolazni webhook |
| **Discord** | Discord URL za dolazni webhook |
| **Discord Trigger** | Javni ključ Discord aplikacije |
| **IMAP** | Vjerodajnice za okidač dolazne pošte |
| **SMTP** | Vjerodajnice za slanje e-pošte |
| **Redis** | Redis veza |
| **RAG: Qdrant + OpenAI** | Vektorska spremišta za RAG čvorove, podržana vanjskim Qdrant poslužiteljem |
| **RAG: Psql + OpenAI** | Vektorska spremišta za RAG čvorove, podržana Heymovom vlastitom Postgres bazom podataka (pgvector) — bez vanjske usluge |
| **RAG: Custom Embeddings** | Vektorska spremišta za RAG čvorove koristeći bilo koji OpenAI-kompatibilni embedding endpoint, s Qdrant ili Postgres (pgvector) kao spremištem |
| **Cohere** | Cohere API za embeddinge |

## Dodavanje Vjerodajnica

1. Kliknite **Dodaj Vjerodajnicu**
2. Odaberite tip vjerodajnice
3. Unesite potrebne vrijednosti (API ključ, URL itd.)
4. Dajte joj ime za referencu u čvorovima

Za GitHub, trenutni tijek vjerodajnica temelji se na PAT-u. Preporučuju se fino podešeni PAT-ovi. Tijekovi instalacije GitHub aplikacija trenutno nisu prioritetni u korisničkom sučelju. Ako koristite GitHub Enterprise Server, također možete postaviti opcionalni GitHub API osnovni URL kao što je `https://github.example.com/api/v3`.

Za Linear, odaberite **Osobni API ključ** ili **OAuth2** u dijalogu. Osobni API ključevi se kreiraju pod **Postavke → Sigurnost i pristup → Osobni API ključevi** u Linearu. OAuth2 koristi Client ID i Client Secret Linear OAuth aplikacije, s `{FRONTEND_URL}/api/credentials/linear/oauth/callback` registriranim kao URI za preusmjeravanje. Vjerodajnica djeluje s dozvolama Linear korisnika koji ju je stvorio ili autorizirao. Koristite **Testiraj vezu** u dijalogu vjerodajnica za provjeru API ključa ili OAuth tokena prije spremanja.

Za **Notion**, odaberite **Interni token** ili **OAuth** u dijalogu. OAuth koristi Client ID i Client Secret iz vaše javne integracije Notion; Heym ih pohranjuje šifrirane u vjerodajnici. Koristite **Testiraj vezu** za provjeru Supabase, Linear ili Notion vjerodajnica prije spremanja workflowa. Pogledajte [Integracije trećih strana](../reference/integrations.md#notion) za detalje o postavljanju Notion-a.

OAuth vjerodajnice otvaraju stranicu autorizacije davatelja u iskačućem prozoru. Ako preglednik blokira, koristite vezu **Otvorite stranicu autorizacije** ispod gumba Poveži; dijalog obavještava kada se veza završi. Kada se nova vjerodajnica poveže, gumb prikazuje **Povezano**.

## Uređivanje i Brisanje

- **Uredi** – Ažurirajte vrijednosti vjerodajnica (osjetljive vrijednosti su maskirane)
- **Izbriši** – Uklonite vjerodajnicu; workflowi koji je koriste trebaju zamjenu

Kada uređujete **GitHub** vjerodajnicu na GitHub Enterprise Serveru, ostavljanje opcionalnog **GitHub API osnovnog URL-a** praznim čuva postojeći Enterprise endpoint. Unesite novu URL adresu samo kada želite promijeniti taj endpoint.

## Dijeljenje

- [Dijelite vjerodajnice](../reference/credentials-sharing.md) s drugim korisnicima putem e-pošte ili s [Timovima](../reference/teams.md)
- Dijeljene vjerodajnice pojavljuju se s indikatorom
- Oduzmite dijeljenje iz izbornika kartice vjerodajnica
## Korištenje u čvorovima

Referencirajte vjerodajnice po imenu u konfiguraciji čvora. Na primjer:
- [LLM čvor](../nodes/llm-node.md) – Odaberite vjerodajnicu za model API
- [HTTP čvor](../nodes/http-node.md) – Koristite Bearer ili Header vjerodajnice za autentifikaciju
- [Agent čvor](../nodes/agent-node.md) – Proslijedite GitHub tokene u MCP varijable okruženja kao što su `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub čvor](../nodes/github-node.md) – Izvršavajte operacije s GitHub repozitorijima, korisnicima, problemima, recenzijama, izdanjima, workflow-ima, prometom i datotekama
- [Linear čvor](../nodes/linear-node.md) – Čitajte metapodatke radnog prostora i automatizirajte Linear probleme i komentare
- [Notion čvor](../nodes/notion-node.md) – Upravljajte Notion bazama podataka, izvorima podataka, stranicama i blokovima
- [RAG čvor](../nodes/rag-node.md) – Koristite Qdrant ili Postgres (pgvector) vjerodajnicu za vektorsko spremište
- [Telegram Trigger čvor](../nodes/telegram-trigger-node.md) – Primajte Telegram bot webhookove
- [Telegram čvor](../nodes/telegram-node.md) – Šaljite poruke Telegram bota
- [Discord Trigger čvor](../nodes/discord-trigger-node.md) – Primajte Discord interakcijske webhookove
- [Discord čvor](../nodes/discord-node.md) – Šaljite Discord webhook poruke
- [IMAP Trigger čvor](../nodes/imap-trigger-node.md) – Provjeravajte zajedničku pristiglu poštu za nove e-mailove

Pogledajte [Expression DSL](../reference/expression-dsl.md) za referenciranje vrijednosti temeljenih na vjerodajnicama u izrazima.

## Povezano

- [Integracije trećih strana](../reference/integrations.md) – Detaljan vodič za postavljanje svake vrste vjerodajnice (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack i druge)
- [Dijeljenje vjerodajnica](../reference/credentials-sharing.md) – Dijelite vjerodajnice s drugim korisnicima
- [Sigurnost](../reference/security.md) – Enkripcija u mirovanju, upravljanje sesijama, ograničavanje brzine
- [Tipovi čvorova](../reference/node-types.md) – Čvorovi koji koriste vjerodajnice ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slanje e-maila](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vektorska spremišta](./vectorstores-tab.md) – Koristi Qdrant ili Postgres (pgvector) vjerodajnice
- [Chat Tab](./chat-tab.md) – Koristi OpenAI/Google vjerodajnice
- [Kontekstualna prezentacija](../reference/contextual-showcase.md) – Kompaktni vodič za površine nadzorne ploče
