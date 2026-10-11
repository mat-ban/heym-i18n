# Hindamiste vahekaart

**Hindamiste** vahekaart on eraldi leht aadressil `/evals`. See võimaldab luua hindamiskomplekte, määratleda testjuhtumeid ja käivitada hindamisi oma [Agendi](../nodes/agent-node.md) workflow'de vastu.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Vaadake hindamiste demot</a></p>

## Juurdepääs

- Klõpsake armatuurlaua vahekaartide ribal **Hindamised**
- Või navigeerige aadressile `/evals`
- Või kasutage **Ctrl+K** (Cmd+K) ja valige käsukäsust "Hindamised"

## Hindamiskomplektid

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
- **Temperatuur** – Määrake mudeli temperatuur (`Exact Match` ja `Contains`)
- **Arutluspingutus** – Määrake arutlusmudelite arutluspingutus (`Exact Match` ja `Contains`)

### LLM-as-Judge

Kohtunikuga vastab iga mudel testi sisendile ainult komplekti promptiga, seejärel hindab kohtunik, kui täpselt vastus oodatud väljundiga kattub, skaalal 0 kuni 100:

- **Mudelkohtunik** (OpenAI, OpenAI-ga ühilduv või Gemini) loeb küsimust, oodatud väljundit ja vastust ning tagastab skoori koos üherealise põhjendusega. See töötab temperatuuril `0` või arutlusmudeli puhul `low` arutluspingutusel, nii et sama vastus saab sama hinnangu.
- **Otsustusmudeli kohtunik** hindab vastust viietasemelisel rubriigil, alates *Täiesti mööda* kuni *Täielikult kattub*. Skoor on sellel rubriigil tõenäosusega kaalutud positsioon, seega pärineb see mudeli arvutatud jaotusest, mitte mudeli kirjutatud numbrist.

Lahtri hõljumiskaart näitab kohtuniku põhjendust või otsustusmudeli puhul taset, skoori ja selle kindlust. Latentsus ja tokenid kirjeldavad testitavat mudelit; kohtuniku enda kutsed ilmuvad jaotises [Käivitused](./traces-tab.md) allika **Hindamised** all. Mudelivalija jätab välja Model Routeri mandaadid, sest hindamine võrdleb konkreetseid mudeleid.

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
