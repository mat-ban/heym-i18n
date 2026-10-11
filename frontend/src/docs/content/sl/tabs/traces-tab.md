# Zavihek Zgodovina

Zavihek **Zgodovina** prikazuje sledi izvajanja LLM. Preverite zahteve/odgovore, časovne podatke, klice orodij in razrešite obnašanje [Agenta](../nodes/agent-node.md) in [LLM](../reference/node-types.md) vozlišč, poleg tega pa tudi agregatne metrike (klici, tokeni, stroški, latenca, stopnja napak) v katerem koli časovnem okviru.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Oglejte si predstavitev Zgodovine</a></p>

## Glava Statistika

Stran se odpre s povzetkom statistik nad seznamom sledi, izračunanih v izbranem časovnem obdobju in drugih aktivnih filtrih:

- **KPI kartice** – Skupaj klici, Skupaj tokeni, Skupni stroški (USD), Povprečna latenca, Stopnja napak %
- **Tokeni po modelu** – Donut grafikon obsega tokenov po modelu
- **Stroški po modelu** – Donut grafikon stroškov v USD po modelu. Modeli brez cenovne politike prikazujejo povezavo "Nastavi ceno" do [Tabele stroškov LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Klici skozi čas** – Složen grafikon uspešnih proti neuspešnim klicem po skupinah (5 min / 1 h / 6 h / 1 dan, izbrano samodejno glede na obseg)
- **Obvestilo o modelih brez cen** – Pojavi se pod grafikoni, ko nekateri sledi modeli nimajo cenovne vrstice, povezane s Tabelo stroškov LLM

## Časovno Obdobje

En sam **Izbira časovnega obdobja** na vrhu traku filtrov upravlja tako glavo statistik kot seznam sledi. Možnosti: Zadnja 1 ura, Zadnjih 24 ur, Zadnjih 7 dni (privzeto), Zadnjih 30 dni, Vse čase. Spreminjanje obsega ponastavi paginacijo in ponovno naloži grafikone ter seznam skupaj.

## Seznam Sledi

- Paginiran seznam nedavnih sledi znotraj izbranega časovnega obdobja
- Vsaka sled prikazuje: workflow, vozlišče, poverilnico, časovni žig, trajanje
- Kliknite na sled, da odprete podrobnosti
- Uporabite **Prejšnji / Naslednji** znotraj pogovornega okna podrobnosti za premikanje med sledmi brez zapiranja

## Filtriranje

- **Časovno obdobje** – 1h / 24h / 7d / 30d / Vse; filtrira grafikone in seznam skupaj
- **Poverilnica** – Filtrirajte po poverilnici (API ključ), ki je bila uporabljena
- **Vir** – Filtrirajte po viru workflow ali izvajanja
- **Iskanje** – Iščite po modelu, workflow, poverilnici ali oznaki vozlišča
- **Osveži** – Ponovno naloži trenutno stran sledi

## Podrobnosti Sledi

Ko odprete sled:

- **Koraki** – Časovnica od zgoraj navzdol, ki bere sled kot urejeno verigo: Sistem → Uporabnik → Pomočnik → Orodje → Odgovor. Vsak korak je zložen; razširitev enega prikaže berljive podrobnosti (besedilo sporočila ali argumente in rezultat orodja), ki jih sledi JSON tega koraka. JSON vsebina v vsakem tipu dogodka—vključno z MCP klici in JSON-RPC payloadi—se privzeto odpre v razširljivem drevesu, pri čemer je prvi nivo razširjen. Uporabite **Drevo / Surovo** za preklapljanje med oblikovano strukturo in izvirnim besedilom. Nepravilno oblikovan JSON ostane viden kot navadno besedilo. Koraki orodij prikazujejo njihovo trajanje in oznako MCP/Skill, kjer je to primerno, poleg oznak za čakajoče / časovno omejene / preklicane, ko je status klica orodja nastavljen. Korak Odgovor lahko prikaže agregatne oznake `tool_metrics` (število klicev po statusu in skupna trajanja orodja). Ko sled beleži vsak klic modela, kot sporočilo v Dashboard Chat in usmerjen agent, korak **LLM** sedi pred orodji, ki jih kličete, in **Razčlenitev trajanja** razporedi vsak klic modela, orodje in odločitev o usmerjanju na eno časovnico. Sporočilo v Dashboard Chat je ena sama sled, ne glede na to, koliko klicev orodij je bilo potrebnih. Sledi brez verige sporočil (na primer generiranje slik) prikazujejo minimalno časovnico Zahteva → Odgovor.
- **Zahteva** – Celoten payload zahteve, poslan LLM, z **Drevo / Surovo** JSON pogledi
- **Odgovor** – Odgovor modela, vključno s klici orodij, če obstajajo, z **Drevo / Surovo** JSON pogledi
- **Metrike orodij** – Ko so prisotne v odgovoru, kompakten povzetek števila klicev orodij (`success` / `error` / `pending` / `timeout` / `cancelled`) in skupno trajanje orodij
- **Razčlenitev časa** – `llm_ms`, `tools_ms`, `mcp_list_ms` za analizo zmogljivosti
- **Klici orodij** – Ime orodja, argumenti, rezultat, status in pretečen čas
- **Vključene veščine** – Veščine, poslane modelu v zahtevi
- **Pojdi na Workflow** – Takoj skočite na povezani workflow iz pogovornega okna podrobnosti sledi

## Kopiranje in Izvoz

- Kopirajte JSON zahteve ali odgovora v odložišče; kopiranje vedno uporablja celoten surov payload ne glede na aktivni pogled
- Uporabite za odpravljanje napak ali deljenje s podporo

## Vzdrževanje

- **Počisti vse** – Izbrišite vse shranjene sledi po potrditvi
- Kontrole paginacije prikazujejo trenutno vidno območje (na primer `1-25 od 240`)

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Opazovanje LLM skozi življenjski cikel agenta
- [Agent Node](../nodes/agent-node.md) – Vozlišče agenta s klicem orodij
- [Vrste vozlišč](../reference/node-types.md) – LLM in Agent vozlišča
- [Zavihek Poverilnice](./credentials-tab.md) – Poverilnice, uporabljene v sledeh
- [OpenTelemetry Sledenje](../reference/opentelemetry.md) – Opt-in OTel izvoz za workflow, vozlišče in razpone orodij Agenta
- [Zavihek DataTable](./datatable-tab.md) – Gosti Tabelo stroškov LLM, uporabljeno v grafu stroškov
- [Kontekstualna Predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po straneh nadzorne plošče
