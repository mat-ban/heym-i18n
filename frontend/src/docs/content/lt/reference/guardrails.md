# Apsauginės priemonės

Apsauginės priemonės leidžia blokuoti nesaugias ar nepageidaujamas vartotojų žinutes prieš jas pasiekiant [LLM](../nodes/llm-node.md) arba [Agent](../nodes/agent-node.md) mazgą. Kai žinutė atitinka blokuojamą kategoriją, mazgas išmeta klaidą, o ne vykdo, kurią galite sugauti su [Klaidos tvarkytuvu](../nodes/error-handler-node.md) mazgu.

## Apsauginių priemonių įjungimas

Atidarykite savybių skydelį **LLM** arba **AI Agent** mazgui ir slinkite iki **Įjungti apsaugines priemones** perjungimo mygtuko (skydas). Pažymėjus langelį, atskleidžiama konfigūracijos sekcija.

## Apsauginių priemonių kredencialai ir modelis

Kai apsauginės priemonės yra įjungtos, Jūs **privalote** pasirinkti **kredencialą ir modelį** turinio saugumui. Apsauginių priemonių patikra naudoja pasirinktas kredencialą ir modelį iš mazgo — jokio atsarginio plano, jokios aplinkos kintamųjų. Naudokite OpenAI arba Google kredencialą patikimam turinio filtravimui, ypač kai Jūsų pagrindinis modelis naudoja pasirinktą teikėją (pvz., Zhipu, GLM), kuris gali nepalaikyti apsauginių priemonių arba grąžinti API klaidas (pvz., 404).

Darbo eiga negali būti vykdoma, kol nebus pasirinkti tiek Apsauginių priemonių kredencialas, tiek Apsauginių priemonių modelis.

## Blokuojamos kategorijos

Pasirinkite vieną ar daugiau kategorijų, kurias norite blokuoti. Žinutė, atitinkanti bet kurią pažymėtą kategoriją, bus atmesta.

| Kategorija | Ką ji blokuoja |
|---|---|
| **Smurtas** | Smurtinis, grasinantis ar fiziškai žalingas turinys |
| **Neapykantos kalba** | Diskriminacija, rasizmas ar bigotizmas |
| **Seksualinis turinys** | Aiškus seksualinis turinys ar scenarijai |
| **NSFW / Necenzūrinė kalba** | Šlykšti kalba, necenzūrinė kalba, aiškūs įžeidimai ir suaugusiųjų žargonas bet kuria kalba |
| **Savižudybė** | Savižudybė, savižalos ar susijęs turinys |
| **Priekabiavimas** | Asmeniniai išpuoliai, įžeidimai, patyčios ar bauginimas |
| **Netikra veikla** | Nurodymai, kaip atlikti neteisėtus veiksmus |
| **Politinis ekstremizmas** | Ekstremistinis politinis turinys ar smurtinė propaganda |
| **Šlamštas / Phishing** | Šlamštas, phishingas ar socialinis inžinerija |
| **Asmens duomenų prašymas** | Prašymas pateikti privačius ar asmeniškai identifikuojamus duomenis |
| **Prompt Injection** | Bandymas perrašyti sistemos instrukcijas, įterpti kenksmingus promptus ar manipuliuoti modelio elgesiu |

## Jautrumas

**Jautrumo** nustatymas kontroliuoja, kaip griežtai pažeidimai yra nustatomi:

| Lygis | Elgesys |
|---|---|
| **Žemas** | Žymi net ir ribinius ar dviprasmiškus atvejus |
| **Vidutinis** *(numatytasis)* | Žymi aiškius pažeidimus; ignoruoja ribinius atvejus |
| **Aukštas** | Žymi tik ekstremalius, nedviprasmiškus pažeidimus |

## Kaip veikia nustatymas

Nustatymas naudoja **pasirinktą apsauginių priemonių kredencialą ir modelį**:

- **OpenAI kredencialai** — naudoja [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (nemokama, greita, be tokenų naudojimo) penkioms kategorijoms, kurias ji palaiko natūraliai (Smurtas, Neapykantos kalba, Seksualinis turinys, Savižudybė, Priekabiavimas). Likusios kategorijos tikrinamos su LLM klasifikacijos skambučiu naudojant pasirinktą apsauginių priemonių modelį.
- **Google / pasirinktinių kredencialų** — visos kategorijos tikrinamos su LLM klasifikacijos skambučiu naudojant pasirinktą apsauginių priemonių kredencialą ir modelį.

Kai Jūsų pagrindinis modelis naudoja pasirinktą teikėją (pvz., Zhipu, Cerebras), kuris gali grąžinti 404 ar kitas API klaidas, pasirinkite **OpenAI arba Google kredencialą** apsauginėms priemonėms.

## Klaidos formatas

Kai apsauginė priemonė yra aktyvuota, mazgas išmeta klaidą su žinute:

```
Apsauginės priemonės pažeidimas: žinutė blokuota dėl draudžiamo turinio.
Pažeistos kategorijos: Smurtas, Neapykantos kalba
```

Mazgo rezultato `output` taip pat apima `guardrail_violated_categories` (pažeistų kategorijų etikečių masyvas), kad Debug Panel ir Vykdymo istorija galėtų aiškiai rodyti "Blokuota: X, Y".

Naudokite mazgo **Tęsti klaidos atveju** parinktį (arba [Klaidos tvarkytuvą](../nodes/error-handler-node.md)), kad nukreiptumėte darbo eigą į atsarginę šaką, kai apsauginės priemonės aktyvuojamos.

## Pavyzdinė darbo eiga

```
Įvestis → Agent (apsauginės priemonės: Smurtas, Netikra veikla, jautrumas: Vidutinis)
          ├── išvesties tvarkymas → LLM → Išvestis
          └── klaidos tvarkymas  → Klaidos tvarkytuvas → Nustatyti("Atsiprašome, šis prašymas buvo blokuotas.") → Išvestis
```

## Pastabos

- **Nėra pakartojimų**: Apsauginių priemonių pažeidimai yra tyčiniai blokai ir niekada nėra pakartojami, net jei mazgas turi "Pakartoti nesėkmės atveju" parinktį įjungtą.
- Duomenų bazės migracija nereikalinga — apsauginių priemonių nustatymai saugomi darbo eigos mazgo JSON kartu su kitais mazgo duomenimis.
- Apsauginės priemonės tikrina išspręstą **vartotojo žinutę** (po šablonų išraiškų įvertinimo), o ne žalią šabloną.
- Nustatymas **jokių kategorijų** esant įjungtoms apsauginėms priemonėms yra lygu jų išjungimui — patikra nevykdoma.
- Esant **žemam** jautrumui, LLM klasifikacija visada vykdoma (geriausias daugiakalbis aprėptis). OpenAI kredencialai papildomai vykdo Moderation API.
- Esant **vidutiniam/aukštam** jautrumui, OpenAI kredencialai naudoja Moderation API natūraliai palaikomoms kategorijoms ir LLM klasifikaciją likusioms. Google/pasirinktinių kredencialai visada naudoja LLM klasifikaciją.
- LLM klasifikacija yra **kalbos nepriklausoma** — ji nustato pažeidimus turkų, arabų, rusų, ispanų ir kitomis kalbomis.
