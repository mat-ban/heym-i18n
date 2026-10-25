# Kiirsahtel

**Kiirsahtel** on workflow'de kiirkäivituse paneel paremal küljel. See kuvatakse autenditud lehtedel, nagu näiteks töölaua [Workflows vahekaart](../tabs/workflows-tab.md), Docs ja Hindamised.

## Juurdepääs

- Klõpsake fikseeritud **Quick / Workflows** triggerit ekraani parema serva keskel
- Kui [Kontekstuaalne esitlus](./contextual-showcase.md) on samuti saadaval, asub selle **Page Guide** trigger Quick Workflowsi kohal
- Sahtel avaneb paremalt ja nihutab praegust lehte vasakule kerge ümberskaalimisega
- Mobiilis on Kiirsahtel peidetud
- Sahtlit ei kuvata workflow'de redaktoris, sisselogimise/registreerimise, portaali ega HITL ülevaatamise lehtedel

## Workflow'de otsing

Kasutage sahtli ülaosas olevat filtrivälja, et otsida workflow'sid järgmiste järgi:

- Workflow nimi
- Workflow kirjeldus

Otsing ei ole tõstutundlik ja uuendab nimekirja koheselt.

## Kinnitatud workflow'd

Kinnitage workflow'sid, et hoida neid sahtli ülaosas.

- Kinnitatud workflow'd kuvatakse eraldi jaotises täieliku nimekirja kohal
- Uued kinnitused lisatakse ülaossa
- Kinnituste järjekord säilib ümberlaadimiste vahel brauseri salvestusruumis

## Workflow'de käivitamine

Valige workflow, et avada selle sisestusvorm.

- Sisestusväljad kuvatakse vertikaalselt sahtli järjekorras
- Klõpsake **Run Workflow**, et käivitada valitud workflow
- Klõpsake **Stop Workflow**, et tühistada sahtlist käimasolev käivitus
- Workflow'sid ilma sisestusväljadeta saab siiski otse käivitada
- Workflow, mis algab sõlmega [File Upload Trigger](../nodes/file-upload-trigger-node.md), kuvab selle asemel pukseerimisala: lohistage fail sinna või klõpsake faili valimiseks. Ala loetleb triggeri lubatud failitüübid ja -suuruse ning keeldub teistest failidest enne üleslaadimist. **Run Workflow** jääb keelatuks, kuni fail on valitud.

Sahtel kasutab sama workflow käivitamise API-t nagu teised Heymi käivituspinnad, seega väljundid ja käitusaegne käitumine püsivad järjepidevad.

Käivituse peatamine sahtlist tühistab ka aktiivse taustaprotsessi käivituse, sealhulgas kõik selle workflow käivituse jaoks käimasolevad Playwright brauseri tööd.

## Edenemine ja tulemused

Pärast käivituse alustamist kuvab sahtel:

- Voogedastusega sammu edenemist sõlmede käivitumisel ja lõpetamisel
- Lõplik olek: `success`, `error` või `pending`
- Lõplikud väljundid kompaktses JSON paneelis
- Ajaloo kirjed, mis on märgistatud sildiga `Quick Drawer`

`pending` tähendab, et workflow ootab hilisemat toimingut, näiteks inimülevaatamist.

Quick Drawer'i käivitused on tootmiskäivitused, mistõttu [samaaegsuse piiranguga](./webhooks.md#concurrency-limit-and-queued-runs) workflow võib panna need ootama. Kuni käivitus seisab järjekorras, on olekuks **Waiting in queue (2/5)**; see muutub olekuks "running", kui käivitus algab, ja näitab tulemust selle lõppemisel ilma samm-sammulise edenemiseta. Käivitus, mis aegus järjekorras või tühistati ootamise ajal, lõpeb olekuga `error`.

Failikäivitus toimub triggeri ühekordse üleslaadimislingi kaudu: sahtel küsib workflow'lt lingi, laadib faili sinna üles ja kuvab tulemuse, kui üleslaadimine lõpeb. Failikäivitused näitavad lõppolekut ja väljundeid, kuid mitte samm-sammulist edenemist, ning need märgitakse ajaloos samuti sildiga `Quick Drawer`. Valitud fail tühjendatakse pärast iga käivitust, sest üks link võtab vastu ühe faili.

## Brauseri salvestusruum

Kiirsahtel salvestab isiklikud eelistused `localStorage`-sse:

- Kinnitatud workflow'de ID-d
- Viimati valitud workflow

Sahtel **ei** säilita selles versioonis sisestusväärtusi.

## Ulatus

Kiirsahtel on tahtlikult kergekaaluline käivituspind.

- Kaasatud: otsing, kinnitamine, valimine, sisestamine (sh fail), käivitamine, edenemine, tulemus
- Välistatud: workflow'de loomine, redigeerimine, kaustahaldus ja lõuendi toimingud

## Seotud

- [Workflows vahekaart](../tabs/workflows-tab.md) – Peamine workflow'de nimekiri, kaustad ja haldus
- [Kiire algus](../getting-started/quick-start.md) – Ehitage ja käivitage oma esimene workflow
- [Käivituste ajalugu](./execution-history.md) – Vaadake varasemaid käivitusi
- [Webhookid](./webhooks.md) – Käivitage workflow'sid HTTP kaudu
- [Kontekstuaalne esitlus](./contextual-showcase.md) – Lehe tasemel juhiste riba, mis täiendab Kiirsahtlit
