# Mandaatide vahekaart

**Mandaatide** vahekaart haldab API võtmeid ja saladusi, mida sõlmed kasutavad. Lisage mandaadid siin ja viidake neile workflow'de sõlmedes nime järgi. Ülevaate saamiseks sellest, mis on mandaadid ja kuidas sõlmed neid kasutavad, vaadake [Mandaadid](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Vaadake mandaatide demo</a></p>

## Mandaadi tüübid

| Tüüp | Kasutusjuht |
|------|----------|
| **OpenAI** | OpenAI API võti LLM-, Agent- ja RAG-sõlmede jaoks |
| **Google** | Google AI (Gemini) API võti |
| **GitHub** | GitHubi isiklik juurdepääsutoken (PAT) GitHub API, GitHubi sõlme workflow'de, MCP serverite ja agentide workflow'de jaoks; valikuline GitHub Enterprise `base_url` |
| **Linear** | Linear isiklik API võti või OAuth2 meeskondade, projektide, teemade ja kommentaaride jaoks |
| **Notion** | Sisemine integratsioonitoken või avaliku integratsiooni OAuth tööruumi autoriseerimine |
| **Custom** | Kohandatud LLM endpoint'id |
| **Bearer** | Bearer token HTTP autentimise jaoks |
| **Header** | Kohandatud header võti-väärtus HTTP päringute jaoks |
| **Telegram** | Telegrami boti token ja valikuline webhooki saladus |
| **Slack** | Slacki sissetuleva webhooki URL |
| **Discord** | Discordi sissetuleva webhooki URL |
| **Discord Trigger** | Discordi rakenduse avalik võti |
| **IMAP** | Sissetuleva postkasti triggeri mandaadid |
| **SMTP** | E-kirjade saatmise mandaadid |
| **Redis** | Redis ühendus |
| **RAG: Qdrant + OpenAI** | Vektorhoidla RAG-sõlmede jaoks, mida toetab väline Qdrant server |
| **RAG: Psql + OpenAI** | Vektorhoidla RAG-sõlmede jaoks, mida toetab Heymi enda Postgres andmebaas (pgvector) — välist teenust pole vaja |
| **RAG: Custom Embeddings** | Vektorhoidla RAG-sõlmede jaoks, kasutades mis tahes OpenAI-ga ühilduvat embedding endpoint'i, kus hoidlana on Qdrant või Postgres (pgvector) |
| **Cohere** | Cohere API embedding'ute jaoks |

## Mandaatide lisamine

1. Klõpsake **Add Credential**
2. Valige mandaadi tüüp
3. Sisestage nõutud väärtused (API võti, URL jne)
4. Andke sellele nimi, et sõlmedes saaks viidata

GitHubi puhul põhineb praegune mandaadi voog PAT-il. Soovitatav on kasutada peeneteralisi PAT-e. GitHub Appi installimise vood ei ole täna UI-s esmajärgulised. Kui kasutate GitHub Enterprise Serverit, saate määrata ka valikulise GitHub API baas-URL-i, näiteks `https://github.example.com/api/v3`.

Linear'i puhul valige dialoogis **Personal API key** või **OAuth2**. Isiklikud API võtmed luuakse
Linear'is jaotises **Settings → Security & Access → Personal API keys**. OAuth2 kasutab Linear OAuth
rakenduse Client ID-d ja Client Secret'i, kusjuures ümbersuunamise URI-na on registreeritud
`{FRONTEND_URL}/api/credentials/linear/oauth/callback`. Mandaat toimib selle Linear kasutaja õigustega, kes selle
lõi või autoriseeris. Kasutage mandaadi dialoogis **Test Connection**, et enne salvestamist API võtit või
OAuth tokenit kontrollida.

