# Human-in-the-Loop

A Human-in-the-loop (HITL) lehetővé teszi, hogy az [Agent csomópont](../nodes/agent-node.md) adott pillanatokban jóváhagyást kérjen, megvárja az emberi döntést, majd ugyanabból a futtatási pillanatképből folytassa a workflow-t.

## Mit tesz lehetővé

- Explicit jóváhagyási ellenőrzési pontokat ad az agenthez anélkül, hogy külön jóváhagyási workflow-t kellene építeni
- Egy egyszer használatos nyilvános ellenőrzési URL-t hoz létre a `/review/{token}` címen
- Lehetővé teszi, hogy az ellenőrző `Accept`, `Edit & Continue` vagy `Refuse` műveletet válasszon
- A futtatást `pending` állapotba helyezi, amíg a döntés meg nem érkezik
- Folytatja a szüneteltetett futtatást, és a jóváhagyás után engedi tovább az agentet
- Több egymást követő HITL ellenőrzési pontot támogat ugyanazon agent futása során

## Agent konfiguráció

A HITL az agent tulajdonságpaneljén engedélyezhető.

| Beállítás | Leírás |
|---------|-------------|
| `hitlEnabled` | Be kapcsolja az emberi ellenőrzést ehhez az agenthez |
| `hitlSummary` | Jóváhagyási irányelvek arra vonatkozóan, hogy az agentnek mikor kell emberi ellenőrzést kérnie |

A HITL egy `request_human_review` eszközt ad az agenthez. A system prompt és a `hitlSummary` irányelvek segítségével adható meg az agentnek, hogy mely műveletek igényelnek jóváhagyást. Amikor az agent úgy dönt, hogy egy ellenőrzési pont felülvizsgálatot igényel, egyetlen Markdown formátumú ellenőrzési szöveget küld az embernek. Az ellenőrző számára megjelenő összefoglaló futásidőben az agent kéréséből generálódik; ha az agent kihagyja, a Heym a Markdown törzséből származtat egyet. A v1-ben a HITL csak szöveges módú agent kimeneteket támogat, ezért nem kombinálható a `jsonOutputEnabled` beállítással.

MCP eszközök esetén a Heym megkéri a modellt, hogy a megírt HITL utasításokat értelmezze a három jóváhagyási hatókör egyikévé:

- `always` az olyan kifejezésekhez, mint az „always", „on each" vagy „for each"
- `once` az olyan kifejezésekhez, mint a „once" vagy „only one time"
- `never` az olyan kifejezésekhez, mint a „never", „do not ask" vagy „already approved"

Ez az értelmezés szabályozza, hogy az ismételt MCP hívások újra szüneteltetnek-e, egyszer jóváhagyottak maradnak-e, vagy teljesen kihagyják az emberi ellenőrzést.

Amikor a HITL engedélyezve van, az agent egy második, `review` címkével ellátott vászon kimeneti fogantyút is elérhetővé tesz. Ezt az ágat használhatja arra, hogy a függőben lévő ellenőrzési URL-t és összefoglalót Slackre, e-mailbe, naplózásba vagy bármely más értesítési folyamatba küldje, miközben a fő futtatás egy személyre vár.

## Ellenőrzési folyamat

1. Az agent elér egy jóváhagyást igénylő lépéshez, és meghívja a `request_human_review` eszközt
2. A Heym létrehoz egy nyilvános ellenőrzési kérést, és visszaad egy ellenőrzési URL-t
3. Az agent `review` fogantyújához csatlakozó csomópontok azonnal lefutnak a függőben lévő HITL payloaddal
4. A workflow futtatása `pending` állapotba kerül
5. Az ellenőrző bejelentkezés nélkül megnyitja a `/review/{token}` címet
6. Az ellenőrző egy műveletet választ:
   - `Accept` az eredeti Markdownnal folytatja
   - `Edit & Continue` a szerkesztett Markdownnal folytatja
   - `Refuse` a `decision: "refused"` értékkel folytatja, és kihagyja a további agent műveleteket
