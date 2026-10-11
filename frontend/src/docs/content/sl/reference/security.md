# Varnost

Prakse in konfiguracija varnosti za platformo Heym.

## Politika gesel

Vsa gesla — ob registraciji in pri spreminjanju gesla — morajo izpolnjevati naslednje zahteve:

| Pravilo | Zahteva |
|---------|---------|
| Minimalna dolžina | 8 znakov |
| Velike črke | Vsaj ena velika črka (A–Z) |
| Male črke | Vsaj ena mala črka (a–z) |
| Številka | Vsaj ena številka (0–9) |

Te zahteve se uveljavijo tako na sprednjem kot na zadnjem delu (validator Pydantic). Zahteva z neustreznim geslom je zavrnjena z odgovorom `422 Unprocessable Entity`, preden pride do kakršnega koli zapisa v bazo podatkov.

**Primer veljavnega gesla:** `MyWorkflow7!`

## Upravljanje sej

- Dostopni žetoni se shranjujejo v **HttpOnly** piškotkih, ne v `localStorage`. To preprečuje, da bi JavaScript (vključno z XSS payloadi) prebral žeton.
- Osveževalni žeton je omejen na pot `/api/auth/refresh` in ga ni mogoče poslati drugim končnim točkam.
- Vsak klic `/api/auth/refresh` **rotira** osveževalni žeton: stari žeton je takoj preklican in izdan je nov. Ponovno pošiljanje uporabljenega osveževalnega žetona vrne `401`.

## Omejevanje hitrosti

Naslednje končne točke so omejene glede na hitrost po IP-ju:

| Končna točka | Omejitev | Trajanje prepovedi |
|---------------|----------|---------------------|
| `POST /api/auth/login` | 10 zahtev / 60 s | 15 min |
| `POST /api/auth/register` | 5 zahtev / 60 s | 10 min |
| `POST /register` (OAuth odjemalci) | 5 zahtev / 60 s | 10 min |
| Prijava v portal | 3 poskusi | 24 h |

Ko je `REDIS_URL` konfiguriran, so omejitve hitrosti deljene med vsemi delavci na zadnjem delu. Brez tega se omejitve uporabljajo na posamezen delovni proces.

## Šifriranje poverilnic

Vsi API ključi, URL-ji za webhook in bearer žetoni, shranjeni v [Poverilnicah](../tabs/credentials-tab.md), so šifrirani v mirovanju z uporabo AES-256 (Fernet) pred zapisom v bazo podatkov. Ključ je izpeljan iz okoljske spremenljivke `ENCRYPTION_KEY`. Skripti `run.sh` in `deploy.sh` samodejno generirata močno vrednost, ko je ta prazna; aplikacija se ne zažene, če je `ENCRYPTION_KEY` prazna ali nastavljena na znano mesto.

## MCP API ključ

MCP API ključ se uporablja za avtentikacijo zunanjih MCP odjemalcev, ki se povezujejo na končno točko `/api/mcp/sse`. Ko je povezava SSE vzpostavljena, se izda kratkotrajen (1-urna) sejni žeton, ki je vstavljen v URL končne točke sporočila namesto pravega API ključa, kar preprečuje, da bi se ključ pojavil v dnevnikih dostopa strežnika. Oglejte si [MCP zavihek](../tabs/mcp-tab.md) za nastavitev.

## OAuth / PKCE

OAuth 2.0 avtentikacijski strežnik (uporabljen za MCP odjemalce) podpira samo `authorization_code` dodelitev s PKCE (`S256`). Obrazec za soglasje uporablja HMAC-SHA256 CSRF žetone, veljavne 10 minut. Vse vrednosti, prikazane na strani soglasja, so HTML-escaped.

## Žetoni za izvajanje

[Žetoni za izvajanje](./execution-tokens.md) so obsežni JWT-ji za klic končne točke izvajanja workflow iz zunanjih sistemov. V nasprotju z žetoni uporabniških sej so:

- **Omejeni na en workflow** — žeton je zavrnjen za kateri koli drug workflow.
- **Neodvisno preklicni** — preklic žetona nima vpliva na sejo izdajatelja.
- **Kratkoročni ali dolgoročni** — izberite TTL od 60 sekund do 10 let.

Žetoni so podpisani z istim skrivnim ključem aplikacije (`SECRET_KEY`) in se preverjajo ob vsakem zahtevku: podpis, potek, ujemanje trditve `wid` in status preklica. Oglejte si [Žetoni za izvajanje](./execution-tokens.md) za nastavitev in referenco API.

## Varnost vsebine

Uporabite [Guardrails](./guardrails.md) na LLM in Agent vozliščih, da blokirate nevarna ali politiko kršeča uporabniška sporočila, preden dosežejo model. Guardrails podpirajo devet kategorij vsebine (nasilje, sovražni govor, seksualna vsebina itd.) z nastavljivimi ravnmi občutljivosti.

