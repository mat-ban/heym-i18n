# Agent čvor

**AI Agent** čvor je LLM čvor s pozivanjem alata. Može pokretati Python alate, pozivati povezane canvas čvorove kao alate, povezivati se na MCP poslužitelje, koristiti vještine, opcionalno djelovati kao orkestrator koji delegira na druge agent čvorove, pozivati druge workflowe kao alate te se pauzirati za [ljudski pregled](../reference/human-in-the-loop.md).

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1, plus opcionalni `review` kada je HITL omogućen |
| Izlaz | `$nodeLabel.text`, `$nodeLabel.fieldName` (kada je JSON izlaz omogućen) ili pending HITL payload dok se čeka pregled |

## Osnovni parametri

### Vjerodajnica i model

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | LLM vjerodajnica (API ključ) iz Postavki |
| `model` | string | Naziv modela (npr. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcionalno) | Rezervna vjerodajnica kada primarna ne uspije |
| `fallbackModel` | string (opcionalno) | Rezervni model kada primarni ne uspije |

Dodajte vjerodajnice u kartici [Vjerodajnice](../tabs/credentials-tab.md). Popis modela učitava se iz odabrane vjerodajnice. Ako primarna vjerodajnica ili model vrate pogrešku, čvor automatski ponovno pokušava s rezervnom vjerodajnicom i modelom prije nego što ne uspije.

### Promptovi

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `systemInstruction` | string | Sistem prompt za AI. Podržava [izraze](../reference/expression-dsl.md). |
| `userMessage` | string | Korisnička poruka/prompt. Zadano: `$input.text` |
| `jsonOutputEnabled` | boolean | Strukturirani JSON izlaz |
| `jsonOutputSchema` | string | JSON Schema za strukturirani izlaz |
| `extraBodyEnabled` | boolean | Šalje parametre zahtjeva specifične za pružatelja usluge (zadano: `false`) |
| `extraBody` | string | JSON objekt koji se spaja u svaki API zahtjev koji agent uputi |

Koristite `$input.text`, `$nodeName.field` i drugu sintaksu [Expression DSL](../reference/expression-dsl.md).

### Reasoning modeli (o1, o3)

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (zadano: 0.7), za standardne modele |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Dubina reasoninga za reasoning modele |

Kada koristite reasoning model (npr. o1, o3), sučelje prikazuje **Reasoning Effort** umjesto Temperature. Za standardne modele, **Temperature** kontrolira kreativnost.

**Primjer JSON izlaza:** Kada su vam potrebni strukturirani podaci od agenta (npr. klasifikacija, ekstrakcija), omogućite JSON izlaz i priložite schemu. Agent vraća JSON koji odgovara schemi; pristupite poljima po nazivu na izlazu čvora:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Nizvodni čvorovi mogu koristiti `$agentLabel.status`, `$agentLabel.reason` itd. Isto ponašanje kao JSON izlaz [LLM čvora](../nodes/llm-node.md).

## Ljudski pregled (HITL)

Koristite HITL kada agent može trebati odobrenje u određenim trenucima prije važnih radnji.

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Dodaje kontrolne točke ljudskog pregleda agentu |
| `hitlSummary` | string | Smjernice za odobrenje koje agentu govore kada je potreban ljudski pregled |

Kada je HITL omogućen, agent prima alat `request_human_review`. Koristite sistem prompt i
ovo polje smjernica kako biste objasnili koji pozivi alata, pod-agenti, pod-workflowi, MCP radnje, vještine
ili nuspojave zahtijevaju odobrenje. Agent može pozvati taj alat samo kada je potrebno, uključujući više
puta u jednom izvršavanju.

Sažetak namijenjen pregledavatelju na javnoj stranici generira se iz agentovog zahtjeva za pregled u
vrijeme izvršavanja. Ako agent ne priloži sažetak izričito, Heym ga izvodi iz Markdown
tijela pregleda.

