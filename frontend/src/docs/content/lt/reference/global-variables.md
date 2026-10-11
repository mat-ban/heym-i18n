# Global Variables

**Global Variable Store** saugo nuolatinius, vartotojo apibrėžtus raktų-vertės duomenis, kurie išlieka tarp workflow vykdymų. Naudokite jį konfigūracijai, funkcijų žymoms, skaitikliams ar bendram būsenai, kurios reikia keliems workflows.

> **Nelaikykite čia slaptažodžių.** Globalios kintamosios nėra slaptažodžių saugykla: vertės saugomos neslaptai, jos grąžinamos visiems, su kuriais jas dalijatės, ir bendradarbiai gali jas redaguoti. API raktai, slaptažodžiai ir tokenai turi būti laikomi [Kredencialuose](./credentials.md), kurie juos šifruoja ir niekada negrąžina slaptažodžio klientui.

## Vietinės vs Globalios

| Saugykla | Sintaksė | Apimtis | Išlikimas |
|----------|----------|---------|-----------|
| **Workflow-vietinė** | `$vars.variableName` | Tik dabartiniam vykdymui | Atmintyje, prarandama, kai vykdymas baigiasi |
| **Globali** | `$global.variableName` | Visiems vartotojo workflows | Išsaugota duomenų bazėje |

## Globalių Kintamųjų Kūrimas

1. **Iš Kintamųjų skyriaus** – [Kintamųjų Skyrius](../tabs/global-variables-tab.md): Kurkite, redaguokite ir šalinkite kintamuosius tiesiogiai.
2. **Iš Kintamojo mazgo** – Įgalinkite **Store in Global Variable Store** (`isGlobal: true`) mazgo savybėse. Kintamasis bus įrašytas į saugyklą, kai workflow bus vykdomas.

## Naudojimas Išraiškose

Pasiekite globalius kintamuosius su `$global.variableName`:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Naudokite tas pačias metodikas kaip ir workflow-vietiniams kintamiesiems (pvz., `.upper()`, `.length`, `.add()` masyvams).

## Vertės Tipai

Palaikomi tipai: `string`, `number`, `boolean`, `array`, `object`. Pasirinkite tipą kuriant ar redaguojant kintamąjį.

## Globalių Kintamųjų Dalinimasis

Galite dalintis globaliu kintamuoju su kitais vartotojais arba [Komandomis](./teams.md), kad jie galėtų jį naudoti savo workflows.

- **Dalinimasis su vartotoju** – Paspauskite dalinimosi ikoną šalia turimo kintamojo, įveskite gavėjo el. paštą ir paspauskite **Share**. Gavėjas matys kintamąjį savo Globalių Kintamųjų sąraše su **Shared** ženkleliu ir "Shared by &lt;Jūsų el. paštas&gt;" etikete.
- **Dalinimasis su komanda** – Dalinimosi dialoge pasirinkite komandą ir paspauskite **Add**. Visi komandos nariai gaus prieigą.
- **Redaguojama prieiga** – Gavėjai gali peržiūrėti, redaguoti ir nurodyti bendrinamą kintamąjį per `$global.variableName` savo workflows. Tik savininkas gali dalintis, atšaukti dalinimąsi ar šalinti kintamąjį.
- **Pavadinimų konfliktai** – Jei gavėjas jau turi kintamąjį su tokiu pačiu pavadinimu, jo kintamasis turės pirmenybę prieš bendrinamą.
- **Atšaukti dalinimąsi** – Atidarykite dalinimosi dialogą kintamajam ir paspauskite **×** mygtuką šalia vartotojo, kuriam norite atšaukti prieigą.

## Chat Integracija

Globalūs kintamieji yra prieinami [Chat](../tabs/chat-tab.md) asistentui. LLM gali juos nurodyti atsakydamas į klausimus ar generuodamas turinį.

## Susiję

- [Kintamųjų Skyrius](../tabs/global-variables-tab.md) – Tvarkykite globalius kintamuosius UI
- [Kintamojo Mazgas](../nodes/variable-node.md) – Nustatykite kintamuosius su `isGlobal`
- [Išraiškų DSL](./expression-dsl.md) – `$global` sintaksė
