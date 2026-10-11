# Agent csomópont

Az **AI Agent** csomópont egy LLM csomópont tool-hívási képességgel. Képes Python toolokat futtatni, a csatlakoztatott vászon-csomópontokat toolként meghívni, MCP szerverekhez kapcsolódni, skilleket használni, opcionálisan orchestratorként működni, amely más agent csomópontoknak delegál, más workflow-kat toolként meghívni, valamint szüneteltetni [emberi felülvizsgálat](../reference/human-in-the-loop.md) céljából.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1, valamint opcionális `review`, ha a HITL engedélyezve van |
| Kimenet | `$nodeLabel.text`, `$nodeLabel.fieldName` (JSON kimenet engedélyezése esetén), vagy egy függőben lévő HITL payload, amíg a felülvizsgálatra vár |

## Alapvető paraméterek

### Hitelesítési adatok és modell

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | LLM hitelesítési adat (API kulcs) a Beállításokból |
| `model` | string | Modell neve (pl. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcionális) | Tartalék hitelesítési adat, ha az elsődleges meghiúsul |
| `fallbackModel` | string (opcionális) | Tartalék modell, ha az elsődleges meghiúsul |

Adjon hozzá hitelesítési adatokat a [Hitelesítési adatok](../tabs/credentials-tab.md) lapon. A modellista a kiválasztott hitelesítési adatból töltődik be. Ha az elsődleges hitelesítési adat vagy modell hibát ad vissza, a csomópont automatikusan újrapróbálkozik a tartalék hitelesítési adattal és modellel, mielőtt meghiúsulna.

### Promptok

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `systemInstruction` | string | Az AI rendszer-promptja. Támogatja a [kifejezéseket](../reference/expression-dsl.md). |
| `userMessage` | string | Felhasználói üzenet/prompt. Alapértelmezett: `$input.text` |
| `jsonOutputEnabled` | boolean | Strukturált JSON kimenet |
| `jsonOutputSchema` | string | JSON Schema a strukturált kimenethez |
| `extraBodyEnabled` | boolean | Szolgáltató-specifikus kérési paraméterek küldése (alapértelmezett: `false`) |
| `extraBody` | string | JSON objektum, amely minden egyes API kérésbe bekerül, amelyet az agent küld |

Használja a `$input.text`, `$nodeName.field` és egyéb [Expression DSL](../reference/expression-dsl.md) szintaxist.

### Reasoning modellek (o1, o3)

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (alapértelmezett: 0.7), standard modellekhez |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning mélység reasoning modellekhez |

Reasoning modell (pl. o1, o3) használatakor a felhasználói felület a **Reasoning Effort** lehetőséget mutatja a Temperature helyett. Standard modelleknél a **Temperature** szabályozza a kreativitást.

**JSON kimenet példa:** Ha strukturált adatokra van szüksége az agenttől (pl. osztályozás, kinyerés), engedélyezze a JSON kimenetet és adjon meg egy sémát. Az agent a sémának megfelelő JSON-t ad vissza; a mezőket név szerint érheti el a csomópont kimenetén:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

A downstream csomópontok használhatják a `$agentLabel.status`, `$agentLabel.reason` stb. kifejezéseket. Ugyanaz a viselkedés, mint az [LLM csomópont](../nodes/llm-node.md) JSON kimeneténél.

## Emberi felülvizsgálat (HITL)

Akkor használja a HITL-t, ha az agentnek bizonyos pillanatokban jóváhagyásra lehet szüksége fontos műveletek előtt.

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Emberi felülvizsgálati ellenőrzési pontokat ad az agenthez |
| `hitlSummary` | string | Jóváhagyási irányelvek, amelyek megmondják az agentnek, mikor van szükség emberi felülvizsgálatra |

