# Evals Tab

Tablica **Evals** je zasebna stranica na `/evals`. Omogućuje vam stvaranje evaluacijskih paketa, definiranje testnih slučajeva i izvođenje evaluacija protiv vaših [Agent](../nodes/agent-node.md) workflows. [Paket agenata](#agent-suites) pokreće agenta ili čita njegova stvarna pokretanja te provjerava alate koje poziva, njegovu latenciju, trošak u USD, tokene i broj poziva alata.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Pogledajte Evals demonstraciju</a></p>

## Pristup

- Kliknite na **Evals** u traci izbornika nadzorne ploče
- Ili idite na `/evals`
- Ili upotrijebite **Ctrl+K** (Cmd+K) i odaberite "Evals" iz palete naredbi

## Eval Paketi

- **Novi paket** – Odaberite **Paket promptova** za testiranje sistemskog prompta na više modela, ili **Paket agenata** za provjeru stvarnih pokretanja agenta (pogledajte [Paketi agenata](#agent-suites))
- **Birač paketa** – Prikazuje pakete promptova i agenata zajedno s vrstom pored svakog naziva; tipkajte za pretraživanje
- **Stvorite paket** – Definirajte paket s imenom i opisom
- **Odaberite workflow** – Odaberite koji workflow želite evaluirati
- **Odaberite vjerodajnicu** – API ključ za izvođenje workflow-a
- **Sustavni prompt** – Uredite sustavni prompt na razini paketa izravno u lijevom panelu
- **Optimizirajte Prompt** – Zatražite od LLM-a da poboljša trenutni sustavni prompt

## Testni Slučajevi

- Dodajte testne slučajeve s ulaznim promptima i očekivanim izlazima
- Svaki slučaj može imati prilagođenu očekivanu vrijednost za usporedbu
- Uredite ili izbrišite slučajeve iz paketa
- **Generirajte Testne Podatke** – Upotrijebite odabranu vjerodajnicu/model za automatsko stvaranje testnih slučajeva iz prompta paketa

## Izvođenje Evaluacija

- **Odaberite jedan ili više modela** – Izvršite isti paket protiv više modela u jednoj evaluaciji
- **Metoda ocjenjivanja** – Odaberite `Exact Match`, `Contains` ili `LLM-as-Judge`
- **Sudac** – Za `LLM-as-Judge`, opcionalno odaberite OpenAI, OpenAI kompatibilnu (Custom), Gemini (Google) ili [Decision Model](../nodes/decision-node.md) vjerodajnicu i upišite model suca (na primjer `gpt-4o-mini` ili `jev-latest`) za ocjenjivanje s neovisnim sucem
- **Izvršenja po testu** – Ponovite svaki testni slučaj više puta u jednom izvođenju
- **Zapamćene postavke** – Paket se otvara s postavkama svog najnovijeg pokretanja: vjerodajnica, modeli, metoda bodovanja i ocjenjivač, temperatura, napor rezoniranja i broj pokretanja po testu. Otvaranje prethodnog pokretanja učitava njegove postavke, pa **Ponovno pokreni evaluacije** ponavlja isto testiranje
- **Temperatura** – Postavite temperaturu modela (`Exact Match` i `Contains`)
- **Napor rezoniranja** – Postavite napor rezoniranja za modele rezoniranja, od Nisko do Iznimno visoko i Maks baš kao i kod LLM i Agent čvorova (`Exact Match` i `Contains`)

### LLM-as-Judge

S sucem, svaki model odgovara na testni ulaz samo s promptom paketa, a zatim sudac ocjenjuje koliko blisko odgovor odgovara očekivanom izlazu od 0 do 100:

- **Model sudac** (OpenAI, OpenAI kompatibilan ili Gemini) čita pitanje, očekivani izlaz i odgovor, te vraća ocjenu s jednim razlogom. Radi na temperaturi `0`, ili s `low` naporom razmišljanja za model razmišljanja, tako da isti odgovor dobije istu presudu.
- **Sudac model odluke** ocjenjuje odgovor prema pet razina rubrike, od *Potpuno pogrešno* do *Potpuno odgovara*. Ocjena je vjerojatnosno ponderirana pozicija na toj rubrici, tako da dolazi iz raspodjele koju je model izračunao, a ne iz broja koji je napisao.

Kartica pri prelasku mišem iznad ćelije prikazuje razlog ocjenjivača ili, za model odlučivanja, razinu, ocjenu i njezinu pouzdanost. Latencija i tokeni opisuju testirani model; vlastiti pozivi ocjenjivača pojavljuju se u [Tragovima](./traces-tab.md) pod izvorom **Evaluacije**. Birač ocjenjivača izostavlja vjerodajnice Model Routera, jer ocjenjivač mora biti jedan fiksni model. Vjerodajnica za testirane modele može biti [Model Router](../reference/credentials.md#model-router-auto-model): njegov **Auto** model bira model po zahtjevu, na isti način kao u workflowu.

Bez suca, svaki model odgovara i ocjenjuje vlastiti odgovor u jednom zahtjevu.

Temperatura i napor razmišljanja su skriveni u ovom načinu rada, a izvođenje koristi fiksne postavke: temperatura `0.7` za standardne modele, i `medium` napor razmišljanja za modele razmišljanja (`low` kada ocjenjuju vlastite odgovore).

## Rezultati

- Pregledajte prolaz/neprolaz po testnom slučaju
- Istražite stvarne naspram očekivanih izlaza
- Usporedite izlaze po modelima jedan pored drugog kada izvođenje uključuje više modela
- Pregledajte povijest izvođenja za prethodne evaluacije; izvođenje `LLM-as-Judge` prikazuje svoj model suca u popisu povijesti
- Otvorite povijesna izvođenja iz panela rezultata i pregledajte spremljene snimke prompta/ulaza/izlaza
- Otvaranje prethodnog izvođenja učitava njegovu metodu ocjenjivanja i suca u lijevi panel, tako da **Ponovno Izvršite Evals** ponavlja istu evaluaciju
- **Izvoz** preuzima izvođenje kao JSON, uključujući `judge_credential_id` i `judge_model`

## Agent Suites

Paket agenata provjerava čvor [Agent](../nodes/agent-node.md) u odnosu na njegova pokretanja. Čita ih iz [Tragova](./traces-tab.md), gdje svako pokretanje već bilježi svoje vrijeme, tokene, trošak i pozive alata, a može i pokrenuti workflow umjesto vas.

Stvorite ga putem **Novi paket** → **Paket agenata** i slijedite tri koraka:

1. **Agent** – Odaberite workflow, a zatim njegov čvor agenta. Prikazani su samo workflowi s čvorom agenta; workflow ili agent koji još nije pokrenut prikazuje se, ali se ne može odabrati. Postavke odabranog agenta (model, upute, alati i ograničenja) prikazuju se s desne strane, a ispod se prikazuje platno njegovog workflowa u načinu rada samo za čitanje s istaknutim agentom.
2. **Baseline** – Zadnjih 10 pokretanja agenta: latencija p50 i p95, trošak po pokretanju, tokeni po pokretanju i pozivi alata po pokretanju, koje je alate pozvao i koliko često, kao i pojedinačne vrijednosti svakog pokretanja. Pokretanja koja su završila pogreškom navedena su, ali su izostavljena iz baselinea.
3. **Provjere** – Označite svaki alat kao **Must call**, **Must not call** ili **Either**. Svaka vrsta poziva navedena je sa svojom vrstom: alati Pythona i čvorova, **MCP** alati sa svojim poslužiteljem, **podagenti** prema oznaci, **podworkflowi** prema nazivu i **skills**. Dodajte alat prema vrsti i nazivu ako još nije pokrenut te ga uklonite pomoću oznake **X**. Postavite gornje granice za latenciju, trošak, ukupne tokene i pozive alata; svaka počinje 20% iznad p95 baselinea i može se isključiti.

Spremljeni paket otvara se na kartici **Rezultati**, s opcijama **Baseline** i **Uredi provjere** pored nje:

- **Pokreni workflow** – Odaberite broj pokretanja (do 20); četiri se izvode istovremeno. Ulazi se popunjavaju iz najnovijeg pokretanja workflowa i mogu se uređivati, a svako pokretanje ih koristi. Uključite **Generiraj ulaze** (ikona iskre), a zatim odaberite vjerodajnicu i model kako bi model sastavio drugačiji ulaz za svako pokretanje. Čita sistemske upute agenta i drži se blisko vrijednostima koje ste unijeli: upisivanje naziva grada generira druge nazive gradova. Svako pokretanje izvršava cijeli workflow kao i svako uobičajeno pokretanje te se bilježi u Povijesti izvođenja s triggerom `agent_suite`. Kako biste preskočili kasnije korake, poput slanja e-pošte, otvorite workflow pomoću opcije **Idi na workflow** na ploči i najprije onemogućite te čvorove. **Zaustavi** prekida izvođenje paketa: nova pokretanja ne počinju, a ona u tijeku se otkazuju. Pokretanje paketa čiji se poslužitelj zaustavio, primjerice tijekom ponovnog pokretanja, prikazuje se kao prekinuto nakon jedne minute umjesto da ostane blokirano.
- **Rezultati** – Najnovije pokretanje paketa ocjenjuje se prema zadanim postavkama. Svako pokretanje paketa čuva se s datumom u biraču pokretanja, gdje ga možete otvoriti ili izbrisati; ili se prebacite na zadnjih 10, 20 ili 50 pokretanja agenta kako biste uključili i njegova druga pokretanja. Vidite stopu prolaznosti, koliko je često svaka provjera prošla, latenciju, trošak, tokene i pozive alata pored spremljenog baselinea, kao i svako pokretanje s razlogom neuspjeha i poveznicom na njegov trag.
- **Idi na workflow** otvara workflow agenta u novoj kartici. U polju naziva pritiskom na **Esc** ili ikonu **X** briše se tekst.

Kako se tumače podaci:

- **Latencija** je vrijeme rada modela uvećano za vrijeme poziva alata tog pokretanja.
- **Trošak** koristi iste cijene kao Traces. Pokretanje modela bez definirane cijene preskače provjeru troška umjesto da javi pogrešku.
- Pokretanje je **uspješno** kada je završilo bez pogreške i kada su prošle sve provjere.
- Paket čita isključivo vaše vlastite tragove, prema istom pravilu kao kartica Tragovi.
- **Upotrijebi najnovija pokretanja kao baseline** u **Uredi provjere** zamjenjuje spremljeni baseline najnovijim pokretanjima agenta.

Baseline paketa potječe iz jednog od tri izvora. **Uredi provjere** prikazuje koji je aktivan pored **Spremljeni baseline**:

- najnovija pokretanja agenta (zadana vrijednost i ono što preuzima opcija **Upotrijebi najnovija pokretanja kao baseline**),
- jedno završeno pokretanje paketa,
- ručno unesene vrijednosti.

Posljednja dva postavljaju se iz [Chata](./chat-tab.md#working-with-evals) ili putem API-ja:

- `PATCH /api/evals/agent-suites/{id}` prihvaća `baseline: {"source": "suite_run", "run_id": "…"}` ili `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` prihvaća `inputs_list`: jedan ulazni objekt po pokretanju, do 20.

### Iz Chata i MCP-a

[Chat](./chat-tab.md#working-with-evals) i MCP alat `heym_chat` mogu stvarati, mijenjati i pokretati pakete promptova i agenata:

- Samostalno sastavljaju testne slučajeve i ulazne podatke za pokretanje.
- Pitaju koju vjerodajnicu koristiti prije stvaranja paketa promptova, osim ako samo jedna odgovara.
- Povezuju svaki paket koji spomenu na ovoj stranici.

## Ideje za Benchmark Matricu

Kada gradite benchmark matricu za agent workflows, uključite HITL scenarije kao primarne slučajeve umjesto da ih tretirate kao rubne slučajeve.

- Pokrijte sve tri odluke o pregledu: `accepted`, `edited` i `refused`
- Uključite više izvora okidača kao što su izvođenja urednika, portal, curl/webhook i cron-okidane izvršenja
- Dodajte scenarije ponovnog pregleda gdje jedno izvođenje agenta pauzira više od jednom
- Provjerite grane obavijesti povezane s `review` izlazom agenta
- Potvrdite ponašanje nizvodno nakon odbijanja, posebno ako kasniji čvorovi grane na `$agent.decision`

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Evals kao testna faza životnog ciklusa agenta
- [Agent Node](../nodes/agent-node.md) – Workflows koji se evaluiraju
- [Credentials Tab](./credentials-tab.md) – Vjerodajnice za eval izvođenja
- [Traces Tab](./traces-tab.md) – Detaljna inspekcija tragova
- [Workflows Tab](./workflows-tab.md) – Stvaranje workflows za evaluaciju
- [Povijest Izvršenja](../reference/execution-history.md) – Pregledajte prethodna izvođenja (gumb Povijest u zaglavlju)
- [Kontekstualna Prikaz](../reference/contextual-showcase.md) – Kompaktni vodič dostupan na stranici evals
