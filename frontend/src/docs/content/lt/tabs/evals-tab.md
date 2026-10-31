# Vertinimų skirtukas

**Vertinimų** skirtukas yra atskira puslapis adresu `/evals`. Jis leidžia kurti vertinimų rinkinius, apibrėžti testavimo atvejus ir vykdyti vertinimus prieš Jūsų [Agent](../nodes/agent-node.md) workflows. [Agentų rinkinys](#agent-suites) vykdo agentą arba nuskaito jo realius vykdymus ir patikrina jo kviečiamus įrankius, delsą, kainą USD, žetonus bei įrankių iškvietimų skaičių.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Žiūrėti vertinimų demonstraciją</a></p>

## Prieiga

- Spustelėkite **Vertinimai** skydelio skirtukų juostoje
- Arba eikite į `/evals`
- Arba naudokite **Ctrl+K** (Cmd+K) ir pasirinkite "Vertinimai" iš komandų paletės

## Vertinimų rinkiniai

- **Naujas rinkinys** – Pasirinkite **Užklausų rinkinys**, kad išbandytumėte sistemos užklausą keliuose modeliuose, arba **Agentų rinkinys**, kad patikrintumėte realius agento vykdymus (žr. [Agentų rinkiniai](#agent-suites))
- **Rinkinių parinkiklis** – Rodo užklausų ir agentų rinkinius kartu su tipu šalia kiekvieno pavadinimo; rašykite teksto paieškai
- **Sukurti rinkinį** – Apibrėžkite rinkinį su pavadinimu ir aprašymu
- **Pasirinkti workflow** – Pasirinkite, kurį workflow vertinti
- **Pasirinkti kredencialą** – API raktas workflow vykdymui
- **Sistemos promptas** – Redaguokite sistemos promptą rinkinio lygyje tiesiogiai kairiajame skydelyje
- **Optimizuoti promptą** – Paprašykite LLM patobulinti esamą sistemos promptą

## Testavimo atvejai

- Pridėkite testavimo atvejus su įvesties promptais ir tikėtiniais rezultatais
- Kiekvienas atvejis gali turėti individualią tikėtiną vertę palyginimui
- Redaguokite arba ištrinkite atvejus iš rinkinio
- **Generuoti testavimo duomenis** – Naudokite pasirinktą kredencialą/modelį automatiškai sukurti testavimo atvejus iš rinkinio prompto

## Vykdant vertinimus

- **Pasirinkti vieną ar kelis modelius** – Vykdykite tą patį rinkinį prieš kelis modelius viename vertinime
- **Vertinimo metodas** – Pasirinkite `Exact Match`, `Contains` arba `LLM-as-Judge`
- **Vertintojas** – Pasirinkite OpenAI, OpenAI suderinamą (Custom), Gemini (Google) arba [Sprendimų modelio](../nodes/decision-node.md) kredencialą ir įveskite vertintojo modelį (pavyzdžiui, `gpt-4o-mini` arba `jev-latest`), kad įvertintumėte su nepriklausomu vertintoju
- **Vykdymai per testą** – Kartokite kiekvieną testavimo atvejį kelis kartus viename vykdyme
- **Įsiminti nustatymai** – Rinkinys atidaromas su naujausio jo vykdymo nustatymais: kredencialai, modeliai, vertinimo metodas ir teisėjas, temperatūra, samprotavimo pastangos ir vykdymų skaičius testui. Atidarius ankstesnį vykdymą įkeliami jo nustatymai, todėl **Pakartotinai vykdyti vertinimus** pakartoja tą patį testą
- **Temperatūra** – Nustatykite modelio temperatūrą (`Exact Match` ir `Contains`)
- **Samprotavimo pastangos** – Nustatykite samprotavimo pastangas samprotaujantiems modeliams nuo Žemų iki Ypatingai aukštų ir Maks. taip pat kaip LLM ir Agent mazguose (`Exact Match` ir `Contains`)

### LLM-as-Judge

Su vertintoju kiekvienas modelis atsako į testinę įvestį tik su rinkinio promptu, tada vertintojas įvertina, kaip gerai atsakymas atitinka tikėtinį rezultatą nuo 0 iki 100:

- **Modelio vertintojas** (OpenAI, OpenAI suderinamas arba Gemini) perskaito klausimą, tikėtiną rezultatą ir atsakymą, ir grąžina įvertinimą su vieno sakinio priežastimi. Jis veikia temperatūroje `0`, arba `low` mąstymo pastangų režimu mąstymo modeliui, todėl tas pats atsakymas gauna tą patį verdiktą.
- **Sprendimų modelio vertintojas** įvertina atsakymą penkių lygių rubrikoje, nuo *Visiškai neteisinga* iki *Visiškai atitinka*. Įvertinimas yra tikimybėmis svertas pozicijos rodiklis toje rubrikoje, todėl jis gaunamas iš pasiskirstymo, kurį modelis apskaičiavo, o ne iš skaičiaus, kurį jis parašė.

Langelio užvedimo kortelė rodo teisėjo pagrindimą arba sprendimo modelio atveju lygį, balą ir jo patikimumą. Delsa ir žetonai apibūdina bandomą modelį; paties teisėjo iškvietimai rodomi [Pėdsakuose](./traces-tab.md) po šaltiniu **Vertinimai**. Teisėjo parinkiklis atmeta Model Router kredencialus, nes teisėjas privalo būti vienas fiksuotas modelis. Bandomų modelių kredencialai gali būti [Model Router](../reference/credentials.md#model-router-auto-model): jo modelis **Auto** parenka modelį pagal užklausą, lygiai taip pat kaip workflow.

Be vertintojo, kiekvienas modelis atsako ir įvertina savo atsakymą viename užklausoje.

Temperatūra ir mąstymo pastangos šiame režime yra paslėptos, o vykdymas naudoja fiksuotas nustatymus: temperatūra `0.7` standartiniams modeliams ir `medium` mąstymo pastangoms mąstymo modeliams (`low`, kai jie vertina savo atsakymus).

## Rezultatai

- Peržiūrėkite praeitų testavimo atvejų sėkmes/nesėkmes
- Tikrinkite faktinius ir tikėtinus rezultatus
- Palyginkite modelių rezultatus šalia, kai vykdymas apima kelis modelius
- Peržiūrėkite vykdymo istoriją praeities vertinimams; `LLM-as-Judge` vykdymas rodo savo vertintojo modelį istorijos sąraše
- Atidarykite istorinius vykdymus iš rezultatų skydelio ir tikrinkite išsaugotus promptų/įvesties/išvesties momentinius vaizdus
- Atidarius praeities vykdymą, jo vertinimo metodas ir vertintojas įkeliamas į kairįjį skydelį, todėl **Pakartotinai vykdyti vertinimus** pakartoja tą patį vertinimą
- **Eksportuoti** atsisiunčia vykdymą kaip JSON, įskaitant `judge_credential_id` ir `judge_model`

## Agent Suites

Agentų rinkinys patikrina mazgą [Agent](../nodes/agent-node.md) pagal jo vykdymus. Jis nuskaito juos iš [Pėdsakų](./traces-tab.md), kur kiekvienas vykdymas jau fiksuoja laiką, žetonus, kainą ir įrankių iškvietimus, ir taip pat gali paleisti workflow už jus.

Sukurkite jį pasirinkę **Naujas rinkinys** → **Agentų rinkinys** ir atlikite tris veiksmus:

1. **Agentas** – Pasirinkite workflow, o tada jo agento mazgą. Pateikiami tik workflow su agento mazgu; workflow ar agentas, kuris dar nebuvo paleistas, rodomas, bet jo pasirinkti negalima. Pasirinkto agento nustatymai (modelis, instrukcijos, įrankiai ir apribojimai) rodomi dešinėje, o žemiau pateikiama tik skaitoma jo workflow drobė su paryškintu agentu.
2. **Baseline** – Paskutiniai 10 agento vykdymų: delsa p50 ir p95, kaina už vykdymą, žetonai už vykdymą ir įrankių iškvietimai už vykdymą, kokius įrankius jis kvietė ir kaip dažnai, bei kiekvieno vykdymo atskiri rodikliai. Vykdymai, pasibaigę klaida, išvardyti, bet neįtraukti į baseline.
3. **Patikros** – Pažymėkite kiekvieną įrankį kaip **Must call**, **Must not call** arba **Either**. Kiekviena iškvietimo rūšis pateikiama su jos tipu: Python ir mazgų įrankiai, **MCP** įrankiai su jų serveriu, **poagentai** pagal etiketę, **antriniai workflow** pagal pavadinimą ir **skills**. Pridėkite įrankį pagal rūšį ir pavadinimą, jei jis dar nebuvo paleistas, ir pašalinkite naudodami **X**. Nustatykite viršutines ribas delsai, kainai, bendram žetonų skaičiui ir įrankių iškvietimams; kiekviena prasideda 20 % virš baseline p95 ir gali būti išjungta.

Išsaugotas rinkinys atidaromas skiltyje **Rezultatai**, o šalia pateikiamos parinktys **Baseline** ir **Redaguoti patikras**:

- **Vykdyti workflow** – Pasirinkite vykdymų skaičių (iki 20); keturi vykdomi vienu metu. Įvestys užpildomos iš naujausio workflow vykdymo ir gali būti redaguojamos, o kiekvienas vykdymas jas naudoja. Įjunkite **Generuoti įvestis** (kibirkšties piktogramą), tada pasirinkite kredencialus ir modelį, kad modelis parašytų skirtingą įvestį kiekvienam vykdymui. Jis skaito agento sistemos instrukcijas ir laikosi arti įvestų verčių: įvedus miesto pavadinimą generuojami kiti miestų pavadinimai. Kiekvienas vykdymas atlieka visą workflow kaip bet kuris įprastas vykdymas ir yra įrašomas Vykdymo istorijoje su trigger `agent_suite`. Norėdami praleisti vėlesnius žingsnius, pavyzdžiui, el. laiško siuntimą, atidarykite workflow naudodami **Eiti į workflow** skydelyje ir pirmiausia išjunkite tuos mazgus. **Sustabdyti** užbaigia rinkinio vykdymą: nauji vykdymai nepradedami, o vykstantys atšaukiami. Rinkinio vykdymas, kurio serveris sustojo, pavyzdžiui, perkrovimo metu, po minutės rodomas kaip nutrauktas, užuot likęs užstrigęs.
- **Rezultatai** – Pagal numatytuosius nustatymus vertinamas naujausias rinkinio vykdymas. Kiekvienas rinkinio vykdymas išsaugomas su data vykdymų parinkiklyje, kur galite jį atidaryti arba ištrinti; arba perjunkite į paskutinius 10, 20 ar 50 agento vykdymų, kad įtrauktumėte ir kitus jo vykdymus. Matysite sėkmės rodiklį, kaip dažnai kiekviena patikra buvo sėkminga, delsą, kainą, žetonus ir įrankių iškvietimus šalia išsaugotos baseline, taip pat kiekvieną vykdymą su nesėkmės priežastimi ir nuoroda į jo pėdsaką.
- **Eiti į workflow** atidaro agento workflow naujame skirtuke. Pavadinimo lauke **Esc** arba **X** išvalo tekstą.

Kaip interpretuojami skaičiai:

- **Delsa** yra modelio laikas plius vykdymo įrankių iškvietimų laikas.
- **Kaina** naudoja tas pačias kainas kaip Traces. Modelio vykdymas be nurodytos kainos praleidžia kainos patikrą užuot pranešęs apie klaidą.
- Vykdymas laikomas **sėkmingu**, kai baigėsi be klaidų ir praėjo visos patikros.
- Rinkinys skaito tik jūsų pačių pėdsakus, pagal tą pačią taisyklę kaip skirtukas Pėdsakai.
- **Naudoti naujausius vykdymus kaip bazę** skiltyje **Redaguoti patikras** pakeičia išsaugotą baseline naujausiais agento vykdymais.

Rinkinio baseline kyla iš vieno iš trijų šaltinių. **Redaguoti patikras** rodo, kuris yra aktyvus šalia **Išsaugota bazinė linija**:

- naujausi agento vykdymai (numatytasis nustatymas ir tai, ką paima **Naudoti naujausius vykdymus kaip bazę**),
- vienas baigtas rinkinio vykdymas,
- rankiniu būdu įvesti skaičiai.

Pastarieji du nustatomi iš [Chat](./chat-tab.md#working-with-evals) arba per API:

- `PATCH /api/evals/agent-suites/{id}` priima `baseline: {"source": "suite_run", "run_id": "…"}` arba `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` priima `inputs_list`: vieną įvesties objektą kiekvienam vykdymui, iki 20.

### Iš Chat ir MCP

[Chat](./chat-tab.md#working-with-evals) ir MCP įrankis `heym_chat` gali kurti, keisti ir vykdyti užklausų bei agentų rinkinius:

- Jie patys suformuluoja testavimo atvejus ir vykdymo įvestis.
- Jie paklausia, kokius kredencialus naudoti prieš sukuriant užklausų rinkinį, nebent tinka tik vienas.
- Jie pateikia nuorodą į kiekvieną rinkinį, kurį paminėjo šiame puslapyje.

## Benchmark matricos idėjos

Kuriant benchmark matricą agentų workflows, įtraukite HITL scenarijus kaip pirmos klasės atvejus, o ne laikykite juos kraštiniais atvejais.

- Apimkite visas tris peržiūros sprendimų kategorijas: `priimta`, `redaguota` ir `atmesta`
- Įtraukite kelis trigger šaltinius, tokius kaip redaktoriaus vykdymai, portalas, curl/webhook ir cron sukelti vykdymai
- Pridėkite pakartotinio peržiūros scenarijus, kur vienas agento vykdymas sustoja daugiau nei vieną kartą
- Patikrinkite pranešimų šakas, susijusias su agento `review` išvestimi
- Patvirtinkite žemyninę elgseną po atmetimo, ypač jei vėlesni mazgai šakojasi pagal `$agent.decision`

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – Vertinimai kaip agento gyvavimo ciklo testavimo etapas
- [Agentų mazgas](../nodes/agent-node.md) – Vertinami workflows
- [Kredencialų skirtukas](./credentials-tab.md) – Kredencialai vertinimų vykdymams
- [Vykdymų skirtukas](./traces-tab.md) – Išsami vykdymo analizė
- [Workflows skirtukas](./workflows-tab.md) – Kurti workflows vertinimams
- [Vykdymo istorija](../reference/execution-history.md) – Peržiūrėti praeities vykdymus (Istorijos mygtukas antraštėje)
- [Kontekstinis demonstravimas](../reference/contextual-showcase.md) – Kompaktiška puslapio gairė, prieinama vertinimų puslapyje
