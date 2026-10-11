# Vahekaart Teavitused

Vahekaart **Teavitused** võimaldab määratleda läviväärtustingimusi ajaakna kohta ja saada teada, kui need ületatakse. Heym salvestab juba käivituste tulemusi, käivituse kestust ja LLM-kulu, kuid ei teata neist kunagi omal algatusel. Teavitus on viis, kuidas seda küsida.

Iga teavitust hinnatakse teie valitud **ajaakna** jooksul, mitte kunagi üksiku sündmuse põhjal. Üks ebaõnnestunud käivitus on müra. Kaksteist ebaõnnestunud käivitust kümne minuti jooksul on intsident.

## Teavituse tüübid

| Tüüp | Küsimus, millele see vastab | Kust number pärineb |
|---|---|---|
| **Vea läviväärtus** | Kas see ebaõnnestus aknas rohkem kui N korda? | [Käivituste ajaloo](../reference/execution-history.md) read vea staatusega |
| **Workflow'i kestus** | Kas käivitused muutusid aknas oodatust aeglasemaks? | Käivituse aeg, agregeeritud maksimumi, keskmise või 95. protsentiilina |
| **Tokeni / USD kulu** | Kas kulu ületas aknas eelarve? | [LLM-jäljed](./traces-tab.md) pluss LLM-i kulutabel |
| **Käivituste arv** | Kas see käivitus palju sagedamini, kui peaks? | Käivituste ajaloo ridade arv |

### Vea läviväärtus

Loeb ebaõnnestunud käivitusi üle akna ja käivitub, kui arv jõuab teie läviväärtuseni. Kuna see loeb üle akna, mitte ei haaku iga vea külge, ei saada üksik mööduv viga teile lehekutset.

### Workflow'i kestus

Mõõdab käivituse kestust akna sees. Valige **max** (kõige aeglasem käivitus), **keskmine** või **p95**. P95 näitaja kasutab sama protsentiiliarvutust nagu [Analyticsi vahekaart](./analytics-tab.md), seega teavitus ja latentsusgraafik ei ole sama akna kohta kunagi vastuolus.

**Minimaalne käivituste arv aknas** hoiab selle ausana. Kõige aeglasem käivitus peaaegu tühjas aknas on lihtsalt see üks käivitus, seega miinimumi, näiteks 3, seadmine takistab teavitusel müra peale käivitumast.

### Tokeni / USD kulu

