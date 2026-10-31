# Duomenų lentelė

**Duomenų lentelės** skirtukas leidžia Jums kurti ir valdyti struktūrizuotas duomenų lenteles tiesiogiai platformoje Heym. Lentelės gali būti naudojamos workflows per [DataTable mazgą](../nodes/datatable-node.md) programinėms CRUD operacijoms.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Žiūrėti Duomenų lentelės demonstraciją</a></p>

## Lentelės kūrimas

1. Eikite į Duomenų lentelės skirtuką iš valdymo skydelio
2. Paspauskite **Sukurti Duomenų lentelę**
3. Įveskite pavadinimą ir pasirinktą aprašymą
4. Pridėkite stulpelius naudodami stulpelių redaktorių

## Stulpeliai

Kiekvienas stulpelis turi:

| Ypatybė | Aprašymas |
|---------|-----------|
| Pavadinimas | Stulpelio rodymo pavadinimas |
| Tipas | `string`, `number`, `boolean`, `date` arba `json` |
| Privalomas | Ar naujos eilutės turi apimti šį stulpelį |
| Unikalus | Ar reikšmės turi būti unikalios tarp eilučių |
| Numatytoji reikšmė | Automatiškai užpildoma, kai eilutė praleidžia šį stulpelį |

Pridėkite, redaguokite arba pašalinkite stulpelius iš lentelės detalių peržiūros antraštės.

## Stulpelių generavimas naudojant AI

Vietoj to, kad stulpelius pridėtumėte rankiniu būdu, galite apibūdinti lentelę paprasta kalba (arba įklijuoti pavyzdinį JSON) ir leisti LLM pasiūlyti schemą. Abu įėjimai atveria tą pačią dialogo langą:

- **Generuoti su AI** (Duomenų lentelės sąrašo antraštė) — sukuria visiškai naują lentelę pagal Jūsų aprašymą.
- **AI stulpeliai** (lentelės detalių peržiūra, šalia stulpelių valdymo) — siūlo *naujus* stulpelius, kuriuos galima pridėti prie atidarytos lentelės.

### Kaip tai veikia

1. Pasirinkite **LLM kredencialą** ir **modelį** (numatyta, kad tai bus Jūsų pirmas LLM kredencialas ir jo naujausias modelis).
2. Įveskite aprašymą — pavyzdžiui, *"Knygų lentelė su pavadinimu, autoriumi, puslapių skaičiumi ir ar aš ją skaičiau"* — arba įklijuokite JSON pavyzdį/schemą.
3. Paspauskite **Generuoti**. Modelis grąžina pasiūlytą schemą.
4. Peržiūrėkite sugeneruotus stulpelius redaguojamoje formoje: pakeiskite **pavadinimą**, **tipą**, **numatytąją reikšmę**, **unikalumą** ir **notEmpty** (privaloma) kiekvienam, ištrinkite nereikalingus stulpelius arba **Pridėti stulpelį** rankiniu būdu. Naujoje lentelėje taip pat galite redaguoti AI pasiūlytą **pavadinimą** ir **aprašymą**.
5. Paspauskite **Sukurti lentelę** (nauja lentelė) arba **Pridėti stulpelius** (esama lentelė), kad išsaugotumėte. Bet kada paspauskite **Esc**, kad uždarytumėte dialogo langą.

### Tik pridėjimas esamoms lentelėms

Generuojant stulpelius esamai lentelei, modelis mato Jūsų dabartinius stulpelius kaip kontekstą ir siūlo **tik naujus** stulpelius. Esami stulpeliai ir jų duomenys niekada nėra keičiami ar pašalinami — sugeneruoti stulpeliai yra pridedami. Dublikatai (nepriklausomai nuo didžiųjų ir mažųjų raidžių) automatiškai pašalinami.

> LLM kredencialas (OpenAI, Google arba Custom) yra būtinas. Jei neturite, pirmiausia pridėkite jį Nustatymuose.

## Eilučių valdymas

- **Pridėti eilutę**: Paspauskite pridėjimo mygtuką, kad sukurtumėte naują eilutę
- **Inline redagavimas**: Dukart spustelėkite bet kurią langelį, kad redaguotumėte jo reikšmę. Paspauskite Enter arba spustelėkite šalia, kad išsaugotumėte, Escape, kad atšauktumėte
- **Ištrinti eilutę**: Naudokite eilutės veiksmų meniu, kad pašalintumėte eilutę
- **Puslapiavimas**: Eilutės rodomos po 25 per puslapį su puslapio navigacija

## CSV Importavimas/Exportavimas

### Importavimas
1. Paspauskite **Importuoti CSV** lentelės detalių peržiūroje
2. Pasirinkite CSV failą, kurį norite įkelti
3. Peržiūrėkite pirmas 5 eilutes ir stulpelių atitikimą
4. Žali stulpeliai atitinka esamus lentelės stulpelius; geltoni yra neatitikimai
5. Paspauskite Importuoti, kad masiškai įterptumėte eilutes

### Exportavimas
Paspauskite **Eksportuoti CSV**, kad atsisiųstumėte visas eilutes kaip CSV failą.

## Dalijimasis

Dalinkitės lentelėmis su kitais vartotojais ar komandomis:

1. Atidarykite dalijimosi dialogą iš lentelės detalių peržiūros
2. Pridėkite vartotojus pagal el. paštą su **skaitymo** arba **rašymo** teise
3. Pridėkite komandas su **skaitymo** arba **rašymo** teise
4. Tik skaitantys vartotojai gali peržiūrėti duomenis; vartotojai su rašymo prieiga gali modifikuoti eilutes ir stulpelius. Lentelės pervadinimas, jos aprašymo keitimas ir bendrinimų valdymas lieka prieinami tik savininkui.

## Lentelių kūrimas naudojant AI asistentą

Drobės [AI asistentas](../reference/ai-assistant.md#data-tables), [Chat](./chat-tab.md) ir `heym_chat` įrankis [MCP skirtuke](./mcp-tab.md) gali pasirinkti vieną iš jūsų lentelių kuriamam workflow arba sukurti naują. Jie pasiūlo pavadinimą bei stulpelius ir sukuria lentelę, kai pateikiate klausimų kortelę. Drobės asistentas konfigūruoja workflow mazgus iš lentelės metaduomenų. Chat ir `heym_chat` taip pat gali tikrinti eilutes, pridėti arba pašalinti stulpelius bei tiesiogiai įterpti, atnaujinti arba ištrinti eilutes. Nurodykite lentelės pavadinimą arba šio skirtuko nuorodą. Rašymui reikalinga nuosavybė arba tiesioginė/komandos **rašymo** prieiga. Stulpelių pridėjimas išlaiko esamus duomenis; stulpelių šalinimas ištrina jų reikšmes iš kiekvienos eilutės. Stulpelių šalinimas ir visų eilučių išvalymas reikalauja patvirtinimo, atitinkant šį skirtuką.

## Naudojimas workflows

[DataTable mazgas](../nodes/datatable-node.md) jungia lenteles su workflows. Operacijos apima find, getAll, getById, insert, update, remove ir upsert. Kredencialai nėra reikalingi.

## LLM Kainų lentelė (sistemos lentelė)

Prisegta **Sistemos lentelės** sekcija pasirodo virš Jūsų sukurtų lentelių su vienu įrašu: **LLM Kainų lentelė**. Tai yra fiksuotos schemos, kiekvienam vartotojui redaguojama peržiūra pagal modelio kainas, naudojamas [Vykdymų](./traces-tab.md) kainų diagramose.

### Iš kur gaunami duomenys

Heym išlaiko globalią lentelę pagal modelio kainas, gautas iš Helicone viešojo kainų galinio taško (`https://www.helicone.ai/api/llm-costs`). Sinchronizacija vyksta fone pirmą kartą atidarius lentelę arba Vykdymus ir yra ribojama iki vieno užklausos per 24 valandas. Paspauskite **Atnaujinti**, kad priverstinai atliktumėte nedelsiant sinchronizavimą. Helicone pašalinimai iš aukščiausio sąrašo nėra ištrinami lokaliai, todėl istoriniai kainų paieškos išlieka stabilūs.

### Schema (tik skaitymo stulpeliai)

| Stulpelis | Reikšmė |
|-----------|---------|
| Teikėjas | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informacinis, naudojamas Helicone) |
| Modelis | Modelio identifikatorius, atitinkantis `trace.model` |
| Operacija | Atitikimo operatorius: `equals`, `startsWith` arba `includes` |
| Įvestis $/1M | USD už 1 milijoną prompt token'ų |
| Išvestis $/1M | USD už 1 milijoną completion token'ų |
| Šaltinis | `helicone`, `seed` arba `user` |
### Kainodaros pritaikymas

- **Redaguokite eilutę**, kad perrašytumėte jos kainas. Jūsų perrašymas yra individualus vartotojui ir pažymėtas `Customized` ženkleliu; ateities Helicone sinchronizacijos jo nepaveiks.
- **Atkurti numatytąją** pašalina perrašymą ir atkuria globalią vertę šiai eilutei.
- **Pridėti individualų modelį** atidaro dialogą, skirtą sukurti tik vartotojui skirtą eilutę (pavyzdžiui, privatus smulkiai pritaikytas modelis, kurio Helicone neskelbia). Individualios eilutės pažymėtos `User added`, o jų ištrynimas visiškai pašalina jas.

### Atitikimas prieš vykdymus

Kai Vykdymų skydelyje skaičiuojama kaina, kiekvienas `trace.model` lyginamas su:

1. Jūsų perrašymais (tikslus atitikimas modelio pavadinimui) pirmiausia
2. Priešingu atveju, su globalia lentele — `equals` tikslus atitikimas turi prioritetą prieš `startsWith`/`includes`; lygios situacijos tame pačiame operatoriuje sprendžiamos pagal ilgiausią atitinkamą modelio prefiksą/podirbį

Jei jokia eilutė neatitinka, modelis yra nurodytas po **Neįkainotų modelių** pranešimu Vykdymų puslapyje; jo kainos indėlis yra nulis, kol nepridėsite individualios eilutės arba neperrašysite vienos.

## Susiję

- [DataTable Node](../nodes/datatable-node.md) - Workflow mazgo nuoroda
- [Traces Tab](./traces-tab.md) - Naudoja LLM Cost Table kainos donutui ir KPI kortelėms
- [Grist Node](../nodes/grist-node.md) - Išorinio skaičiuoklės alternatyva
- [Variables Tab](./global-variables-tab.md) - Raktų-vertės saugojimo alternatyva