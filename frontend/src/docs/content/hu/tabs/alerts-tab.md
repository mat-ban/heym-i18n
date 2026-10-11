# Riasztások lap

A **Riasztások** lap lehetővé teszi, hogy küszöbérték-feltételeket definiáljon egy adott időablakra vonatkozóan, és értesítést kapjon, amikor azok teljesülnek. A Heym már rögzíti a futtatások eredményeit, a futásidőt és az LLM-költségeket, de ezeket soha nem önként jelenti. A riasztás az a mód, ahogyan Ön erre kéri.

Minden riasztás egy Ön által választott **időablak** felett kerül kiértékelésre, soha nem egyetlen esemény alapján. Egy sikertelen futtatás csak zaj. Tizenkét sikertelen futtatás tíz perc alatt már incidens.

## Riasztástípusok

| Típus | A kérdés, amelyre válaszol | Honnan származik a szám |
|---|---|---|
| **Hibaküszöb** | Több mint N alkalommal hibázott az ablakban? | [Futtatási előzmények](../reference/execution-history.md) hibás állapotú sorai |
| **Workflow időtartama** | Lassabbak lettek a futtatások a vártnál az ablakban? | Futtatási idő, maximum, átlag vagy 95. percentilis szerint aggregálva |
| **Token / USD költség** | Átlépte a költség a keretet az ablakban? | [LLM nyomok](./traces-tab.md) és az LLM költségtábla |
| **Futtatások száma** | Sokkal gyakrabban futott, mint kellett volna? | Futtatási előzmények sorainak száma |

### Hibaküszöb

Az ablakban sikertelen futtatásokat számolja, és akkor jelez, amikor a szám eléri az Ön küszöbértékét. Mivel egy ablak felett számol, nem pedig minden egyes hibát külön figyel, egyetlen átmeneti hiba nem váltja ki a riasztást.

### Workflow időtartama

Az ablakon belüli futtatási időt méri. Válassza a **max** (a leglassabb futtatás), **átlag** vagy **p95** opciót. A p95 érték ugyanazt a percentilis-számítást használja, mint az [Analytics lap](./analytics-tab.md), így a riasztás és a késleltetési diagram soha nem mond ellent egymásnak ugyanarra az ablakra vonatkozóan.

A **Minimális futtatások száma az ablakban** biztosítja a megbízhatóságot. A leglassabb futtatás egy szinte üres ablakban csupán az az egyetlen futtatás, ezért egy minimumérték – mondjuk 3 – beállítása megakadályozza, hogy a riasztás zajra aktiválódjon.

### Token / USD költség

