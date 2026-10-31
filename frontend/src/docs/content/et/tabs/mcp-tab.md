# MCP / A2A vahekaart

**MCP** vahekaart konfigureerib Model Context Protocol (MCP) integratsiooni, ning [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) serveritena, millele teised agendid saavad ülesandeid delegeerida. MCP võimaldab AI-klienditel (Claude, ChatGPT, Gemini, Cursor ja mis tahes MCP-ühilduv tööriist) kutsuda teie Heymi workflow'sid tööriistadena.

Heym toetab kahte režiimi: **vaikeserver**, mis eksponeerib kõik MCP-lubatud workflow'd ühe endpoint'i all, ja **nimega serverid**, mis annavad igale workflow'de loogilisele grupile omaette URL-i ja API võtme.

Mõlemad režiimid saavad eksponeerida kahte tüüpi tööriistu: üksikud **workflow'd** ja **Heymi chat-tööriist** — kogu [Chat vahekaardi](./chat-tab.md) mootor ühe `heym_chat` tööriista taga.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Vaadake MCP demo</a></p>

## Vaikimisi MCP server

Vaikeserver on alati saadaval aadressil `{origin}/api/mcp/sse`. Kõik workflow'd, millel on MCP sisse lülitatud, kuvatakse siin tööriistadena.

### MCP API võti

- Võtmed salvestatakse SHA-256 räsidena, seega Heym ei saa teile olemasolevat võtit näidata. Vahekaart näitab, kas võti on seatud, mitte seda, milline see on.
- **Genereeri** / **Genereeri uuesti** – Uus võti kuvatakse üks kord, kohe pärast selle loomist. Kopeerige see siis; vahekaardi uuesti laadimine peidab selle jäädavalt.
- Kasutage seda võtit, kui ühendate Claude Desktopi, Cursori või muud MCP kliendid Heymiga
- Kaotasite võtme? Genereerige see uuesti. Eelmine võti lakkab kohe töötamast.

### Ühendusmeetodid

- **API võti** – Kasutage MCP API võtit programmiliste ühenduste jaoks. Vahekaart suudab kopeerida kasutamisvalmis JSON-konfiguratsiooni ja sisaldab nuppu **Lisa Cursorile** ühe klikiga Cursori seadistamiseks.
- **Claude** – Vahekaart näitab MCP serveri URL-i ja seadistamise samme Claude'i jaoks. Jätke OAuth Client ID ja Secret tühjaks; Claude registreerub automaatselt ja autendib end Heymi OAuthi kaudu.
- **ChatGPT** – Vahekaart näitab MCP serveri URL-i ja ChatGPT rakenduse seadistamise samme. Lülitage sisse arendajarežiim (Developer mode), looge URL-iga rakendus ja valige OAuth; ChatGPT registreerub automaatselt.
- **Gemini** – Vahekaart näitab MCP serveri URL-i ja Gemini kohandatud rakenduse seadistamise samme: avage aadressil gemini.google.com **Settings → Connected Apps → Add a custom app**, kleepige URL ja jätke **Advanced features** suletuks; Gemini registreerub automaatselt ja autendib Heym OAuthi kaudu. Pärast ühendamist töötab Heym ka Gemini mobiilirakenduses.

### Workflow MCP lüliti

Iga workflow'd saab eksponeerida MCP tööriistana:

- **Luba** – Workflow tööriistad muutuvad kättesaadavaks kõigile vaikeserveriga ühendatud klientidele
- **Keela** – Workflow'd ei eksponeerita

Workflow kaardid näitavad kirjeldust ja sisendväljade nimede eelvaadet, et näeksite, mida iga tööriist enne lubamist ootab.


### Järjekorras käitused ja heym_execution_status

