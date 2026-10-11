# Portal

A **Portal** a Heym workflow-kat nyilvános chat-stílusú felületekként teszi elérhetővé. A végfelhasználók bejelentkezés nélkül futtathatnak workflow-kat egy URL-en keresztül.

## Mit tesz

- **Nyilvános URL**: `/chat/{slug}` (pl. `/chat/my-workflow`)
- **Chat felület**: A felhasználók chat felületen keresztül lépnek kapcsolatba (üzenetek, bemenetek, válaszok)
- **Opcionális hitelesítés**: Ha portal felhasználók vannak konfigurálva, bejelentkezés szükséges; egyébként a portal nyilvános
- **Streaming**: Valós idejű csomópont-haladás a futtatás során (ha engedélyezett)
- **Futó futtatások leállítása**: A felhasználók a chat láblécéből leállíthatják a folyamatban lévő portal futtatást; az aktív workflow futtatás szerveroldalon is megszakításra kerül
- **Fájlfeltöltés**: Opcionális fájlfeltöltések (szöveg, képek stb.) bemeneti mezőnként
- **Emberi felülvizsgálat átadása**: A portal futtatások [HITL felülvizsgálati linkeket](./human-in-the-loop.md) jeleníthetnek meg, amikor egy ügynök jóváhagyásra vár
- **Kép megjelenítés**: A képeket tartalmazó workflow kimenetek (pl. LLM képgenerálásból vagy Playwright képernyőképekből) bélyegképként jelennek meg a chatben. Kattintson bármely képre a teljes képernyős néző megnyitásához; nyomja meg az **Esc** billentyűt vagy használja az eszköz vissza gombját a bezáráshoz

## Workflow konfiguráció

| Beállítás | Leírás |
|---------|-------------|
| `portal_enabled` | Portal engedélyezése ehhez a workflow-hoz |
| `portal_slug` | URL slug (pl. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Streaming futtatás használata |
| `portal_file_upload_enabled` | Fájlfeltöltések engedélyezése |
| `portal_file_config` | Mezőnkénti fájlkonfiguráció (típusok, korlátok) |

Konfigurálás a szerkesztőben: A **Portal** gomb a workflow fejlécében megnyitja a portal beállítások párbeszédablakot.

## Folyamat

1. **Info**: `GET /api/portal/{slug}/info` – Visszaadja a workflow metaadatokat és a bemeneti mezőket (nincs hitelesítés)
2. **Bejelentkezés** (ha szükséges): `POST /api/portal/{slug}/login` – Visszaadja a munkamenet tokent
3. **Futtatás**: `POST /api/portal/{slug}/execute` – A portal chat felület hívja ezt (vagy belsőleg a streaming változatát, ha engedélyezett); a végfelhasználók a chat felületen keresztül lépnek kapcsolatba, nem közvetlenül az API hívásával.
4. **Leállítás**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Akkor kérhető, amikor a felhasználó megnyomja a **Stop** gombot egy aktív portal futtatás során

## HITL a Portal futtatásokban

Ha egy portal workflow elér egy [Agent csomópontot](../nodes/agent-node.md), amelynél a [Human-in-the-Loop](./human-in-the-loop.md) engedélyezett, a portal válasz egy felülvizsgálati linket jelenít meg ahelyett, hogy üresnek tűnne.

- A workflow futtatás állapota `pending` lesz
- A portal chat megjeleníti a felülvizsgálati URL-t
- Az ügynök `review` kimeneti fogantyújához csatlakoztatott csomópontok azonnal értesíthetik a Slacket, e-mailt vagy más csatornákat
- A felülvizsgáló bejelentkezés nélkül fejezi be a döntést a `/review/{token}` oldalon
- A felülvizsgálat után a workflow a tárolt pillanatképből folytatódik

Ez lehetővé teszi nyilvános chat folyamatok kombinálását privát emberi jóváhagyási lépésekkel.

## Bemeneti mezők

A bemeneti mezők az [Input](../nodes/input-node.md) csomópontokból származnak. Az API kinyeri a `textInput` típusú kezdő csomópontokat és azok `inputFields` mezőit. A futtatás ugyanazt a motort használja, mint a normál futtatások; a bemenetek `body.inputs` és `conversation_history` formában kerülnek átadásra többfordulós folyamatokhoz.

## Hitelesítés és munkamenetek

- **WorkflowPortalUser**: Felhasználónév/jelszó workflow-nként (ha a hitelesítés engedélyezett)
- **PortalSession**: Munkamenet tokenek 168 órás TTL-lel
- **Sebességkorlátozás**: 3 sikertelen bejelentkezési kísérlet → 24 órás tiltás workflow+IP kombinációnként
- A lejárt munkameneteket egy cron job tisztítja

## Konfigurációs felület

**WebPortalSettingsDialog** fülek:

1. **General**: Portal engedélyezése, slug beállítása, portal URL másolása
2. **Users**: Portal felhasználók hozzáadása/eltávolítása (felhasználónév/jelszó)
3. **Options**: Stream mód, fájlfeltöltés, bemeneti mezők megtekintése

## Kapcsolódó

- [Miért a Heym](../getting-started/why-heym.md) – A Portal mint chat felület az ügynökök számára éles környezetben
- [Workflows fül](../tabs/workflows-tab.md) – Workflow-k létrehozása és a portal engedélyezése
- [Human-in-the-Loop](./human-in-the-loop.md) – Nyilvános felülvizsgálati oldalak függőben lévő ügynök kimenetekhez
- [Triggerek](./triggers.md) – A Portal mint belépési pont
- [Csomópont típusok](./node-types.md) – [Input](../nodes/input-node.md) a portal bemenetekhez
- [Workflow struktúra](./workflow-structure.md) – Csomópontok és élek
