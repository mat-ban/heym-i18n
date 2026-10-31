# Zavihek Evals

Zavihek **Evals** je ločena stran na naslovu `/evals`. Omogoča vam ustvarjanje evalvacijskih paketov, opredelitev testnih primerov in izvajanje evalvacij proti vašim [Agent](../nodes/agent-node.md) workflow-om. [Paket agentov](#agent-suites) zažene agenta ali prebere njegove dejanske zstatusirane teke ter preveri orodja, ki jih kliče, njegovo latenco, stroške v USD, žetone in število klicev orodij.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Oglejte si demo Evals</a></p>

## Dostop

- Kliknite **Evals** v menijski vrstici nadzorne plošče
- Ali se pomaknite na `/evals`
- Ali uporabite **Ctrl+K** (Cmd+K) in izberite "Evals" iz ukazne palete

## Evalvacijski paketi

- **Nov paket** – Izberite **Paket pozivov** za preizkušanje sistemskega poziva v več modelih, ali **Paket agentov** za preverjanje dejanskih zagonov agenta (glejte [Paketi agentov](#agent-suites))
- **Izbirnik paketov** – Prikazuje pakete pozivov in agentov skupaj z vrsto ob vsakem imenu; tipkajte za iskanje
- **Ustvari paket** – Opredelite paket z imenom in opisom
- **Izberite workflow** – Izberite, kateri workflow želite evalvirati
- **Izberite poverilnico** – API ključ za izvajanje workflow-a
- **Sistemskega prompta** – Uredite sistemski prompt na ravni paketa neposredno v levem panelu
- **Optimiziraj prompt** – Prosite LLM, da izboljša trenutni sistemski prompt

## Testni primeri

- Dodajte testne primere z vhodnimi prompti in pričakovanimi izhodi
- Vsak primer lahko ima prilagojeno pričakovano vrednost za primerjavo
- Uredite ali izbrišite primere iz paketa
- **Generiraj testne podatke** – Uporabite izbrano poverilnico/model za samodejno ustvarjanje testnih primerov iz prompta paketa

## Izvajanje evalvacij

- **Izberite enega ali več modelov** – Izvedite isti paket proti več modelom v eni evalvaciji
- **Metoda ocenjevanja** – Izberite `Exact Match`, `Contains` ali `LLM-as-Judge`
- **Sodnik** – Za `LLM-as-Judge` po potrebi izberite OpenAI, OpenAI združljivo (Custom), Gemini (Google) ali [Decision Model](../nodes/decision-node.md) poverilnico in vpišite model sodnika (na primer `gpt-4o-mini` ali `jev-latest`), da ocenite z neodvisnim sodnikom
- **Ponovitve na test** – Ponovite vsak testni primer večkrat v eni izvedbi
- **Zapomnjene nastavitve** – Paket se odpre z nastavitvami svojega najnovejšega zagona: poverilnica, modeli, način ocenjevanja in sodnik, temperatura, napor sklepanja ter zagoni na preizkus. Odpiranje prejšnjega zagona naloži njegove nastavitve, tako da **Ponovno zaženi ocenjevanja** ponovi isti preizkus
- **Temperatura** – Nastavite temperaturo modela (`Exact Match` in `Contains`)
- **Napor sklepanja** – Nastavite napor sklepanja za modele sklepanja, od Nizko do Zelo visoko in Maks., enako kot pri vozliščih LLM in Agent (`Exact Match` in `Contains`)

### LLM-as-Judge

S sodnikom vsak model odgovori na testni vhod le s promptom paketa, nato sodnik oceni, kako blizu je odgovor pričakovanemu izhodu od 0 do 100:

- **Model sodnik** (OpenAI, OpenAI združljiv ali Gemini) prebere vprašanje, pričakovani izhod in odgovor ter vrne oceno z enovrstičnim razlogom. Deluje pri temperaturi `0`, ali pri `nizkem` naporu razmišljanja za model razmišljanja, tako da isti odgovor dobi isto oceno.
- **Sodnik modela odločanja** ocenjuje odgovor na petstopenjski rubriki, od *Popolnoma napačno* do *Popolnoma se ujema*. Ocena je verjetnostno-tehtana pozicija na tej rubriki, zato izhaja iz porazdelitve, ki jo je model izračunal, namesto iz številke, ki jo je napisal.

Kartica ob prehodu z miško nad celico prikazuje utemeljitev sodnika ali pri odločitvenem modelu raven, oceno in njeno zanesljivost. Latenca in žetoni opisujejo preizkušani model; lastni klici sodnika se pojavijo v [Sledeh](./traces-tab.md) pod virom **Ocenjevanja**. Izbirnik sodnika izpušča poverilnice Model Router, saj mora biti sodnik en fiksen model. Poverilnica za preizkušane modele je lahko [Model Router](../reference/credentials.md#model-router-auto-model): njegov model **Auto** izbere model za vsako zahtevo, enako kot v workflowu.

Brez sodnika vsak model odgovori in oceni svoj odgovor v eni zahtevi.

Temperatura in napor razmišljanja sta v tem načinu skrita, izvedba pa uporablja fiksne nastavitve: temperatura `0.7` za standardne modele in `srednji` napor razmišljanja za modele razmišljanja (`nizki`, ko ocenjujejo svoje odgovore).

## Rezultati

- Oglejte si uspeh/neuspeh za vsak testni primer
- Preverite dejanske in pričakovane izhode
- Primerjajte izhode po modelih drug ob drugem, ko izvedba vključuje več modelov
- Preglejte zgodovino izvedb prejšnjih evalvacij; izvedba `LLM-as-Judge` prikazuje svoj model sodnika v seznamu zgodovine
- Odprite zgodovinske izvedbe iz panela rezultatov in preglejte shranjene posnetke promptov/vhodov/izhodov
- Odprtje prejšnje izvedbe naloži njeno metodo ocenjevanja in sodnika v levi panel, tako da **Ponovno izvedite Evals** ponovi isto evalvacijo
- **Izvozi** prenese izvedbo kot JSON, vključno z `judge_credential_id` in `judge_model`

## Agent Suites

Paket agentov preverja vozlišče [Agent](../nodes/agent-node.md) glede na njegove zagone. Bere jih iz [Sledi](./traces-tab.md), kjer vsak zagon že beleži svoj čas, žetone, stroške in klice orodij, poleg tega pa lahko workflow zažene namesto vas.

Ustvarite ga z **Nov paket** → **Paket agentov** in sledite trem korakom:

1. **Agent** – Izberite workflow in nato njegovo vozlišče agenta. Navedeni so samo workflowi z vozliščem agenta; workflow ali agent, ki se še ni izvajal, je prikazan, vendar ga ni mogoče izbrati. Nastavitve izbranega agenta (model, navodila, orodja in omejitve) se prikažejo na desni, spodaj pa se prikaže platno njegovega workflowa v načinu samo za branje z označenim agentom.
2. **Baseline** – Zadnjih 10 zagonov agenta: latenca p50 in p95, strošek na zagon, žetoni na zagon in klici orodij na zagon, katera orodja je klical in kako pogosto, ter posamezne vrednosti vsakega zagona. Zagoni, ki so se končali z napako, so navedeni, vendar so izključeni iz baseline.
3. **Preverjanja** – Označite vsako orodje kot **Must call**, **Must not call** ali **Either**. Vsaka vrsta klica je navedena s svojo vrsto: orodja Python in vozlišč, orodja **MCP** s svojim strežnikom, **podagenti** po oznaki, **podrejeni workflowi** po imenu in **skills**. Dodajte orodje po vrsti in imenu, če se še ni izvajalo, ter ga odstranite z znakom **X**. Nastavite zgornje meje za latenco, stroške, skupne žetone in klice orodij; vsaka se začne 20 % nad p95 baseline in jo je mogoče izklopiti.

Shranjeni paket se odpre na zavihku **Rezultati**, ob njem pa sta zavihka **Baseline** in **Uredi preverjanja**:

- **Zaženi workflow** – Izberite število zagonov (do 20); štirje tečejo sočasno. Vhodi se predhodno izpolnijo iz najnovejšega zagona workflowa in jih je mogoče urejati, pri čemer jih uporabi vsak zagon. Vklopite **Generiraj vhode** (ikona iskre) ter izberite poverilnico in model, da model sestavi drugačen vhod za vsak zagon. Prebere sistemska navodila agenta in se drži blizu vnesenih vrednosti: vnos imena mesta ustvari druga imena mest. Vsak zagon izvede celoten workflow kot vsak običajen zagon in se zabeleži v Zgodovini izvajanja s sprožilcem `agent_suite`. Če želite preskočiti poznejše korake, kot je pošiljanje e-pošte, odprite workflow z možnostjo **Pojdi na workflow** na plošči in ta vozlišča najprej onemogočite. **Ustavi** zaključi izvajanje paketa: novi zagoni se ne začnejo, tisti v teku pa se prekličejo. Zagon paketa, katerega strežnik se je ustavil, na primer med ponovnim zagonom, se po eni minuti prikaže kot prekinjen, namesto da bi ostal zablokiran.
- **Rezultati** – Privzeto se oceni najnovejši zagon paketa. Vsak zagon paketa se shrani z datumom v izbirniku zagonov, kjer ga lahko odprete ali izbrišete; ali pa preklopite na zadnjih 10, 20 ali 50 zagonov agenta, da vključite tudi njegove druge zagone. Vidite stopnjo uspešnosti, kako pogosto je posamezno preverjanje uspelo, latenco, stroške, žetone in klice orodij poleg shranjenega baseline ter vsak zagon z razlogom za neuspeh in povezavo do njegove sledi.
- **Pojdi na workflow** odpre workflow agenta v novem zavihku. V polju za ime pritisk na **Esc** ali ikono **X** počisti besedilo.

Kako se podatki razlagajo:

- **Latenca** je čas delovanja modela, povečan za čas klicev orodij tega zagona.
- **Stroški** uporabljajo enake cene kot Traces. Zagon modela brez določene cene preskoči preverjanje stroškov, namesto da bi javil napako.
- Zagon je **uspešen**, ko se zaključi brez napake in so vsa preverjanja opravljena.
- Paket bere izključno vaše lastne sledi, po enakem pravilu kot zavihek Traces.
- **Uporabi najnovejše zagone kot baseline** v **Uredi preverjanja** nadomesti shranjeni baseline z najnovejšimi zagoni agenta.

Baseline paketa izhaja iz enega od treh virov. **Uredi preverjanja** prikazuje, kateri je aktiven poleg **Shranjeni baseline**:

- najnovejši zagoni agenta (privzeta možnost in tisto, kar prevzame **Uporabi najnovejše zagone kot baseline**),
- en zaključen zagon paketa,
- ročno vnesene številke.

Zadnji dve možnosti se nastavita iz [Chata](./chat-tab.md#working-with-evals) ali prek API-ja:

- `PATCH /api/evals/agent-suites/{id}` sprejme `baseline: {"source": "suite_run", "run_id": "…"}` ali `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` sprejme `inputs_list`: en vhodni objekt na zagon, do 20.

### Iz Chata in MCP

[Chat](./chat-tab.md#working-with-evals) in orodje MCP `heym_chat` lahko ustvarjata, spreminjata in izvajata pakete pozivov in agentov:

- Sama pripravita testne primere in vhodne podatke za zagone.
- Vprašata, katero poverilnico uporabiti pred ustvarjanjem paketa pozivov, razen če ustreza natanko ena.
- Povežeta vsak paket, ki ga omenita na tej strani.

## Ideje za Benchmark Matrico

Ko gradite benchmark matrico za agent workflow-e, vključite HITL scenarije kot primarne primere namesto da bi jih obravnavali kot robne primere.

- Pokrijte vse tri odločitve pregleda: `sprejeto`, `urejeno` in `zavrnjeno`
- Vključite več virov sprožitev, kot so izvajanja urednika, portal, curl/webhook in cron-sprožene izvedbe
- Dodajte scenarije ponovnega pregleda, kjer ena agentova izvedba prekine več kot enkrat
- Preverite veje obvestil, povezane z agentovim `review` izhodom
- Potrdite obnašanje downstream po zavrnitvi, še posebej, če kasnejša vozlišča veje na `$agent.decision`

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Evals kot testna faza življenjskega cikla agenta
- [Agent Node](../nodes/agent-node.md) – Workflows, ki se evalvirajo
- [Zavihek Poverilnice](./credentials-tab.md) – Poverilnice za evalvacije
- [Zavihek Zgodovina](./traces-tab.md) – Podroben pregled sledi
- [Zavihek Workflows](./workflows-tab.md) – Ustvarite workflows za evalvacijo
- [Zgodovina izvajanja](../reference/execution-history.md) – Oglejte si prejšnje izvedbe (gumb Zgodovina v glavi)
- [Kontekstualni prikaz](../reference/contextual-showcase.md) – Kompaktni vodnik po strani evalvacij