## Peskovnik za Python orodja

Uporabniško definirana Python orodja na [Agent vozlišču](../nodes/agent-node.md) izvajajo nezanesljivo kodo. Privzeto Heym izvaja vsako orodje znotraj utrjenega, enkratnega Docker kontejnerja z:

- brez dostopa do omrežja,
- samo za branje datotečnim sistemom z majhnim delovnim imenikom `tmpfs`,
- uporabnikom, ki ni root, z vsemi Linux zmogljivostmi, ki so bile odstranjene, in `no-new-privileges`,
- strogimi omejitvami CPU, pomnilnika in PID, ter
- **brez Docker vtičnice** pritrjene, tako da orodje ne more doseči gostitelja Docker demona.

Zadnji del izvajanja nadzira okoljska spremenljivka `HEYM_PYTHON_TOOL_SANDBOX`:

| Vrednost | Obnašanje |
|----------|-----------|
| `auto` (privzeto) | Izvajanje v utrjenem Docker kontejnerju. Če Docker ni na voljo, izvajanje **ne uspe** — ne izvaja tiho nezanesljive kode brez izolacije OS. |
| `docker` | Enako kot `auto`, vendar nikoli ne pade nazaj. |
| `subprocess` | Izvajanje v lokalnem procesu, zaščitenem z dovoljenjem za uvoz. To **ni varnostna meja** in je namenjeno samo za zanesljivo kodo ali lokalni razvoj. `run.sh` ga izbere za lokalni razvoj. |

Nastavite `HEYM_PYTHON_TOOL_IMAGE`, da določite sliko peskovnika; ko je prazna, Heym samodejno zazna trenutno sliko zadnjega dela. Omejitve v procesu (dovoljenje za uvoz plus filtriranje atributov in introspekcije) se uporabljajo kot dodatna zaščita, vendar je kontejner prava izolacijska meja — obdržite privzeti način `auto` (ali `docker`) za večuporabniške in produkcijske namestitve.
## Peskovnik veščin

Python veščine, povezane z [Agent vozliščem](../nodes/agent-node.md), prav tako izvajajo nezanesljivo kodo — veščina lahko prispe v izvirni obliki znotraj skupnega workflow-a ali predloge z vidnostjo `everyone` — zato se veščine izvajajo skozi **isti** preklop `HEYM_PYTHON_TOOL_SANDBOX` kot Python orodja in se ob neuspehu zaprejo na enak način. Kontejner za veščine je enako zaščiten (ne-root, vse zmožnosti odstranjene, `no-new-privileges`, samo za branje dostopna korenska datotečna sistem, omejitve CPU/memory/PID in **brez Docker vtičnika**), z dvema namernima razlikama, ker veščine to resnično potrebujejo:

- **Dovoli se izhod v omrežje** (veščine kličejo API-je in nameščajo svoje odvisnosti preko `uv`), in
- **priključen je pisarniški prostor** tako, da lahko veščine generirajo izhodne datoteke in berejo datoteke iz Heym Drive.

