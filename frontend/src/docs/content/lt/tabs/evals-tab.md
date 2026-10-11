# Vertinimų skirtukas

**Vertinimų** skirtukas yra atskira puslapis adresu `/evals`. Jis leidžia kurti vertinimų rinkinius, apibrėžti testavimo atvejus ir vykdyti vertinimus prieš Jūsų [Agent](../nodes/agent-node.md) workflows.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Žiūrėti vertinimų demonstraciją</a></p>

## Prieiga

- Spustelėkite **Vertinimai** skydelio skirtukų juostoje
- Arba eikite į `/evals`
- Arba naudokite **Ctrl+K** (Cmd+K) ir pasirinkite "Vertinimai" iš komandų paletės

## Vertinimų rinkiniai

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
- **Temperatūra** – Nustatykite modelio temperatūrą (`Exact Match` ir `Contains`)
- **Mąstymo pastangos** – Nustatykite mąstymo pastangas mąstymo modeliams (`Exact Match` ir `Contains`)

### LLM-as-Judge

Su vertintoju kiekvienas modelis atsako į testinę įvestį tik su rinkinio promptu, tada vertintojas įvertina, kaip gerai atsakymas atitinka tikėtinį rezultatą nuo 0 iki 100:

- **Modelio vertintojas** (OpenAI, OpenAI suderinamas arba Gemini) perskaito klausimą, tikėtiną rezultatą ir atsakymą, ir grąžina įvertinimą su vieno sakinio priežastimi. Jis veikia temperatūroje `0`, arba `low` mąstymo pastangų režimu mąstymo modeliui, todėl tas pats atsakymas gauna tą patį verdiktą.
- **Sprendimų modelio vertintojas** įvertina atsakymą penkių lygių rubrikoje, nuo *Visiškai neteisinga* iki *Visiškai atitinka*. Įvertinimas yra tikimybėmis svertas pozicijos rodiklis toje rubrikoje, todėl jis gaunamas iš pasiskirstymo, kurį modelis apskaičiavo, o ne iš skaičiaus, kurį jis parašė.

Langelio plūduriuojantis kortelė rodo vertintojo priežastį, arba sprendimų modelio atveju lygį, įvertinimą ir jo pasitikėjimą. Latencija ir tokenai apibūdina testuojamą modelį; vertintojo skambučiai pasirodo [Vykdymuose](./traces-tab.md) po **Vertinimų** šaltiniu. Modelių pasirinkiklis neįtraukia Model Router kredencialų, nes vertinimas palygina konkrečius modelius.

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