7. A Heym a tárolt pillanatképből folytatja a workflow-t, és engedi, hogy az agent a jóváhagyott Markdown kontextussal folytassa
8. Ha egy későbbi lépés is jóváhagyást igényel, az agent ismét meghívhatja a HITL-t, és létrehozhat egy újabb függőben lévő ellenőrzési pontot

Az ellenőrzési linkek 168 óra után lejárnak, ha senki nem válaszol.

## Nyilvános ellenőrzési oldal

A nyilvános ellenőrzési oldal a következőket mutatja:

- A workflow nevét és az agent címkéjét
- Az agent ellenőrzési kéréséből automatikusan generált ellenőrzői összefoglalót
- A Markdown formátumú ellenőrzési szöveget elsőként, fő tartalomként
- Egy szerkesztőmezőt, amely csak azután nyílik meg, hogy az ellenőrző az `Edit` gombra kattint
- Élő Markdown előnézetet szerkesztés közben
- Műveletgombokat az `Accept`, `Edit & Continue` és `Refuse` műveletekhez

A döntés benyújtása után a token zárolva van, és nem használható újra.

## Kimenetek és futtatási állapot

Amíg az ellenőrzésre vár, az agent kimenete egy függőben lévő payloadot tartalmaz:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Miután az ellenőrző válaszol, és a workflow folytatódik, a végleges agent kimenet tartalmazza a döntés metaadatait:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

A downstream csomópontokban a `$agentLabel.decision` használatával lehet elágazni az elfogadott, szerkesztett vagy elutasított kimenetelek alapján.

## Vászon ellenőrzési ág

A `review` kimeneti fogantyú csak akkor érhető el, ha a `hitlEnabled` be van kapcsolva egy agentnél.

- Az emberi döntés megérkezése előtt fut le
- Megkapja a függőben lévő HITL payloadot, beleértve a `summary`, `draftText`, `reviewUrl`, `shareText` és `shareMarkdown` mezőket
- Értesítési vagy átadási lépésekhez használható, például Slack, e-mail vagy auditnaplózás
- Minden HITL ellenőrzési pontnál egyszer fut le
- Nem fut le újra, miután az ellenőrző válaszolt; folytatáskor csak a normál agent kimeneti útvonal folytatódik
## Hol jelenik meg

- Az [Előzmények](./execution-history.md) azonnal megjeleníti a `pending` futtatásokat, és a csomópont eredményeiben tárolja az ellenőrzési URL-t
- A [Portal](./portal.md) chat válaszai az emberi ellenőrzési hivatkozást jelenítik meg az üres válasz helyett
- A Debug panel és az előzmények párbeszédablakai a végső HITL döntést és az ellenőrzött szöveget mutatják
- Az ellenőrzési kimeneti csomópont külső csatornákat is értesíthet, még akkor is, ha a workflow-t cron, curl vagy portal forgalom indította
- Több HITL ellenőrzési pont ugyanazt az előzménybejegyzést használja újra, miközben minden szüneteltetéshez új egyszeri ellenőrzési hivatkozást hoz létre

## Jelenlegi korlátok

- A HITL kizárólag Agent csomópontokon érhető el
- A HITL az agent szöveges kimenetét használja, és a v1 nem támogatja a JSON kimenetet
- A szüneteltetett futtatás a tárolt workflow pillanatképből folytatódik, nem a legutóbb szerkesztett workflow verzióból
- A beágyazott al-workflow-k a v1-ben nem léphetnek függőben lévő HITL állapotba; az ellenőrzést a szülő agenttől kell kérni, mielőtt meghívásra kerülnek

## Kapcsolódó

- [Agent csomópont](../nodes/agent-node.md) – A HITL konfigurálása egy agenten
- [Agent architektúra](./agent-architecture.md) – Hogyan illeszkednek össze az agentek, eszközök, al-agentek és a HITL
- [Előzmények](./execution-history.md) – A függőben lévő és folytatott futtatások vizsgálata
- [Board](../tabs/board-tab.md) – A Board láncfuttatásai a kártyát függőben lévő (borostyán) állapotban szüneteltetik HITL esetén
- [Portal](./portal.md) – Nyilvános chat folyamatok és HITL ellenőrzési hivatkozások