Workflow, millel on [paralleelsuse piirmäär](../reference/webhooks.md#concurrency-limit-and-queued-runs), võib olla hõivatud, kui klient seda kutsub. Kutse tagastab kohe tulemuse, mis ei ole viga:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Klient küsib tööriista `heym_execution_status` selle `execution_id`-ga. See tagastab sama keha nagu [oleku URL](../reference/webhooks.md#status-url): `queued` praeguse positsiooniga, `running`, seejärel `success` või `error` koos väljunditega. See leiab ainult nende workflows käitusi, mida sama server pakub. Tööriist kuvatakse vaikeserveris ja igas nimega serveris ainult seni, kuni vähemalt ühel selle workflow-l on paralleelsuse piirmäär. Kui järjekord on täis, tagastab kutse vea „Concurrency queue is full“.
## Heymi agent

Jaotis **Heymi võimekused** muudab Chat vahekaardi mootori üheks MCP tööriistaks nimega `heym_chat`. Lubage see vaikeserveril, mis tahes nimega serveril või mõlemal — igal pinnal on oma lüliti ja mudeli valik.

Kui see on sisse lülitatud, kuvatakse `heym_chat` loendis `tools/list` koos teie workflow tööriistadega. MCP klient saadab ühe loomulikus keeles sõnumi ja Heymi mootor võtab sealt edasi, omades samu võimekusi, mis Chat vahekaardil:

- Workflow loomine, selle testkäivitamine näidissisenditega, parandamine ja lõpetamine, kui käivitus õnnestub (vt [Ehitusrežiim](#build-mode))
- Olemasolevate workflow'de uurimine ja käivitamine
- Analüütika, hiljutiste käivituste ja tulevaste cron ajakavade raporteerimine
- Selgitab, kus töövood ebaõnnestuvad ja miks need on aeglased: töövood, mida on kõige rohkem käivitatud, mis on kõige sagedamini ebaõnnestunud ja kõige aeglasemad, ning sõlmetüübid, millele kulub kõige rohkem aega, vigu ja väljakutseid viimase 1, 3 või 6 tunni, 24 tunni, 7 või 30 päeva või kogu ajaloo jooksul
- Ühe workflow käivituste ajaloo raporteerimine: mitu korda see käivitus, olekute loendused, millal see käivitus, ja nõudmisel ühe käivituse sisendid, väljundid ja sõlmede kaupa vead
- Praegu toimuvate asjade raporteerimine: mitu käivitust on aktiivsed, nende workflow nimed, kui kaua igaüks on töötanud, millisel sõlmel see parasjagu on, ja link reaalajas käivitusele
- Tahvlite loetlemine, kaartide loomine ja kaardi detailide lugemine [Tahvli vahekaardil](./board-tab.md)
- Loetleb juhtpaneelid (Heym Worki lehed) ja nende vidinad, tuvastab, millisel juhtpaneelil töövoog asub, lisab uue vidina ja koostab selle töövoo, paigutab olemasoleva töövoo vidinana, nimetab ümber või kustutab vidinaid või korrastab paigutust (vt [Dashboard › Chatist ja MCP-st](./dashboard-tab.md#from-chat-and-mcp))
- Uurib andmetabeleid ja ridu, loob tabeleid, lisab või eemaldab veerge, lisab, uuendab või kustutab ridu ning seob tabeleid töövoogudesse
- Loob, redigeerib ja käivitab viipade ja agentide hindamiskomplekte ([Eval suites](./evals-tab.md#from-chat-and-mcp)), sealhulgas agendi baastaset: raporteeritud, käivitustest koostatud või arvuliselt määratud. Tulemus loetleb iga salvestatud komplekti Evals-lingi.
- Mandaatide loomine või värskendamine Heymi lehel (vt [Mandaadid](#mandaadid))
- Meeskondade ja globaalsete muutujate lugemine ning dokumentatsioonis otsimine
- Ootel inimkonna-tsüklis ülevaatuste kinnitamine, muutmine või tagasilükkamine

Hiljem Chat vahekaardile lisatud võimekused muutuvad automaatselt kättesaadavaks ka `heym_chat` kaudu — ühtegi võimekuse kaupa lülitit pole vaja sünkroonida.

Need funktsioonid töötavad `heym_chat` sees: `tools/list` kuvab `heym_chat` ja teie töövoo tööriistad, mitte kunagi chati sise-tööriistu, nagu hindamiskomplektide omi.

### Ehitusrežiim

`heym_chat` käivitab Chat mootori alati ehitusrežiimis (build mode). Ühe väljakutsega saab assistent salvestada uue workflow, käivitada selle realistlike näidissisenditega, lugeda käivitusaruannet, parandada ebaõnnestunud osad ja käivitada selle uuesti – kuni viis testkäivitust väljakutse kohta. Kui viimase salvestuse viimane käivitus õnnestub, lõpetab see ühelauselise kokkuvõttega ning vastus lõpeb tekstiga `Verified: the latest test run of the saved workflow passed.`

Kui kutse loob või muudab workflow'd, loetleb vastus igaüks oma täieliku redaktori lingiga, näiteks `https://heym.example.com/workflows/<id>`, ja lingid assistendi vastuses on samuti täielikud lingid. Need kasutavad teie konfigureeritud Heymi aadressi (`FRONTEND_URL`) ja avanevad Heymi sisse logitud inimestele, kellel on sellele workflow-le juurdepääs.

- Testkäivitused on päris käivitused. Nende kõrvalmõjud toimuvad päriselt ja need ilmuvad workflow käivitusajaloos nagu iga teine käivitus.
- Salvestamised järgivad redaktori teekonda: graafi muudatus säilitab eelmise graafi workflow muutmise ajaloos (**Edit History**).
- Varem loodud workflow muutmiseks jätkake lõime sama `conversation_id`-ga. Assistent uuendab seda workflow'd uue loomise asemel ning muudab ainult neid workflow'sid, mida teil on õigus muuta.
- Kui viis testkäivitust on ära kasutatud, assistent peatub ja selgitab, mis endiselt ebaõnnestub.

Andmetabelid on erinevad. Tabel ei sisalda saladusi, seega `heym_chat` saab loetleda teie tabeleid, küsida, millist workflow peaks kasutama, ja luua uue koos veergudega. See ei loe ega kirjuta kunagi ridu.

### Mandaadid

`heym_chat` näeb teile kuuluvaid ja teiega jagatud mandaate nime ja tüübi järgi samamoodi nagu Chati vahekaart. Kui selle koostatud workflow vajab mandaati, küsib see tulemuses küsimusena, millist kasutada. Vastake sama `conversation_id`-ga.

Mandaadi lisamiseks või oma mandaadi värskendamiseks avab assistent Heymi mandaadivormi Heymi lehel, `/credentials/setup/<id>`. Logite seal Heymi sisse, sisestate võtme või ühendate konto ja salvestate. Väärtus läheb otse Heymi: MCP klient ja selle mudel saavad teada ainult mandaadi nime ja tüübi. Ärge kleepige võtmeid MCP klienti; küsige selle asemel vormi.

| Klient | Mis juhtub |
|--------|------------|
| Toetab MCP URL-i esilekutsumist | Klient palub teil avada Heymi lehe. Kutse ootab vormi täitmist (kuni kümme minutit) ja jätkab seejärel uue mandaadiga. |
| Kõik muud | Tulemus sisaldab linki ja palub kliendil uuesti kutsuda `heym_chat` parameetriga `wait_for_credential_form`. See kutse ootab vormi täitmisel kuni viis minutit ja jätkab seejärel vestlust. Kui klient ei oota, salvestage vorm ja vastake sama `conversation_id`-ga; järgmine kutse teab, et vorm salvestati ja milline mandaat loodi. |

Leht avaneb ainult päringu algatanud Heymi konto jaoks, seega edastatud link on kõigile teistele kasutu. Vorm jääb avatuks 24 tunniks ja sellest saab lehel keelduda. Kui olete selle salvestanud või tagasi lükanud, kuvab Chati vahekaardi vestluse samm tulemuse.


### Mandaat ja mudel

`heym_chat` käitab mootorit teie Heymi kontol, seega vajab see oma LLM mandaati:

| Väli | Käitumine |
|-------|----------|
| **Mandaat** | Valige mis tahes OpenAI, Google või Custom mandaat, millele teil on juurdepääs. Eeltäidetud eelistatud mandaadiga jaotises [Seaded](../reference/user-settings.md), kui te pole ühtegi valinud. |
| **Mudel** | Laaditakse valitud mandaadist. Eeltäidetud teie eelistatud mudeliga, kui mandaat ühtib. |

Kui kumbki puudub, kuvatakse tööriist endiselt loendis `tools/list`, kuid iga kutse tagastab vea, mis palub seadistamise sellel vahekaardil lõpetada.


LLM- ja Agent-sõlmed `heym_chat` loodud workflow-s töötavad selle mandaadi ja mudeliga, sealhulgas teiega jagatud mandaadiga, nii et testkäitused toimivad ilma täiendava seadistamiseta. Kui `heym_chat` muudab workflow'd, säilitavad LLM- ja Agent-sõlmed, millel juba on mandaat, selle koos oma mudeliga.
### Argumendid ja ajalugu

| Argument | Nõutav | Kirjeldus |
|----------|----------|-------------|
| `message` | Jah | Juhis või küsimus loomulikus keeles. |
| `conversation_id` | Ei | `conversation_id` eelmisest `heym_chat` tulemusest, et jätkata seda vestlust. |
| `wait_for_credential_form` | Ei | Koos `conversation_id`: oodake, kuni kasutaja salvestab või lükkab tagasi lõime avatud mandaadivormi, seejärel saatke `message`. |

Iga kutse kirjutatakse teie [Chat vahekaardi](./chat-tab.md) ajalukku tavalise vestlusena, tähistatud pistiku ikooniga vestluste loendis. Sõnumid, tööriistakaardid ja täpsustamise pausid näevad välja täpselt nagu vestlus, mille te ise algatasite, ja saate vestluse avada ning brauseris edasi rääkida. Iga tulemus tagastab oma `conversation_id`, et MCP klient saaks jätkata sama vestlust, selle asemel et avada iga kutse jaoks uus.

Kui assistent vajab täpsustamist, teeb see pausi ja ütleb seda; vastake vastustega, kasutades sama `conversation_id`.
### Luba A2A

Kui Heymi agent on sisse lülitatud, kuvatakse kaardil märkeruut **Luba A2A**. Märkige see ja teised agendid saavad saata Heymi agendile ülesandeid Agent2Agent protokolli (A2A 1.0) kaudu. Seejärel kuvatakse kaardil **Agent Card** URL ja **JSON-RPC endpoint**, mõlemal kopeerimisnupp, ning käsk `curl` kaardi allalaadimiseks. A2A kasutab sama võtit ja OAuth-sisselogimist nagu MCP. Agendi väljalülitamine lülitab välja ka A2A. Meetodite, ülesannete olekute ja näite kohta vaadake jaotist [A2A](../reference/a2a.md).

### Edenemine

Pikaajaline `heym_chat` väljakutse teatab agendi tegevusest MCP edenemisena (`notifications/progress`), samade sõnadega, mida kuvatakse Chati vahekaardil, näiteks `Töövoo testimine · katse 2/5`. Kliendid, kes lähtestavad oma ajalõpu edenemise teatamisel, ootavad jätkuvalt, kuni agent töötab.

## Nimega MCP serverid

Nimega serverid võimaldavad teil workflow'sid jaotada isoleeritud MCP endpointideks. Igal serveril on oma URL ja API key, nii et erinevad AI kliendid, meeskonnad või kasutusjuhud saavad ühenduda täpselt nende workflow'dega, mida nad vajavad.

### Nimega serveri loomine

1. Sisestage nimi MCP vahekaardi allosas olevasse sisestusvälja (nt **CRM Tools**)
2. Klõpsake **Create** — uus serveri kaart ilmub kohe
3. Klõpsake kaardil, et see laiendada

### Serveripõhised seaded

Iga serveri kaart kuvab:

| Seade | Kirjeldus |
|---------|-------------|
| **SSE Endpoint** | Unikaalne URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Sõltumatu key, kuvatakse üks kord genereerimisel või uuesti genereerimisel. Kopeerige see kohe; seda hoitakse räsitud kujul ja hiljem ei saa seda paljastada |
| **How to connect** | **Copy JSON** kopeerib valmis kleepimiseks mõeldud MCP konfiguratsiooni; **Add to Cursor** installib selle ühe klõpsuga |
| **Heym Capabilities** | Lülitage Heymi agent (`heym_chat`) selle serveri jaoks sisse või välja ning valige selle credential ja mudel |
| **Luba A2A** | Selle serveri enda A2A lüliti koos oma Agent Cardiga aadressil `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Luba A2A** | Selle serveri enda A2A lüliti koos oma Agent Cardiga aadressil `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Lülitage sisse, milliseid teie workflow'sid see server avalikustab |

### Workflow'de määramine

Workflow'de määramine on serveripõhine ja sõltumatu vaikeserveri lülitist. Workflow saab olla lubatud vaikeserveril ja mitmel nimega serveril üheaegselt või mitte ühelgi.

Workflow ümberlülitamine viib selle määratud loendi ülaossa, nii et äsja muudetud rida jääb nähtavale, selle asemel et eemale kerida.

### Autentimine

Nimega serverid toetavad samu autentimismeetodeid nagu vaikeserver:

- **X-MCP-Key header** – Edastage serveri API key otse (API kliendid, Cursor). Ainult header: keysid ei aktsepteerita `?key=` päringuparameetrina, sest URL-id satuvad juurdepääsulogidesse, puhverserveri logidesse ja brauseri ajalukku.
- **Claude, ChatGPT ja Gemini OAuth** – Lisage serveri URL kliendi konnektoritesse või kohandatud rakendustesse; jätke mandaadid tühjaks ja klient registreerub automaatselt OAuth kaudu. Bearer token peab liikuma `Authorization` headeris, mitte `?token=` kujul.
- **Session token** – Väljastatakse SSE kätlemise ajal; piiratud konkreetse serveriga, nii et ühe nimega serveri tokenid ei pääse teisele juurde. See lühiajaline `?session=` parameeter ei ole mõjutatud.

### Nimega serveri kustutamine

Klõpsake serveri kaardi päises **X** ikoonil. Kustutamine eemaldab serveri ja kõik selle workflow'de määramised; workflow'd ise ei ole mõjutatud.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Mõlemad endpointid toetavad SSE transporti (GET, MCP spec 2024-11-05) ja Streamable HTTP transporti (POST, MCP spec 2025-03-26). Claude, ChatGPT ja Gemini kasutavad mõlemal turvaliseks sisselogimiseks OAuth 2.1 / PKCE.

## Seotud

- [Why Heym](../getting-started/why-heym.md) – MCP kui esmaklassiline primitiiv Heymis
- [Agent Node](../nodes/agent-node.md) – Agent node MCP tööriistade toega
- [Agent Architecture](../reference/agent-architecture.md) – MCP klient, tööriistade saatmine, orkestraator
- [Triggers](../reference/triggers.md) – MCP kui workflow'de sisenemispunkt
- [Chat Tab](./chat-tab.md) – Mootor `heym_chat` tööriista taga
- [Workflows Tab](./workflows-tab.md) – Looge ja haldake workflow'sid
- [Node Types](../reference/node-types.md) – AI sõlmede ülevaade
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadete jaoks