Liidab LLM-kulu üle akna, kas koguarvuna tokenites või USA dollarites. Dollari summad lahendatakse sama hinnatabeli kaudu, mida kasutavad [Traces'i vahekaart](./traces-tab.md) ja [LLM-i kulutabel](./datatable-tab.md#llm-cost-table-system-table), seega kulu teavitus ja kulu leht on alati üksmeelel.

Kui ulatus on kõik teie workflow'd, hõlmab see LLM-kutseid, mis on tehtud väljaspool workflow'd, näiteks [Chati vahekaart](./chat-tab.md) ja [AI-assistent](../reference/ai-assistant.md). Kodeerimisagendi kasutamine (Codex, OpenCode) ei ole kaasatud.

Mudelid, millel puudub hinnarida, esitatakse teavituse kontekstis hinnastamata mudelitena, mitte ei loeta vaikselt nulliks.

### Käivituste arv

Loeb mis tahes staatusega käivitusi aknas. See on see, mis püüab kinni valesti läinud triggeri: workflow, mis tavaliselt käivitub 20 korda tunnis, käivitub äkki 2000 korda. Käivitumise kirje sisaldab triggeri allika kaupa jaotust, sest see on tavaliselt vastus küsimusele "miks see juhtus".

## Ulatus

Teavitus jälgib kas **ühte workflow'd** või **kõiki teie workflow'sid**.

"Kõik teie workflow'd" tähendab iga workflow'd, millele teavituse omanikul on juurdepääs. See ei tähenda meelega iga workflow'd Heymi instantsil: teavitusi saab jagada ja teavituse jagamine ei tohiks anda kellelegi koondnumbreid workflow'de kohta, mida nad ei saa avada.

## Viisard

Teavituse loomine kulgeb läbi viie sammu.

1. **Tüüp** — valige üks neljast ülaltoodust.
2. **Ulatus** — üks workflow või kõik need.
3. **Tingimus** — ajaaken pluss selle tüübi läviväärtuse väljad.
4. **Vastus** — mis käivitub, kui see käivitub, ja kui sageli teile jätkuvalt teatada.
5. **Ülevaatus** — nimetage see ja vaadake tagasitestimist.

### Tagasitestimine

Ülevaatuse samm vastab küsimusele, mis on tegelikult oluline enne salvestamist: *viimase 24 tunni jooksul, kui sageli oleks see käivitunud?*

See esitab käivitumiste arvu ja kõrgeima täheldatud väärtuse teie läviväärtuse suhtes. Kui see ütleb, et tingimus oleks käivitunud 400 korda, parandate läviväärtuse enne salvestamist, mitte pärast lehekutse saamist. Saate tagasivaateperioodi laiendada 3 või 7 päevani.

## AI mustandite koostamine

Esimese sammu ülaosas on kast, kuhu kirjeldate lihtsas keeles, mida soovite:

> Hoiata mind, kui arve sünkroonimine ebaõnnestub rohkem kui 5 korda 10 minuti jooksul

Heym muudab selle teavituse definitsiooniks, täidab iga sammu, mida suudab, ja hüppab edasi, märkides AI-täidetud väljad, nii et kinnitate, mitte ei sisesta uuesti. Täielik taotlus viib teid ülevaatuse juurde.

**Osaline taotlus liigutab teid siiski edasi.** Öelge ainult "hoiata mind, kui see ebaõnnestub 5 korda" ja saate vea läviväärtuse teavituse, kus arv on täidetud, ülejäänu on vaikeväärtused, ja viisard avaneb esimesel sammul, mis vajab veel teie sekkumist: sel juhul Ulatus, sest ühtegi workflow'd ei nimetatud. Ülaosas olev märkus ütleb, mis on veel otsustamata. See ei blokeeri kunagi Edasi ega Loo.

Sama kehtib, kui mudel nimetab workflow'd, millele teil puudub juurdepääs, või tagastab tingimuse, millel on väljad puudu. Mõistlikud osad jäetakse alles, ülejäänu langeb tagasi selle teavituse tüübi vaikeväärtustele ja te kohandate sealt edasi. Miski siin ei möödu valideerimisest: nii viisardi enda reeglid kui ka API kontrollivad teavituse salvestamisel uuesti üle.
## Kordumise käitumine

Kui teavitus käivitub, läheb see käivitatud olekusse. Mis juhtub edasi, on Teie valik 4. sammus.

- **Teavita üks kord, kuni see taastub** (vaikeväärtus) — käivitub üks kord, seejärel jääb vaikseks, kuni tingimus kehtib. Kui mõõdik langeb tagasi alla lävendi, naaseb teavitus olekusse OK ja on taas käivitumiseks valmis. Taastumine on olekumuutus, mitte sündmus: see ei loo käivituse kirjet ega käivita teavituse workflow'd.
- **Jätka teavitamist intervalliga** — käivitub uuesti iga N minuti järel seni, kuni tingimus kehtib.

Vaikeväärtus on olemas seetõttu, et katkine workflow, mida kontrollitakse iga 60 sekundi järel, tekitaks muidu 60 käivitust tunnis, mis ongi põhjus, miks teavitused vaigistatakse.

## Workflow käivitamine käivitumise korral

4. samm pakub kolme vastust küsimusele "mis peaks juhtuma, kui see käivitub":

- **Loo ja määra uus workflow** (vaikeväärtus) — teavituse salvestamine loob ka workflow nimega *"&lt;teavituse nimi&gt; notification"* ja lingib selle. See saabub sisendsõlmega, mille väljad on täpselt allpool esitatud payload, seega `$alert.body.observed_value` ja ülejäänu lahenevad kohe ning Teil tuleb vaid lisada sõlm, mis sõnumi edastab. **Go to workflow** teavituse kaardil avab selle. See on vaikeväärtus seetõttu, et teavitust, mis käivitub tühjusesse, on lihtne märkamata jätta.
- **Valige olemasolev workflow** — käivitage midagi, mille olete juba loonud.
- **Ära tee midagi** — käivitus registreeritakse ikkagi vahekaardil, see lihtsalt ei käivita midagi.

Teavituse payload saabub selle workflow' sisendbody'na:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Milline workflow tekitas selle numbri

`workflows` on ainus koht, kus workflow esineb. See loetleb iga workflow', mis panustas näitu, igaüks oma `value`-ga — selle workflow' vigade arv, käivituste arv, aeglaseim käivitus millisekundites või kulutus, sõltuvalt teavituse tüübist. Loend on sorditud `value` järgi, suurim esimesena, seega `workflows[0]` on kõige hullem rikkuja.

See on **alati massiiv**: ühe elemendiga ühe workflow' skoobi korral, mitmega "kõik minu workflow'd" korral ja tühi, mitte null, kui midagi ei ole omistatav. Teavituse workflow saab seda itereerida ilma kuju kontrollimata.

Ainsuses `workflow_id` on meelega puuduv. See kirjeldas teavituse skoopi, mitte mõõdikut, seega oli see süsteemi skoobi korral `null`, mis on täpselt see juhtum, kus "milline workflow?" on kõige olulisem. `observed_value` jääb agregaadiks, millega lävendit võrreldi; iga workflow' `value` väljad selgitavad, kust see pärines.

Nii jõuavad teavitused Slacki, e-kirja, Telegrami või kuhu iganes mujale: [sõlmedega](../reference/node-types.md), mis Teil juba olemas on, mitte eraldi teavitussüsteemiga.

Teavitus ei saa teavitada workflow'd, mida see jälgib. See oleks tsükkel, kõige ilmsemalt käivituste arvu teavituse puhul, kus iga teavitus lisandub arvu, mida see mõõdab.

Teavituse käivitused on tavalised käivitused, seega need ilmuvad [käivituste ajaloos](../reference/execution-history.md) nagu iga teinegi käivitus. Ebaõnnestunud teavituse workflow registreeritakse käivitusel, kuid ei takista kunagi käivituse enda registreerimist.

Teavituse workflow käivitub teavituse omanikuna, tema mandaatide ja globaalsete muutujatega, täpselt nii, nagu oleks ta selle ise käivitanud. Teiega jagatud workflow' valimine ei laena selle isiku mandaate. Kui omanik kaotab juurdepääsu teavituse workflow'le, registreeritakse käivitus ikkagi, kuid teavituse käivitus jäetakse vahele.

## Käivituste ajalugu

Teavituste loendi all on käivituste ajalugu: mis käivitus, millal, vaadeldud väärtus lävendi suhtes, täpne hinnatud aken ja teavituse tulemus.

Käivituse kinnitamine märgib rea ja muudab teavituse märgi **Firing** olekust **Acknowledged** olekusse. See on väide Teie, mitte teavituse kohta: tingimus kehtib endiselt ja teavitus naaseb iseseisvalt olekusse **OK**, kui mõõdik langeb tagasi alla lävendi.

Iga kirje salvestab panustava detaili käivitumise hetkel: ebaõnnestunud käivituste id-d ja veateated, mudelipõhise kulutuse või triggeri-allika jaotuse. See on meelega nii. Aken on möödunud ja hilisem ümberarvutamine võib anda teistsuguse vastuse.

Käivituste kirjeid hoitakse 90 päeva.

## Chat'ilt teavituste kohta küsimine

[Chat vahekaart](./chat-tab.md) oskab vastata küsimustele Teie teavituste kohta:

- "Millised teavitused mul on?"
- "Kas invoice workflow'l on teavitus?"
- "Miks kulu teavitus käivitus?"
- "Millal see viimati käivitus?"

Küsimuse "miks see käivitus" puhul tsiteerib Chat käivituse kirjest tegelikku vaadeldud väärtust, lävendit ja ajavahemikku koos panustava detailiga.

## Jagamine

Teavitusi saab jagada üksikute kasutajatega või [tiimidega](./teams-tab.md). Inimesed, kellega jagate, näevad teavitust ja selle käivituste ajalugu. Ainult omanik saab seda muuta, peatada, kustutada või uuesti jagada.
### Kui workflow'le juurdepääs eemaldatakse

Üksiku workflow peal olev teavitus loeb jätkuvalt selle workflow käivituste mõõdikuid, seega kellegi juurdepääsu eemaldamine workflow'le määrab ühtlasi, mis juhtub tema teavitustega sellel:

- **Kasutaja või tiimi jagamise eemaldamine** küsib workflow omanikult, kas peatada ka selle kasutaja või tiimi teavitused workflow'l. Peatamine on vaikevalik. Peatatud teavitused on pausil, mitte kustutatud, ja igaüks neist logitakse kui `alert.disable_on_access_revoke` [auditilogis](../reference/audit.md).
- **Tiimiliikme eemaldamine või tiimi kustutamine** peatab alati mõjutatud teavitused, sest muudatuse tegija ei pruugi olla workflow omanik.
- Teavitus peatatakse ainult siis, kui selle omanikul pole workflow'le muud teed, näiteks otsest jagamist või teist tiimi.
- Peatatud teavituse jätkamine või testimine kontrollib omaniku juurdepääsu uuesti, seega peatatud teavitust ei saa ilma juurdepääsuta uuesti sisse lülitada ega kasutada workflow mõõdikute lugemiseks. Nupu **Jätka** vajutamine ilma juurdepääsuta kuvab teate, mis selgitab, et workflow omanik peab selle esmalt uuesti jagama.

## Teavituste haldamine

- **Paus / Jätka** — peatatud teavitust ei hinnata kunagi. Jätkamine kontrollib seda kohe, ootamata järgmist intervalliaega.
- **Muuda** — muudatused valideeritakse tervikuna, seega osaline muudatus ei saa jätta teavitust kehtetusse olekusse.
- **Kustuta** — eemaldab teavituse ja selle käivitumise ajaloo.

## Vaata ka

- [Analytics Tab](./analytics-tab.md) — graafikud, millest need lävendid pärinevad
- [Traces Tab](./traces-tab.md) — kust LLM kulunumbrid tulevad
- [Execution History](../reference/execution-history.md) — käivitused, mida vea-, kestuse- ja loendusteavitused mõõdavad
- [Chat Tab](./chat-tab.md) — teavituste pärimine loomulikus keeles
- [Teams](./teams-tab.md) — teavituste jagamine tiimiga