**Notioni** puhul valige dialoogis **Internal token** või **OAuth**. OAuth kasutab Client ID-d ja
Client Secret'i teie Notioni avalikust integratsioonist; Heym salvestab need mandaadis krüpteeritult.
Kasutage **Test Connection**, et enne workflow' salvestamist Supabase'i, Linear'i või Notioni mandaate kontrollida. Notioni seadistamise üksikasjade kohta vaadake
[Kolmandate osapoolte integratsioonid](../reference/integrations.md#notion).

OAuth mandaadid avavad pakkuja autoriseerimislehe hüpikaknas. Kui brauser blokeerib selle, kasutage nuppu **Open the authorization page** lingi all; dialoog märkab, kui ühendus on loodud. Kui uus mandaat on ühendatud, kuvatakse nupul **Connected**.

## Muutmine ja kustutamine

- **Edit** – Mandaadi väärtuste värskendamine (tundlikud väärtused on peidetud)
- **Delete** – Mandaadi eemaldamine; seda kasutavad workflow'd vajavad asendust

Kui muudate **GitHubi** mandaati GitHub Enterprise Serveris, siis valikulise **GitHub
API Base URL** tühjaks jätmine säilitab olemasoleva Enterprise endpoint'i. Sisestage uus URL ainult siis, kui
soovite seda endpoint'i muuta.

## Jagamine

- [Jagage mandaate](../reference/credentials-sharing.md) teiste kasutajatega e-posti teel või [Meeskondadega](../reference/teams.md)
- Jagatud mandaadid kuvatakse indikaatoriga
- Tühistage jagamine mandaadi kaardi menüüst
## Kasutamine sõlmedes

Viidake mandaatidele nime järgi sõlme konfiguratsioonis. Näiteks:
- [LLM node](../nodes/llm-node.md) – Valige mandaat mudeli API jaoks
- [HTTP node](../nodes/http-node.md) – Kasutage autentimiseks Bearer- või Header-mandaati
- [Agent node](../nodes/agent-node.md) – Edastage GitHubi tokenid MCP-serveri keskkonnamuutujatesse, nagu `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub node](../nodes/github-node.md) – Käitage natiivseid GitHubi hoidla, kasutaja, issue, review', release'i, workflow', traffic'u ja failioperatsioone
- [Linear node](../nodes/linear-node.md) – Lugege tööruumi metaandmeid ning automatiseerige Linear issue'sid ja kommentaare
- [Notion node](../nodes/notion-node.md) – Halda Notioni andmebaase, andmeallikaid, lehti ja plokke
- [RAG node](../nodes/rag-node.md) – Kasutage vektorhoidla jaoks Qdranti või Postgresi (pgvector) mandaati
- [Telegram Trigger node](../nodes/telegram-trigger-node.md) – Võtke vastu Telegrami boti webhooke
- [Telegram node](../nodes/telegram-node.md) – Saatke Telegrami boti sõnumeid
- [Discord Trigger node](../nodes/discord-trigger-node.md) – Võtke vastu Discordi interaktsiooni webhooke
- [Discord node](../nodes/discord-node.md) – Saatke Discordi webhook-sõnumeid
- [IMAP Trigger node](../nodes/imap-trigger-node.md) – Küsige jagatud postkastist uusi e-kirju

Vt [Expression DSL](../reference/expression-dsl.md), et viidata mandaadipõhistele väärtustele avaldistes.

## Seotud

- [Third-Party Integrations](../reference/integrations.md) – Üksikasjalik seadistusjuhend iga mandaaditüübi jaoks (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack ja paljud teised)
- [Credentials Sharing](../reference/credentials-sharing.md) – Jagage mandaate teiste kasutajatega
- [Security](../reference/security.md) – Krüpteerimine salvestamisel, sessioonihaldus, päringusageduse piiramine
- [Node Types](../reference/node-types.md) – Sõlmed, mis kasutavad mandaate ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Kasutab Qdranti või Postgresi (pgvector) mandaate
- [Chat Tab](./chat-tab.md) – Kasutab OpenAI/Google'i mandaate
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadete jaoks
