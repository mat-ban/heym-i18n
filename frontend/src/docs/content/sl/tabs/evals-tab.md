# Zavihek Evals

Zavihek **Evals** je ločena stran na naslovu `/evals`. Omogoča vam ustvarjanje evalvacijskih paketov, opredelitev testnih primerov in izvajanje evalvacij proti vašim [Agent](../nodes/agent-node.md) workflow-om.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Oglejte si demo Evals</a></p>

## Dostop

- Kliknite **Evals** v menijski vrstici nadzorne plošče
- Ali se pomaknite na `/evals`
- Ali uporabite **Ctrl+K** (Cmd+K) in izberite "Evals" iz ukazne palete

## Evalvacijski paketi

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
- **Temperatura** – Nastavite temperaturo modela (`Exact Match` in `Contains`)
- **Napor razmišljanja** – Nastavite napor razmišljanja za modele razmišljanja (`Exact Match` in `Contains`)

### LLM-as-Judge

S sodnikom vsak model odgovori na testni vhod le s promptom paketa, nato sodnik oceni, kako blizu je odgovor pričakovanemu izhodu od 0 do 100:

- **Model sodnik** (OpenAI, OpenAI združljiv ali Gemini) prebere vprašanje, pričakovani izhod in odgovor ter vrne oceno z enovrstičnim razlogom. Deluje pri temperaturi `0`, ali pri `nizkem` naporu razmišljanja za model razmišljanja, tako da isti odgovor dobi isto oceno.
- **Sodnik modela odločanja** ocenjuje odgovor na petstopenjski rubriki, od *Popolnoma napačno* do *Popolnoma se ujema*. Ocena je verjetnostno-tehtana pozicija na tej rubriki, zato izhaja iz porazdelitve, ki jo je model izračunal, namesto iz številke, ki jo je napisal.

Kartica za lebdenje celice prikazuje razlog sodnika, ali pa za model odločanja raven, oceno in njeno zaupanje. Latenca in tokovi opisujejo model pod testom; klici sodnika se pojavijo v [Zgodovina](./traces-tab.md) pod virom **Evals**. Izbira modela izpušča Model Router poverilnice, ker evalvacija primerja specifične modele.

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
