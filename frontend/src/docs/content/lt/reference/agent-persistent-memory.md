# Agent Nuolatinė Atmintis

Agentų mazgai gali saugoti **kiekvieno mazgo žinių grafiką**, laikomą duomenų bazėje: subjektus (su tipais ir savybėmis) ir santykius tarp jų. Kai ši funkcija įjungta, Heym **įterpia šio grafiko santrauką į sistemos promptą** kiekvieno vykdymo metu (jei grafikas nėra tuščias). Po sėkmingo vykdymo, **LLM ištraukimo užduotis** sujungia naujus faktus iš pokalbio į grafiką fone.

Sub-agentai ir orkestratoriai pagal numatytuosius nustatymus naudoja grafiką, susietą su **savo drobės mazgu**. Taip pat galite **suteikti kitiems agentams skaitymo arba skaitymo/rašymo prieigą** prie šio mazgo grafiko (įskaitant agentus iš **kitų darbo eigų**, kuriuos valdote)—žr. [Bendrinimas su kitais agentais](#sharing-with-other-agents).

## Įjungimas

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `persistentMemoryEnabled` | boolean | Kai `true`, įkelkite šio mazgo grafiką į sistemos promptą ir suplanuokite po-vykdymo ištraukimo užduotį šio mazgo grafikui |
| `memoryShares` | masyvas (pasirinktinai) | Suteikia kitiems agentų mazgams prieigą prie **šio** mazgo atminties grafiko; žr. [Bendrinimas](#sharing-with-other-agents) |

Įjunkite tai Agentų mazgo savybėse (**Nuolatinė atmintis (grafikas)**). Rožinė **smegenų** ikona mazge atidaro grafiko redaktorių, kai atmintis yra įjungta (arba kai rodomas modelis).

## Grafiko redaktorius

Dialogas vaizduoja subjektus kaip animuotą, jėgos krypties grafiką — spalvoti apskritimai, kurių dydis priklauso nuo ryšių skaičiaus ir grupuojami pagal subjekto tipą — plius redagavimo ir navigacijos galimybės (pritaikyti vaizdą, tvarkingas išdėstymas, klaviatūros spartieji klavišai). Galite **pridėti, redaguoti arba ištrinti** mazgus ir briaunas rankiniu būdu; Šaltinio/Tikslinio santykių pasirinkikliai yra paieškos funkcija, skirta grafams su daug subjektų. Pasirinkus mazgą, rodomi jo išeinantys ir gaunami ryšiai, kiekvienas paspaudžiamas, kad būtų galima pereiti prie to mazgo. Pakeitimai taikomi tik **šio** agento grafikui (grafikas, susietas su drobės mazgu, kurio smegenis atidarėte).

## Bendrinimas su kitais agentais

Grafiko atminties dialoge, **Bendrinti atmintį su kitais agentais** leidžia jums prijungti **kolegas**, kurie gali naudoti šį grafiką vykdymo metu:

1. Pasirinkite **darbo eigą** (bet kurią darbo eigą, kurią galite atidaryti redaktoriuje).
2. Pasirinkite **agento** mazgą toje darbo eigoje.
3. Nustatykite **Tik skaitymui** arba **Skaitymui ir rašymui**.

| Leidimas | Poveikis |
|----------|----------|
| Tik skaitymui | Kai **kolega** agentas vykdomas, šis grafikas sujungiama į kolegos sistemos promptą (jei jis turi subjektų). Nėra ištraukimo į šį grafiką iš kolegos vykdymo. |
| Skaitymui ir rašymui | Tas pats prompto elgesys kaip ir skaitymui, ir po **sėkmingo** kolegos užbaigimo, įprasta atminties ištrauka taip pat gali **sujungti į šį (savininko) grafiką** naudojant kolegos vykdymo kredencialus. |

Kolegos saugomi pagal savininko mazgą kaip `memoryShares` įrašai su `peerWorkflowId` ir `peerCanvasNodeId` (ir `permission`). Senesnės darbo eigos gali praleisti `peerWorkflowId` kolegoms toje **pačioje** darbo eigoje; redaktorius tai traktuoja kaip dabartinę darbo eigą.

**Kryžminis darbo eigos bendrinimas** vykdomas vykdymo metu skenuojant darbo eigas, **kurias valdote**. Vykdymai be autentifikuoto vartotojo konteksto tik išsprendžia dalijimus, apibrėžtus **dabartinės** darbo eigos JSON (toje pačioje drobėje).

## Vykdymo elgesys

### Nuosavas grafikas (`persistentMemoryEnabled`)

1. **Prieš LLM skambutį** — Jei grafikas turi subjektų, blokas pridedamas prie sistemos instrukcijų, paaiškinančių, kad tai yra faktai iš ankstesnių vykdymų (gali būti neišsamūs; dabartinė vartotojo žinutė laimi konfliktų atveju).
2. **Po sėkmingo užbaigimo** — Fone vykdoma užduotis prašo modelio (tos pačios kredencialų kaip agento vykdymo) struktūrizuoto JSON (subjektai + santykiai). Tas payload sujungiama į duomenų bazę (deduplication ir santykių valymas taikomi kai kuriems tipams, pvz., darbo stiliaus briaunoms).

### Kolega, gaunantis bendrinamus grafikus

Kai agentas vykdomas, sistema randa **savininkus** mazgus (bet kurioje iš jūsų darbo eigos, kai tai įmanoma), kurių `memoryShares` rodo į šios vykdymo darbo eigą ir drobės mazgą. Kiekvienam atitikimui, to savininko grafikas pridedamas kaip **bendrinama atmintis** sekcija sistemos prompto. **Skaitymui ir rašymui** kolegos papildomai suplanuoja ištraukimo tikslus **savininko** darbo eigai/grafikui, kai vykdymas sėkmingas.

Ištrauka **ne** vykdoma, kai vykdymas baigiasi klaida arba HITL laukimo būsenoje.

## Darbo eigos JSON (`data` laukas)

Išsaugota agento mazge kaip ir kiti nustatymai:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` yra `"read"` arba `"write"`. Praleiskite `memoryShares` arba naudokite `[]`, kai nėra dalijimosi.

Žr. [Darbo eigos struktūra](./workflow-structure.md) visam mazgo objekto formai.

## Susiję

- [Agentų mazgas](../nodes/agent-node.md) — Pilna agento konfigūracija
- [Agentų architektūra](./agent-architecture.md) — Orkestratorius, sub-agentai, įrankiai
- [Darbo eigos struktūra](./workflow-structure.md) — JSON darbo eigos formatas
- [Drobės funkcijos](./canvas-features.md) — Smegenų valdymas ir grafiko dialogas
- [Vykdymų skirtukas](../tabs/traces-tab.md) — LLM užklausų/atsakymų stebėjimas