Az ablakban összegzi az LLM-költségeket, akár összes tokenben, akár amerikai dollárban. A dollárösszegek ugyanazon az árazási táblán keresztül kerülnek feloldásra, amelyet a [Nyomok lap](./traces-tab.md) és az [LLM költségtábla](./datatable-tab.md#llm-cost-table-system-table) használ, így a költségriasztás és a költségoldal mindig megegyezik.

Amikor a hatókör az összes workflow-ra kiterjed, ez magában foglalja a workflow-n kívül végzett LLM-hívásokat is, például a [Chat lap](./chat-tab.md) és az [AI asszisztens](../reference/ai-assistant.md) esetében. A kódoló ügynökök használata (Codex, OpenCode) nem tartozik ide.

Azok a modellek, amelyekhez nem tartozik árazási sor, a riasztás kontextusában árazatlanul jelennek meg, nem pedig csendben nullaként számolódnak.

### Futtatások száma

Az ablakban bármilyen állapotú futtatásokat számolja. Ez az, amely elkapja az elromlott triggert: egy workflow, amely általában óránként 20 alkalommal fut, hirtelen 2 000 alkalommal fut. Az aktiválási rekord tartalmaz egy triggertípusonkénti bontást, mert általában ez a válasz a „miért történt ez?" kérdésre.

## Hatókör

Egy riasztás vagy **egyetlen workflow-t** vagy **az összes workflow-t** figyeli.

„Az összes workflow" azt jelenti, hogy minden workflow, amelyhez a riasztás tulajdonosa hozzáfér. Szándékosan nem jelenti a Heym példány összes workflow-ját: a riasztások megoszthatók, és egy riasztás megosztása nem adhat valakinek összesített számokat olyan workflow-król, amelyeket nem tud megnyitni.

## A varázsló

Egy riasztás létrehozása öt lépésen vezet végig.

1. **Típus** — válasszon a fenti négy közül.
2. **Hatókör** — egy workflow vagy az összes.
3. **Feltétel** — az időablak, valamint az adott típushoz tartozó küszöbérték-mezők.
4. **Válasz** — mi fut le aktiváláskor, és milyen gyakran értesítse Önt ismételten.
5. **Áttekintés** — nevezze el, és tekintse meg a visszatesztet.

### A visszateszt

Az Áttekintés lépés arra a kérdésre ad választ, amely valójában számít a mentés előtt: *az elmúlt 24 órában hányszor aktiválódott volna ez?*

Jelenti az aktiválások számát és a küszöbértékhez viszonyított legmagasabb megfigyelt értéket. Ha azt írja, hogy a feltétel 400 alkalommal aktiválódott volna, a küszöbértéket a mentés előtt javítja, nem pedig azt követően, hogy riasztást kapott. A visszatekintési időszakot 3 vagy 7 napra is kiterjesztheti.

## AI-piszkozatkészítés

Az első lépés tetején található egy mező, ahol természetes nyelven írhatja le, mit szeretne:

> Figyelmeztessen, ha a számlaszinkronizálás több mint 5 alkalommal hibázik 10 perc alatt

A Heym ezt riasztásdefinícióvá alakítja, kitölti az összes lehetséges lépést, és előreugrik úgy, hogy az AI által kitöltött mezők meg vannak jelölve, így Ön megerősíti ahelyett, hogy újra begépelné. Egy teljes kérés az Áttekintés lépéshez vezeti Önt.

**Egy részleges kérés is előreviszi Önt.** Ha csak annyit ír, hogy „figyelmeztessen, ha 5 alkalommal hibázik", egy hibaküszöb-riasztást kap a kitöltött számmal, az alapértelmezett értékekkel a többihez, és a varázsló az első olyan lépésnél nyílik meg, amelynél még szükség van Önre: ebben az esetben a Hatókörnél, mert nem nevezett meg workflow-t. A tetején egy megjegyzés jelzi, mi maradt eldöntendő. Soha nem blokkolja a Tovább vagy a Létrehozás gombot.

Ugyanez érvényes akkor is, ha a modell olyan workflow-t nevez meg, amelyhez Ön nem fér hozzá, vagy olyan feltételt ad vissza, amelyből hiányoznak mezők. A értelmes részek megmaradnak, a többi az adott riasztástípus alapértelmezett értékeire esik vissza, és Ön onnan igazítja. Itt semmi nem kerüli meg az érvényesítést: a varázsló saját szabályai és az API is újraellenőrzi a riasztást mentéskor.
## Ismétlődő viselkedés

Amint egy riasztás aktiválódik, triggered állapotba kerül. Hogy mi történik ezután, az a 4. lépésben az Ön döntése.

- **Értesítés egyszer, amíg helyre nem áll** (az alapértelmezett) — egyszer aktiválódik, majd csendben marad, amíg a feltétel fennáll. Amikor a metrika visszaesik a küszöbérték alá, a riasztás visszatér OK állapotba, és ismét aktiválódhat. A helyreállás állapotváltozás, nem esemény: nem hoz létre aktiválási rekordot, és nem futtatja az értesítési workflow-t.
- **Értesítés ismétlése adott időközönként** — N percenként ismét aktiválódik, ameddig a feltétel fennáll.

Az alapértelmezett beállítás azért létezik, mert egy hibás workflow, amelyet 60 másodpercenként ellenőriznek, egyébként óránként 60 aktiválást eredményezne, és ez az, ami miatt a riasztásokat némítani szokták.

## Workflow futtatása aktiváláskor

A 4. lépés három választ kínál arra a kérdésre, hogy „mi történjen, amikor ez aktiválódik":

- **Új workflow létrehozása és hozzárendelése** (az alapértelmezett) — a riasztás mentése egyben létrehoz egy *„&lt;riasztás neve&gt; notification"* nevű workflow-t, és összekapcsolja vele. Egy bemeneti csomóponttal érkezik, amelynek mezői pontosan az alábbi payload, így a `$alert.body.observed_value` és a többi azonnal feloldódik, és Önnek csak az üzenetet kézbesítő csomópontot kell csatolnia. A riasztáskártyán a **Go to workflow** gomb nyitja meg. Ez az alapértelmezett, mert egy riasztás, amely a semmibe aktiválódik, könnyen figyelmen kívül marad.
- **Meglévő workflow kiválasztása** — futtasson valamit, amit már felépített.
- **Ne tegyen semmit** — az aktiválás továbbra is rögzítésre kerül a lapon, csak nem futtat semmit.

A riasztás payload az adott workflow bemeneti body-jaként érkezik:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Melyik workflow produkálta a számot

A `workflows` az egyetlen hely, ahol egy workflow megjelenik. Felsorolja az összes workflow-t, amely hozzájárult az értékhez, mindegyiket a saját `value` értékével — az adott workflow hibaszámával, futtatásszámával, a leglassabb futtatás ezredmásodpercben kifejezett értékével vagy költésével, a riasztás típusától függően. A lista `value` szerint rendezett, a legmagasabb értékkel kezdve, így a `workflows[0]` a legrosszabb eset.

Ez **mindig egy tömb**: egyetlen elemű egy-workflow hatókör esetén, sok elemű „az összes workflow-m" esetén, és üres a null helyett, amikor semmi sem tulajdonítható. Egy értesítési workflow alak-ellenőrzés nélkül iterálhat rajta.

Szándékosan nincs egyes számú `workflow_id`. Az a riasztás hatókörét írta le, nem a metrikát, így rendszer-hatókör esetén `null` volt, ami pontosan az az eset, amikor a „melyik workflow?" kérdés a legfontosabb. Az `observed_value` továbbra is az az aggregátum, amelyhez a küszöbértéket hasonlították; a workflow-nkénti `value` mezők magyarázzák, honnan származik.

Így érik el a riasztások a Slacket, az e-mailt, a Telegramot vagy bármi mást: a már meglévő [csomópontokkal](../reference/node-types.md), nem pedig egy külön értesítési rendszerrel.

Egy riasztás nem értesítheti azt a workflow-t, amelyet figyel. Ez egy hurok lenne, legnyilvánvalóbban egy végrehajtásszám-riasztás esetén, ahol minden értesítés hozzáadódik a mért számhoz.

Az értesítési futtatások közönséges végrehajtások, így megjelennek a [végrehajtási előzményekben](../reference/execution-history.md), mint bármely más futtatás. Egy sikertelen értesítési workflow rögzítésre kerül az aktiváláson, de soha nem akadályozza meg magát az aktiválást a rögzítésben.

Egy értesítési workflow a riasztás tulajdonosaként fut, annak hitelesítési adataival és globális változóival, pontosan úgy, mintha ő maga futtatta volna. Egy Önnel megosztott workflow kiválasztása nem kölcsönzi annak a személynek a hitelesítési adatait. Ha a tulajdonos elveszíti a hozzáférést az értesítési workflow-hoz, az aktiválás továbbra is rögzítésre kerül, de az értesítési futtatás kimarad.

## Aktiválási előzmények

A riasztáslista alatt található az aktiválási előzmények: mi aktiválódott, mikor, a megfigyelt érték a küszöbértékkel szemben, a kiértékelt pontos időablak és az értesítés kimenetele.

Egy aktiválás nyugtázása megjelöli a sort, és a riasztás jelvényét **Firing**-ról **Acknowledged**-re változtatja. Ez Önről szól, nem a riasztásról: a feltétel továbbra is fennáll, és a riasztás magától visszatér **OK** állapotba, amikor a metrika visszaesik a küszöbérték alá.

Minden rekord tárolja a hozzájáruló részleteket az aktiválás pillanatában: a sikertelen végrehajtások azonosítóit és hibaüzeneteit, a modellenkénti költést vagy a trigger-forrás bontását. Ez szándékos. Az időablak elmúlt, és az utólagos újraszámítás más eredményt adhat.

Az aktiválási rekordokat 90 napig őrzi meg a rendszer.

## Kérdezze a Chatet a riasztásokról

A [Chat lap](./chat-tab.md) válaszolni tud a riasztásaival kapcsolatos kérdésekre:

- „Milyen riasztásaim vannak?"
- „Van riasztás az invoice workflow-n?"
- „Miért aktiválódott a költségriasztás?"
- „Mikor aktiválódott ez utoljára?"

Egy „miért aktiválódott" kérdés esetén a Chat az aktiválási rekordból idézi a tényleges megfigyelt értéket, a küszöbértéket és az időablakot, valamint a hozzájáruló részleteket.

## Megosztás

A riasztások megoszthatók egyes felhasználókkal vagy [csapatokkal](./teams-tab.md). Azok, akikkel megosztja, láthatják a riasztást és annak aktiválási előzményeit. Csak a tulajdonos szerkesztheti, szüneteltetheti, törölheti vagy oszthatja meg újra.
### Amikor a workflow-hozzáférés megszűnik

Egy adott workflow-hoz tartozó riasztás folyamatosan olvassa az adott workflow futási metrikáit, ezért ha valakitől megvonják a workflow-hoz való hozzáférést, az egyben meghatározza azt is, hogy mi történik a hozzá tartozó riasztásokkal:

- **Egy felhasználói vagy csapatmegosztás eltávolítása** esetén a rendszer megkérdezi a workflow tulajdonosát, hogy az adott felhasználó vagy csapat riasztásait is leállítsa-e a workflow-hoz. A leállítás az alapértelmezett. A leállított riasztások szüneteltetve lesznek, nem törlődnek, és mindegyikük `alert.disable_on_access_revoke` néven kerül rögzítésre az [audit log](../reference/audit.md)-ban.
- **Egy csapattag eltávolítása vagy egy csapat törlése** mindig leállítja az érintett riasztásokat, mert a módosítást végző személy nem feltétlenül a workflow tulajdonosa.
- Egy riasztás csak akkor áll le, ha a tulajdonosának nincs más útvonala a workflow-hoz, például közvetlen megosztás vagy egy másik csapat.
- Egy szüneteltetett riasztás folytatása vagy tesztelése újra ellenőrzi a tulajdonos hozzáférését, így egy leállított riasztás nem kapcsolható vissza, és nem használható a workflow metrikáinak olvasására hozzáférés nélkül. Ha hozzáférés nélkül nyomja meg a **Resume** gombot, egy értesítés jelenik meg, amely elmagyarázza, hogy a workflow tulajdonosának először újra meg kell osztania azt.

## Riasztások kezelése

- **Pause / Resume** — egy szüneteltetett riasztás soha nem kerül kiértékelésre. A folytatás azonnal ellenőrzi, nem vár a következő intervallumra.
- **Edit** — a módosítások egészként kerülnek érvényesítésre, így egy részleges szerkesztés nem hagyhatja a riasztást érvénytelen állapotban.
- **Delete** — eltávolítja a riasztást és annak kiváltási előzményeit.

## Lásd még

- [Analytics Tab](./analytics-tab.md) — azok a diagramok, amelyekből ezek a küszöbértékek származnak
- [Traces Tab](./traces-tab.md) — honnan származnak az LLM-költségadatok
- [Execution History](../reference/execution-history.md) — azok a futások, amelyeket a hiba-, időtartam- és darabszám-riasztások mérnek
- [Chat Tab](./chat-tab.md) — riasztások lekérdezése természetes nyelven
- [Teams](./teams-tab.md) — riasztások megosztása egy csapattal
