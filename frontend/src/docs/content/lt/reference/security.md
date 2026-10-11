# Saugumas

Saugumo praktikos ir konfigūracija Heym platformai.

## Slaptažodžių politika

Visi slaptažodžiai — registracijos metu ir keičiant slaptažodį — turi atitikti šiuos reikalavimus:

| Taisyklė | Reikalavimas |
|----------|--------------|
| Minimalus ilgis | 8 simboliai |
| Didžioji raidė | Bent viena didžioji raidė (A–Z) |
| Mažoji raidė | Bent viena mažoji raidė (a–z) |
| Skaičius | Bent vienas skaičius (0–9) |

Šios taisyklės taikomos tiek priekinėje, tiek galinėje pusėje (Pydantic validator). Užklausa su nesuderinamu slaptažodžiu atmetama su `422 Unprocessable Entity` atsaku prieš atliekant bet kokį duomenų bazės įrašymą.

**Galimo slaptažodžio pavyzdys:** `MyWorkflow7!`

## Sesijų valdymas

- Prieigos žetonai saugomi **HttpOnly** slapukuose, o ne `localStorage`. Tai neleidžia JavaScript (įskaitant XSS payloads) skaityti žetono.
- Atkūrimo žetonas yra ribotas `/api/auth/refresh` kelyje ir negali būti siunčiamas į kitus endpointus.
- Kiekvienas `/api/auth/refresh` skambutis **sukasi** atkūrimo žetoną: senas žetonas nedelsiant atšaukiamas, o naujas išduodamas. Naudojant jau panaudotą atkūrimo žetoną grąžinamas `401`.

## Greičio ribojimas

Šie endpointai yra ribojami pagal IP:

| Endpointas | Ribojimas | Baudos trukmė |
|------------|-----------|----------------|
| `POST /api/auth/login` | 10 užklausų / 60 s | 15 min |
| `POST /api/auth/register` | 5 užklausos / 60 s | 10 min |
| `POST /register` (OAuth klientai) | 5 užklausos / 60 s | 10 min |
| Portalo prisijungimas | 3 bandymai | 24 h |

Kai `REDIS_URL` yra sukonfigūruotas, greičio ribojimai dalijami tarp visų galinių darbuotojų. Be jo, ribojimai taikomi kiekvienam darbuotojo procesui.

## Kredencialų šifravimas

Visi API raktai, webhook URL ir bearer žetonai, saugomi [Kredencialų](../tabs/credentials-tab.md) skydelyje, yra šifruojami ramybėje naudojant AES-256 (Fernet) prieš juos įrašant į duomenų bazę. Raktas gaunamas iš `ENCRYPTION_KEY` aplinkos kintamojo. `run.sh` ir `deploy.sh` skriptai automatiškai sugeneruoja stiprų vertę, kai ji yra tuščia; programa atsisako startuoti, jei `ENCRYPTION_KEY` yra tuščias arba paliktas žinomam rezerviniam raktui.

## MCP API raktas

MCP API raktas naudojamas autentifikuoti išorinius MCP klientus, jungiančius prie `/api/mcp/sse` endpointo. Kai SSE ryšys yra užmegztas, išduodamas trumpalaikis (1 valandos) sesijos žetonas, kuris įterpiamas į pranešimo endpointo URL vietoj tikro API rakto, taip užkertant kelią rakto pasirodymui serverio prieigos žurnaluose. Daugiau informacijos žr. [MCP Tab](../tabs/mcp-tab.md).

## OAuth / PKCE

OAuth 2.0 autorizacijos serveris (naudojamas MCP klientams) palaiko tik `authorization_code` grant su PKCE (`S256`). Sutikimo forma naudoja HMAC-SHA256 CSRF žetonus, galiojančius 10 minučių. Visi sutikimo puslapyje rodomi vertės yra HTML-escape'inami.

## Vykdymo žetonai