Pisarniški prostor je deljen z zavržnim bratskim kontejnerjem preko istega poimenovanega Docker volumna, ki ga uporablja Codex izvajalec (`heym-codex-workspaces`, priključen na `/app/data/codex-workspaces`). V montažo je vključen samo poddirektorij te izvedbe — preko `volume-subpath` za vsako izvedbo — tako, da ena veščina nikoli ne vidi podatkov druge izvedbe ali Codex-a. Docker Compose sklad vedno priključi ta volumen; enokontejnerski `docker run` mora vključevati `-v heym-codex-workspaces:/app/data/codex-workspaces` za Python veščine in Codex. Če je volumen odsoten v `auto`/`docker` načinu, se izvajanje veščin **zapre** namesto da bi se izvajalo v ozadju. Ker montaže poddirektorije za vsako izvedbo zahtevajo **Docker Engine 25.0 ali novejši**, starejši motorji naj nadgradijo ali izvajajo zaupanja vredne veščine z `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

V kontejner se posredujejo samo ne-tajni, prenosljivi okoljski spremenljivki (nastavitve proxy in CA-bundle, lokalizacija); URL-ji baz podatkov, `SECRET_KEY`/`ENCRYPTION_KEY`, ključi API ponudnikov in OAuth skrivnosti so zadržani z dovoljenjem. Pot do datotek veščin se preverja, da ostanejo znotraj pisarniškega prostora, in simbolne povezave, nameščene v izhodni imenik (vključno s sentinelom `_hitl_request.json`), nikoli niso sledene. Privzete nastavitve lahko prepišete z `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` in `HEYM_SKILL_USER`, če je potrebno.

Kot pri orodjih, `subprocess` način izvaja veščino v ozadju in **ni varnostna meja** — uporabite ga samo za zaupanja vredne enok uporabniške ali lokalne razvojne naloge (`run.sh` ga izbere za naravni razvoj).

## Peskovnik Code vozlišča

[Code vozlišče](../nodes/code-node.md) izvaja poljubno uporabniško Python kodo skupaj s poljubnimi odvisnostmi tretjih oseb, zato je to najstrožji od treh peskovnikov in edini brez **izhodne odprtine**: ne bere nobene spremenljivke načina peskovnika, nima `subprocess` načina in se zapre, ko Docker demon ni dosegljiv. Nikoli ne preklopi na izvajanje uporabniške kode v ozadju.

Izvedba poteka v enem ali dveh zavržnih kontejnerjih, oba zaščitena kot orodja in peskovniki veščin (ne-root, vse zmožnosti odstranjene, `no-new-privileges`, samo za branje dostopna korenska datotečna sistem, omejitve CPU/memory/PID in **brez Docker vtičnika**):

- Z praznim `requirements.txt` se **izvaja en sam kontejner z `--network none`**. Izvajalec prispe v stdin payload kontejnerja, tako da ni ničesar priključenega.
- Z odvisnostmi prvi kontejner namesti te odvisnosti z dostopom do omrežja v per-run `.deps` imenik, drugi kontejner pa priključi to poddrevo **samo za branje** in izvaja kodo. Izvedbeni kontejner nima dostopa do omrežja, razen če je možnost `codeAllowNetwork` vozlišča omogočena.

Odvisnosti se namestijo z `uv`, ponovijo z `pip` in nikoli se ne predpomnijo med izvedbami. Ko se ozadje izvaja v kontejnerju, živi per-run imenik na istem `heym-codex-workspaces` volumnu, ki ga uporablja peskovnik veščin, priključen preko `volume-subpath` za vsako izvedbo, tako da ena izvedba nikoli ne vidi datotek druge; ta oblika zahteva **Docker Engine 25.0 ali novejši**. Naravno ozadje (`./run.sh`) nima takega volumna in ga ne potrebuje — njegov per-run imenik je lokalna začasna pot, ki je neposredno vezana na brata. V obeh primerih se imenik izbriše po vsaki izvedbi ne glede na izid.

V kontejnerje se posredujejo samo ne-tajni, prenosljivi okoljski spremenljivki — nastavitve proxy, CA paketi in lokalizacija, ki jih namestitev odvisnosti potrebuje za dostop do PyPI za korporativnim proxyjem. URL-ji baz podatkov, `SECRET_KEY`/`ENCRYPTION_KEY`, ključi API ponudnikov in OAuth skrivnosti so zadržani z dovoljenjem, tako da se nova skrivnost ozadja privzeto ne razkrije, dokler nekdo ne posodobi seznama prepovedi. `HOME` ozadja nikoli ne prepiše lastne pisarniške poti.

Gumb **Format** uporablja isti peskovnik. Ruff analizira in prepisuje izvor, namesto da bi ga izvajal, vendar bi njegovo izvajanje na gostitelju dalo nezanesljivi datoteki proces, ki podeduje celotno okolje ozadja, zato dobi svoj zavržni kontejner z `--network none` z istimi omejitvami in enakim dovoljenim okoljem. Zapre se, če Docker ni na voljo, namesto da bi formatiral na gostitelju.

Omejitve peskovnika so konstante in ne okoljske spremenljivke — 512 MB pomnilnika, en CPU, 256 procesov, 120-sekundni časovni omejitev namestitve in 60-sekundni časovni omejitev izvajanja. Slika se reši iz obstoječe verige `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; vozlišče ne uvaja nobene svoje konfiguracije.
## Sorodno

- [Zagon in namestitev](../getting-started/running-and-deployment.md) – Konfigurirajte `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` in `HEYM_PYTHON_TOOL_SANDBOX` ob zagonu
- [Koda vozlišče](../nodes/code-node.md) – Izvajanje Python kode v peskovniku z lastnimi odvisnostmi
- [Agentsko vozlišče](../nodes/agent-node.md) – Prilagojena Python orodja, ki delujejo v peskovniku
- [Izvršitveni tokeni](./execution-tokens.md) – Območeni JWT-ji za klicanje workflows iz zunanjih sistemov
- [Varovala](./guardrails.md) – Blokiranje nevarne vsebine v LLM in Agentskih vozliščih
- [Nastavitve](./user-settings.md) – Spremenite svoje geslo
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Upravljanje API ključev
- [Zavihek MCP](../tabs/mcp-tab.md) – MCP API ključ in OAuth odjemalci
- [Portal](./portal.md) – Nadzor dostopa do javnega klepetalnega portala