Ha a HITL engedélyezve van, az agent kap egy `request_human_review` toolt. A rendszer-prompt és
ez az irányelvek mező segítségével magyarázza el, mely tool-hívások, sub-agentek, sub-workflow-k, MCP műveletek, skillek
vagy mellékhatások igényelnek jóváhagyást. Az agent csak akkor hívhatja meg ezt a toolt, amikor szükséges, akár többször
is egy futtatáson belül.

A nyilvános oldalon a felülvizsgáló számára megjelenő összefoglaló az agent felülvizsgálati kéréséből
generálódik futásidőben. Ha az agent nem ad meg kifejezetten összefoglalót, a Heym a Markdown
felülvizsgálati törzsből származtat egyet.

MCP toolok esetén a Heym megkéri a modellt, hogy az Ön írott HITL utasításait a három
hatókör egyikeként értelmezze: `always`, `once` vagy `never`. Ez azt jelenti, hogy a szabad szövegezésű
megfogalmazásokat, mint például „minden híváshoz", „csak egyszer" vagy „soha ne kérdezzen", normalizálja, mielőtt a futásidejű kapuzás alkalmazásra kerül.

Minden HITL ellenőrzési pont létrehoz egy egyszeri nyilvános felülvizsgálati linket a `/review/{token}` címen. A felülvizsgáló a következőket teheti:

- **Elfogadás** az eredeti Markdown felülvizsgálati szöveggel
- **Szerkesztés és folytatás** módosított Markdown szöveggel
- **Elutasítás** és folytatás `text: ""` értékkel

Ha a HITL engedélyezve van, a csomópont egy `review` kimeneti fogantyút is megjelenít a vásznon. Csatlakoztassa azt az ágat Slack, e-mail vagy egyéb értesítési csomópontokhoz, ha a felülvizsgálati URL-t és összefoglalót szeretné közzétenni, amint a futtatás szünetel.

A futtatás `pending` állapotba kerül, amíg a felülvizsgáló válaszol. A felülvizsgálati szöveg egyetlen Markdown törzs, és a függőben lévő payload tartalmazza a megosztható link szövegét is a külső átadáshoz. A `review` ágon lévő csomópontok azonnal futnak, amikor a szünet létrejön; a normál kimeneti útvonal csak a jóváhagyás után folytatódik. A jóváhagyás után a Heym a tárolt futtatási pillanatképből folytatja, és az agent a jóváhagyott kontextussal folytatja. Ha egy későbbi lépés is jóváhagyást igényel, az agent létrehozhat egy másik HITL ellenőrzési pontot. A payload alakjáról, a felülvizsgálati URL viselkedéséről és a folytatási szemantikáról lásd a [Human-in-the-Loop](../reference/human-in-the-loop.md) részt.

A HITL csak szöveges módú agent kimenethez érhető el. Az v1-ben nem kombinálható a `jsonOutputEnabled` beállítással.
## Orchestrator mód

Ha engedélyezett, az ügynök feladatokat delegálhat a workflow más ügynök csomópontjaira. Ha az **Orchestrator mód le van tiltva**, az ügynök **nem hozhat létre ügynök→ügynök kapcsolatokat** a vásznon.

| Paraméter | Típus | Leírás |
|-----------|------|--------|
| `isOrchestrator` | boolean | Ha `true`, az ügynök kap egy `call_sub_agent` eszközt |
| `subAgentLabels` | string[] | Azon ügynök csomópontok címkéi, amelyeket ez az orchestrator hívhat |

A **rész-ügynököknek** a `$input.text` kifejezést kell használniuk a User Message mezőben, hogy megkapják az orchestrator promptját.

Ha az orchestrator egyetlen körben több rész-ügynököt hív meg, azok párhuzamosan futnak. A részletekért lásd az [Ügynök architektúra](../reference/agent-architecture.md) oldalt.

## Rész-workflow-k

Ha konfigurálva van, az ügynök kap egy `call_sub_workflow` eszközt más workflow-k végrehajtásához.