[Vykdymo žetonai](./execution-tokens.md) yra riboti JWT, skirti kvietimui į workflow vykdymo endpointą iš išorinių sistemų. Skirtingai nuo vartotojo sesijos žetonų, jie yra:

- **Vieno workflow riboti** — žetonas atmetamas bet kuriam kitam workflow.
- **Nepriklausomai atšaukiami** — žetono atšaukimas neturi įtakos išduoto vartotojo sesijai.
- **Trumpalaikiai arba ilgalaikiai** — pasirinkite TTL nuo 60 sekundžių iki 10 metų.

Žetonai yra pasirašomi su ta pačia programos paslaptimi (`SECRET_KEY`) ir tikrinami kiekvienoje užklausoje: parašas, galiojimo laikas, `wid` teiginio atitikimas ir atšaukimo būsena. Daugiau informacijos žr. [Vykdymo žetonai](./execution-tokens.md) dėl konfigūracijos ir API nuorodų.

## Turinys saugumas

Naudokite [Guardrails](./guardrails.md) LLM ir Agent mazguose, kad blokuotumėte nesaugias ar politiką pažeidžiančias vartotojo žinutes prieš joms pasiekiant modelį. Guardrails palaiko devynias turinio kategorijas (smurtas, neapykantos kalba, seksualinis turinys ir kt.) su konfigūruojamais jautrumo lygiais.

## Python įrankių smėlio dėžė

Vartotojo apibrėžti Python įrankiai [Agent mazge](../nodes/agent-node.md) vykdo nepatikimą kodą. Pagal numatytuosius nustatymus Heym kiekvieną įrankį vykdo sustiprinto, laikino Docker konteineryje su:

- be tinklo prieigos,
- tik skaitymo režimo šakninė failų sistema su mažu `tmpfs` darbo katalogu,
- ne root vartotoju, kuriam atšauktos visos Linux galimybės ir `no-new-privileges`,
- griežtais CPU, atminties ir PID ribojimais, ir
- **be Docker socket** prijungto, todėl įrankis negali pasiekti host Docker demoną.

Vykdymo galinė dalis kontroliuojama `HEYM_PYTHON_TOOL_SANDBOX` aplinkos kintamuoju:

| Vertė | Elgesys |
|-------|---------|
| `auto` (numatytasis) | Vykdyti sustiprintame Docker konteineryje. Jei Docker nėra prieinamas, vykdymas **nepavyksta** — jis nesileidžia tyliai vykdyti nepatikimo kodo be OS izoliacijos. |
| `docker` | Tas pats kaip `auto`, bet niekada negrįžta atgal. |
| `subprocess` | Vykdyti vietiniame proceso subprocess'e, saugomame importo leidimų sąrašu. Tai **nėra saugumo riba** ir skirta tik patikimam kodui arba vietiniam vystymuisi. `run.sh` pasirenka jį natūraliai vystymuisi. |

Nustatykite `HEYM_PYTHON_TOOL_IMAGE`, kad fiksuotumėte smėlio dėžės vaizdą; kai jis tuščias, Heym automatiškai nustato vykdomo galinio vaizdo versiją. Vidinės proceso ribos (importo leidimų sąrašas plius atributų ir introspekcijos filtravimas) taikomos kaip gynyba gylio, tačiau konteineris yra tikroji izoliacijos riba — laikykite numatytąjį `auto` (arba `docker`) režimą daugiausiai vartotojų ir gamybos diegimams.
## Įgūdžių smėlio dėžė

Python įgūdžiai, prijungti prie [Agent mazgo](../nodes/agent-node.md), taip pat vykdo nepatikimą kodą — įgūdis gali atvykti verbatim formatu bendrame workflow arba `everyone` matomumo šablone — todėl įgūdžiai vykdomi per **tą patį** `HEYM_PYTHON_TOOL_SANDBOX` jungiklį kaip Python įrankiai ir užsidaro tokiu pačiu būdu. Įgūdžių konteineris yra sustiprintas identiškai (ne root, visos galimybės atšauktos, `no-new-privileges`, tik skaitymo režimu veikianti šakninė failų sistema, CPU/memory/PID limitai ir **jokio Docker socket**), su dviem tyčiniais skirtumais, nes įgūdžiai teisėtai jų reikia:

- **Leidžiamas tinklo išėjimas** (įgūdžiai kviečia API ir įdiegia savo priklausomybes per `uv`), ir
- **rašomas darbo aplinkos katalogas** yra prijungtas, kad įgūdžiai galėtų generuoti išvesties failus ir skaityti Heym Drive failus.

Darbo aplinka dalijamasi su laikinu seseriniu konteineriu per tą patį pavadintą Docker tūrį, kurį naudoja Codex vykdytojas (`heym-codex-workspaces`, prijungtas prie `/app/data/codex-workspaces`). Tik šio vykdymo subkatalogas yra prijungtas prie seserinio — per kiekvieno vykdymo `volume-subpath` — todėl vienas įgūdis niekada nemato kito vykdymo ar Codex darbo aplinkos duomenų. Docker Compose krūva visada prijungia šį tūrį; vieno konteinerio `docker run` turi apimti `-v heym-codex-workspaces:/app/data/codex-workspaces` Python įgūdžiams, taip pat Codex. Jei tūris trūksta `auto`/`docker` režimu, įgūdžio vykdymas **užsidaro** vietoj to, kad veiktų fone. Kadangi kiekvieno vykdymo subpath prijungimai reikalauja **Docker Engine 25.0 ar naujesnės** versijos, senesni varikliai turėtų arba atnaujinti, arba vykdyti patikimus įgūdžius su `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Į konteinerį perduodamos tik nepaslaptinės, nešiojamos aplinkos kintamosios (proxy ir CA-bundle nustatymai, locale); duomenų bazės URL, `SECRET_KEY`/`ENCRYPTION_KEY`, tiekėjo API raktai ir OAuth paslaptys yra sulaikomos pagal leidimų sąrašą. Įgūdžių failų keliai yra tikrinami, kad liktų darbo aplinkoje, o simboliniai nuorodos, pasodintos išvesties kataloge (įskaitant `_hitl_request.json` sentinel), niekada nėra sekamos. Jei reikia, perrašykite numatytuosius nustatymus su `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` ir `HEYM_SKILL_USER`.

Kaip ir su įrankiais, `subprocess` režimas vykdo įgūdį fono procese ir **nėra saugumo riba** — naudokite jį tik patikimiems vieno vartotojo arba vietiniam vystymuisi (`run.sh` jį pasirenka natūraliam vystymuisi).

## Kodo mazgo smėlio dėžė

[Code mazgas](../nodes/code-node.md) vykdo savavališką vartotojo Python kartu su savavališkomis trečiųjų šalių priklausomybėmis, todėl tai yra griežčiausia iš trijų smėlio dėžių ir vienintelė, turinti **jokio pabėgimo** galimybės: ji neskaito jokios smėlio dėžės režimo kintamosios, neturi `subprocess` režimo ir užsidaro, kai nėra pasiekiamas Docker demonas. Ji niekada negrįžta prie vartotojo kodo vykdymo fono procese.

Vykdymas vykdomas viename arba dviejuose laikinuose konteineriuose, abu sustiprinti kaip įrankių ir įgūdžių smėlio dėžės (ne root, visos galimybės atšauktos, `no-new-privileges`, tik skaitymo režimu veikianti šakninė failų sistema, CPU/memory/PID limitai ir **jokio Docker socket**):

- Su tuščiu `requirements.txt`, **vienas konteineris su `--network none`** vykdo kodą. Vykdytojas atkeliauja į konteinerio stdin payload, todėl niekas nėra prijungta.
- Su priklausomybėmis, pirmasis konteineris jas įdiegia su tinklo prieiga į kiekvieno vykdymo `.deps` katalogą, o antrasis konteineris prijungia tą medį **tik skaitymo režimu** ir vykdo kodą. Vykdymo konteineris neturi tinklo, nebent mazgo `codeAllowNetwork` parinktis yra įjungta.

Priklausomybės yra diegiamos per `uv`, bandant su `pip`, ir niekada nėra talpinamos tarp vykdymų. Kai fone veikia konteineris, kiekvieno vykdymo katalogas gyvena tame pačiame `heym-codex-workspaces` tūryje, kurį naudoja įgūdžių smėlio dėžė, prijungtas per kiekvieno vykdymo `volume-subpath`, todėl vienas vykdymas niekada nemato kito failų; ši forma reikalauja **Docker Engine 25.0 ar naujesnės** versijos. Natūralus fono vykdytojas (`./run.sh`) neturi tokio tūrio ir jo nereikia — jo kiekvieno vykdymo katalogas yra vietinė laikina kelio nuoroda, tiesiogiai prijungta prie seserinio. Bet kuriuo atveju katalogas yra ištrinamas po kiekvieno vykdymo, nepriklausomai nuo rezultato.

Į konteinerius perduodamos tik nepaslaptinės, nešiojamos aplinkos kintamosios — proxy nustatymai, CA paketai ir locale, kurių reikia priklausomybių diegimui, kad būtų pasiektas PyPI už korporatyvinio proxy. Duomenų bazės URL, `SECRET_KEY`/`ENCRYPTION_KEY`, tiekėjo API raktai ir OAuth paslaptys yra sulaikomos pagal leidimų sąrašą, todėl naujas fono paslaptis yra numatytas kaip sulaikytas, o ne nutekintas, kol kas nors atnaujina draudimo sąrašą. Fono `HOME` niekada nepakeičia smėlio dėžės savo rašomo kelio.

**Formatavimo** mygtukas naudoja tą pačią smėlio dėžę. Ruff analizuoja ir perrašo šaltinį, o ne vykdo jo, tačiau jo vykdymas fono kompiuteryje suteiktų nepatikimam failui procesą, kuris paveldėtų visą fono aplinką, todėl jis gauna savo laikinas `--network none` konteinerį su tais pačiais ribojimais ir tuo pačiu leidimų sąrašu. Jis užsidaro be Docker, o ne formatuoja kompiuteryje.

Smėlio dėžės ribos yra konstantos, o ne aplinkos kintamosios — 512 MB atminties, vienas CPU, 256 procesų, 120 sekundžių diegimo laiko limitas ir 60 sekundžių vykdymo laiko limitas. Vaizdas yra išsprendžiamas iš esamo `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` grandinės; mazgas neįveda jokios savo konfigūracijos.
## Susiję

- [Vykdymas ir diegimas](../getting-started/running-and-deployment.md) – Sukonfigūruokite `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` ir `HEYM_PYTHON_TOOL_SANDBOX` paleidimo metu
- [Kodo mazgas](../nodes/code-node.md) – Sandboxed Python vykdymas su savo priklausomybėmis
- [Agentų mazgas](../nodes/agent-node.md) – Pasirinktiniai Python įrankiai, kurie veikia sandbox aplinkoje
- [Vykdymo tokenai](./execution-tokens.md) – Apriboti JWT, skirti Workflow iškvietimui iš išorinių sistemų
- [Apsaugos priemonės](./guardrails.md) – Blokuoti nesaugų turinį LLM ir Agentų mazguose
- [Nustatymai](./user-settings.md) – Pakeiskite savo slaptažodį
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Tvarkykite API raktus
- [MCP skirtukas](../tabs/mcp-tab.md) – MCP API raktas ir OAuth klientai
- [Portalas](./portal.md) – Viešo pokalbių portalo prieigos kontrolė