Za MCP alate, Heym traži od modela da interpretira vaše pisane HITL upute kao jedan od tri
opsega: `always`, `once` ili `never`. To znači da se slobodni izričaji poput "za svaki poziv", "samo
jednom" ili "nikad ne pitaj" normaliziraju prije nego što se primijeni runtime gating.

Svaka HITL kontrolna točka stvara jednokratnu javnu poveznicu za pregled na `/review/{token}`. Pregledavatelj može:

- **Prihvatiti** izvorni Markdown tekst pregleda
- **Urediti i nastaviti** s izmijenjenim Markdownom
- **Odbiti** i nastaviti s `text: ""`

Kada je HITL omogućen, čvor također izlaže izlazni priključak `review` na canvasu. Povežite tu granu s Slackom, e-poštom ili drugim čvorovima za obavijesti ako želite emitirati URL pregleda i sažetak čim se izvršavanje pauzira.

Izvršavanje prelazi u stanje `pending` dok pregledavatelj ne odgovori. Tekst pregleda je jedno Markdown tijelo, a pending payload također uključuje tekst poveznice za dijeljenje za vanjsko prosljeđivanje. Čvorovi na grani `review` pokreću se odmah kada se pauza stvori; normalni izlazni put nastavlja se tek nakon odobrenja. Nakon odobrenja, Heym nastavlja iz pohranjenog snimka izvršavanja i agent nastavlja s odobrenim kontekstom. Ako kasniji korak također zahtijeva odobrenje, agent može stvoriti još jednu HITL kontrolnu točku. Pogledajte [Human-in-the-Loop](../reference/human-in-the-loop.md) za oblik payloada, ponašanje URL-a pregleda i semantiku nastavljanja.

HITL je dostupan samo za izlaz agenta u tekstualnom načinu rada. U v1 se ne može kombinirati s `jsonOutputEnabled`.
## Orchestrator način rada

Kada je omogućen, agent može delegirati zadatke drugim agent nodeovima u workflowu. Ako je **Orchestrator način rada onemogućen**, agent **ne može stvarati agent→agent veze** na platnu.

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Kada je `true`, agent dobiva alat `call_sub_agent` |
| `subAgentLabels` | string[] | Oznake agent nodeova koje ovaj orchestrator može pozvati |

**Sub-agenti** moraju koristiti `$input.text` u svojoj User Message kako bi primili orchestratorov prompt.

Kada orchestrator pozove više sub-agenata u jednom potezu, oni se izvršavaju paralelno. Pogledajte [Agent Architecture](../reference/agent-architecture.md) za detalje.

## Sub-Workflows

Kada je konfiguriran, agent dobiva alat `call_sub_workflow` za izvršavanje drugih workflowa.

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID-evi workflowa koje ovaj agent može pozvati kao alate |

Odaberite workflowe u odjeljku Sub-Workflows u konfiguraciji agenta. Agent će ih pozvati s `workflow_id` i `inputs` (objekt koji odgovara ulaznim poljima ciljnog workflowa). Maksimalna dubina: 5 ugniježđenih poziva sub-workflowa.

## Alati canvas nodeova

Možete povezati podržani workflow node s agentovom ručkom **tools** kako bi agent mogao pozvati taj node tijekom izvršavanja. Time se postojeće canvas radnje i transformacije pretvaraju u alate koji se mogu pozvati bez pisanja Pythona.

Koristite alate canvas nodeova kada želite da agent odluči kada će pokrenuti konfigurirani node, a pritom zadržavate vjerodajnice, statična polja i postavke specifične za workflow u sučelju nodea.

### Polja koja osigurava agent

Polja na povezanom tool nodeu mogu se označiti ikonom bota. Označena polja postaju obavezni parametri alata koje agent mora osigurati kada pozove node. Neoznačena polja ostaju fiksna i čitaju se iz konfiguracije nodea.

Na primjer:

- Povežite Slack node s agentom kao alat
- Zadržite vjerodajnicu fiksnom u Slack nodeu
- Označite `message` kao polje koje osigurava agent
- Agent prima Slack alat u kojem tijekom izvršavanja dostavlja samo poruku

