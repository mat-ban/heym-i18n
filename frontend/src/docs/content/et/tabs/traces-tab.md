# Käivituste vahekaart

**Käivituste** vahekaart kuvab LLM-i käivituste jälgi. Saate uurida päringu/vastuse payload'isid, ajastust, tööriistakutseid ja siluda [Agendi](../nodes/agent-node.md) ja [LLM-i](../reference/node-types.md) sõlmede käitumist, samuti koondnäitajaid (kutsed, tokenid, kulu, latentsus, veamäär) mis tahes ajavahemikus.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Vaadake käivituste demot</a></p>

## Statistika päis

Leht avaneb statistika kokkuvõttega käivituste loendi kohal, mis arvutatakse valitud ajavahemiku ja muude aktiivsete filtrite põhjal:

- **KPI-kaardid** – Kutsed kokku, tokenid kokku, kulu kokku (USD), keskmine latentsus, vigade %
- **Tokenid mudeli kaupa** – Sõõrikdiagramm tokenite mahust mudeli kohta
- **Kulu mudeli kaupa** – Sõõrikdiagramm USD-kulust mudeli kohta. Mudelid, millel puudub hinnastus, kuvavad lingi "Konfigureeri hinnastus" [LLM-i kulutabelisse](./datatable-tab.md#llm-cost-table-system-table)
- **Kutsed ajas** – Virnastatud pinddiagramm õnnestunud ja ebaõnnestunud kutsetest vahemiku kohta (5 min / 1 h / 6 h / 1 päev, valitakse automaatselt vastavalt vahemikule)
- **Hinnastamata mudelite teade** – Kuvatakse diagrammide all, kui mõnel jälgitud mudelil puudub hinnarida, viidates LLM-i kulutabelile

## Ajavahemik

Üks **Ajavahemiku** valija filtririba ülaosas juhib nii statistika päist kui ka käivituste loendit. Valikud: Viimane 1 tund, Viimased 24 tundi, Viimased 7 päeva (vaikimisi), Viimased 30 päeva, Kogu aeg. Vahemiku muutmine lähtestab lehekülgede jaotuse ning laadib diagrammid ja loendi koos uuesti.

## Käivituste loend

- Lehekülgedeks jaotatud loend viimastest käivitustest valitud ajavahemikus
- Iga käivitus kuvab: workflow, sõlm, mandaat, ajatempel, kestus
- Klõpsake käivitusel, et avada üksikasjavaade
- Kasutage üksikasjade dialoogis **Eelmine / Järgmine**, et liikuda käivituste vahel ilma seda sulgemata

## Filtreerimine

- **Ajavahemik** – 1h / 24h / 7d / 30d / Kõik; filtreerib diagramme ja loendit koos
- **Mandaat** – Filtreerige kasutatud mandaadi (API-võti) järgi
- **Allikas** – Filtreerige workflow või käivituse allika järgi
- **Otsing** – Otsige mudeli, workflow, mandaadi või sõlme sildi järgi
- **Värskenda** – Laadige käivituste praegune leht uuesti

## Käivituse üksikasjad

Kui avate käivituse:

- **Sammud** – Ülalt alla ajatelg, mis loeb käivitust järjestatud ahelana: Süsteem → Kasutaja → Assistent → Tööriist → Vastus. Iga samm on kokkupandav; ühe laiendamisel kuvatakse loetav üksikasjavaade (sõnumi tekst või tööriista argumendid ja tulemus), millele järgneb selle sammu JSON. JSON-sisu igas sündmuse tüübis – sealhulgas MCP-kutsed ja JSON-RPC payload'id – avaneb vaikimisi laiendatavas puus, kus esimene tase on laiendatud. Kasutage **Puu / Toor**, et lülituda vormindatud struktuuri ja algse teksti vahel. Vigane JSON jääb nähtavale lihttekstina. Tööriista sammud kuvavad oma kestust ja vajaduse korral MCP/Skill märgist, samuti ootel / aegunud / tühistatud märgiseid, kui tööriistakutse olek on määratud. Vastuse samm võib kuvada koondavaid `tool_metrics` märgiseid (kutsete arv oleku järgi ja tööriista kogukestus). Kui käivitus salvestab iga mudelikutse, nagu teeb Dashboard Chat sõnum ja suunatud agent, asub **LLM** samm enne tööriistu, mida kutse taotles, ja **Kestuse jaotus** paigutab iga mudelikutse, tööriista ja suunamisotsuse ühele ajateljele. Dashboard Chat sõnum on üks käivitus, olenemata sellest, mitu tööriistavooru see nõudis. Käivitused ilma sõnumiahelata (näiteks pildigeneratsioon) kuvavad minimaalse Päring → Vastus ajatelje.
- **Päring** – Täielik LLM-ile saadetud päringu payload, **Puu / Toor** JSON-vaadetega
- **Vastus** – Mudeli vastus, sealhulgas tööriistakutsed, kui neid on, **Puu / Toor** JSON-vaadetega
- **Tööriista mõõdikud** – Kui vastuses olemas, kompaktne kokkuvõte tööriistakutsete arvudest (`success` / `error` / `pending` / `timeout` / `cancelled`) ja tööriista kogukestusest
- **Ajastuse jaotus** – `llm_ms`, `tools_ms`, `mcp_list_ms` jõudluse analüüsiks
- **Tööriistakutsed** – Tööriista nimi, argumendid, tulemus, olek ja kulunud aeg
- **Kaasatud oskused** – Oskused, mis edastati mudelile päringus
- **Mine workflow'sse** – Hüpake otse seotud workflow'sse käivituse üksikasjade dialoogist

## Kopeerimine ja eksport

- Kopeerige päringu või vastuse JSON lõikelauale; kopeerimine kasutab alati täielikku toorpayload'i, olenemata aktiivsest vaatest
- Kasutage silumiseks või jagamiseks toega

## Hooldus

- **Kustuta kõik** – Kustutage kõik salvestatud käivitused pärast kinnitust
- Lehekülgede jaotuse juhtelemendid kuvavad praegust nähtavat vahemikku (näiteks `1-25 of 240`)

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – LLM-i jälgitavus agendi elutsükli jooksul
- [Agendi sõlm](../nodes/agent-node.md) – Agendi sõlm tööriistakutsetega
- [Sõlmede tüübid](../reference/node-types.md) – LLM-i ja Agendi sõlmed
- [Mandaatide vahekaart](./credentials-tab.md) – Käivitustes kasutatud mandaadid
- [OpenTelemetry jälgimine](../reference/opentelemetry.md) – Valikuline OTel-eksport workflow, sõlme ja Agendi tööriista span'ide jaoks
- [Andmetabeli vahekaart](./datatable-tab.md) – Majutab LLM-i kulutabelit, mida kuludiagramm kasutab
- [Kontekstuaalne showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend armatuurlaua vaadete jaoks
