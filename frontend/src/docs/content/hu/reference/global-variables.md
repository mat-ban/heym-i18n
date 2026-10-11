# Globális változók

A **Globális változótár** olyan állandó, felhasználói hatókörű kulcs-érték adatokat tárol, amelyek túlélik a workflow-futtatásokat. Használja konfigurációhoz, funkciójelzőkhöz, számlálókhoz vagy olyan megosztott állapotokhoz, amelyekre több workflow-nak is szüksége van.

> **Ne tároljon itt titkos adatokat.** A globális változók nem titkos adatok tárolására szolgálnak: az értékek titkosítás nélkül tárolódnak, teljes egészükben visszaadódnak bárkinek, akivel megosztja őket, és a munkatársak szerkeszthetik azokat. Az API-kulcsok, jelszavak és tokenek a [Hitelesítési adatok](./credentials.md) közé tartoznak, amelyek nyugalmi állapotban titkosítja őket, és soha nem adja vissza a titkos adatot az ügyfélnek.

## Helyi vs. globális

| Tár | Szintaxis | Hatókör | Állandóság |
|-------|--------|-------|-------------|
| **Workflow-helyi** | `$vars.variableName` | Csak az aktuális futtatás | Memóriában, a futtatás végén elveszik |
| **Globális** | `$global.variableName` | A felhasználó összes workflow-ja | Adatbázisban tárolva |

## Globális változók létrehozása

1. **A Változók lapról** – [Változók lap](../tabs/global-variables-tab.md): Változók közvetlen létrehozása, szerkesztése és törlése.
2. **Egy Változó csomópontból** – Engedélyezze a **Tárolás a globális változótárban** (`isGlobal: true`) beállítást a csomópont tulajdonságai között. A változó a workflow futtatásakor íródik a tárba.

## Használat kifejezésekben

A globális változók elérése a `$global.variableName` szintaxissal történik:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Ugyanazokat a metódusokat használhatja, mint a workflow-helyi változóknál (pl. `.upper()`, `.length`, `.add()` tömböknél).

## Értéktípusok

Támogatott típusok: `string`, `number`, `boolean`, `array`, `object`. A változó létrehozásakor vagy szerkesztésekor válassza ki a típust.

## Globális változók megosztása

Egy globális változót megoszthat más felhasználókkal vagy [Csapatokkal](./teams.md), hogy azok a saját workflow-jaikban használhassák.

- **Megosztás felhasználóval** – Kattintson a tulajdonában lévő változó melletti megosztás ikonra, adja meg a címzett e-mail-címét, majd kattintson a **Megosztás** gombra. A címzett a globális változók listájában egy **Megosztott** jelvénnyel és a „Megosztotta: &lt;az Ön e-mail-címe&gt;” felirattal látja a változót.
- **Megosztás csapattal** – A megosztási párbeszédablakban válasszon ki egy csapatot, majd kattintson a **Hozzáadás** gombra. Minden csapattag hozzáférést kap.
- **Szerkeszthető hozzáférés** – A címzettek megtekinthetik, szerkeszthetik és hivatkozhatnak a megosztott változóra a `$global.variableName` szintaxissal a workflow-jaikban. Csak a tulajdonos oszthatja meg, vonhatja vissza a megosztást vagy törölheti a változót.
- **Névütközések** – Ha a címzettnek már van azonos nevű változója, a saját változója élvez elsőbbséget a megosztottal szemben.
- **Megosztás visszavonása** – Nyissa meg a változó megosztási párbeszédablakát, és kattintson a **×** gombra annak a felhasználónak a neve mellett, akinek a hozzáférését meg kívánja szüntetni.

## Chat-integráció

A globális változók a [Chat](../tabs/chat-tab.md) asszisztens számára is elérhetők. Az LLM hivatkozhat rájuk kérdések megválaszolásakor vagy tartalom generálásakor.

## Kapcsolódó

- [Változók lap](../tabs/global-variables-tab.md) – Globális változók kezelése a felületen
- [Változó csomópont](../nodes/variable-node.md) – Változók beállítása `isGlobal` használatával
- [Kifejezés DSL](./expression-dsl.md) – `$global` szintaxis