Ako node nije povezan s agentom kao alat, ikona bota je skrivena i node se ponaša kao uobičajeni korak workflowa.

### Ponašanje tijekom izvršavanja

Kada agent pozove alat canvas nodea, Heym privremeno spaja argumente koje je osigurao agent u podatke tog nodea, izvršava node, vraća izlaz nodea agentu, a zatim vraća izvornu konfiguraciju nodea. Tool nodeovi se ne izvršavaju kao uobičajeni koraci workflowa kroz normalno raspoređivanje; izvršavaju se samo kada ih agent pozove.

Alati canvas nodeova korisni su s integracijskim nodeovima kao što su Slack, Telegram, HTTP, Send Email i nodeovima za oblikovanje podataka kao što je [Set](./set-node.md). Trigger nodeovi, nodeovi za kontrolu toka i terminalni output mappers ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) ne mogu se koristiti kao agentovi alati.

## Python alati

Definirajte prilagođene alate koje agent može pozvati. Svaki alat ima:

| Polje | Tip | Opis |
|-------|------|-------------|
| `name` | string | Naziv alata (npr. `count_characters`) |
| `description` | string | Opis za LLM |
| `parameters` | JSON Schema | OpenAI function-calling schema (format objekta) |
| `code` | string | Python kod funkcije |