| Paraméter | Típus | Leírás |
|-----------|------|--------|
| `subWorkflowIds` | string[] | Azon workflow-k azonosítói, amelyeket ez az ügynök eszközként hívhat |

Válassza ki a workflow-kat az ügynök konfigurációjának Sub-Workflows szakaszában. Az ügynök a `workflow_id` és `inputs` paraméterekkel hívja meg őket (az `inputs` objektum a cél-workflow bemeneti mezőivel egyezik). Maximális mélység: 5 egymásba ágyazott rész-workflow hívás.

## Vászon csomópont eszközök

Egy támogatott workflow csomópontot összekapcsolhat egy ügynök **tools** fogantyújával, így az ügynök futásidőben meghívhatja azt a csomópontot. Ez a meglévő vászon műveleteket és transzformációkat hívható eszközökké alakítja Python kód írása nélkül.

Akkor használja a vászon csomópont eszközöket, ha azt szeretné, hogy az ügynök döntse el, mikor futtassa a konfigurált csomópontot, miközben a hitelesítési adatok, a statikus mezők és a workflow-specifikus beállítások továbbra is a csomópont felületén maradnak.

### Ügynök által megadott mezők

Egy csatlakoztatott eszköz csomópont mezői megjelölhetők a bot ikonnal. A megjelölt mezők kötelező eszközparaméterekké válnak, amelyeket az ügynöknek meg kell adnia a csomópont meghívásakor. A meg nem jelölt mezők rögzítettek maradnak, és a csomópont konfigurációjából olvasódnak be.

Például:

- Csatlakoztasson egy Slack csomópontot egy ügynökhöz eszközként
- Tartsa a hitelesítési adatokat rögzítve a Slack csomópontban
- Jelölje meg a `message` mezőt ügynök által megadottként
- Az ügynök kap egy Slack eszközt, ahol futásidőben csak az üzenetet adja meg

Ha a csomópont nincs ügynökhöz csatlakoztatva eszközként, a bot ikon rejtett, és a csomópont úgy viselkedik, mint egy normál workflow lépés.

### Futásidejű viselkedés

Amikor az ügynök meghív egy vászon csomópont eszközt, a Heym ideiglenesen beolvasztja az ügynök által megadott argumentumokat a csomópont adataiba, végrehajtja a csomópontot, visszaadja a csomópont kimenetét az ügynöknek, majd visszaállítja az eredeti csomópont konfigurációt. Az eszköz csomópontok nem futnak rendes workflow lépésként a normál ütemezésen keresztül; csak akkor futnak, amikor az ügynök meghívja őket.

A vászon csomópont eszközök hasznosak integrációs csomópontokkal, például Slack, Telegram, HTTP, Send Email, valamint adat alakító csomópontokkal, például a [Set](./set-node.md) csomóponttal. A trigger csomópontok, a vezérlési folyam csomópontok és a terminális kimenet leképezők ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) nem használhatók ügynök eszközként.

## Python eszközök

Egyéni eszközök definiálása, amelyeket az ügynök hívhat. Minden eszköz a következőkkel rendelkezik:

| Mező | Típus | Leírás |
|-------|------|--------|
| `name` | string | Eszköz neve (pl. `count_characters`) |
| `description` | string | Leírás az LLM számára |
| `parameters` | JSON Schema | OpenAI function-calling séma (objektum formátum) |
| `code` | string | Python függvény kódja |

