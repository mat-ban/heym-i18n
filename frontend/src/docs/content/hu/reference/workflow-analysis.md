# Workflow elemzése

A **Workflow elemzése** egy bal oldali panel, amely workflow-nként egyetlen megosztható, szerkeszthető Markdown-dokumentumot tartalmaz. Használja arra, hogy elmagyarázza, mit tesz egy workflow, és hogy fejlesztési ötleteket rögzítsen — az AI pedig elkészítheti Önnek az első vázlatot.

A dokumentum megosztott: mindenki, aki hozzáfér a workflow-hoz, olvashatja és szerkesztheti. A workflow-val együtt tárolódik, és automatikusan törlődik, amikor a workflow-t törlik.

## A panel megnyitása

1. Nyisson meg egy workflow-t a szerkesztőben.
2. Kattintson az **Analyze** (Sparkles ikon) elemre a szerkesztő eszköztárán.
3. A panel a bal oldalon nyílik meg. Amíg nyitva van, a csomópontpaletta (bal oldali panel) összecsuklik; a csomópontpaletta újbóli megnyitása bezárja az elemzési panelt.

A panel csak mentett workflow-k esetén érhető el. Egy vadonatúj, nem mentett workflow esetén először mentse el azt.

## A dokumentum

A panel egyetlen Markdown-dokumentumot jelenít meg két nézettel, amelyek között az **Edit** (ceruza) és a **Preview** (szem) gombokkal válthat:

| Nézet | Cél |
|------|---------|
| **Edit** | Egyszerű Markdown-szerkesztő (textarea). |
| **Preview** | Megjelenített Markdown. |

A fejléc mutatja, hogy **ki szerkesztette utoljára** a dokumentumot, és mikor.

### Mentés

Kattintson a **Save** gombra a módosítások mentéséhez. A Save csak akkor engedélyezett, ha vannak nem mentett módosítások.

Mivel a dokumentum megosztott, a mentések optimista párhuzamosságot használnak:

- Ha valaki más újabb verziót mentett, mióta Ön megnyitotta a panelt, a mentése elutasításra kerül, és egy figyelmeztetés jelenik meg a másik szerkesztő megnevezésével.
- Ezután választhatja a **Reload (discard mine)** lehetőséget, hogy átvegye a szerver verzióját, vagy az **Overwrite** lehetőséget, hogy az Ön verzióját a másiké fölé kényszerítve mentse.

## AI-elemzés

Válasszon ki egy LLM **Credential** és **Model** elemet a panel tetején (a modellista a kiválasztott credential alapján töltődik be — lásd [Credentials](../tabs/credentials-tab.md)). Ezután futtassa az elemzést:

- **Analyze my workflow** — akkor jelenik meg, ha a dokumentum üres. Egy AI által generált Markdown-jelentést streamel közvetlenül a szerkesztőbe nem mentett vázlatként. Nézze át és szerkessze, majd **Save**.
- **Reanalyze** — akkor jelenik meg, ha a dokumentum már tartalmaz tartalmat. Egy friss jelentést streamel egy külön **preview**-ba, az aktuális dokumentumot érintetlenül hagyva. Válassza az **Accept** lehetőséget, hogy a szerkesztő tartalmát az új elemzéssel cserélje le, vagy a **Discard** lehetőséget, hogy megtartsa a korábbit.

Mindkét művelet először **futtatja a workflow-t** (amikor az érvényes és futtatható), és az elemzési promptba belefoglalja a futtatás eredményeit, így a jelentés tükrözi, hogyan viselkedik a workflow a valóságban. Ha a workflow nem futtatható, az elemzés a statikus szerkezete alapján folytatódik.

A generált jelentés három szakaszt fed le, sorrendben: **Improvement areas** (konkrét javaslatok, beleértve egy **security** szempontot is, valahányszor a workflow credential-eket, felhasználói bemenetet, külső kéréseket vagy adatkitettséget érint), a workflow **Purpose** (célja), valamint **What it does** (lépésről lépésre végigvezet a csomópontokon).

Az **Improvement areas** szakasz mindig négy explicit ellenőrzést futtat:

1. **Error coverage** — ha a vásznon nincs [Error Handler](../nodes/error-handler-node.md) csomópont, és nincs beállítva error workflow, a jelentés ezt kiemeli, és hibakezelés hozzáadását javasolja.
2. **Time saved** — ha nincs beállítva futtatásonkénti becsült megtakarított idő, a jelentés egy ilyen beállítását javasolja, hogy az [Analytics](../tabs/analytics-tab.md) **Time Saved** metrikája fel tudjon töltődni.
3. **Network nodes** — a hálózati hívásokat végző csomópontok (például [HTTP](../nodes/http-node.md) és integrációs csomópontok) esetén a jelentés csomópont-specifikus hibakezelést (retry és/vagy continue-on-error) javasol ezeken a csomópontokon.
4. **Alerts** — amikor nincs [alerts](../tabs/alerts-tab.md) beállítva a workflow-hoz, a jelentés azt javasolja, hogy a prod-ba kerülés előtt állítson be riasztásokat.

5. **Evals**: ha a workflow rendelkezik egy ügynökcsomag nélküli [Agent](../nodes/agent-node.md) csomóponttal, a jelentés egy **Agent Suite** (vagy **Prompt Suite**) használatát javasolja az [Evals](../tabs/evals-tab.md#agent-suites) felületen; ha [LLM](../nodes/llm-node.md) csomóponttal rendelkezik, egy **Prompt Suite** használatát javasolja a prompt modellek közötti teszteléséhez.

### Az Analyzer futtatása a Properties panelről

Amikor egy workflow-nak vannak csomópontjai a vásznon, de még nincs elemzési dokumentuma, egy **Run Analyzer** gomb jelenik meg a workflow-szintű [Properties](./canvas-features.md) panelen (amely akkor látható, ha nincs csomópont kiválasztva). Ez megnyitja ezt a Workflow Analysis panelt, hogy kiválaszthasson egy credential-t és modellt, és generálhassa a jelentést.

Minden elemzési futtatás rögzítésre kerül a [Traces](../tabs/traces-tab.md) alatt a **Workflow Analysis** forrásnál.

Ha nincs LLM credential beállítva, az Analyze gomb le van tiltva — adjon hozzá egyet a [Credentials Tab](../tabs/credentials-tab.md) oldalon.

## Kapcsolódó

- [AI Assistant](./ai-assistant.md) — workflow-csomópontok generálása vagy módosítása természetes nyelvből.
- [Sticky Note](../nodes/sticky-note-node.md) — rövid jegyzetekhez, amelyeket közvetlenül a vászonra tűzhet ki.
