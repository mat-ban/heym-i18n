# Uzol Agenta

Uzol **AI Agent** je LLM uzol s volaním nástrojov. Dokáže spúšťať Python nástroje, volať pripojené uzly plátna ako nástroje, pripájať sa k MCP serverom, používať zručnosti, voliteľne fungovať ako orchestrátor, ktorý deleguje na iné uzly agentov, volať iné workflowy ako nástroje a pozastaviť sa na [ľudskú kontrolu](../reference/human-in-the-loop.md).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1, plus voliteľný `review`, keď je povolené HITL |
| Výstup | `$nodeLabel.text`, `$nodeLabel.fieldName` (keď je povolený JSON výstup), alebo čakajúci HITL payload počas čakania na kontrolu |

## Základné parametre

### Prihlasovacie údaje a model

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | LLM prihlasovacie údaje (API kľúč) z Nastavení |
| `model` | string | Názov modelu (napr. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (voliteľné) | Záložné prihlasovacie údaje, keď primárne zlyhajú |
| `fallbackModel` | string (voliteľné) | Záložný model, keď primárny zlyhá |

Pridajte prihlasovacie údaje v karte [Prihlasovacie údaje](../tabs/credentials-tab.md). Zoznam modelov sa načíta z vybraných prihlasovacích údajov. Ak primárne prihlasovacie údaje alebo model vrátia chybu, uzol automaticky zopakuje pokus so záložnými prihlasovacími údajmi a modelom pred zlyhaním.

### Prompty

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `systemInstruction` | string | Systémový prompt pre AI. Podporuje [výrazy](../reference/expression-dsl.md). |
| `userMessage` | string | Používateľská správa/prompt. Predvolené: `$input.text` |
| `jsonOutputEnabled` | boolean | Štruktúrovaný JSON výstup |
| `jsonOutputSchema` | string | JSON Schema pre štruktúrovaný výstup |
| `extraBodyEnabled` | boolean | Odoslať parametre požiadavky špecifické pre poskytovateľa (predvolené: `false`) |
| `extraBody` | string | JSON objekt zlúčený do každej API požiadavky, ktorú agent vykoná |

Použite `$input.text`, `$nodeName.field` a inú syntax [Expression DSL](../reference/expression-dsl.md).

### Reasoning modely (o1, o3)

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (predvolené: 0.7), pre štandardné modely |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Hĺbka uvažovania pre reasoning modely |

Pri používaní reasoning modelu (napr. o1, o3) rozhranie zobrazuje **Reasoning Effort** namiesto Temperature. Pre štandardné modely **Temperature** riadi kreativitu.

**Príklad JSON výstupu:** Keď potrebujete štruktúrované dáta od agenta (napr. klasifikáciu, extrakciu), povoľte JSON výstup a poskytnite schému. Agent vráti JSON zodpovedajúci schéme; pristupujte k poliam podľa názvu na výstupe uzla:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Nadväzujúce uzly môžu použiť `$agentLabel.status`, `$agentLabel.reason` atď. Rovnaké správanie ako JSON výstup [LLM uzla](../nodes/llm-node.md).

## Ľudská kontrola (HITL)

Použite HITL, keď agent môže potrebovať schválenie v konkrétnych momentoch pred dôležitými akciami.

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Pridá kontrolné body ľudskej kontroly do agenta |
| `hitlSummary` | string | Pokyny na schválenie, ktoré agentovi hovoria, kedy je potrebná ľudská kontrola |

Keď je HITL povolené, agent dostane nástroj `request_human_review`. Použite systémový prompt a
toto pole pokynov na vysvetlenie, ktoré volania nástrojov, sub-agentov, sub-workflowov, MCP akcie, zručnosti
alebo vedľajšie efekty vyžadujú schválenie. Agent môže tento nástroj zavolať len v prípade potreby, vrátane viacerých
volaní v jednom spustení.

Súhrn pre kontrolóra na verejnej stránke sa generuje z požiadavky na kontrolu agenta za
behu. Ak agent neposkytne súhrn explicitne, Heym ho odvodí z Markdown
tela kontroly.

Pre MCP nástroje Heym žiada model, aby interpretoval vaše písomné HITL pokyny ako jeden z troch
rozsahov: `always`, `once` alebo `never`. To znamená, že voľné formulácie ako „pre každé volanie", „len
jedenkrát" alebo „nikdy sa nepýtaj" sú normalizované pred uplatnením runtime gating.

Každý HITL kontrolný bod vytvára jednorazový verejný odkaz na kontrolu na `/review/{token}`. Kontrolór môže:

- **Prijať** pôvodný Markdown text kontroly
- **Upraviť a pokračovať** s upraveným Markdownom
- **Odmietnuť** a pokračovať s `text: ""`

Keď je HITL povolené, uzol tiež vystavuje výstupný konektor `review` na plátne. Pripojte túto vetvu k Slacku, e-mailu alebo iným uzlov upozornení, ak chcete vysielať URL kontroly a súhrn hneď, ako sa spustenie pozastaví.

Spustenie prechádza do stavu `pending`, kým kontrolór neodpovie. Text kontroly je jedno Markdown telo a čakajúci payload tiež obsahuje text zdieľateľného odkazu pre externé odovzdanie. Uzly na vetve `review` sa spustia okamžite, keď sa vytvorí pozastavenie; normálna výstupná cesta pokračuje až po schválení. Po schválení Heym pokračuje z uloženého snímku spustenia a agent pokračuje so schváleným kontextom. Ak neskorší krok tiež potrebuje schválenie, agent môže vytvoriť ďalší HITL kontrolný bod. Pozrite si [Human-in-the-Loop](../reference/human-in-the-loop.md) pre tvar payloadu, správanie URL kontroly a sémantiku pokračovania.

HITL je dostupné len pre výstup agenta v textovom režime. Vo v1 ho nie je možné kombinovať s `jsonOutputEnabled`.
## Režim Orchestrator

Keď je povolený, agent môže delegovať úlohy na iné agent uzly v rámci workflow. Ak je **Režim Orchestrator zakázaný**, agent **nemôže vytvárať prepojenia agent→agent** na plátne.

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Ak je `true`, agent získa nástroj `call_sub_agent` |
| `subAgentLabels` | string[] | Označenia agent uzlov, ktoré môže tento orchestrator volať |

**Sub-agenti** musia vo svojej User Message používať `$input.text`, aby dostali prompt od orchestratora.

Keď orchestrator zavolá viacerých sub-agentov v rámci jedného ťahu, vykonajú sa paralelne. Podrobnosti nájdete v časti [Agent Architecture](../reference/agent-architecture.md).

## Sub-Workflows

Po nakonfigurovaní agent získa nástroj `call_sub_workflow` na spúšťanie iných workflowov.

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID workflowov, ktoré môže tento agent volať ako nástroje |

Workflowy vyberte v sekcii Sub-Workflows v konfigurácii agenta. Agent ich bude volať s `workflow_id` a `inputs` (objekt zodpovedajúci vstupným poliam cieľového workflowu). Maximálna hĺbka: 5 vnorených volaní sub-workflowov.

## Nástroje uzlov na plátne

Podporovaný uzol workflowu môžete pripojiť k rukoväti **tools** agenta, aby ho agent mohol za behu zavolať. Tým sa existujúce akcie a transformácie na plátne zmenia na volateľné nástroje bez písania Pythonu.

Nástroje uzlov na plátne použite, keď chcete, aby agent rozhodol, kedy spustiť nakonfigurovaný uzol, pričom prihlasovacie údaje, statické polia a nastavenia špecifické pre workflow zostanú v UI uzla.

### Polia poskytované agentom

Polia na pripojenom uzle nástroja môžu byť označené ikonou robota. Označené polia sa stanú povinnými parametrami nástroja, ktoré musí agent pri volaní uzla poskytnúť. Neoznačené polia zostávajú pevné a čítajú sa z konfigurácie uzla.

Napríklad:

- Pripojte uzol Slack k agentovi ako nástroj
- Prihlasovacie údaje ponechajte pevné v uzle Slack
- Označte `message` ako poskytované agentom
- Agent získa nástroj Slack, v ktorom za behu poskytne iba správu

Ak uzol nie je pripojený k agentovi ako nástroj, ikona robota je skrytá a uzol sa správa ako bežný krok workflowu.

### Správanie za behu

Keď agent zavolá nástroj uzla na plátne, Heym dočasne zlúči argumenty poskytnuté agentom do dát tohto uzla, vykoná uzol, vráti výstup uzla agentovi a potom obnoví pôvodnú konfiguráciu uzla. Uzly nástrojov sa nespúšťajú ako bežné kroky workflowu prostredníctvom normálneho plánovania; spustia sa iba vtedy, keď ich agent zavolá.

Nástroje uzlov na plátne sú užitočné s integračnými uzlami, ako sú Slack, Telegram, HTTP, Send Email, a s uzlami na úpravu dát, ako je [Set](./set-node.md). Trigger uzly, uzly riadenia toku a mapovače terminálneho výstupu ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) sa nedajú použiť ako nástroje agenta.

