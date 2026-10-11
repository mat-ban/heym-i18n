# Evals Tab

Tablica **Evals** je zasebna stranica na `/evals`. Omogućuje vam stvaranje evaluacijskih paketa, definiranje testnih slučajeva i izvođenje evaluacija protiv vaših [Agent](../nodes/agent-node.md) workflows.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Pogledajte Evals demonstraciju</a></p>

## Pristup

- Kliknite na **Evals** u traci izbornika nadzorne ploče
- Ili idite na `/evals`
- Ili upotrijebite **Ctrl+K** (Cmd+K) i odaberite "Evals" iz palete naredbi

## Eval Paketi

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
- **Temperatura** – Postavite temperaturu modela (`Exact Match` i `Contains`)
- **Napor razmišljanja** – Postavite napor razmišljanja za modele razmišljanja (`Exact Match` i `Contains`)

### LLM-as-Judge

S sucem, svaki model odgovara na testni ulaz samo s promptom paketa, a zatim sudac ocjenjuje koliko blisko odgovor odgovara očekivanom izlazu od 0 do 100:

- **Model sudac** (OpenAI, OpenAI kompatibilan ili Gemini) čita pitanje, očekivani izlaz i odgovor, te vraća ocjenu s jednim razlogom. Radi na temperaturi `0`, ili s `low` naporom razmišljanja za model razmišljanja, tako da isti odgovor dobije istu presudu.
- **Sudac model odluke** ocjenjuje odgovor prema pet razina rubrike, od *Potpuno pogrešno* do *Potpuno odgovara*. Ocjena je vjerojatnosno ponderirana pozicija na toj rubrici, tako da dolazi iz raspodjele koju je model izračunao, a ne iz broja koji je napisao.

Kartica s informacijama o ćeliji prikazuje razlog suca, ili za model odluke razinu, ocjenu i njezinu pouzdanost. Latencija i tokeni opisuju model pod ispitivanjem; vlastiti pozivi suca pojavljuju se u [Traces](./traces-tab.md) pod izvorom **Evals**. Odabir modela izostavlja Model Router vjerodajnice, jer eval uspoređuje specifične modele.

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
