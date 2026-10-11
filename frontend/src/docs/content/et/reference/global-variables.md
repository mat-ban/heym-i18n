# Globaalsed muutujad

**Globaalsete muutujate hoidla** (Global Variable Store) sisaldab püsivaid, kasutajapõhiseid võtme-väärtuse andmeid, mis säilivad üle workflow'de käivituste. Kasutage seda konfiguratsiooni, funktsioonilipukeste, loendurite või jagatud oleku jaoks, mida mitmed workflow'd vajavad.

> **Ärge hoidke siin saladusi.** Globaalsed muutujad ei ole saladuste hoidla: väärtused salvestatakse krüpteerimata kujul, need tagastatakse täielikult kõigile, kellega neid jagate, ja kaastöötajad saavad neid muuta. API võtmed, paroolid ja tokenid kuuluvad jaotisesse [Mandaadid](./credentials.md), mis krüpteerib need puhkeolekus ega tagasta saladust kunagi kliendile.

## Kohalik vs globaalne

| Hoidla | Süntaks | Ulatus | Püsivus |
|-------|--------|-------|-------------|
| **Workflow-kohalik** | `$vars.variableName` | Ainult praegune käivitus | Mälu-sisene, kaob käivituse lõppedes |
| **Globaalne** | `$global.variableName` | Kõik kasutaja workflow'd | Salvestatud andmebaasi |

## Globaalsete muutujate loomine

1. **Muutujate vahekaardilt** – [Muutujate vahekaart](../tabs/global-variables-tab.md): Looge, muutke ja kustutage muutujaid otse.
2. **Muutuja sõlmest** – Lubage sõlme atribuutides **Store in Global Variable Store** (`isGlobal: true`). Muutuja kirjutatakse hoidlasse workflow käivitumisel.

## Kasutamine avaldistes

Globaalsetele muutujatele pääseb ligi süntaksiga `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Kasutage samu meetodeid nagu workflow-kohalike muutujate puhul (nt `.upper()`, `.length`, `.add()` massiivide jaoks).

## Väärtuste tüübid

Toetatud tüübid: `string`, `number`, `boolean`, `array`, `object`. Valige tüüp muutuja loomisel või muutmisel.

## Globaalsete muutujate jagamine

Globaalset muutujat saab jagada teiste kasutajatega või [Meeskondadega](./teams.md), et nad saaksid seda oma workflow'des kasutada.

- **Jagamine kasutajaga** – Klõpsake omanduses oleva muutuja kõrval oleval jagamise ikoonil, sisestage saaja e-posti aadress ja klõpsake **Share**. Saaja näeb muutujat oma globaalsete muutujate loendis märgisega **Shared** ja sildiga "Shared by &lt;teie e-post&gt;".
- **Jagamine meeskonnaga** – Valige jagamise dialoogis meeskond ja klõpsake **Add**. Kõik meeskonnaliikmed saavad juurdepääsu.
- **Muutmise õigus** – Saajad saavad jagatud muutujat vaadata, muuta ja viidata sellele oma workflow'des süntaksiga `$global.variableName`. Ainult omanik saab muutujat jagada, jagamise tühistada või kustutada.
- **Nimede konfliktid** – Kui saajal on juba sama nimega muutuja, on tema enda muutujal jagatud muutuja ees prioriteet.
- **Jagamise tühistamine** – Avage muutuja jagamise dialoog ja klõpsake kasutaja kõrval nuppu **×**, kellelt soovite juurdepääsu eemaldada.

## Chat-integratsioon

Globaalsed muutujad on saadaval [Chat](../tabs/chat-tab.md) assistendile. LLM saab neile viidata küsimustele vastamisel või sisu genereerimisel.

## Seotud

- [Muutujate vahekaart](../tabs/global-variables-tab.md) – Globaalsete muutujate haldamine kasutajaliideses
- [Muutuja sõlm](../nodes/variable-node.md) – Muutujate määramine atribuudiga `isGlobal`
- [Avaldise DSL](./expression-dsl.md) – `$global` süntaks