A **Parameters** mezőnek JSON objektumnak kell lennie, nem stringnek:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Példa eszköz:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** A Python eszközök alapértelmezés szerint nem megbízható kódként futnak egy megerősített, izolált Docker konténerben (nincs hálózat, nincs Docker socket, csak olvasható fájlrendszer, nem root felhasználó). Az importok egy biztonságos standard könyvtár modulokból álló engedélyezési listára korlátozódnak. A konfigurációért (`HEYM_PYTHON_TOOL_SANDBOX`) lásd a [Biztonság → Python eszköz sandbox](../reference/security.md#python-tool-sandbox) oldalt.

| Paraméter | Típus | Leírás |
|-----------|------|--------|
| `toolTimeoutSeconds` | number | Eszközönkénti végrehajtás maximális másodperce (alapértelmezett: 30) |
| `requestTimeoutSeconds` | number | Az egyes modellválaszokra való várakozás maximális másodperce az időtúllépés előtt (alapértelmezett: 60). Növelje lassú vagy saját üzemeltetésű szolgáltatók (LiteLLM, vLLM, helyi modellek) és hosszú, több lépéses futások esetén. |
## MCP-kapcsolatok

Csatlakozás [Model Context Protocol](https://modelcontextprotocol.io/) szerverekhez, hogy azok eszközeit elérhetővé tegye az ügynök számára.

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Kapcsolattípus |
| `timeoutSeconds` | number | A kapcsolat időtúllépése (alapértelmezett: 30) |
| `label` | string | Opcionális megjelenítendő név |

**stdio** (helyi folyamat):

| Mező | Leírás |
|-------|-------------|
| `command` | A futtatandó parancs (pl. `npx`) |
| `args` | JSON tömb (pl. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | A folyamatba injektált környezeti változók JSON objektuma (pl. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

A legtöbb API-kulccsal rendelkező stdio szerver környezeti változókon keresztül hitelesít, nem parancsargumentumokkal. Állítsa be az `env` értéket kapcsolatonként, hogy minden ügynök csomópont különböző hitelesítési adatokat használhasson anélkül, hogy a gazdakörnyezethez hozzányúlna.

Az `env` értékek támogatják az [Expression DSL](../reference/expression-dsl.md) szintaxist, így a workflow bemeneteit hitelesítési adatokként adhatja át a titkos értékek beégetése helyett:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

A `$userInput.pat` kifejezés futásidőben, a workflow bemeneti adatai alapján kerül feloldásra, mielőtt az MCP folyamat elindul. Ez lehetővé teszi, hogy a tokeneket egy trigger vagy bemeneti csomópontból fogadja el ahelyett, hogy a workflow definíciójába ágyazná azokat.

Példa — GitHub MCP beégetett tokennel:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Példa — GitHub MCP dinamikus tokennel a workflow bemenetéből:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Példa — GitHub MCP Heym GitHub hitelesítési adatokkal:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

A beépített GitHub hitelesítési adatok jelenleg PAT-alapú hitelesítést céloznak. Ha szervezeti hozzáférésre van szüksége, használjon a szükséges szervezeti/tároló jogosultságokkal rendelkező PAT-ot.

Példa — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (távoli szerver):

| Mező | Leírás |
|-------|-------------|
| `url` | SSE endpoint URL. Támogatja a kifejezéseket (pl. `$userInput.serverUrl`). |
| `headers` | JSON objektum hitelesítési/egyedi fejlécekhez. Az értékek támogatják a kifejezéseket. |

**Streamable HTTP** (távoli szerver):

| Mező | Leírás |
|-------|-------------|
| `url` | MCP endpoint URL (pl. `https://example.com/mcp`). Támogatja a kifejezéseket. |
| `headers` | JSON objektum hitelesítési/egyedi fejlécekhez. Az értékek támogatják a kifejezéseket. |

## Skillek

A skillek SKILL.md utasításokból, valamint opcionális Python fájlokból és csomagolt erőforrásokból állnak. Kiterjesztik az ügynök rendszerkörnyezetét, és Python eszközöket adhatnak hozzá.

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `name` | string | Skill neve |
| `content` | string | SKILL.md tartalom (utasítások) |
| `timeoutSeconds` | number | A skill Python végrehajtásának időtúllépése (alapértelmezett: 30) |
| `driveFilesEnabled` | boolean | Engedélyezi a futásidejű `heym_drive` segédeszközt ehhez a skillhez (alapértelmezett: false) |
| `files` | array | Opcionális `{ path, content, encoding, mimeType }` bejegyzések (pl. `.py` szkriptek vagy base64-ként tárolt bináris erőforrások) |

A skillek hozzáadhatók egy `.zip` vagy `.md` fájl a Skillek területre történő ejtésével.
Egy skill kártyájának kibontása után ejtsen bármilyen fájlt arra a skillre egy csomagolt fájl csatolásához vagy cseréjéhez, beleértve a bináris erőforrásokat, például PDF-eket és képeket.
Használja a skill kártyáján található letöltés gombot a skill `.zip` archívumként történő exportálásához biztonsági mentés vagy egy másik workflow-ban való újrafelhasználás céljából.

Csak akkor engedélyezze a **Drive files** beállítást egy skillen, ha annak Python kódjának fájlokat kell olvasnia a Heym Drive-ról. Az engedélyezett skillek futásidőben egy generált `heym_drive.py` segédeszközt kapnak, és meghívhatják a `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` vagy `read_drive_base64` függvényeket egy Drive fájl azonosítóval vagy pontos fájlnévvel. A fájlnévkeresés a legújabb elérhető egyezést használja. A letiltott skillek nem kapják meg a segédeszközt.

Minden skill kártyán négy művelet található a cím alatti sorban:

| Gomb | Leírás |
|--------|-------------|
| **Edit with AI** | Megnyitja a Skill Buildert a skill chat prompt alapján történő átdolgozásához |
| **Download** | Exportálja a skillt `.zip` archívumként |
| **Remove** | Törli a skillt erről az ügynök csomópontról |
| **History** | Megnyitja a [Edit History](../reference/edit-history.md) alapján származtatott skill előzményeket |
### Skill előzmények

A Skill előzmények **nem** tárolódnak külön. A workflow Edit History pillanatképeiből származnak: minden mentett workflow-verzió tartalmazza a teljes agent csomópont `skills` tömbjét.

Az Előzmények párbeszédablakból a következőket teheti:

- **Előnézet** egy korábbi pillanatképhez (SKILL.md és fájllista)
- **Szerkesztés** — egy pillanatkép betöltése a skill szerkesztőbe a teljes workflow visszaállítása nélkül
- **AI Fine-tune** — a Skill Builder megnyitása az adott pillanatképpel kiindulópontként
- **Visszaállítás** — csak ennek a skillnek a visszaállítása egy korábbi verzióból (a többi csomópont változatlan marad)

Az Előzmények ugyanazt a 7 napos megőrzési időt követik, mint a workflow Edit History. A workflow mentése a skill szerkesztése után új előzménybejegyzéseket hoz létre.

A Skills szakasz tartalmazza továbbá az **AI Build** funkciót:

- Kattintson az **AI Build** elemre új skill létrehozásához egy chat prompt alapján
- Kattintson a csillogás gombra egy meglévő skillnél az AI-val történő átdolgozáshoz
- Húzzon fájlokat a prompt szerkesztőbe, hogy csatolja azokat a fine-tune megjegyzéshez; ezek a fájlok a csomagolt skill-erőforrásokként is mentésre kerülnek
- A modális ablak streameli az asszisztens szövegét, miközben élő `SKILL.md` és `.py` fájlelőnézeteket mutat
- A **Download ZIP** exportálja az aktuális előnézetet anélkül, hogy hozzáadná a csomóponthoz
- A **Save & Add** visszamenti a generált fájlokat ugyanazon a ZIP-feldolgozási folyamaton keresztül, amelyet a manuális feltöltések használnak

Amikor AI-val szerkeszt, a Heym csak a szöveges `.md` és `.py` skill-fájlokat küldi el a buildernek. A bináris és egyéb nem szerkeszthető mellékletek megőrződnek, és útvonal-metaadatokként kerülnek megosztásra a builderrel, hogy a generált Python-kód helyesen tudja megtartani a relatív fájlhivatkozásokat.
Válasszon ki egy csatolt fájlt a jobb oldali panelen, és engedélyezze az **Include this file in AI context** beállítást, amikor az AI-nak meg kell vizsgálnia egy csomagolt sablont. A szöveg-, PDF- és DOCX-fájlok lehetőség szerint kinyerésre kerülnek a prompt kontextusba; a Heym nem alkalmaz külön Skill Builder mellékletméret-korlátot a platform kérés törzsének méretkorlátján túl.

## Extra Body

Egyes providerek olyan kérés-paramétereket fogadnak el, amelyeket a szabványos OpenAI-kompatibilis mezők nem fednek le, például egy modell gondolkodási módjának letiltását. Jelölje be a **Send extra request body** opciót a csomópont tulajdonságai között, és adjon meg egy JSON objektumot.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Alapértelmezés szerint letiltva.** A jelölőnégyzet kikapcsolt állapotában semmi extra nem kerül elküldésre.
- A **minden** kérésre alkalmazódik a tool-calling ciklusban, nem csak az első körre, valamint a fallback modellkísérletre. Nem alkalmazódik a guardrail-ellenőrzésekre, amelyek külön modellt használnak.
- JSON **objektumnak** kell lennie. Egy tömb, egy skalár vagy hibás formátumú szöveg `Invalid extra body JSON` hibával bukik el a csomóponton, ahelyett hogy csendben elvetésre kerülne.
- A `$` kifejezések a feldolgozás előtt feloldódnak. Mivel ez szöveges helyettesítés, egy feloldott érték, amely idézőjelet vagy sortörést tartalmaz, érvénytelen JSON-t eredményez, és a csomópont meghiúsul.

Ugyanaz a mező és viselkedés, mint az [LLM csomópont](./llm-node.md) extra body esetében.

## Guardrails

Engedélyezze a **Guardrails** opciót a csomópont tulajdonságai között, hogy blokkolja a nem biztonságos felhasználói üzeneteket, mielőtt az agent futna. A teljes referenciáért lásd: [Guardrails](../reference/guardrails.md).

## Perzisztens memória (gráf)

Opcionális **agent-csomópontonkénti** tudásgráf, amely az adatbázisban tárolódik. Ha engedélyezve van, a Heym minden futtatás előtt hozzáfűzi a megjegyzett entitások és kapcsolatok Markdown-összefoglalóját a **system instruction**-höz (csak akkor, ha a gráf nem üres). Egy **sikeres** agent-befejezést követően egy háttérfeladat kinyeri az új tartós tényeket a beszélgetésből, és beolvasztja azokat a gráfba.

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Betöltés + háttérkinyerés engedélyezése ehhez a vászon-csomóponthoz |

A **sub-agentek** a **saját** gráfjukat tartják fenn (a csomópont-azonosítójukkal kulcsolva), elkülönítve az orchestratortól.

Használja a csomóponton lévő rózsaszín **brain** vezérlőt (amikor a memória be van kapcsolva, vagy a modellsor látható) a gráfszerkesztő és az opcionális **memóriam egosztás** (más workflow-k/agentek) megnyitásához. A teljes viselkedés, REST-útvonalak és JSON-export részletei: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API és reasoning folytonosság

A **Use Responses API** jelölőnégyzet az agent modellhívásait a
[Responses API](https://platform.openai.com/docs/api-reference/responses) felé irányítja a Chat
Completions helyett. Alapértelmezés szerint ki van kapcsolva.

Ez leginkább egy reasoning modellnél számít, mint például a `gpt-5` vagy az `o` sorozat. A Responses API visszaadja a modell reasoningjét minden tool-hívás mellett, és az agent a következő körben visszacsatolja ezeket a reasoning elemeket, így a modell megőrzi a gondolatmenetét egy többlépéses tool-ciklus során, ahelyett hogy minden tool-eredmény után újra levezetné azt. A teljes ciklus ugyanazon az útvonalon fut, beleértve a
[human review](#human-review-hitl) szüneteltetést és folytatást, a [context compression](#context-compression) funkciót,
és a végső választ.

Maga a beszélgetés a Heymben marad. A Heym minden körben elküldi a teljes bemenetet, és a reasoninget titkosított blobként szállítja, így a hívások között semmi sem marad meg a provider oldalán.
A context compression által összegzett tartományon belüli reasoning elemek elvetésre kerülnek vele együtt, mivel egy titkosított blob nem összegezhető.

OpenAI hitelesítési adatokkal működik, valamint olyan egyedi hitelesítési adatokkal, amelyeknek az átjárója támogatja az endpointot. Google hitelesítési adatokkal letiltva marad.
## Kontextus tömörítés

Amikor egy ügynök számos eszköz-iterációt futtat nagy eredményekkel (web scraping, dokumentumolvasás, al-workflow kimenetek), a felhalmozódott üzenet-előzmények megközelíthetik a modell kontextusablakának korlátját. A Heym automatikusan tömöríti a beszélgetés előzményeit a futtatás közben, hogy megakadályozza a kontextus túlcsordulását.

**Hogyan működik:**

1. Minden eszköz-iteráció előtt a Heym megbecsüli az aktuális token-számot (~4 karakter tokenenként).
2. Ha a becslés meghaladja a modell kontextusablakának **80%**-át, a tömörítés aktiválódik.
3. Az üzenet-előzmények megőrzött és tömörített részekre bomlanak:
   - **Megőrzött**: system prompt, első felhasználói üzenet, legutóbbi felhasználói üzenet
   - **Tömörített**: minden a kettő között (asszisztens érvelési körök, eszközhívások, eszközeredmények)
4. A középső részt a **ugyanazon modell és hitelesítési adat** használatával összegzi — nincs szükség további konfigurációra.
5. A tömörített összegzés egyetlen asszisztens üzenetként helyettesíti a középső részt.

**Megfigyelhetőség:**

A tömörítési események `Context compressed (N messages → summary)` bejegyzésként jelennek meg a következőkben:
- A **Debug panel** eszközhívás-listájában az élő futtatás során
- A **Futtatások előzményei** futtatás részletei nézetben
- A **Traces fülön** `context.compression` trace bejegyzésként

A tömörítés automatikus és mindig aktív az Agent csomópontok esetében. **Nem** vonatkozik az LLM csomópontokra, a Chat fülre vagy az AI Assistant munkamenetekre.

## Kapcsolódó

- [Miért a Heym](../getting-started/why-heym.md) – Hogyan futnak az ügynökök és maradnak szabályozottak a produkcióban
- [Agent tartós memória](../reference/agent-persistent-memory.md) – Tudásgráf agent csomópontonként, opcionális megosztás, API, szerkesztő
- [Agent architektúra](../reference/agent-architecture.md) – Al-ügynökök, orchestrátor, skillek, MCP, eszközhívás
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Nyilvános felülvizsgálati oldalak, függőben lévő futtatások, jóváhagyás/szerkesztés/elutasítás folyamat
- [Guardrails](../reference/guardrails.md) – Nem biztonságos tartalomkategóriák blokkolása
- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [AI Assistant](../reference/ai-assistant.md) – Chat felület workflow-k természetes nyelvű építéséhez (különbözik az Agent csomóponttól)
- [Expression DSL](../reference/expression-dsl.md) – Adatokra hivatkozás promptokban
- [Workflow struktúra](../reference/workflow-structure.md) – Csomópontok, élek és DSL formátum
- [Gyors kezdés](../getting-started/quick-start.md) – Alap workflow LLM-mel és kifejezésekkel
- [Hitelesítési adatok fül](../tabs/credentials-tab.md) – API kulcsok hozzáadása az ügynökhöz
- [MCP fül](../tabs/mcp-tab.md) – MCP konfigurálása workflow eszközökhöz
