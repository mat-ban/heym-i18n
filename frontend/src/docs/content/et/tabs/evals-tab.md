# Hindamiste vahekaart

**Hindamiste** vahekaart on eraldi leht aadressil `/evals`. See võimaldab luua hindamiskomplekte, määratleda testjuhtumeid ja käivitada hindamisi oma [Agendi](../nodes/agent-node.md) workflow'de vastu. [Agendikomplekt](#agent-suites) käivitab agendi või loeb selle tegelikke käitusi ning kontrollib selle kutsutud tööriistu, latentsust, kulu USD-s, tokeneid ja tööriistakutsete arvu.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Vaadake hindamiste demot</a></p>

## Juurdepääs

- Klõpsake armatuurlaua vahekaartide ribal **Hindamised**
- Või navigeerige aadressile `/evals`
- Või kasutage **Ctrl+K** (Cmd+K) ja valige käsukäsust "Hindamised"

## Hindamiskomplektid

- **Uus komplekt** – Valige **Promptikomplekt**, et testida süsteemiprompti mudelite lõikes, või **Agendikomplekt**, et kontrollida agendi tegelikke käitusi (vt [Agendikomplektid](#agent-suites))
- **Komplektivalija** – Kuvab prompti- ja agendikomplektid koos tüübiga iga nime kõrval; tippige otsimiseks
- **Loo komplekt** – Määratlege komplekt nime ja kirjeldusega
- **Valige workflow** – Valige, millist workflow'd hinnata
- **Valige mandaat** – API võti workflow' käivitamiseks
- **Süsteemi prompt** – Muutke komplekti tasandi süsteemi prompti otse vasakpoolses paneelis
- **Optimeeri prompt** – Paluge LLM-il praegust süsteemi prompti täiustada

## Testjuhtumid

- Lisage testjuhtumeid sisendpromptide ja oodatud väljunditega
- Igal juhtumil võib olla kohandatud oodatud väärtus võrdlemiseks
- Muutke või kustutage juhtumeid komplektist
- **Genereeri testandmed** – Kasutage valitud mandaati/mudelit, et automaatselt luua testjuhtumeid komplekti prompti põhjal

## Hindamiste käivitamine

- **Valige üks või mitu mudelit** – Käivitage sama komplekt mitme mudeli vastu ühes hindamises
- **Hindamismeetod** – Valige `Exact Match`, `Contains` või `LLM-as-Judge`
- **Kohtunik** – Valiku `LLM-as-Judge` puhul valige soovi korral OpenAI, OpenAI-ga ühilduv (Custom), Gemini (Google) või [Otsustusmudeli](../nodes/decision-node.md) mandaat ja sisestage kohtuniku mudel (näiteks `gpt-4o-mini` või `jev-latest`), et hinnata sõltumatu kohtunikuga
- **Käivitusi testi kohta** – Korrake iga testjuhtumit mitu korda ühes käivituses
- **Meeldejäetud sätted** – Komplekt avaneb oma uusima käituse sätetega: mandaat, mudelid, hindamismeetod ja kohtunik, temperatuur, arutluspingutus ning käitused testi kohta. Varasema käituse avamine laadib selle sätted, nii et **Käivita hindamised uuesti** kordab sama testi
- **Temperatuur** – Määrake mudeli temperatuur (`Exact Match` ja `Contains`)
- **Arutluspingutus** – Määrake arutluspingutus arutlevate mudelite jaoks, vahemikus Madal kuni Eriti kõrge ja Maks sarnaselt LLM ja Agent sõlmedega (`Exact Match` ja `Contains`)

### LLM-as-Judge

Kohtunikuga vastab iga mudel testi sisendile ainult komplekti promptiga, seejärel hindab kohtunik, kui täpselt vastus oodatud väljundiga kattub, skaalal 0 kuni 100:

- **Mudelkohtunik** (OpenAI, OpenAI-ga ühilduv või Gemini) loeb küsimust, oodatud väljundit ja vastust ning tagastab skoori koos üherealise põhjendusega. See töötab temperatuuril `0` või arutlusmudeli puhul `low` arutluspingutusel, nii et sama vastus saab sama hinnangu.
- **Otsustusmudeli kohtunik** hindab vastust viietasemelisel rubriigil, alates *Täiesti mööda* kuni *Täielikult kattub*. Skoor on sellel rubriigil tõenäosusega kaalutud positsioon, seega pärineb see mudeli arvutatud jaotusest, mitte mudeli kirjutatud numbrist.

Lahtri hõljutuskaart näitab kohtuniku põhjendust või otsustusmudeli puhul taset, skoori ja selle kindlust. Latentsus ja tokenid kirjeldavad testitavat mudelit; kohtuniku enda kutsed ilmuvad [Jälitustes](./traces-tab.md) allika **Hindamised** all. Kohtuniku valija jätab välja Model Router mandaadid, sest kohtunik peab olema üks kindel mudel. Testitavate mudelite mandaadiks võib olla [Model Router](../reference/credentials.md#model-router-auto-model): selle **Auto** mudel valib mudeli päringu kohta, täpselt nagu workflow's.

Ilma kohtunikuta vastab iga mudel ise ja hindab oma vastust ühes päringus.

Temperatuur ja arutluspingutus on selles režiimis peidetud ning käivitus kasutab fikseeritud seadeid: temperatuur `0.7` standardsete mudelite puhul ja `medium` arutluspingutus arutlusmudelite puhul (`low`, kui need hindavad oma vastuseid ise).

## Tulemused

- Vaadake iga testjuhtumi puhul, kas see läbis või ebaõnnestus
- Uurige tegelikke ja oodatud väljundeid
- Võrrelge mitme mudeli väljundeid kõrvuti, kui käivitus hõlmab mitut mudelit
- Vaadake varasemate hindamiste käivituste ajalugu; `LLM-as-Judge` käivitus näitab ajaloo loendis oma kohtuniku mudelit
- Avage tulemuste paneelilt ajaloolisi käivitusi ja uurige salvestatud prompti/sisendi/väljundi hetktõmmiseid
- Varasema käivituse avamine laadib selle hindamismeetodi ja kohtuniku vasakpoolsesse paneeli, nii et **Käivita hindamised uuesti** kordab sama hindamist
- **Ekspordi** laadib käivituse alla JSON-ina, sealhulgas `judge_credential_id` ja `judge_model`

## Agent Suites

Agendikomplekt kontrollib sõlme [Agent](../nodes/agent-node.md) selle käituste põhjal. See loeb need [Jälitustest](./traces-tab.md), kus iga käitus salvestab juba oma aja, tokenid, kulu ja tööriistakutsed, ning võib samuti teie eest workflow käivitada.

Looge see valikuga **Uus komplekt** → **Agendikomplekt** ja järgige kolme sammu:

1. **Agent** – Valige workflow ja seejärel selle agendisõlm. Loetletud on ainult agendisõlmega workflow'd; workflow või agent, mida pole veel käitatud, kuvatakse, kuid seda ei saa valida. Valitud agendi sätted (mudel, juhised, tööriistad ja piirangud) kuvatakse paremal ning all kuvatakse selle workflow kirjutuskaitstud lõuend esiletõstetud agendiga.
2. **Baseline** – Agendi viimased 10 käitust: latentsus p50 ja p95, kulu käituse kohta, tokenid käituse kohta ja tööriistakutsed käituse kohta, milliseid tööriistu kutsuti ja kui sageli, ning iga käituse enda numbrid. Veaga lõppenud käitused on loetletud, kuid baseline'ist välja jäetud.
3. **Kontrollid** – Märkige iga tööriist kui **Must call**, **Must not call** või **Either**. Iga kutseliik on loetletud koos oma tüübiga: Pythoni ja sõlmede tööriistad, **MCP** tööriistad koos oma serveriga, **alamagendid** sildi järgi, **alam-workflow'd** nime järgi ja **skills**. Lisage tööriist liigi ja nime järgi, kui see pole veel käitunud, ning eemaldage see nupuga **X**. Seadke ülempiirid latentsusele, kulule, kogutokenitele ja tööriistakutsetele; igaüks algab 20% üle baseline p95 taseme ja selle saab välja lülitada.

Salvestatud komplekt avaneb vaates **Tulemused**, mille kõrval on **Baseline** ja **Muuda kontrolle**:

- **Käivita workflow** – Valige käituste arv (kuni 20); neli käituvad korraga. Sisendid täidetakse workflow viimasest käitusest ja neid saab muuta, kusjuures iga käitus kasutab neid. Lülitage sisse **Genereeri sisendid** (sädemekujuline ikoon) ning seejärel valige mandaat ja mudel, et mudel koostaks iga käituse jaoks erineva sisendi. See loeb agendi süsteemijuhiseid ja püsib sisestatud väärtuste lähedal: linna nime sisestamisel luuakse teisi linnanimesid. Iga käitus sooritab kogu workflow nagu iga tavaline käitus ja kantakse Käituste ajalukku päästikuga `agent_suite`. Hilisemate sammude vahelejätmiseks, nagu meili saatmine, avage workflow paneelilt käsuga **Mine workflow'sse** ja keelake need sõlmed esmalt. **Peata** lõpetab komplekti käituse: uusi käitusi ei alustata ja pooleliolevad tühistatakse. Komplektikäitus, mille server seiskus, näiteks taaskäivituse ajal, kuvatakse minuti pärast katkestatuna, selle asemel et jääda kinni.
- **Tulemused** – Vaikimisi hinnatakse viimast komplekti käitust. Iga komplekti käitus säilitatakse koos kuupäevaga käituste valijas, kus saate selle avada või kustutada; või lülituge agendi viimasele 10, 20 või 50 käitusele, et kaasata selle teised käitused. Näete läbivusmäära, kui sageli iga kontroll läbiti, latentsust, kulu, tokeneid ja tööriistakutseid salvestatud baseline'i kõrval, samuti iga käitust koos tõrke põhjuse ja lingiga selle jälitusele.
- **Mine workflow'sse** avab agendi workflow uuel vahelehel. Nimeväljal tühjendab teksti **Esc** või ikoon **X**.

Kuidas numbreid tõlgendatakse:

- **Latentsus** on mudeli aeg liidetuna käituse tööriistakutsete ajaga.
- **Kulu** kasutab samu hindu nagu Traces. Hinnata mudeli käitus jätab kulukontrolli vahele, selle asemel et tõrkuda.
- Käitus loetakse **läbituks**, kui see lõppes veata ja iga kontroll läbiti.
- Komplekt loeb ainult teie enda jälitusi, sama reegli järgi nagu jälituste vahekaart.
- **Kasuta viimaseid käitusi baastasemena** valikus **Muuda kontrolle** asendab salvestatud baseline'i agendi viimaste käitustega.

Komplekti baseline pärineb ühest kolmest allikast. **Muuda kontrolle** näitab aktiivset valikut sildi **Salvestatud baseline** kõrval:

- agendi viimased käitused (vaikimisi ja see, mida võtab **Kasuta viimaseid käitusi baastasemena**),
- üks lõpetatud komplekti käitus,
- käsitsi sisestatud arvud.

Kaks viimast määratakse [Chatist](./chat-tab.md#working-with-evals) või API kaudu:

- `PATCH /api/evals/agent-suites/{id}` võtab vastu `baseline: {"source": "suite_run", "run_id": "…"}` või `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` võtab vastu `inputs_list`: ühe sisendobjekti käituse kohta, kuni 20.

### Chatist ja MCP-st

[Chat](./chat-tab.md#working-with-evals) ja MCP tööriist `heym_chat` saavad luua, muuta ja käivitada prompti- ja agendikomplekte:

- Nad koostavad testjuhtumid ja käituste sisendid ise.
- Nad küsivad enne promptikomplekti loomist kasutatava mandaadi kohta, välja arvatud juhul, kui sobib ainult üks.
- Nad lingivad igale komplektile, mida sellel lehel mainivad.

## Võrdlusmaatriksi ideed

Kui koostate agentide workflow'de jaoks võrdlusmaatriksit, kaasake HITL-stsenaariumid esmaklassiliste juhtumitena, mitte ärge käsitlege neid erandjuhtumitena.

- Katke kõik kolm ülevaatamisotsust: `accepted`, `edited` ja `refused`
- Kaasake mitu triggeri allikat, nagu redaktori käivitused, portaal, curl/webhook ja cron-triggeriga käivitused
- Lisage korduva ülevaatamise stsenaariumid, kus üks agendi käivitus peatub rohkem kui üks kord
- Kontrollige agendi `review` väljundiga ühendatud teavitusharusid
- Kinnitage allavoolu käitumine pärast keeldumist, eriti kui hilisemad sõlmed hargnevad `$agent.decision` põhjal

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Hindamised kui agendi elutsükli testietapp
- [Agendi sõlm](../nodes/agent-node.md) – Workflow'd, mida hinnatakse
- [Mandaatide vahekaart](./credentials-tab.md) – Mandaadid hindamiste käivitamiseks
- [Käivituste vahekaart](./traces-tab.md) – Üksikasjalik käivituste uurimine
- [Workflow'de vahekaart](./workflows-tab.md) – Looge workflow'sid hindamiseks
- [Käivituste ajalugu](../reference/execution-history.md) – Vaadake varasemaid käivitusi (päise nupp Ajalugu)
- [Kontekstuaalne showcase](../reference/contextual-showcase.md) – Kompaktne lehejuhend, mis on saadaval hindamiste lehel
