# Vykdymų Skiltis

**Vykdymų** skiltis rodo LLM vykdymo trasas. Galite apžiūrėti užklausų/atsakymų payload'us, laiką, įrankių skambučius ir derinti [Agent](../nodes/agent-node.md) bei [LLM](../reference/node-types.md) mazgų elgesį, taip pat agreguotus metrikas (skambučiai, tokenai, kaina, latencija, klaidų procentas) bet kuriame laiko intervale.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Žiūrėti Vykdymų demonstraciją</a></p>

## Statistika

Puslapis prasideda nuo statistikos santraukos virš vykdymų sąrašo, apskaičiuotos pagal pasirinktą laiko intervalą ir kitus aktyvius filtrus:

- **KPI kortelės** – Bendri skambučiai, Bendri tokenai, Bendros išlaidos (USD), Vidutinė latencija, Klaidų %
- **Tokenai pagal modelį** – Donuto diagrama, rodanti tokenų kiekį pagal modelį
- **Išlaidos pagal modelį** – Donuto diagrama, rodanti USD išlaidas pagal modelį. Modeliai, neturintys kainodaros, rodo nuorodą „Sukonfigūruoti kainodarą“ į [LLM Išlaidų Lentelę](./datatable-tab.md#llm-cost-table-system-table)
- **Skambučiai per laiką** – Sukrauta plotų diagrama, rodanti sėkmingus ir nesėkmingus skambučius pagal intervalus (5 min / 1 val / 6 val / 1 diena, automatiškai pasirenkama pagal intervalą)
- **Nepatikslintų modelių pranešimas** – Pasirodo po diagramomis, kai kai kurie trasuoti modeliai neturi kainodaros eilutės, nuorodą į LLM Išlaidų Lentelę

## Laiko Intervalas

Vienas **Laiko intervalo** pasirinkiklis virš filtrų juostos valdo tiek statistikos antraštę, tiek vykdymų sąrašą. Pasirinkimai: Paskutinė 1 valanda, Paskutinės 24 valandos, Paskutinės 7 dienos (numatytoji), Paskutinės 30 dienų, Visi laikai. Keisdami intervalą, atstatote puslapiavimą ir perkraunate diagramas bei sąrašą kartu.

## Vykdymų Sąrašas

- Puslapiuojamas nesenų trasų sąrašas pasirinkto laiko intervalo viduje
- Kiekviena trasa rodo: workflow, mazgą, kredencialą, laiko žymę, trukmę
- Paspauskite ant trasos, kad atidarytumėte detalių peržiūrą
- Naudokite **Ankstesnis / Kitas** detaliame dialoge, kad judėtumėte tarp trasų, nesugrįždami atgal

## Filtravimas

- **Laiko intervalas** – 1h / 24h / 7d / 30d / Visi; filtruoja diagramas ir sąrašą kartu
- **Kredencialas** – Filtruoti pagal naudojamą kredencialą (API raktą)
- **Šaltinis** – Filtruoti pagal workflow arba vykdymo šaltinį
- **Paieška** – Ieškoti pagal modelį, workflow, kredencialą ar mazgo etiketę
- **Atnaujinti** – Perkrauti dabartinį vykdymų puslapį

## Vykdymo Išsami Informacija

Atidarius trasą:

- **Žingsniai** – Laiko juosta iš viršaus į apačią, kuri skaito trasą kaip užsakytą grandinę: Sistema → Vartotojas → Asistentas → Įrankis → Atsakymas. Kiekvienas žingsnis yra suskleidžiamas; išplečiant vieną rodomas skaitomas detalus (žinutės tekstas arba įrankio argumentai ir rezultatas), po to seka to žingsnio JSON. JSON turinys kiekviename įvykio tipyje – įskaitant MCP skambučius ir JSON-RPC payload'us – pagal numatytuosius nustatymus atsidaro išplečiamame medyje, pirmasis lygis yra išplėstas. Naudokite **Medis / Žali** norėdami pereiti tarp suformatuotos struktūros ir originalaus teksto. Netinkamai suformatuotas JSON lieka matomas kaip paprastas tekstas. Įrankių žingsniai rodo savo trukmę ir MCP/Įgūdžių ženklelį, jei taikoma, taip pat laukiančius / laiko limitą / atšauktus ženklelius, kai įrankio skambučio būsena nustatyta. Atsakymo žingsnis gali rodyti agreguotus `tool_metrics` ženklelius (skambučių skaičius pagal būseną ir bendrą įrankio trukmę). Kai trasa fiksuoja kiekvieną modelio skambutį, kaip tai daro Dashboard Chat žinutė ir nukreiptas agentas, **LLM** žingsnis sėdi prieš įrankius, kurie buvo prašomi, o **Trukmės Išskaidymas** išdėsto kiekvieną modelio skambutį, įrankį ir nukreipimo sprendimą vienoje laiko juostoje. Dashboard Chat žinutė yra viena trasa, nesvarbu, kiek įrankių raundų tai užtruko. Trasos be žinučių grandinės (pavyzdžiui, vaizdo generavimas) rodo minimalų Užklausos → Atsakymo laiko juostą.
- **Užklausa** – Pilnas užklausos payload'as, siunčiamas LLM, su **Medis / Žali** JSON peržiūromis
- **Atsakymas** – Modelio atsakymas, įskaitant įrankių skambučius, jei tokių yra, su **Medis / Žali** JSON peržiūromis
- **Įrankių metrikos** – Kai yra atsakyme, kompaktiška įrankių skambučių skaičiaus santrauka (`success` / `error` / `pending` / `timeout` / `cancelled`) ir bendra įrankio trukmė
- **Laiko išskaidymas** – `llm_ms`, `tools_ms`, `mcp_list_ms` našumo analizei
- **Įrankių skambučiai** – Įrankio pavadinimas, argumentai, rezultatas, būsena ir praeitas laikas
- **Įtraukti įgūdžiai** – Įgūdžiai, perduoti modeliui užklausoje
- **Eiti į Workflow** – Šokti tiesiai į susijusį workflow iš trasos detalių dialogo

## Kopijuoti ir Eksportuoti

- Kopijuoti užklausos arba atsakymo JSON į iškarpinę; kopijavimas visada naudoja pilną žalią payload'ą, nepriklausomai nuo aktyvios peržiūros
- Naudokite derinimui arba dalijimuisi su palaikymo komanda

## Priežiūra

- **Išvalyti viską** – Ištrinti visas išsaugotas trasas po patvirtinimo
- Puslapiavimo valdikliai rodo dabartinį matomą intervalą (pavyzdžiui, `1-25 iš 240`)

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – LLM stebėjimas viso agento gyvavimo ciklo metu
- [Agentų Mazgas](../nodes/agent-node.md) – Agentų mazgas su įrankių skambučiais
- [Mazgų Tipai](../reference/node-types.md) – LLM ir Agentų mazgai
- [Kredencialų Skiltis](./credentials-tab.md) – Kredencialai, naudojami trasose
- [OpenTelemetry Trasavimas](../reference/opentelemetry.md) – Pasirinktinė OTel eksportas workflow, mazgo ir Agentų įrankių spanams
- [Duomenų Lentelės Skiltis](./datatable-tab.md) – Talpina LLM Išlaidų Lentelę, naudojamą išlaidų diagramoje
- [Kontekstinis Demonstravimas](../reference/contextual-showcase.md) – Kompaktiška puslapio gairė dashboard paviršiams
