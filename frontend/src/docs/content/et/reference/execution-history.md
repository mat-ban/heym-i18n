# Käivituste ajalugu

Käivituste ajalugu salvestab workflow'de käivitusi: sisendid, väljundid, sõlmede tulemused, oleku ja triggeri
allika. Kasutage seda aktiivse produktsioonikäivituse jälgimiseks, varasemate käivituste uurimiseks, tõrgete silumiseks või uuesti käivitamiseks
samade sisenditega funktsiooni **Bring to Canvas** abil.

## Ülevaade

Iga käivitus salvestab:

| Väli | Kirjeldus |
|-------|-------------|
| **Inputs** | Päringu keha või käivituse sisendid (nt `text` Input node'i jaoks) |
| **Outputs** | Workflow-tasandi väljundid |
| **Node results** | Sõlmede kaupa väljundid, olek ja täitmisaeg |
| **Status** | `success`, `error`, `pending`, `skipped` või `failed` (vt [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Kuidas käivitus käivitati (vt [Triggers](./triggers.md)) |

## Ajaloo avamine

| Asukoht | Ulatus |
|----------|-------|
| **Editor**'i tööriistariba | Ainult praegune workflow |
| **Docs** vaate päis | Ainult praegune workflow |
| **Dashboard**'i päis (Chat vahekaart) | Kõik workflow'd + chat/assistant käivitused |
| **Evals** vaate päis | Kõik workflow'd + chat/assistant käivitused |

Dialoogi avamiseks klõpsake nuppu **History** (kella ikoon).

## Workflow-põhine vs kogu ajalugu

- **Workflow-põhine** (Editor, Docs): Kuvab avatud workflow' käivitusi. Kasutage **Clear history**, et eemaldada käivitused ainult selle workflow' jaoks.
- **Kogu ajalugu** (Dashboard, Evals): Kuvab käivitusi kõikide workflow'de ja chat/assistant sessioonide lõikes. Hõlmatus vastab workflow' juurdepääsule: workflow'd, mille omanik olete, otse teiega jagatud workflow'd ja workflow'd, mis on jagatud teie kuuluvasse tiimi. Kasutage **Clear all history**, et eemaldada kõik kirjed, mille omanik olete. Jagatud workflow'de ajalugu säilitatakse.

## Bring to Canvas

**Bring to Canvas** laadib valitud käivituse sisendid ja sõlmede väljundid praegusesse workflow'sse.

### Mida see laadib

- **Inputs** → Käivituse sisendi paneel (nt `text` Input node'i jaoks või kohandatud väljad)
- **Node results** → Execution result paneel kuvab varasemad väljundid sõlmede kaupa
- **Execution result** → Olek, väljundid ja ajastus käivitusest

### Käitumine konteksti järgi

- **Editor'is** (workflow-põhine ajalugu): Rakendub kohe avatud workflow'le ja sulgeb dialoogi.
- **Kogu ajaloo kaudu** (Dashboard/Evals): Liigub workflow' redaktorisse ja rakendab andmed redaktori laadimisel. Saadaval ainult workflow' käivituste jaoks—mitte chat/assistant käivituste jaoks.

### Käivituse deep link

Workflow' avamine aadressil `/workflows/{workflowId}/{executionId}` toob selle käivituse automaatselt lõuendile — sama, mis käivituse valimine ja **Bring to Canvas** valimine. See muudab konkreetse varasema käivituse URL-ina jagatavaks. Kui käivitust ei leita (vale või kustutatud id), laadib redaktor tavalise workflow' tagasilangusena.

### Kasutusjuhud

- Käivitage workflow uuesti samade sisenditega
- Siluge ebaõnnestunud käivitust, uurides sisendeid ja sõlmede väljundeid
- Võrrelge väljundeid käivituste lõikes

## Küsi AI-lt

Mõlemal ajaloo dialoogiboksil on pealkirja kõrval nupp **Küsi AI-lt** (sädeikoon). See avab [vahekaardi Chat](../tabs/chat-tab.md#asking-about-a-run) uues vestluses, kuhu on lisatud workflow ja valitud käitus eemaldatavate kiipidena. Küsige, miks käitus oli aeglane, mis ebaõnnestus, või laske Chatil workflow parandada. Chat loeb täpselt seda käitust, sealhulgas selle jälge ja vigu sõlmede kaupa.

All History dialoogis kuvatakse **Küsi AI-lt** ainult siis, kui valitud on workflow käitus; chati ja assistendi käitused seda ei näita.

## Käituse ajaskaala

Käituse üksikasjades vahetab nupp **Ajaskaala** (stopperi ikoon) nupu **Laienda kõik** kõrval nimekirja **Sammud** vahemike ajaskaala vastu. Kui ajaskaala on kuvatud, kannab sama nupp nime **Logid**; klõpsake sellel, et naasta nimekirja juurde. All History dialoogis ilmub nupp ainult workflow käituste jaoks. Ajaskaala joonistab riba iga sõlme kohta selle käivitumise hetkel, et näeksite, milline sõlm kui kaua aega võttis ja millised jooksid paralleelselt. Viige kursor riba kohale kestuse nägemiseks; klõpsake sellel, et avada sama üksikasjade inspektor nagu redaktori [käituse ajaskaalas](#execution-timeline-details). Valitud vaade jääb püsima seni, kuni dialoog on avatud.

Käitused, mis on salvestatud enne sõlmede algusaegade talletamist, paigutatakse üksteise järel kestuse järgi.

## Execution Highlights

Pärast reaalajas käivitust — või pärast **Bring to Canvas** — kuvatakse **Lõuendi ülaosas paremal** suletav **Execution Highlights** hüpikaken. See on kiire viis näha, *mida iga sõlm tootis*, loetletuna ülalt alla täitmise järjekorras. Sulgege see **✕**-iga; see avaneb uuesti järgmisel käivitusel.

### Mida kuvatakse

| Kirje | Allikas | Automaatne? |
|--------|--------|-------|
| **Input** | Käivituse sisendparameetrid (input/trigger node) | Jah |
| **Output** | Väljundsõlme tulemus — või, kui seda pole, viimase sõlme sõnum | Jah |
| **Agent / LLM** | Iga agent või LLM sõlme väljund | Jah |
| **Output** | Iga muu sõlm, millel on lubatud **Highlight Node Output** | Soovi korral |

Sõlmed, mis on juba automaatselt esile tõstetud (input / output / last / agent / llm), ei kuvata kunagi kaks korda, isegi kui lubate lüliti.

### Iga kirje

- Kuvab `Node — message…` esimese **250 tähemärgiga**; klõpsake real, et seda laiendada ja kuvada **kogu sõnum Markdownina**, koos **Copy** nupuga.
- Sõlm, mis käivitati mitu korda (nt tsükli sees), kuvab `Node (N)` koos `‹ i / N ›` valijaga — valige, millist käivitust vaadata; iga sõlme valija on sõltumatu.

### Highlight Node Output

Igal sõlmel **välja arvatud Agent ja LLM** on oma atribuutide paneelis märkeruut **Highlight Node Output** (vaikimisi väljas). Lubage see, et lisada selle sõlme väljund hüpikaknasse. Lõuendil kuvatakse esiletõstetud sõlmedel väike ✦ märgis. [Workflow DSL-is](./expression-dsl.md) on see sõlme-andmete väli `"highlight": true` (vaikimisi `false`).

### Dashboard'idel

Dashboard'i vidina kaardid, mis käivitasid workflow', kuvavad kaardi päises ✦ **Execution highlights** nuppu; klõpsake seda, et avada sama hüpikaken selle vidina käivituse jaoks, kus vidina joonistatud väljund on esiletõstetud kirje.
## Käimasolevate käivituste haldamine

Mõlemad ajaloo dialoogid kuvavad **hetkel käimasolevaid käivitusi** nimekirja ülaosas, enne varasemaid käivitusi.

- Pöörlev indikaator ja silt **Running** kuvatakse koos algusajaga
- Klõpsake **Open live**, et siduda redaktor täpselt selle käivitusega ilma seda uuesti käivitamata
- Lõuend taastab esmalt sõlmed, mis on juba lõpetanud, seejärel võtab vastu
  `node_start`, `node_complete` ja lõplikud käivituse sündmused SSE kaudu
- Praegune sõlm pulseerib lõuendil, allavoolu sõlmed säilitavad oma ootel animatsiooni ja
  Debug paneel lisab iga tulemuse selle saabumisel—täpselt nagu redaktorist käivitatud käivitus
- Klõpsake **Cancel**, et käivitus kohe peatada
- Tühistamine mis tahes dialoogist (redaktor või Dashboard) sulgeb ka aktiivse SSE voo mis tahes avatud lõuendi vahekaardil selle workflow jaoks, nii et redaktori olek lähtestatakse puhtalt
- Pärast tühistamist kaob käimasolev kirje järgmisel värskendamisel; vajutage **Refresh**, et nimekirja käsitsi värskendada
- Kui tühistate käivituse, mis on juba lõpetanud, on päring no-op

Reaalajas URL on `/workflows/{workflowId}/{executionId}`. Vaatleja on kirjutuskaitstud: redaktorist
lahkumine ühendab ainult selle brauseri vahekaardi lahti ega peata kunagi workflow'd. Aktiivsed hetktõmmised
jagatakse PostgreSQL kaudu, nii et käivituse avamine töötab endiselt, kui trigger ja redaktori
päring maanduvad erinevatele backend töötajatele.

## Krahhist taastamine

Kui server taaskäivitub (juurutus, konteineri taaskäivitamine või krahh) workflow töötamise ajal, peatub selle käivituse töötaja keset täitmist. Heym taastab need katkestatud käivitused automaatselt, selle asemel et jätta need **Running** olekusse kinni.

- Järgmisel käivitamisel tuvastab valitud juhi protsess orvuks jäänud käivitused — koheselt sujuvа taaskäivituse korral või ~60 sekundi jooksul raske krahhi korral (kui südamelöögid selgelt peatuvad).
- Taastatud käivitused **käivitatakse uuesti nullist samade sisenditega** (mitte ei jätkata sealt, kus need peatusid), kasutades praegust workflow definitsiooni. Lõpetamisel salvestavad need tavalise lõppkirje (nt `success`), nii et ajalugu näitab käivitust lõpetatuna.
- Käivitust proovitakse uuesti **üks kord**. Kui taastamiskatse katkestatakse samuti — või workflow on vahepeal kustutatud — salvestatakse kirje olekuga `failed`.
- See töötab samamoodi üksiku konteineri ja mitme töötajaga juurutuste puhul; ainult juht teostab taastamist, nii et käivitust ei taastata kunagi kaks korda erinevate töötajate poolt.

### Automaatse taastamise lüliti

Redaktori **Execution Log** (käivituse) paneelil on märkeruut **Auto-recover**, mis on **vaikimisi sees** iga workflow kohta.

- **Sees**: selle workflow katkestatud käivitused käivitatakse uuesti ülalkirjeldatud viisil.
- **Väljas**: katkestatud käivitusi ei käivitata uuesti ja need salvestatakse olekuga `skipped`.

> Alam-workflow käivitusi ei taastata iseseisvalt — neid juhitakse uuesti nende taastatud ülem-workflow käivituse poolt. Triggerid, millel on oma kordussaadetmine (RabbitMQ, ajastatud/cron, IMAP), võivad samuti taaskäivitamisel uuesti saata, nii et taastatud käivitus võib mõnikord täituda kaks korda.

## Ootel inimhindamine

Käivitused, mis peatuvad [Human-in-the-Loop](./human-in-the-loop.md) kinnituse ootamiseks, kirjutatakse ajalukku kohe olekuga `pending`.

- Ootel agent sõlm salvestab ülevaatamise payload'i, mis sisaldab `reviewUrl`, `draftText` ja `expiresAt`
- Kõik sõlmed, mis on ühendatud agendi `review` handle'iga, võivad samuti töötada enne, kui inimene vastab, ja nende sõlmede tulemused salvestatakse samasse ootel ajalookirjesse
- Ajaloo dialoogid kuvavad ülevaatamise linki, et omanikud saaksid selle kopeerida või avada
- Ajaloo dialoogid ja redaktori Debug paneel kuvavad lõplikku inimotsust pärast käivituse jätkamist
- Kui ülevaataja aktsepteerib, muudab või keeldub mustandist, värskendatakse sama ajalookirjet lõpliku täitmise tulemusega
- Kui sama käivitus peatub HITL jaoks rohkem kui üks kord, jääb ajalookirje samaks, samal ajal kui iga kontrollpunkt saab oma ühekordse ülevaatamise lingi

See on eriti kasulik portaali käivituste ja pikaajaliste workflow'de jaoks, mis võivad oodata tunde või päevi enne jätkamist.

## Kopeerimine

Kasutage **Copy** Inputs või Outputs kõrval, et kopeerida JSON lõikelauale.

## Ajaloo tühjendamine

- **Workflow kaupa**: Redaktori ajaloo dialoogis klõpsake **Clear history**, et eemaldada praeguse workflow käivitused.
- **Kogu ajalugu**: Dashboard/Evals ajaloo dialoogis klõpsake **Clear all history**, et eemaldada kõik teile kuuluvad täitmiskirjed. Jagatud workflow'de käivitused säilitatakse. Seda toimingut ei saa tagasi võtta.

## Täitmise ajatelje üksikasjad

Kui redaktori **Execution Log** on avatud, klõpsake taimeri nuppu, et kuvada täitmise ajatelg. Valige vahemik, et avada reasisene üksikasjade inspektor, mis võtab üle ridade ala. See näitab valitud sammu olekut, kestust, katsete arvu, uuesti proovimise teavet, vigu, trace ID-d ja kompaktset väljundi eelvaadet. Objekti- ja massiivi väljundid kasutavad sama `JsonTree` vaaturit nagu ülejäänud Debug paneel; skalaarväärtused kasutavad tekstieelvaadet. Kui samm väljastab pilte (Playwrighti ekraanipildid, genereeritud pildid, pildifailid või base64-pildid päringu kehas, mis leitakse väljundist), kuvatakse need pisipiltidena väljundi kohal ja JSON näitab lühikest kohatäitjat töötlemata base64 asemel. Klõpsake pisipildil, et avada see lightbox'is; noolenupud või ←/→ klahvid liiguvad läbi iga pildi käivituses, loenduriga nagu `2 / 5`. Kasutage **Open trace** LLM ja Agent vahemike jaoks, kui trace ID on saadaval.
## Mobiilse sõlme detailvaade

Telefonis kuvab redaktor täisekraanil workflow-puu, mitte vaba vormiga lõuendit. Puudutage puu sõlme, millel on salvestatud tulemus, et avada selle käivitus täisekraanil detailvaates. Vaade pakub eraldi vahekaarte **Sisendandmed**, **Väljundandmed** ja **Vead**. Väljundi vahekaart kuvab salvestatud tulemuse ja pakub **Kopeeri väljund**; sisendi vahekaart näitab valitud sõlme konfiguratsiooni ning vigade vahekaart kuvab salvestatud vea, kui sõlm ebaõnnestus. Kasutage **Tagasi workflow'sse** või sulgemisnuppu, et naasta puu juurde.

Lõuendi ja töölaua ajaloo dialoogid hoiavad oma käivitamise juhtelemente ühel real ning paigutavad saadaolevad sildi- ja instantsifiltrid kohanduvasse ruudustikku. Nende filtrimenüüd kasutavad sama rakendusesisest valijat, seega valitud linnuke on iga valiku sildiga ühtlases veerises ja baasjoonel.

## Seotud

- [Triggerid](./triggers.md) – Kuidas workflow'sid käivitatakse; ajalugu salvestab `trigger_source` (sealhulgas `board` [Tahvli](../tabs/board-tab.md) kaardi liigutamise ja järeltegevuste käivituste jaoks)
- [Human-in-the-Loop](./human-in-the-loop.md) – Ootel ülevaatamise URL-id ja jätkamise käitumine
- [Muudatuste ajalugu](./edit-history.md) – Versioonihaldus workflow'de salvestamiseks (tagasivõtmine, diff)
- [Kiire algus](../getting-started/quick-start.md) – Looge ja käivitage oma esimene workflow
- [Workflows vahekaart](../tabs/workflows-tab.md) – Looge ja haldake workflow'sid