## Python nástroje

Definujte vlastné nástroje, ktoré môže agent volať. Každý nástroj má:

| Pole | Typ | Popis |
|-------|------|-------------|
| `name` | string | Názov nástroja (napr. `count_characters`) |
| `description` | string | Popis pre LLM |
| `parameters` | JSON Schema | Schéma OpenAI function-calling (formát objektu) |
| `code` | string | Kód funkcie v Pythone |

**Parameters** musia byť JSON objekt, nie reťazec:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Príklad nástroja:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python nástroje sa štandardne spúšťajú ako nedôveryhodný kód v spevnenom, izolovanom Docker kontajneri (bez siete, bez Docker socketu, súborový systém iba na čítanie, bez root oprávnení). Importy sú obmedzené na allowlist bezpečných modulov štandardnej knižnice. Konfiguráciu (`HEYM_PYTHON_TOOL_SANDBOX`) nájdete v časti [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox).

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maximálny počet sekúnd na jedno spustenie nástroja (predvolené: 30) |
| `requestTimeoutSeconds` | number | Maximálny počet sekúnd čakania na každú odpoveď modelu pred vypršaním časového limitu (predvolené: 60). Zvýšte ho pre pomalých alebo self-hosted poskytovateľov (LiteLLM, vLLM, lokálne modely) a dlhé viackrokové behy. |
## MCP Connections