**Parameters** mora biti JSON objekt, ne string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Primjer alata:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python alati izvršavaju se kao nepouzdani kod u očvrsnutom, izoliranom Docker kontejneru prema zadanim postavkama (bez mreže, bez Docker socketa, filesystem samo za čitanje, non-root). Importi su ograničeni na allowlistu sigurnih modula standardne biblioteke. Pogledajte [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) za konfiguraciju (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maksimalno sekundi po izvršavanju alata (zadano: 30) |
| `requestTimeoutSeconds` | number | Maksimalno sekundi čekanja na svaki odgovor modela prije isteka vremena (zadano: 60). Povećajte za spore ili samostalno hostane providere (LiteLLM, vLLM, lokalni modeli) i duge višekoračne izvedbe. |
## MCP veze

Povežite se s poslužiteljima [Model Context Protocol](https://modelcontextprotocol.io/) kako biste njihove alate izložili agentu.

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Vrsta veze |
| `timeoutSeconds` | number | Vremensko ograničenje za ovu vezu (zadano: 30) |
| `label` | string | Neobavezni naziv za prikaz |

**stdio** (lokalni proces):

| Polje | Opis |
|-------|-------------|
| `command` | Naredba za pokretanje (npr. `npx`) |
| `args` | JSON polje (npr. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON objekt varijabli okoline koje se ubacuju u proces (npr. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Većina stdio poslužitelja koji se oslanjaju na API ključ autentificira se putem varijabli okoline, a ne putem argumenata naredbe. Postavite `env` za svaku vezu zasebno kako bi svaki agent čvor mogao koristiti drugu vjerodajnicu bez mijenjanja okoline hosta.

Vrijednosti u `env` podržavaju [Expression DSL](../reference/expression-dsl.md), pa možete proslijediti ulaze workflowa kao vjerodajnice umjesto da tajne upisujete izravno u kod:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Izraz `$userInput.pat` razrješava se tijekom izvršavanja prema ulaznim podacima workflowa prije nego što se MCP proces pokrene. To vam omogućuje da prihvatite tokene iz triggera ili ulaznog čvora umjesto da ih ugrađujete u definiciju workflowa.

Primjer — GitHub MCP s tvrdo upisanim tokenom:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Primjer — GitHub MCP s dinamičkim tokenom iz ulaza workflowa:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Primjer — GitHub MCP s Heym GitHub vjerodajnicom:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Ugrađena GitHub vjerodajnica trenutačno podržava autentifikaciju temeljenu na PAT-u. Ako vam je potreban pristup organizaciji, upotrijebite PAT s potrebnim dozvolama za organizaciju/repozitorij.

Primjer — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (udaljeni poslužitelj):

| Polje | Opis |
|-------|-------------|
| `url` | URL SSE endpointa. Podržava izraze (npr. `$userInput.serverUrl`). |
| `headers` | JSON objekt za autentifikaciju/prilagođena zaglavlja. Vrijednosti podržavaju izraze. |

**Streamable HTTP** (udaljeni poslužitelj):

| Polje | Opis |
|-------|-------------|
| `url` | URL MCP endpointa (npr. `https://example.com/mcp`). Podržava izraze. |
| `headers` | JSON objekt za autentifikaciju/prilagođena zaglavlja. Vrijednosti podržavaju izraze. |

## Skills

Skills su upute iz SKILL.md datoteke te neobavezne Python datoteke i priloženi resursi. Proširuju sistemski kontekst agenta i mogu dodati Python alate.

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `name` | string | Naziv skilla |
| `content` | string | Sadržaj SKILL.md datoteke (upute) |
| `timeoutSeconds` | number | Vremensko ograničenje za izvršavanje Python koda skilla (zadano: 30) |
| `driveFilesEnabled` | boolean | Omogućuje runtime pomoćnik `heym_drive` za ovaj skill (zadano: false) |
| `files` | array | Neobavezni unosi `{ path, content, encoding, mimeType }` (npr. `.py` skripte ili binarni resursi pohranjeni kao base64) |

Skills se mogu dodati ispuštanjem `.zip` ili `.md` datoteke na područje Skills.
Nakon što raširite karticu skilla, ispustite bilo koju datoteku na taj skill kako biste priložili ili zamijenili priloženu datoteku, uključujući binarne resurse poput PDF-ova i slika.
Upotrijebite gumb za preuzimanje na kartici skilla kako biste taj skill izvezli kao `.zip` arhivu za sigurnosnu kopiju ili ponovnu upotrebu u drugom workflowu.

Omogućite **Drive files** na skillu samo kada njegov Python kod treba čitati datoteke iz Heym Drivea. Omogućeni skills tijekom izvršavanja dobivaju generirani pomoćnik `heym_drive.py` i mogu pozvati `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` ili `read_drive_base64` s ID-om Drive datoteke ili točnim nazivom datoteke. Pretraživanje prema nazivu datoteke koristi najnovije dostupno podudaranje. Onemogućeni skills ne dobivaju pomoćnika.

Svaka kartica skilla ima četiri radnje u retku ispod naslova:

| Gumb | Opis |
|--------|-------------|
| **Edit with AI** | Otvara Skill Builder za reviziju skilla putem chat prompta |
| **Download** | Izvozi skill kao `.zip` arhivu |
| **Remove** | Briše skill s ovog agent čvora |
| **History** | Otvara povijest skilla izvedenu iz [Edit History](../reference/edit-history.md) |
### Povijest skilla

Povijest skilla **ne** pohranjuje se zasebno. Izvodi se iz snimki povijesti izmjena workflowa: svaka spremljena verzija workflowa uključuje potpuni `skills` array agent čvora.

Iz dijaloga Povijest možete:

- **Pregledati** prošlu snimku (SKILL.md i popis datoteka)
- **Urediti** — učitati snimku u uređivač skilla bez vraćanja cijelog workflowa
- **AI Fine-tune** — otvoriti Skill Builder s tom snimkom kao polazištem
- **Vratiti** — vratiti samo ovaj skill iz prošle verzije (ostali čvorovi ostaju nepromijenjeni)

Povijest slijedi isto 7-dnevno zadržavanje kao i povijest izmjena workflowa. Spremanjem workflowa nakon izmjena skilla stvaraju se novi unosi povijesti.

Odjeljak Skills također uključuje **AI Build**:

- Kliknite **AI Build** za stvaranje novog skilla iz chat prompta
- Kliknite gumb iskrica na postojećem skillu za njegovu reviziju pomoću AI-ja
- Ispustite datoteke u sastavljač prompta kako biste ih priložili komentaru za fine-tune; te se datoteke također spremaju kao priložena sredstva skilla
- Modalni prozor struji tekst asistenta uz prikaz uživo pregleda datoteka `SKILL.md` i `.py`
- **Download ZIP** izvozi trenutni pregled bez dodavanja u čvor
- **Save & Add** sprema generirane datoteke natrag kroz isti tijek parsiranja ZIP-a koji se koristi za ručna učitavanja

Pri uređivanju pomoću AI-ja, Heym šalje samo tekstualne `.md` i `.py` datoteke skilla u builder. Binarni i drugi neuredljivi privitci čuvaju se i dijele s builderom kao metapodaci putanje kako bi generirani Python kod mogao zadržati ispravne relativne reference datoteka.
Odaberite priloženu datoteku u desnom panelu i omogućite **Include this file in AI context** kada AI treba pregledati priloženi predložak. Tekstualne, PDF i DOCX datoteke izdvajaju se u kontekst prompta kada je to moguće; Heym ne primjenjuje zasebno ograničenje veličine privitka Skill Buildera osim ograničenja tijela zahtjeva platforme.

## Extra Body

Neki pružatelji usluga prihvaćaju parametre zahtjeva koje standardna polja kompatibilna s OpenAI-jem ne pokrivaju, poput onemogućavanja načina razmišljanja modela. Označite **Send extra request body** u svojstvima čvora i unesite JSON objekt.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Onemogućeno prema zadanim postavkama.** Kada je potvrdni okvir isključen, ništa dodatno se ne šalje.
- Primjenjuje se na **svaki** zahtjev u petlji pozivanja alata, ne samo na prvi krug, plus na pokušaj rezervnog modela. Ne primjenjuje se na provjere guardrailsa, koje koriste zaseban model.
- Mora biti JSON **objekt**. Array, skalarna vrijednost ili neispravno oblikovan tekst uzrokuje pad čvora s `Invalid extra body JSON` umjesto tihog odbacivanja.
- `$` izrazi rješavaju se prije parsiranja. Budući da je riječ o tekstualnoj zamjeni, razriješena vrijednost koja sadrži dvostruki navodnik ili novi redak proizvodi neispravan JSON i uzrokuje pad čvora.

Isto polje i ponašanje kao kod extra bodyja [LLM čvora](./llm-node.md).

## Guardrails

Omogućite **Guardrails** u svojstvima čvora kako biste blokirali nesigurne korisničke poruke prije pokretanja agenta. Pogledajte [Guardrails](../reference/guardrails.md) za potpunu referencu.

## Trajna memorija (graf)

Neobavezni **po agent čvoru** graf znanja pohranjen u bazi podataka. Kada je omogućen, Heym dodaje Markdown sažetak zapamćenih entiteta i odnosa u **sistemsku instrukciju** prije svakog pokretanja (samo ako graf nije prazan). Nakon **uspješnog** dovršetka agenta, pozadinski posao izdvaja nove trajne činjenice iz razgovora i spaja ih u graf.

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Omogući učitavanje + pozadinsko izdvajanje za ovaj canvas čvor |

**Pod-agenti** zadržavaju **vlastiti** graf (ključan prema njihovom id-u čvora), odvojen od orkestratora.

Koristite ružičastu **brain** kontrolu na čvoru (kada je memorija uključena ili je redak modela prikazan) za otvaranje uređivača grafa i neobaveznog **dijeljenja memorije** (drugi workflowi/agenti). Potpuno ponašanje, REST putanje i pojedinosti JSON izvoza: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API i kontinuitet zaključivanja

Potvrdni okvir **Use Responses API** usmjerava pozive modela agenta kroz
[Responses API](https://platform.openai.com/docs/api-reference/responses) umjesto Chat
Completions. Prema zadanim postavkama isključen je.

Najvažniji je kod modela zaključivanja poput `gpt-5` ili serije `o`. Responses API vraća
zaključivanje modela uz svaki poziv alata, a agent vraća te stavke zaključivanja natrag u
sljedećem krugu, tako da model zadržava svoj lanac misli kroz višekoračnu petlju alata umjesto
da ga ponovno izvodi nakon svakog rezultata alata. Cijela petlja radi na istoj putanji, uključujući
pauzu i nastavak [ljudskog pregleda](#human-review-hitl), [kompresiju konteksta](#context-compression)
i konačni odgovor.

Sam razgovor ostaje u Heymu. Heym šalje potpuni unos u svakom krugu i prenosi
zaključivanje kao šifrirani blob, tako da ništa nije zadržano na strani pružatelja usluge između poziva.
Stavke zaključivanja unutar raspona koje kompresija konteksta sažima odbacuju se zajedno s njim, budući
da se šifrirani blob ne može sažeti.

Radi s OpenAI vjerodajnicom i s prilagođenom vjerodajnicom čiji gateway podržava
endpoint. S Google vjerodajnicom ostaje onemogućen.
## Kompresija konteksta

Kada agent izvršava mnoge iteracije alata s velikim rezultatima (web scraping, čitanje dokumenata, izlazi pod-workflowa), akumulirana povijest poruka može se približiti ograničenju kontekstnog okvira modela. Heym automatski komprimira povijest razgovora tijekom izvršavanja kako bi spriječio prelijevanje konteksta.

**Kako funkcionira:**

1. Prije svake iteracije alata, Heym procjenjuje trenutni broj tokena (~4 znaka po tokenu).
2. Ako procjena premašuje **80 %** kontekstnog okvira modela, pokreće se kompresija.
3. Povijest poruka dijeli se na očuvane i komprimirane dijelove:
   - **Očuvano**: sistemski prompt, prva korisnička poruka, najnovija korisnička poruka
   - **Komprimirano**: sve između (krugovi zaključivanja asistenta, pozivi alata, rezultati alata)
4. Srednji dio sažima se pomoću **istog modela i vjerodajnice** — dodatna konfiguracija nije potrebna.
5. Komprimirani sažetak zamjenjuje srednji dio kao jedna poruka asistenta.

**Vidljivost:**

Događaji kompresije pojavljuju se kao unosi `Context compressed (N messages → summary)` u:
- Popisu poziva alata u **Debug panelu** tijekom izvršavanja uživo
- Prikazu pojedinosti izvršavanja u **Povijesti izvršavanja**
- Kartici **Traces** kao unos traga `context.compression`

Kompresija je automatska i uvijek aktivna za Agent čvorove. **Ne** primjenjuje se na LLM čvorove, Chat karticu ni sesije AI Assistant-a.

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Kako agenti rade i ostaju pod kontrolom u produkciji
- [Trajna memorija agenta](../reference/agent-persistent-memory.md) – Graf znanja po Agent čvoru, opcionalno dijeljenje, API, editor
- [Arhitektura agenta](../reference/agent-architecture.md) – Pod-agenti, orkestrator, vještine, MCP, pozivanje alata
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Javne stranice za pregled, izvršavanja na čekanju, tijek odobri/uredi/odbij
- [Guardrails](../reference/guardrails.md) – Blokirajte nesigurne kategorije sadržaja
- [Vrste čvorova](../reference/node-types.md) – Pregled svih vrsta čvorova
- [AI Assistant](../reference/ai-assistant.md) – Chat sučelje za izradu workflowa prirodnim jezikom (razlikuje se od Agent čvora)
- [Expression DSL](../reference/expression-dsl.md) – Referenciranje podataka u promptovima
- [Struktura workflowa](../reference/workflow-structure.md) – Čvorovi, veze i DSL format
- [Brzi početak](../getting-started/quick-start.md) – Osnovni workflow s LLM-om i izrazima
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodajte API ključeve za agenta
- [Kartica MCP](../tabs/mcp-tab.md) – Konfigurirajte MCP za alate workflowa