Pripojte sa k serverom [Model Context Protocol](https://modelcontextprotocol.io/) a sprístupnite ich nástroje agentovi.

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Typ pripojenia |
| `timeoutSeconds` | number | Časový limit pre toto pripojenie (predvolené: 30) |
| `label` | string | Voliteľný zobrazovaný názov |

**stdio** (lokálny proces):

| Pole | Popis |
|-------|-------------|
| `command` | Príkaz na spustenie (napr. `npx`) |
| `args` | JSON pole (napr. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON objekt premenných prostredia vložených do procesu (napr. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Väčšina stdio serverov s API kľúčom sa autentifikuje prostredníctvom premenných prostredia, nie prostredníctvom argumentov príkazu. Nastavte `env` pre každé pripojenie, aby každý uzol agenta mohol používať iné prihlasovacie údaje bez zásahu do prostredia hostiteľa.

Hodnoty `env` podporujú [Expression DSL](../reference/expression-dsl.md), takže môžete odovzdávať vstupy workflowu ako prihlasovacie údaje namiesto pevného zakódovania tajných údajov:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Výraz `$userInput.pat` sa vyhodnotí za behu voči vstupným údajom workflowu pred spustením procesu MCP. To vám umožňuje prijímať tokeny z triggera alebo vstupného uzla namiesto ich vkladania do definície workflowu.

Príklad — GitHub MCP s pevne zakódovaným tokenom:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Príklad — GitHub MCP s dynamickým tokenom zo vstupu workflowu:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Príklad — GitHub MCP s prihlasovacími údajmi Heym GitHub:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Vstavané prihlasovacie údaje GitHub sú momentálne zamerané na autentifikáciu založenú na PAT. Ak potrebujete prístup k organizácii, použite PAT s požadovanými oprávneniami pre organizáciu/repozitár.

Príklad — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (vzdialený server):

| Pole | Popis |
|-------|-------------|
| `url` | URL adresa SSE endpointu. Podporuje výrazy (napr. `$userInput.serverUrl`). |
| `headers` | JSON objekt pre autentifikáciu/vlastné hlavičky. Hodnoty podporujú výrazy. |

**Streamable HTTP** (vzdialený server):

| Pole | Popis |
|-------|-------------|
| `url` | URL adresa MCP endpointu (napr. `https://example.com/mcp`). Podporuje výrazy. |
| `headers` | JSON objekt pre autentifikáciu/vlastné hlavičky. Hodnoty podporujú výrazy. |

## Skills

Skills sú inštrukcie SKILL.md plus voliteľné Python súbory a priložené aktíva. Rozširujú systémový kontext agenta a môžu pridávať Python nástroje.

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `name` | string | Názov skillu |
| `content` | string | Obsah SKILL.md (inštrukcie) |
| `timeoutSeconds` | number | Časový limit pre spustenie Pythonu skillu (predvolené: 30) |
| `driveFilesEnabled` | boolean | Povoľuje runtime pomocníka `heym_drive` pre tento skill (predvolené: false) |
| `files` | array | Voliteľné položky `{ path, content, encoding, mimeType }` (napr. `.py` skripty alebo binárne aktíva uložené ako base64) |

Skills je možné pridať presunutím súboru `.zip` alebo `.md` do oblasti Skills.
Po rozbalení karty skillu presuňte ľubovoľný súbor na daný skill a pripojte alebo nahraďte priložený súbor, vrátane binárnych aktív, ako sú PDF a obrázky.
Pomocou tlačidla na stiahnutie na karte skillu exportujte daný skill ako archív `.zip` na zálohovanie alebo opätovné použitie v inom workflowe.

Povoľte **Drive files** na skille iba vtedy, keď jeho Python kód potrebuje čítať súbory z Heym Drive. Povolené skills dostanú za behu vygenerovaného pomocníka `heym_drive.py` a môžu volať `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` alebo `read_drive_base64` s ID súboru Drive alebo presným názvom súboru. Vyhľadávanie podľa názvu súboru používa najnovšiu dostupnú zhodu. Zakázané skills pomocníka nedostanú.

Každá karta skillu má štyri akcie v riadku pod názvom:

| Tlačidlo | Popis |
|--------|-------------|
| **Edit with AI** | Otvorí Skill Builder na úpravu skillu z chat promptu |
| **Download** | Exportuje skill ako archív `.zip` |
| **Remove** | Odstráni skill z tohto uzla agenta |
| **History** | Otvorí históriu skillu odvodenú z [Edit History](../reference/edit-history.md) |
### História skillu

História skillu sa **neukladá** samostatne. Odvodzuje sa zo snapshotov História úprav workflowu: každá uložená verzia workflowu obsahuje celé pole `skills` uzla agenta.

V dialógu História môžete:

- **Zobraziť náhľad** minulého snapshotu (SKILL.md a zoznam súborov)
- **Upraviť** — načítať snapshot do editora skillov bez vrátenia celého workflowu
- **AI Fine-tune** — otvoriť Skill Builder s týmto snapshotom ako východiskovým bodom
- **Vrátiť** — obnoviť iba tento skill z minulej verzie (ostatné uzly zostanú nezmenené)

História sa riadi rovnakou 7-dňovou retenciou ako História úprav workflowu. Uloženie workflowu po úpravách skillu vytvára nové záznamy histórie.

Sekcia Skilly tiež obsahuje **AI Build**:

- Kliknutím na **AI Build** vytvoríte nový skill z chatového promptu
- Kliknutím na tlačidlo iskry na existujúcom skille ho upravíte pomocou AI
- Presuňte súbory do skladateľa promptu, čím ich pripojíte ku komentáru fine-tune; tieto súbory sa tiež uložia ako priložené aktíva skillu
- Modálne okno streamuje text asistenta a zároveň zobrazuje živé náhľady súborov `SKILL.md` a `.py`
- **Download ZIP** exportuje aktuálny náhľad bez jeho pridania do uzla
- **Save & Add** uloží vygenerované súbory späť prostredníctvom rovnakého procesu parsovania ZIP, aký sa používa pri manuálnych nahrávaniach

Pri úpravách pomocou AI odosiela Heym do buildera iba textové súbory skillov `.md` a `.py`. Binárne a iné needitovateľné prílohy sa zachovajú a zdieľajú s builderom ako metadata ciest, aby vygenerovaný kód v Pythone mohol zachovať správne relatívne odkazy na súbory.
Vyberte priložený súbor v pravom paneli a povoľte **Include this file in AI context**, keď AI potrebuje skontrolovať priloženú šablónu. Textové súbory, PDF a DOCX sa podľa možností extrahujú do kontextu promptu; Heym neuplatňuje samostatný limit veľkosti prílohy Skill Builder nad rámec limitu tela požiadavky platformy.

## Extra Body

Niektorí poskytovatelia akceptujú parametre požiadavky, ktoré štandardné polia kompatibilné s OpenAI nepokrývajú, napríklad vypnutie režimu myslenia modelu. Začiarknite **Send extra request body** vo vlastnostiach uzla a zadajte objekt JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Predvolene vypnuté.** Pri vypnutom začiarkavacom políčku sa neodosiela nič navyše.
- Aplikuje sa na **každú** požiadavku v slučke volania nástrojov, nielen na prvý ťah, plus na pokus o záložný model. Neaplikuje sa na kontroly guardrails, ktoré používajú samostatný model.
- Musí ísť o **objekt** JSON. Pole, skalárna hodnota alebo nesprávne naformátovaný text spôsobí zlyhanie uzla s chybou `Invalid extra body JSON` namiesto tichého zahodenia.
- Výrazy `$` sa vyhodnocujú pred parsovaním. Keďže ide o textovú substitúciu, vyhodnotená hodnota obsahujúca úvodzovku alebo nový riadok vytvorí neplatný JSON a spôsobí zlyhanie uzla.

Rovnaké pole a správanie ako extra body v [uzle LLM](./llm-node.md).

## Guardrails

Povoľte **Guardrails** vo vlastnostiach uzla, aby ste zablokovali nebezpečné správy používateľa pred spustením agenta. Úplnú referenciu nájdete v [Guardrails](../reference/guardrails.md).

## Perzistentná pamäť (graf)

Voliteľný znalostný graf **pre každý uzol agenta** uložený v databáze. Keď je povolený, Heym pripojí pred každým spustením k **systémovej inštrukcii** súhrn zapamätaných entít a vzťahov vo formáte Markdown (iba ak je graf neprázdny). Po **úspešnom** dokončení agenta úloha na pozadí extrahuje nové trvalé fakty z konverzácie a zlúči ich do grafu.

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Povoliť načítanie + extrakciu na pozadí pre tento uzol plátna |

**Sub-agenti** si zachovávajú **vlastný** graf (kľúčovaný podľa ich id uzla), oddelený od orchestrátora.

Pomocou ružového ovládacieho prvku **brain** na uzle (keď je pamäť zapnutá alebo je zobrazený riadok modelu) otvoríte editor grafu a voliteľné **zdieľanie pamäte** (iné workflowy/agenti). Úplné správanie, REST cesty a podrobnosti exportu JSON: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API a kontinuita uvažovania

Začiarkavacie políčko **Use Responses API** smeruje volania modelu agenta cez
[Responses API](https://platform.openai.com/docs/api-reference/responses) namiesto Chat
Completions. Predvolene je vypnuté.

Najdôležitejšie je pri modeli uvažovania, ako je `gpt-5` alebo séria `o`. Responses API vracia
uvažovanie modelu spolu s každým volaním nástroja a agent posiela tieto položky uvažovania späť
v ďalšom ťahu, takže model si zachováva reťazec myšlienok naprieč viackrokovou slučkou nástrojov
namiesto toho, aby ho znovu odvodzoval po každom výsledku nástroja. Celá slučka beží na rovnakej
ceste vrátane
[ľudského posúdenia](#human-review-hitl) pozastavenia a obnovenia, [kompresie kontextu](#context-compression)
a konečnej odpovede.

Samotná konverzácia zostáva v Heym. Heym odosiela úplný vstup v každom ťahu a prenáša
uvažovanie ako zašifrovaný blob, takže na strane poskytovateľa sa medzi volaniami nič neuchováva.
Položky uvažovania v rámci rozsahu, ktorý kompresia kontextu sumarizuje, sa zahodia spolu s ním, keďže
zašifrovaný blob nie je možné sumarizovať.

Funguje s prihlasovacími údajmi OpenAI a s vlastnými prihlasovacími údajmi, ktorých brána podporuje
endpoint. S prihlasovacími údajmi Google zostáva vypnuté.
## Kompresia kontextu

Keď agent vykoná mnoho iterácií nástrojov s rozsiahlymi výsledkami (web scraping, čítanie dokumentov, výstupy pod-workflowov), nahromadená história správ sa môže priblížiť limitu kontextového okna modelu. Heym automaticky komprimuje históriu konverzácie počas behu, aby predišiel pretečeniu kontextu.

**Ako to funguje:**

1. Pred každou iteráciou nástroja Heym odhadne aktuálny počet tokenov (~4 znaky na token).
2. Ak odhad prekročí **80 %** kontextového okna modelu, spustí sa kompresia.
3. História správ sa rozdelí na zachovanú a komprimovanú časť:
   - **Zachovaná**: systémový prompt, prvá správa používateľa, najnovšia správa používateľa
   - **Komprimovaná**: všetko medzi tým (myšlienkové kroky asistenta, volania nástrojov, výsledky nástrojov)
4. Stredná časť sa zhrnie pomocou **rovnakého modelu a prihlasovacích údajov** — nie je potrebná žiadna dodatočná konfigurácia.
5. Komprimovaný súhrn nahradí strednú časť ako jediná správa asistenta.

**Sledovateľnosť:**

Udalosti kompresie sa zobrazujú ako záznamy `Context compressed (N messages → summary)` v:
- Zozname volaní nástrojov v **Debug paneli** počas živého behu
- Zobrazení detailu behu v **Histórii spustení**
- Karte **Traces** ako záznam trace typu `context.compression`

Kompresia je automatická a vždy aktívna pre uzly Agent. **Nevzťahuje sa** na uzly LLM, kartu Chat ani relácie AI Assistant.

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Ako agenti bežia a zostávajú pod kontrolou v produkcii
- [Trvalá pamäť agenta](../reference/agent-persistent-memory.md) – Znalostný graf pre každý uzol agenta, voliteľné zdieľanie, API, editor
- [Architektúra agenta](../reference/agent-architecture.md) – Pod-agent, orchestrátor, zručnosti, MCP, volanie nástrojov
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Verejné stránky na kontrolu, čakajúce spustenia, tok schválenia/úpravy/odmietnutia
- [Guardrails](../reference/guardrails.md) – Blokovanie kategórií nebezpečného obsahu
- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [AI Assistant](../reference/ai-assistant.md) – Chat rozhranie na tvorbu workflowov prirodzeným jazykom (odlišné od uzla Agent)
- [Expression DSL](../reference/expression-dsl.md) – Odkazovanie na dáta v promptoch
- [Štruktúra workflowu](../reference/workflow-structure.md) – Uzly, hrany a formát DSL
- [Rýchly štart](../getting-started/quick-start.md) – Základný workflow s LLM a výrazmi
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie API kľúčov pre agenta
- [Karta MCP](../tabs/mcp-tab.md) – Konfigurácia MCP pre nástroje workflowu
